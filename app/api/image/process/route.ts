import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with sharp
    const processedImageBuffer = await sharp(buffer)
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    // Create filename without extension first
    const baseFileName = name
      ? `${name.toLowerCase().replace(/\s+/g, '-')}-profile`
      : file.name.replace(/\.[^/.]+$/, "");

    // Return the processed image as a response
    return new NextResponse(processedImageBuffer, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `attachment; filename="${baseFileName}.webp"`,
      },
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
