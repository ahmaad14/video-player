import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { storage, db } from "./db";
import { UPLOAD_STATUS } from "./constants";
import Progressbar from "./Progressbar";
import VideosList from "./VideosList";
import "./App.css";

function App() {
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(UPLOAD_STATUS.IN_PROGRESS);
  const [latestUpload, setLatestUpload] = useState(null);

  function uploadVideo(e) {
    setUploadStatus(UPLOAD_STATUS.IN_PROGRESS);

    const file = e.target.files[0];
    if (!file.type.match("video")) return setUploadStatus(UPLOAD_STATUS.FAILED);

    const storageRef = ref(storage, `/videos/${uuid()}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressValue = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressValue);
      },

      () => setUploadStatus(UPLOAD_STATUS.FAILED),

      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const videosCollectionRef = collection(db, "videos");
          const thumbnailUrl = await getThumbnail(file);
          const doc = await addDoc(videosCollectionRef, {
            videoUrl: url,
            thumbnailUrl,
          });
          setUploadStatus(UPLOAD_STATUS.COMPLETED);
          setLatestUpload({ id: doc.id, videoUrl: url, thumbnailUrl });
        } catch {
          setUploadStatus(UPLOAD_STATUS.FAILED);
        }
      }
    );
  }

  const getThumbnail = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const video = document.createElement("video");

      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        return resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  return (
    <main>
      <label htmlFor="file-upload" className="upload-btn">
        SELECT
      </label>
      <input
        id="file-upload"
        type="file"
        accept="video/*"
        onChange={uploadVideo}
      />
      <Progressbar percentage={progress} uploadStatus={uploadStatus} />
      <VideosList latestUpload={latestUpload} />
    </main>
  );
}

export default App;
