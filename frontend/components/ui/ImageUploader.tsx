"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUploadComplete: (url: string, publicId: string) => void;
  onRemove: () => void;
  folder: string;
  className?: string;
}

export function ImageUploader({
  currentUrl,
  onUploadComplete,
  onRemove,
  folder,
  className = "",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, JPEG, PNG & WebP are supported");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File must be under 5MB");
        return;
      }

      setIsUploading(true);
      setProgress(10);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      try {
        setProgress(50);
        const result = await fetchApi<{ url: string; public_id: string }>("/api/upload", {
          method: "POST",
          body: formData,
          headers: {},
        });

        setProgress(100);
        setPreview(result.url);
        onUploadComplete(result.url, result.public_id);
      } catch (err: any) {
        setError(err.message || "Upload failed");
        setPreview(currentUrl ?? null);
      } finally {
        setIsUploading(false);
        setProgress(0);
      }
    },
    [folder, onUploadComplete, currentUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-muted/30">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
              title="Replace image"
            >
              <Upload className="w-4 h-4 text-foreground" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="text-[10px] font-bold text-white">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`relative flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          } ${isUploading ? "pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-bold text-muted-foreground">Uploading... {progress}%</span>
            </div>
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-muted-foreground mb-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Drop image or click to upload
              </span>
              <span className="text-[9px] text-muted-foreground/60">JPG, PNG, WebP — Max 5MB</span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] font-bold text-destructive">{error}</p>
      )}
    </div>
  );
}
