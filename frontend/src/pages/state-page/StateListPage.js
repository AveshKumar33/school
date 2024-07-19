import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { uiAction } from "../../redux/ui-slice";
import StateList from "../../components/State/StateList";
import Modal from "../../components/UI/Modal";
import styles from "../../components/State/StateForm.module.css";
import instance from "../../util/axios/config";

const StateListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({});
  const [newValue, setNewValue] = useState("");
  const [updatedData, setUpdatedData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("State"));
  }, [dispatch]);

  const postSection = async (data) => {
    try {
      const response = await instance.put("/state/" + value._id, {
        name: data,
      });

      if (response.data.status === "failed") {
        return response;
      }

      toast.success(response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });

      setUpdatedData(response.data.data);
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
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
              <label className={styles["form-label"]}>State</label>
              <input
                className={styles["form-control"]}
                type="text"
                defaultValue={newValue}
                onChange={(e) => {
                  setNewValue(e.target.value);
                }}
              />
              <button className={styles["submit-button"]} type="submit">
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
      <StateList newData={updatedData} onClick={(data) => openModal(data)} />
    </>
  );
};

export default StateListPage;
