"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { MediaLibraryDialog } from "@/components/admin/MediaLibraryDialog";

/**
 * Campo de imagen que admite pegar una URL, ELEGIR una de la biblioteca (lo ya
 * subido a Vercel Blob) o SUBIR un archivo (vía /api/admin/upload-image). Al
 * elegir o subir, rellena el valor con la URL de Blob.
 */
export function ImageUploadField({
  value,
  onChange,
  placeholder = "https://ejemplo.com/imagen.jpg  ·  o sube un archivo →",
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir la imagen");
      onChange(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-[12rem] flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral focus:border-transparent"
        />
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ImageIcon className="h-4 w-4" />
          Elegir de la biblioteca
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-coral px-4 py-2 font-bold text-white transition-colors hover:bg-coral-dark disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "Subiendo…" : "Subir"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <MediaLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}
