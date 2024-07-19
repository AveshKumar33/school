import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import LocalityList from "../../../components/Master/Locality/LocalityList";
import Modal from "../../../components/UI/Modal";
import styles from "../../../components/Master/Locality/LocalityForm.module.css";
import instance from "../../../util/axios/config";

const LocalityListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({});
  const [newValue, setNewValue] = useState("");
  const [updatedData, setUpdatedData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Locality"));
  }, [dispatch]);

  const postSection = async (data) => {
    try {
      const response = await instance.put("/locality/" + value._id, {
        name: data,
      });

      if (response.data.status === "failed") {
        return response;
      }

      window.alert(response.data.message);
      setUpdatedData(response.data.data);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newValue === "") {
      alert("empty");
      return;
    }
    postSection(newValue);
  };

  const openModal = (data) => {
    setValue({ ...data.data });
    setNewValue(data.data.name);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Modal onCloseCart={closeModal}>
          <div className={styles["form-container"]}>
            <form onSubmit={handleSubmit}>
              <label className={styles["form-label"]}>Locality</label>
              <input
                className={styles["form-control"]}
                type="text"
                defaultValue={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                }}
              />
              <button className={styles["submit-btn"]} type="submit">
                Submit
              </button>
              <button
                className={styles["cancle-button"]}
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
            </form>
          </div>
        </Modal>
      )}
      <LocalityList newData={updatedData} onClick={(data) => openModal(data)} />
    </>
  );
};

export default LocalityListPage;
