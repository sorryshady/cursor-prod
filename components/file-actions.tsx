"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

interface FileActionsProps {
  fileUrl: string;
  title: string;
}

const FileActions = ({ fileUrl, title }: FileActionsProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(fileUrl)}&title=${encodeURIComponent(title)}`,
      );

      if (!response.ok) throw new Error("Download failed");

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("content-disposition");
      let filename = title;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename; // Use the filename from the header
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <CardFooter className="flex justify-center gap-4 p-6">
      <Button asChild variant="ghost" size="icon">
        <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
          <Eye className="h-6 w-6" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDownload}>
        <Download className="h-6 w-6" />
      </Button>
    </CardFooter>
  );
};

export default FileActions;
