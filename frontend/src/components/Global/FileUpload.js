import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { REACT_APP_FileURL } from "../../util/axios/config";
import UploadIcon from "../../assets/UploadIcon";
import FileIcon from "../../assets/FileIcon";
import styles from "../Student/StudentForm.module.css";

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
        if (file.type.includes("image") || file.type.includes("pdf")) {
          file.preview = URL.createObjectURL(file);
          return file;
        }
        toast.error("Only image and PDF allowed!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        return null;
      })
      .filter((elem) => elem !== null);

    setstate(blobs);
  }
  return [state, withBlobs];
}

// validate between image and pdf for display
const fileExtension = (fileName) => {
  const fileExtension = fileName?.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
};

// main function

function Upload({
  onDrop,
  fileAccept,
  handleFileChange = () => {},
  field,
  inpId,
  name,
  existingFile = "",
}) {
  const [files, setfiles] = useFiles({});

  useEffect(() => {
    if (onDrop) {
      onDrop(files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <>
      <div>
        <div className={styles.container}>
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
            {existingFile &&
              files.length === 0 &&
              (fileExtension(existingFile) ? (
                <img
                  width="175"
                  height="175"
                  key={existingFile + "file"}
                  src={`${REACT_APP_FileURL}/file/${existingFile}`}
                  alt="your file"
                />
              ) : (
                <img
                  style={{
                    width: "150px",
                    height: "150px",
                    marginTop: "10px",
                  }}
                  src={`${REACT_APP_FileURL}/pdf.webp`}
                  alt="you_file"
                />
              ))}
            {files.length > 0 ? (
              fileExtension(files[0]?.name) ? (
                files.map((file) => (
                  <img
                    width="175"
                    height="175"
                    key={file.name + "file"}
                    src={file.preview}
                    alt="your_file"
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
                  alt="you_file"
                />
              )
            ) : !existingFile ? (
              <UploadIcon />
            ) : (
              ""
            )}

            <p>Drop & Browse File to upload!</p>
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
            {...field}
            onChange={(e) => {
              handleFileChange(e);
              setfiles(e.target.files);
            }}
          />
        </div>
      </div>
    </>
  );
}

export { Upload };
