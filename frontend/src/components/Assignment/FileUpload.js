import React, { useState, useEffect } from "react";
import UploadIcon from "../../assets/UploadIcon";
import FileIcon from "../../assets/FileIcon";
import styles from "./Styles.module.css";

function removeItems(arr, item) {
  for (var i = 0; i < item; i++) {
    arr.pop();
  }
}

function useFiles({ initialState = [], maxFiles = 1 }) {
  const [state, setstate] = useState(initialState);

  function withBlobs(files) {
    const destructured = [...files];

    if (destructured.length > maxFiles) {
      const difference = destructured.length - maxFiles;
      removeItems(destructured, difference);
    }

    const blobs = destructured
      .map((file) => {
        if (
          file.type.includes("image") ||
          file.type.includes("pdf")
          // file.type.includes("excel") ||
          // file.type.includes("word")
        ) {
          file.preview = URL.createObjectURL(file);
          return file;
        }
        console.log("Unsupported file type:", file.type);
        return null;
      })
      .filter((elem) => elem !== null);

    setstate(blobs);
  }
  return [state, withBlobs];
}

// validate between image and pdf
const fileExtension = (fileName) => {
  const fileExtension = fileName?.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
};

// main function

function AssignmentUpload({ onDrop, fileAccept, inpId, name }) {
  const [files, setfiles] = useFiles({});

  useEffect(() => {
    if (onDrop) {
      onDrop(files);
    }
  }, [files]);

  return (
    <>
      <div>
        <div className={styles["upload-container"]}>
          <label
            htmlFor={inpId}
            onDrop={(e) => {
              e.preventDefault();
              e.persist();
              setfiles(e.dataTransfer.files);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
            }}
            className={styles.header}
          >
            {files.length > 0 ? (
              fileExtension(files[0]?.name) ? (
                files.map((file) => (
                  <img
                    width="175"
                    height="175"
                    key={file.name + "file"}
                    src={file.preview}
                    alt="your file"
                  />
                ))
              ) : (
                <img
                  style={{
                    width: "150px",
                    height: "150px",
                    marginTop: "10px",
                  }}
                  src="http://localhost:3000/pdf.webp"
                />
              )
            ) : (
              <UploadIcon />
            )}

            <p>Drop and Browse File to upload!</p>
          </label>
          <label htmlFor={inpId} className={styles.footer}>
            <FileIcon />
            {files.length > 0 ? (
              <p>{files[0].name}</p>
            ) : (
              <p>Not selected file</p>
            )}
          </label>
          <input
            style={{ display: "none" }}
            type="file"
            id={inpId}
            name={name}
            accept={fileAccept}
            onChange={(e) => {
              setfiles(e.target.files);
            }}
          />
        </div>
      </div>
    </>
  );
}

export { AssignmentUpload };
