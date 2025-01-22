import React, { useRef, useState } from "react";
import axios from "axios";
import { useMutation, QueryClient } from "react-query";
import { jwtDecode } from "jwt-decode";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 256 * 1024 * 1024; // 256 MB

const queryClient = new QueryClient();

const UploadVideo = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const [error, setError] = useState(null);
  const [image, setImage] = useState();
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploading, setUploading] = useState(false); // Ez azért kell, hogy az uploading ne jelenjen meg az elején
  const [uploadPercent, setUploadPercent] = useState(0);
  const titleRef = useRef();

  // Chunkokat küld a szerver felé
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

  // Ez fogja elküldeni azt, hogy a fájl készen áll az összeállításra
  const assembleFile = async ({
    fileName,
    totalChunks,
    image,
    userId,
    token,
    extension,
  }) => {
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("extension", extension); // A videó kiterjesztése
    formData.append("totalChunks", totalChunks);
    formData.append("image", image);
    formData.append("title", titleRef.current.value);
    formData.append("userId", userId);

    const response = await axios.post("api/video/assemble", formData, {
      headers: { Authorization: `Bearer ${token}` },
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Szétbontja a videót 10 MB-os szeletekre
  const handleUpload = async () => {
    // Nem csinálunk semmit, ha nincs megadva minden
    if (!file || !image || !titleRef.current.value) return;
    if (file.size > MAX_VIDEO_SIZE) {
      setError("Nem lehet nagyobb a videó mérete 256 MB-nál");
      return;
    }

    setUploading(true);
    setIsUploaded(false);

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // Összesen mennyi 10 MB-os chunk lesz
    setFileName(Date.now() + "-" + totalChunks); // User adatai
    const token = localStorage.getItem("jwtToken");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.sub;
    const extension = file.name.split(".").pop(); // Helyesen meghatározza a fájl kiterjesztését
    for (let i = 0; i < totalChunks; i++) {
      // A feltöltendő chunkot kiveszi a fájlból
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await uploadMutation.mutateAsync({
        chunk,
        fileName: fileName,
        chunkNumber: i,
        token: token,
      });
      setUploadPercent(Math.round(((i + 1) / totalChunks) * 100));
    }
    await assembleMutation.mutateAsync({
      fileName: fileName,
      totalChunks,
      image,
      userId,
      token,
      extension: extension,
    });
    setIsUploaded(true);
  };

  if (localStorage.getItem("jwtToken") === null) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Nem vagy bejelentkezve!
        </h1>
        <p className="text-center mb-4">A feltöltéshez be kell jelentkezned.</p>
        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 block text-center"
        >
          Bejelentkezés
        </a>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-4">
          Videó feltöltése
        </h1>
        <div className="mb-4">
          <label htmlFor="video" className="block text-white font-bold mb-2">
            Videó:
          </label>
          <input
            className="form-input w-full px-4 py-2 border rounded-md"
            name="video"
            type="file"
            onChange={handleFileChange}
            accept="video/*"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="thumbnail"
            className="block text-white font-bold mb-2"
          >
            Indexkép:
          </label>
          <input
            className="form-input w-full px-4 py-2 border rounded-md"
            name="thumbnail"
            type="file"
            onChange={handleImageChange}
            accept=".png"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-white font-bold mb-2">
            Cím:
          </label>
          <input
            className="form-input text-black w-full px-4 py-2 border rounded-md"
            name="title"
            type="text"
            ref={titleRef}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!uploading && !isUploaded && (
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Feltöltés
          </button>
        )}
        {isUploaded && (
          <h1 className="text-green-500 text-center mt-4">Videó feltöltve!</h1>
        )}
        {!isUploaded && uploading ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            type="button"
            disabled
          >
            <svg
              className="animate-spin mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Uploading {uploadPercent} %
          </button>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
};

export default UploadVideo;
