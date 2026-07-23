import { useCallback, useEffect, useRef, useState } from 'react';
import { useUploadFile } from '@/lib/api/use-upload';

interface UseImageUploadProps {
  initialUrl?: string;
  onUpload?: (url: string) => void;
  onRemove?: () => void;
}

export function useImageUpload({
  initialUrl,
  onUpload,
  onRemove
}: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUrl ?? null
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();

  // Sync external initialUrl changes (e.g. form reset)
  useEffect(() => {
    if (initialUrl !== undefined) {
      setPreviewUrl(initialUrl ?? null);
    }
  }, [initialUrl]);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Show local preview immediately
      setFileName(file.name);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      previewRef.current = localUrl;

      // Upload to backend
      setIsUploading(true);
      try {
        const result = await uploadFile(file);
        // Replace local preview with server URL
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(result.url);
        previewRef.current = null;
        onUpload?.(result.url);
      } catch {
        // Revert on failure
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(initialUrl ?? null);
        setFileName(null);
        previewRef.current = null;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile, onUpload, initialUrl]
  );

  const handleRemove = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  }, [onRemove]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    isUploading,
    handleThumbnailClick,
    handleFileChange,
    handleRemove
  };
}
