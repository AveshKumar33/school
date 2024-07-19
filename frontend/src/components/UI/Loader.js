import React from "react";
import { RotatingLines } from "react-loader-spinner";

import FileModal from "./FileModal";

const Loader = ({ isLoading }) => {
  return (
    <FileModal>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <RotatingLines
          strokeColor="#4a4a4b"
          strokeWidth="3"
          animationDuration="0.75"
          width="50"
          visible={isLoading}
        />
      </div>
    </FileModal>
  );
};

export default Loader;
