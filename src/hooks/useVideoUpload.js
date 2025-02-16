import { useState, useRef } from "react";
import axios from "axios";
import { useMutation, QueryClient } from "react-query";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 256 * 1024 * 1024; // 256 MB
const MAX_CONCURRENT_UPLOADS = 3;
const RETRY_LIMIT = 3;

const queryClient = new QueryClient();

export const useVideoUpload = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const titleRef = useRef();

  const uploadChunk = async ({ chunk, fileName, chunkNumber, token }) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("fileName", fileName);
    formData.append("chunkNumber", chunkNumber);

    const response = await axios.post("api/video/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const assembleFile = async ({
    fileName,
    totalChunks,
    image,
    token,
    extension,
  }) => {
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("extension", extension);
    formData.append("totalChunks", totalChunks);
    formData.append("image", image);
    formData.append("title", titleRef.current.value);

    const response = await axios.post("api/video/assemble", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const uploadMutation = useMutation(uploadChunk, {
    onSuccess: () => queryClient.invalidateQueries("upload"),
  });

  const assembleMutation = useMutation(assembleFile, {
    onSuccess: () => queryClient.invalidateQueries("assemble"),
  });

  const uploadWithRetry = async (
    chunk,
    fileName,
    chunkNumber,
    token,
    attempt = 1
  ) => {
    try {
      await uploadMutation.mutateAsync({ chunk, fileName, chunkNumber, token });
    } catch (error) {
      if (attempt < RETRY_LIMIT) {
        console.warn(
          `Chunk ${chunkNumber} upload failed, retrying (${attempt}/${RETRY_LIMIT})`
        );
        await uploadWithRetry(chunk, fileName, chunkNumber, token, attempt + 1);
      } else {
        setError(`Chunk ${chunkNumber} upload permanently failed.`);
        setUploading(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !image || !titleRef.current.value) return;
    if (file.size > MAX_VIDEO_SIZE) {
      setError("Nem lehet nagyobb a videó mérete 256 MB-nál");
      return;
    }

    setUploading(true);
    setIsUploaded(false);

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const generatedFileName = Date.now();
    setFileName(generatedFileName);

    const token = sessionStorage.getItem("jwtToken");
    const extension = file.name.split(".").pop();

    let completedChunks = 0;
    let chunkQueue = Array.from({ length: totalChunks }, (_, i) => i);
    const activeUploads = new Set();

    while (chunkQueue.length > 0 || activeUploads.size > 0) {
      while (
        activeUploads.size < MAX_CONCURRENT_UPLOADS &&
        chunkQueue.length > 0
      ) {
        const chunkNumber = chunkQueue.shift();
        const chunk = file.slice(
          chunkNumber * CHUNK_SIZE,
          (chunkNumber + 1) * CHUNK_SIZE
        );
        const uploadPromise = uploadWithRetry(
          chunk,
          generatedFileName,
          chunkNumber,
          token
        ).finally(() => {
          activeUploads.delete(uploadPromise);
          completedChunks++;
          setUploadPercent(Math.round((completedChunks / totalChunks) * 100));
        });
        activeUploads.add(uploadPromise);
      }
      await Promise.race(activeUploads);
    }

    await assembleMutation.mutateAsync({
      fileName: generatedFileName,
      totalChunks,
      image,
      token,
      extension,
    });
    setIsUploaded(true);
  };

  return {
    file,
    image,
    setFile,
    setImage,
    titleRef,
    error,
    isUploaded,
    uploading,
    uploadPercent,
    handleUpload,
  };
};
