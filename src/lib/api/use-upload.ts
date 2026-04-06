/**
 * OP Video Engine — File Upload Hook
 *
 * Uploads a file to the backend POST /uploads endpoint.
 * Uses multipart/form-data (not JSON).
 * Returns { url, filename, originalName, size, mimeType }.
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { layoutTextMap } from '@/constants/layout-text-maps';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<UploadResponse>(
    `${API_BASE}/uploads`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data;
}

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
    onError: (error: Error) => {
      toast.error(error.message || layoutTextMap.imageUpload.uploadFailed);
    },
  });
}
