import instance from "../axios/config";
import { toast } from "react-toastify";

const errorHandler = (error) => {
  if (
    error?.response?.data?.status === 401 ||
    error?.response?.data?.status === 500
  ) {
    toast.error("Please login again!", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  } else {
    toast.error(error?.response?.data?.message || "Something went wrong", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  }
};

export const getCity = async () => {
  try {
    const response = await instance.get(`/city/all`);
    return response.data.data;
  } catch (error) {
    errorHandler(error);
  }
};

export const getLocality = async () => {
  try {
    const response = await instance.get(`/locality/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getState = async () => {
  try {
    const response = await instance.get(`/state/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStandard = async () => {
  try {
    const response = await instance.get(`/standard/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSession = async () => {
  try {
    const response = await instance.get(`/session/all`);
    //   if (!response.ok) {
    //     return json({ message: "Could not fetch datas." }, { status: 500 });
    //   } else {
    // }
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCourseTyppe = async () => {
  try {
    const response = await instance.get(`/course-type/all`);
    //   if (!response.ok) {
    //     return json({ message: "Could not fetch datas." }, { status: 500 });
    //   } else {
    // }
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCastCategory = async () => {
  try {
    const response = await instance.get(`/cast-category/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getStudentCategory = async () => {
  try {
    const response = await instance.get(`/student-category/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFeeDiscount = async () => {
  try {
    const response = await instance.get(`/fee-discount/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFeeHead = async () => {
  try {
    const response = await instance.get(`/fee-head/all`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
