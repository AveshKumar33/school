import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../util/axios/config";
import { toast } from "react-toastify";

export const changePassword = createAsyncThunk(
  "changePassword",
  async ({ type, id, password }) => {
    if (type === "teacher") {
      type = "employee";
    }
    if (type === "student") {
      const formData = new FormData();
      formData.append("data", JSON.stringify(password));
      password = formData;
    }

    try {
      const response = await instance.put(`/${type}/${id}`, password);

      if (response.data.status === "failed") {
        return response;
      }

      if (response.data.status === "Success") {
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }

      return response.data.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return error;
    }
  }
);

// get otp
export const forgetPassword = createAsyncThunk(
  "forgetPassword",
  async ({ data, path }) => {
    try {
      const response = await instance.post(`/otp/${path}`, data);

      if (response.data.status === "Failed") {
        toast.error(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        return response.data;
      }

      if (response.data.status === "Success") {
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }

      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  }
);

// change password with forget

export const changePasswordWithForget = createAsyncThunk(
  "changePasswordWithForget",
  async (data) => {
    let postData = data;

    // if (data.userType === "student") {
    //   const formData = new FormData();
    //   formData.append("data", JSON.stringify(data));
    //   postData = formData;
    // }

    try {
      const response = await instance.post("/otp/change-password", postData);

      if (response.data.status === "Success") {
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }

      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  }
);

const initialState = {
  isLoading: false,
  data: null,
  error: null,
};

const psswordSlice = createSlice({
  name: "passwordChange",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, acion) => {
        state.isLoading = false;
        state.data = acion.payload;
      })
      .addCase(changePassword.rejected, (state) => {
        state.isLoading = false;
      })

      // Forgot Password (send otp)

      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(forgetPassword.rejected, (state) => {
        state.isLoading = false;
      })

      // reset Password

      .addCase(changePasswordWithForget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePasswordWithForget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(changePasswordWithForget.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const changePasswordActions = psswordSlice.actions;

export default psswordSlice.reducer;
