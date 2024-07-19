import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import instance from "../util/axios/config";

// create assignment
export const addAssignment = createAsyncThunk(
  "addAssignment",
  async (data, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("assignment", data.assignment);
    formData.append("data", JSON.stringify(data));

    try {
      const response = await instance.post("/assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeAssignment = createAsyncThunk(
  "fetchDataById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.delete("/assignment", {
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: false,
  data: null,
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add-assignment
      .addCase(addAssignment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAssignment.fulfilled, (state, acion) => {
        state.isLoading = false;
        state.data = acion.payload;
      })
      .addCase(addAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // remove-assignment
      .addCase(removeAssignment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeAssignment.fulfilled, (state, acion) => {
        state.isLoading = false;
        state.data = acion.payload;
      })
      .addCase(removeAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const assignmentActions = assignmentSlice.actions;

export default assignmentSlice.reducer;
