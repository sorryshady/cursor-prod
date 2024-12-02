"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface FileActionsProps {
  fileUrl: string;
  title: string;
}

const FileActions = ({ fileUrl, title }: FileActionsProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = title || "download";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <CardFooter className="flex justify-center gap-4 p-6">
      <Button asChild variant="ghost" size="icon">
        <Link href={fileUrl} target="_blank">
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
