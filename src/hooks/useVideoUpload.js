import { useState, useRef } from "react";
import axios from "axios";
import { useMutation, QueryClient } from "react-query";

// Feltöltési darab (chunk) méret beállítása 10 MB-ra
const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB

// Maximális videóméret beállítása 256 MB-ra
const MAX_VIDEO_SIZE = 256 * 1024 * 1024; // 256 MB

// Maximális párhuzamos feltöltések száma
const MAX_CONCURRENT_UPLOADS = 3;

// Újrapróbálkozások maximális száma
const RETRY_LIMIT = 3;

const queryClient = new QueryClient();

export const useVideoUpload = () => {
  // Állapotok definiálása
  const [file, setFile] = useState(null); // Feltöltendő fájl
  const [image, setImage] = useState(null); // Videóhoz tartozó kép
  const [fileName, setFileName] = useState(""); // Generált fájlnév
  const [error, setError] = useState(null); // Hibák tárolása
  const [isUploaded, setIsUploaded] = useState(false); // Feltöltés állapota
  const [uploading, setUploading] = useState(false); // Feltöltés folyamatban jelző
  const [uploadPercent, setUploadPercent] = useState(0); // Feltöltési százalék
  const titleRef = useRef(); // Videó címe

  // Ez fog lefutni, amikor feltöltjük a fájlokat a szerverre
  const uploadChunk = async ({ chunk, fileName, chunkNumber, token }) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("fileName", fileName);
    formData.append("chunkNumber", chunkNumber);

    // HTTP POST kérés a feltöltési API-hoz
    const response = await axios.post("api/video/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  // Ez fog lefutni, amikor a fájldarabok összeállításra kerülnek
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

  // Mutation definiálása az adatdarabok feltöltéséhez
  const uploadMutation = useMutation(uploadChunk, {
    onSuccess: () => queryClient.invalidateQueries("upload"), // Gyorsítótár érvénytelenítése sikeres feltöltés után
  });

  // Mutation definiálása az összeállításhoz
  const assembleMutation = useMutation(assembleFile, {
    onSuccess: () => queryClient.invalidateQueries("assemble"), // Gyorsítótár érvénytelenítése sikeres összeállítás után
  });

  // Adatdarab feltöltése újrapróbálkozással
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
        // Újrapróbálkozás hiba esetén, ha a próbálkozások száma nem érte el a RETRY_LIMIT-et
        console.warn(
          `Chunk ${chunkNumber} upload failed, retrying (${attempt}/${RETRY_LIMIT})`
        );
        await uploadWithRetry(chunk, fileName, chunkNumber, token, attempt + 1);
      } else {
        // Hibakezelés, ha a próbálkozások száma elérte a RETRY_LIMIT-et
        setError(`Chunk ${chunkNumber} upload permanently failed.`);
        setUploading(false);
      }
    }
  };

  // Feltöltési folyamat kezelése
  const handleUpload = async () => {
    if (!file || !image || !titleRef.current.value) return;

    if (file.size > MAX_VIDEO_SIZE) {
      setError("Nem lehet nagyobb a videó mérete 256 MB-nál");
      return;
    }

    setUploading(true);
    setIsUploaded(false);

    // Darabszámok kiszámítása
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    const generatedFileName = Date.now();
    setFileName(generatedFileName);

    const token = sessionStorage.getItem("jwtToken");
    const extension = file.name.split(".").pop();

    let completedChunks = 0;
    let chunkQueue = Array.from({ length: totalChunks }, (_, i) => i); // Darabszámok sorban
    const activeUploads = new Set(); // Aktív feltöltések halmaza

    // Külső ciklus a feltöltési sor és az aktív feltöltések kezeléséhez
    while (chunkQueue.length > 0 || activeUploads.size > 0) {
      // Belső ciklus a párhuzamos feltöltések kezeléséhez
      while (
        activeUploads.size < MAX_CONCURRENT_UPLOADS &&
        chunkQueue.length > 0
      ) {
        // Aktuális darabszám és fájldarab kiválasztása
        const chunkNumber = chunkQueue.shift();
        const chunk = file.slice(
          chunkNumber * CHUNK_SIZE,
          (chunkNumber + 1) * CHUNK_SIZE
        );

        // Feltöltési Promise létrehozása
        const uploadPromise = uploadWithRetry(
          chunk,
          generatedFileName,
          chunkNumber,
          token
        ).finally(() => {
          // Végrehajtandó műveletek feltöltés után
          activeUploads.delete(uploadPromise); // Eltávolítás az aktív feltöltések közül
          completedChunks++; // Befejezett darabok számának növelése
          setUploadPercent(Math.round((completedChunks / totalChunks) * 100)); // Feltöltési százalék frissítése
        });

        // Promise hozzáadása az aktív feltöltésekhez
        activeUploads.add(uploadPromise);
      }

      // Várakozás, amíg az aktív feltöltések közül bármelyik befejeződik
      await Promise.race(activeUploads);
    }

    // Fájl összeállítása az összes darab feltöltése után
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
