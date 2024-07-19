import React from "react";

import img404 from "../../assets/error-404.png";
import styles from "./styles.module.css";

const NotFoundPage = () => {
  return (
    <img className={styles.pageNotFound} src={img404} alt="_page_not_found" />
  );
};

export default NotFoundPage;
