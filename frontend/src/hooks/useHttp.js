import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { authActions } from "../redux/auth-slice";
import instance from "../util/axios/config";

export const useGetApi = (url) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(url);
        setData(response.data.data);
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      } finally {
        setIsLoading(false);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [url, dispatch]);

  return { data, isLoading };
};
