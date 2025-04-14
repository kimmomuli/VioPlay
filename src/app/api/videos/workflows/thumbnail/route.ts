import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/db";
import { videos } from "@/db/schema"; 
import { and, eq } from "drizzle-orm"; 
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(
  async (context) => {
    const utapi = new UTApi();
    const input = context.requestPayload as InputType;
    const { videoId, userId, prompt } = input;

    const video = await context.run("get-video", async () => { 
      const existingVideo = await db 
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.id, videoId),
            eq(videos.userId, userId)
          )
        );
      if (!existingVideo[0]) { 
        throw new Error("Not found");
      }
      return existingVideo[0]; 
    });

    const { body } = await context.call<{ data: Array<{ url: string }> }>(
      "generate-thumbnail",
      {
        url: "https://api.openai.com/v1/images/generations",
        method: "POST",
        body: {
          prompt,
          n: 1,
          model: "dall-e-3",
          size: "1792x1024",
        },
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const tempThumbnailUrl = body.data[0]?.url;
    console.log("OpenAI API Response Body:", JSON.stringify(body, null, 2)); // Kirjaa koko vastaus


    if (!tempThumbnailUrl) {
      throw new Error("Bad request");
    }
  
    await context.run("cleanup-thumbnail", async () => {
      if (video.thumbnailKey) {
        await utapi.deleteFiles(video.thumbnailKey);
        await db
          .update(videos)
          .set({
            thumbnailKey: null,
            thumbnailUrl: null,
          })
          .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
      }
    });
  
    const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
      const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);
  
      if (!data) { 
        throw new Error("Bad request");
      }
      return data;
    });

    await context.run("update-video", async () => {
      await db
        .update(videos)
        .set({
          thumbnailKey: uploadedThumbnail.key,
          thumbnailUrl: uploadedThumbnail.ufsUrl,
        })
        .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
  