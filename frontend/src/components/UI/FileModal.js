import { Fragment } from "react";
import classes from "./FileModal.module.css";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose}></div>;
};

const ModaalOverlay = (props) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className={classes.modal}>
        <div className={classes.content}>{props.children}</div>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("fileoverlays");

const FileModal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onCloseModal} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModaalOverlay>{props.children}</ModaalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default FileModal;
