export async function processImage(file: File, name?: string): Promise<File> {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);

  const response = await fetch("/api/image/process", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to process image");
  }

  const processedBlob = await response.blob();

  // Create filename without extension first
  const baseFileName = name
    ? `${name.toLowerCase().replace(/\s+/g, '-')}-profile`
    : file.name.replace(/\.[^/.]+$/, "");

  // Then add single .webp extension
  const filename = `${baseFileName}.webp`;

  return new File([processedBlob], filename, { type: "image/webp" });
}
