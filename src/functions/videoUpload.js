import axios from "axios";
import { useMutation, QueryClient } from "react-query";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 256 * 1024 * 1024; // 256 MB
const queryClient = new QueryClient();

// Chunkokat küld a szerver felé
const uploadChunk = async ({ chunk, fileName, chunkNumber }) => {
  const formData = new FormData();
  formData.append("chunk", chunk);
  formData.append("fileName", fileName);
  formData.append("chunkNumber", chunkNumber);

  const response = await axios.post("api/video/upload", formData, {
    withCredentials: true
  });
  return response.data;
};

// Ez fogja elküldeni azt, hogy a fájl készen áll az összeállításra
const assembleFile = async ({
  fileName,
  totalChunks,
  image,
  extension,
}) => {
  const formData = new FormData();
  formData.append("fileName", fileName);
  formData.append("extension", extension); // A videó kiterjesztése
  formData.append("totalChunks", totalChunks);
  formData.append("image", image);
  formData.append("title", titleRef.current.value);

  const response = await axios.post("api/video/assemble", formData, {
    withCredentials: true
  });
  return response.data;
};

// Kezeli a feltöltést, hibákat, kéréseket
const uploadMutation = useMutation(uploadChunk, {
  onSuccess: () => {
    queryClient.invalidateQueries("upload");
  },
});

const assembleMutation = useMutation(assembleFile, {
  onSuccess: () => {
    queryClient.invalidateQueries("assemble");
  },
});

export { uploadMutation, assembleMutation };
