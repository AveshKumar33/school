import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import AccountGroup from "../../components/dashboard/components/Account/AccountGroup";

const AccountGroupPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Account Group"));
  }, [dispatch]);

  return (
    <>
      {/* {isOpen && (
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
      )} */}
      {/* <AccountGroup onClick={(data) => openModal(data)} />; */}
      <AccountGroup />;
    </>
  );
};

export default AccountGroupPage;
