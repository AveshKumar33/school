import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { authActions } from "../redux/auth-slice";

// const regex = /\"(.*?)\"/;
const regex = /"(.*?)"/;

const useHttpErrorHandler = () => {
  const dispatch = useDispatch();

  const handleHttpError = useCallback(
    (error) => {
      if (error?.message?.includes("E11000")) {
        const match = error?.message?.match(regex);
        const grade = match ? match[1] : null;
        toast.error(`${grade} already exist!`, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      } else if (error?.status === 401 || error?.status === 500) {
        toast.error("Please login again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        dispatch(authActions.logout());
      } else if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(error?.message || error || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    },
    [dispatch]
  );

  return handleHttpError;
};

export default useHttpErrorHandler;
