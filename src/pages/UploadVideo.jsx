import React, { useRef, useState } from "react";
import axios from "axios";
import { useMutation, QueryClient } from "react-query";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB

const queryClient = new QueryClient();

const UploadVideo = () => {
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploading, setUploading] = useState(false); // Ez azért kell, hogy az uploading ne jelenjen meg az elején
  const [uploadPercent, setUploadPercent] = useState(0);
  const titleRef = useRef();

  // Chunkokat küld a szerver felé
  const uploadChunk = async ({ chunk, fileName, chunkNumber }) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("fileName", fileName);
    formData.append("chunkNumber", chunkNumber);

    const response = await axios.post(
      "https://localhost:7124/api/video/upload",
      formData
    );
    return response.data;
  };

  // Ez fogja elküldeni azt, hogy a fájl készen áll az összeállításra
  const assembleFile = async ({ fileName, totalChunks, image }) => {
    const formData = new FormData();
    const extension = fileName
      .substring(fileName.lastIndexOf("."))
      .replace(".", "");
    formData.append("fileName", fileName);
    formData.append("extension", extension);
    formData.append("totalChunks", totalChunks);
    formData.append("image", image);
    formData.append("title", titleRef.current.value);

    const response = await axios.post(
      "https://localhost:7124/api/video/assemble",
      formData
    );
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

    setUploading(true);
    setIsUploaded(false);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // Összesen mennyi 10 MB-os chunk lesz
    const fileName = file.name;

    for (let i = 0; i < totalChunks; i++) {
      // A feltöltendő chunkot kiveszi a fájlból
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await uploadMutation.mutateAsync({ chunk, fileName, chunkNumber: i });
      setUploadPercent(Math.round(((i + 1) / totalChunks) * 100));
    }

    await assembleMutation.mutateAsync({ fileName, totalChunks, image });
    setIsUploaded(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Videó feltöltése</h1>
      <div className="form-group">
        <label htmlFor="video">Videó:</label>
        <input
          className="form-control"
          name="video"
          type="file"
          onChange={handleFileChange}
          accept="video/*"
        />
      </div>
      <div className="form-group">
        <label htmlFor="thumbnail">Indexkép:</label>
        <input
          className="form-control"
          name="thumbnail"
          type="file"
          onChange={handleImageChange}
          accept=".png"
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Cím:</label>
        <input
          className="form-control"
          name="title"
          type="text"
          ref={titleRef}
        />
      </div>
      {!uploading && !isUploaded && (
        <button onClick={handleUpload} className="btn btn-success btn-block">
          Feltöltés
        </button>
      )}
      {isUploaded && <h1 style={{ color: "green" }}>Videó feltöltve!</h1>}
      {/* Spinner, a videó feltöltésének állapotát jelzi
          Meg kell csinálni úgy, hogy csak akkor jelenjen meg
          hogyha a feltöltés elindult */}
      {!isUploaded && uploading ? (
        <button class="btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Uploading {uploadPercent} %
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default UploadVideo;
