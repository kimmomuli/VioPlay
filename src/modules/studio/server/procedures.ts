import z from "zod";

import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const studioRouter = createTRPCRouter({
    getOne: protectedProcedure.
    input(z.object({
        id: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        const { id } = input;

        const videoResult = await db
            .select()
            .from(videos)
            .where(
                and(
                    eq(videos.id, id),
                    eq(videos.userId, userId)
                )
            )
            .limit(1);

        const video = videoResult[0];

        if (!video) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Video not found",
            });
        }

        return video;
    }),
    getMany: protectedProcedure
    .input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt: z.date(),
            })
            .nullish(),
            limit: z.number().min(1).max(100),
        })
    )
    .query(async ({ ctx, input }) => {
        const { cursor, limit } = input;
        const { id: userId } = ctx.user;

        const data = await db
            .select()
            .from(videos)
            .where(and(
                eq(videos.userId, userId),
                cursor
                ? or(
                    lt(videos.updatedAt, cursor.updatedAt),
                    and(
                        eq(videos.updatedAt, cursor.updatedAt),
                        lt(videos.id, cursor.id)
                    )
                )
                : undefined,
            )).orderBy(desc(videos.updatedAt), desc(videos.id)).limit(limit + 1)

        const hasMore = data.length > limit;

        if (hasMore) {
            data.pop();
        }

        const lastItem = data[data.length - 1];
        const nextCursor = hasMore ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
        } : null

        return {
            items: data,
            nextCursor
        };
    })
});