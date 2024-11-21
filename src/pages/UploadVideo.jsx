import React, { useRef, useState } from "react";
import axios from "axios";
import { useMutation, QueryClient } from "react-query";
import { jwtDecode } from "jwt-decode";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB

const queryClient = new QueryClient();

const UploadVideo = () => {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
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
    formData.append("extension", extension);
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
    setUploading(true);
    setIsUploaded(false);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE); // Összesen mennyi 10 MB-os chunk lesz
    setFileName(Date.now() + "-" + totalChunks); // User adatai
    const token = localStorage.getItem("jwtToken");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
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
      <div>
        <h1>Nem vagy bejelentkezve!</h1>
        <p>A feltöltéshez be kell jelentkezned.</p>
        <a href="/login" className="btn btn-primary btn-block">
          Bejelentkezés
        </a>
      </div>
    );
  } else {
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
        {!isUploaded && uploading ? (
          <button className="btn btn-primary" type="button" disabled>
            <span
              className="spinner-border spinner-border-sm"
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
  }
};

export default UploadVideo;
