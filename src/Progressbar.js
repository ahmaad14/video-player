import React from "react";
import { UPLOAD_STATUS } from "./constants";
export default function Progressbar({ percentage = 0, uploadStatus }) {
  return (
    <>
      {uploadStatus === UPLOAD_STATUS.IN_PROGRESS && percentage > 0 && (
        <div className="progress__bar">
          <div
            className="progress__bar-fill"
            style={{ width: `${100 - percentage}%` }}
          />
        </div>
      )}

      {uploadStatus === UPLOAD_STATUS.COMPLETED && (
        <p className="status-completed">
          {" "}
          The Video Has Been Uploaded successfully 🎉{" "}
        </p>
      )}

      {uploadStatus === UPLOAD_STATUS.FAILED && (
        <p className="status-failed"> Something Went Wrong 😔 </p>
      )}
    </>
  );
}
