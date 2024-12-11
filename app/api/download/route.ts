import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    const title = req.nextUrl.searchParams.get("title");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch file");
    }

    // Get the original file extension from the URL
    const urlExtension = url.split('.').pop()?.toLowerCase();

    // Get content type from response
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    // Determine the appropriate extension
    let extension = '';
    if (urlExtension && ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(urlExtension)) {
      extension = `.${urlExtension}`;
    } else if (contentType.includes('pdf')) {
      extension = '.pdf';
    } else if (contentType.includes('word')) {
      extension = '.docx';
    } else if (contentType.includes('excel')) {
      extension = '.xlsx';
    }

    // Create filename with the title and proper extension
    const filename = `${title}${extension}`;

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        // Add cache control to prevent caching
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
