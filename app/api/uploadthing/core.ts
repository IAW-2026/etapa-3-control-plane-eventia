import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imagenesEvento: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({ ufsUrl: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
