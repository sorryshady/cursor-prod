/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import z from "zod";
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(
      z.object({
        configId: z.string().optional(),
      }),
    )
    .middleware(async ({ input }) => {
      return { input };
    })

    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Url", file.url);
      //   const res = await fetch(file.url);
      //   console.log(res);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
