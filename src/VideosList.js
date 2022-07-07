import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./db";

export default function VideosList({ latestUpload }) {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const videosCollectionRef = collection(db, "videos");
      const docs = await (await getDocs(videosCollectionRef)).docs;
      setVideos(
        docs.map((doc) => {
          return {
            videoUrl: doc.data().videoUrl,
            id: doc.id,
            thumbnailUrl: doc.data().thumbnailUrl,
          };
        })
      );
    };
    getData();
  }, []);

  useEffect(() => {
    if (latestUpload) 
       setVideos((prev) => [...prev, latestUpload])

  }, [latestUpload]);

  return (
    <div className="videos-list">
      {videos.map((video) => (
        <ReactPlayer
          key={video.id}
          url={video.videoUrl}
          light={video.thumbnailUrl}
          controls={true}
          height={200}
          width={300}
        />
      ))}
    </div>
  );
}
