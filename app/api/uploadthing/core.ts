import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedAt: metadata.uploadedAt, fileUrl: file.url }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
