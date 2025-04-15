import { db } from "@/db";
import { users, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workkflow";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
            const [existingVideo] = await db
                .select({
                    ...getTableColumns(videos),
                    user: {
                    ...getTableColumns(users),
                    },
                    viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)), 
                })
                .from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .where(eq(videos.id, input.id));

            if (!existingVideo) { 
              throw new TRPCError({ code: "NOT_FOUND" });
            }
      
            return existingVideo;
          }),
    generateDescription: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.user.id;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
                body: {
                    userId,
                    videoId: input.id,
                },
            });

            return workflowRunId;
        }),
    generateTitle: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.user.id;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
                body: {
                    userId,
                    videoId: input.id,
                },
            });

            return workflowRunId;
        }),
    generateThumbnail: protectedProcedure
        .input(z.object({
            id: z.string().uuid(),
            prompt: z.string().min(10) 
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.user.id;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
                body: {
                    userId,
                    videoId: input.id,
                    prompt: input.prompt, 
                },
            });

            return workflowRunId;
        }),
    restoreThumbnail: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;

            const [video] = await db
                .select()
                .from(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ));

            if (!video) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Video not found",
                });
            }

            if (video.thumbnailKey) {
                const utapi = new UTApi();
                await utapi.deleteFiles(video.thumbnailKey);
                await db
                .update(videos)
                .set({
                    thumbnailKey: null,
                    thumbnailUrl: null,
                })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ));
            }

            if (!video.muxPlaybackId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                });
            }

            const utapi = new UTApi();
            
            const tempThumbnailUrl = `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg`;
            const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

            if (!uploadedThumbnail.data) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                });
            }

            const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumbnail.data

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    thumbnailUrl,
                    thumbnailKey,
                })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ))
                .returning();

            return updatedVideo;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;

            const [removedVideo] = await db
                .delete(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ))
                .returning();

            if (!removedVideo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Video not found",
                });
            }

            if (removedVideo.muxAssetId) {
                await mux.video.assets.delete(removedVideo.muxAssetId);
              
            }

            const utapi = new UTApi();
            if (removedVideo.thumbnailKey) {
                await utapi.deleteFiles(removedVideo.thumbnailKey);
            } 

            if (removedVideo.previewKey) {
                await utapi.deleteFiles(removedVideo.previewKey);
            } 


            return removedVideo;
        }),
    update: protectedProcedure
        .input(videoUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;

            if (!input.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Video ID is required",
                });
            }

            const [video] = await db
                .update(videos)
                .set({
                    title: input.title,
                    description: input.description,
                    categoryId: input.categoryId,
                    visibility: input.visibility,
                    updatedAt: new Date(),
                })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId),
                ))
                .returning();

            if (!video) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Video not found",
                });
            }

            return video;
        }),
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ["public"],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: "en",
                                name: "English",
                            },
                        ]
                    }
                ]
            },
            cors_origin: "*",
        })

        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: "Untitled",
                muxStatus: "waiting",
                muxUploadId: upload.id,
            })
            .returning();

        return {
            video,
            url: upload.url,
        };
    })
});