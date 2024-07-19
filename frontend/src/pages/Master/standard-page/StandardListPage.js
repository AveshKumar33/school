import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import StandardList from "../../../components/Master/Standard/StandardList";
import Modal from "../../../components/UI/Modal";
import styles from "../../../components/Master/Standard/StandardForm.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import instance from "../../../util/axios/config";

const StandardListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({});
  const [newValue, setNewValue] = useState("");
  const [updatedData, setUpdatedData] = useState();
  const [optionSelected, setSelected] = useState(null);
  const [section, setSection] = useState([]);

  // const options = section.map((obj) => ({
  //   value: obj._id,
  //   label: obj.section,
  // }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Standard"));
  }, [dispatch]);

  const getSection = async () => {
    try {
      const response = await instance.get(`/section/all`);
      //   if (!response.ok) {
      //     return json({ message: "Could not fetch datas." }, { status: 500 });
      //   } else {
      // }

      setSection(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSection();
  }, []);

  const postStandard = async (updatdStandard, updatedSectionsId) => {
    const updatedData = {
      standard: updatdStandard,
      sections: updatedSectionsId,
    };

    try {
      const response = await instance.put(
        "/standard/" + value._id,
        updatedData
      );

      if (response.data.status === "failed") {
        return response;
      }

      window.alert(response.data.message);
      setUpdatedData(response.data.updataddata);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const openModal = (data) => {
    setValue({ ...data.data });
    setNewValue(data.data.standard);

    // const SelectedOptions = [...data.data.sections].map((obj) => ({
    //   value: obj._id,
    //   label: obj.section,
    // }));

    // setSelected(SelectedOptions);
    setSelected([...data.data.sections]);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOptionChange = (event, value) => {
    setSelected(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (newValue === "" || optionSelected.length === 0) {
    //   alert("empty");
    //   return;
    // }
    const sectionId = optionSelected.map((item) => item._id);
    postStandard(newValue, sectionId);
  };

  return (
    <>
      {isOpen && (
        <Modal onCloseCart={closeModal}>
          <div className={styles["form-container"]}>
            <form onSubmit={handleSubmit}>
              <div
                className={styles["form-group"]}
                style={{ display: "block" }}
              >
                <div>
                  <label className={styles["form-label"]}>Standard</label>
                  <input
                    className={styles["form-control"]}
                    type="text"
                    defaultValue={newValue}
                    onChange={(e) => {
                      setNewValue(e.target.value);
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="country" className={styles["form-label"]}>
                    Section
                  </label>
                  <Stack sx={{ width: 340 }}>
                    <Autocomplete
                      multiple
                      size="small"
                      id="multiple-limit-tags"
                      options={section}
                      value={optionSelected}
                      getOptionLabel={(option) => option.section}
                      filterSelectedOptions
                      onChange={handleOptionChange}
                      isOptionEqualToValue={(option, value) =>
                        option?._id === value?._id
                      }
                      renderInput={(params) => (
                        <TextField {...params} placeholder="section" />
                      )}
                    />
                  </Stack>
                </div>
              </div>
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
      <StandardList newData={updatedData} onClick={(data) => openModal(data)} />
    </>
  );
};

export default StandardListPage;
