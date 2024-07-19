import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import instance from "../util/axios/config";

export const postData = createAsyncThunk(
  "postData",
  async ({ path, data }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`${path}`, data);

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

export const postAttendance = createAsyncThunk(
  "postAttendance",
  async ({ path, data }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`${path}`, data);

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

export const postDataWithFile = createAsyncThunk(
  "postDataWithFile",
  async ({ path, data }, { rejectWithValue }) => {
    try {
      const response = await instance.post(path, data, {
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

export const updateDataWithFile = createAsyncThunk(
  "updateDataWithFile",
  async ({ path, id, data, session = "" }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`${path}/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          session: session,
        },
      });

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

      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchData = createAsyncThunk(
  "fetchData",
  async ({ path }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`${path}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDataWithPagination = createAsyncThunk(
  "fetchDataWithPagination",
  async ({ path }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`${path}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDataById = createAsyncThunk(
  "fetchDataById",
  async ({ path, id }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`${path}/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDataById = createAsyncThunk(
  "deleteDataById",
  async ({ path, id, data = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`${path}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          data: data,
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
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateDataById = createAsyncThunk(
  "updateDataById",
  async ({ path, id, data }, { rejectWithValue }) => {
    try {
      const response = await instance.put(`${path}/${id}`, {
        name: data,
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

export const removeDataAndFile = createAsyncThunk(
  "removeDataAndFile",
  async ({ path, id }, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`${path}/${id}`, {
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

export const viewFile = createAsyncThunk(
  "viewFile",
  async ({ path, filename }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`${path}/${filename}`, {
        responseType: "blob",
      });
      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const pdfDownload = createAsyncThunk(
  "pdfDownload",
  async ({ path, fileName }, { rejectWithValue }) => {
    try {
      const response = await instance.get(path, {
        responseType: "blob", // This ensures we receive a binary response (the PDF)
      });

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      a.href = pdfUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(pdfUrl);
      return;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const excelDownload = createAsyncThunk(
  "excelDownload",
  async ({ path, fileName }, { rejectWithValue }) => {
    try {
      const response = await instance.get(path, {
        responseType: "blob", // This ensures we receive a binary response (the PDF)
      });

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      return;
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const initialState = {
  Loading: false,
  response: "",
  data: [],
  pageData: [],
  dataById: {},
  deletedData: "",
  updatedData: "",
  fileUrl: null,
  httpError: null,
};

const httpSlice = createSlice({
  name: "http-request",
  initialState,
  reducers: {
    clearResponse: (state) => {
      state.response = "";
      state.Loading = false;
      state.updatedData = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // post data
      .addCase(postData.pending, (state) => {
        state.Loading = true;
      })
      .addCase(postData.fulfilled, (state, acion) => {
        state.response = acion.payload;
        state.Loading = false;
      })
      .addCase(postData.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      //postAttendance
      .addCase(postAttendance.pending, (state) => {
        state.Loading = false;
      })
      .addCase(postAttendance.fulfilled, (state, acion) => {
        state.response = acion.payload;
        state.Loading = false;
      })
      .addCase(postAttendance.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      //post data with file
      .addCase(postDataWithFile.pending, (state) => {
        state.Loading = true;
      })
      .addCase(postDataWithFile.fulfilled, (state, acion) => {
        state.response = acion.payload;
        state.Loading = false;
      })
      .addCase(postDataWithFile.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // fetch data
      .addCase(fetchData.pending, (state) => {
        state.Loading = true;
      })
      .addCase(fetchData.fulfilled, (state, acion) => {
        state.data = acion.payload;
        state.Loading = false;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // fetch data with pagination
      .addCase(fetchDataWithPagination.pending, (state) => {
        state.Loading = true;
      })
      .addCase(fetchDataWithPagination.fulfilled, (state, acion) => {
        state.pageData = acion.payload;
        state.Loading = false;
      })
      .addCase(fetchDataWithPagination.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // fetch data by id
      .addCase(fetchDataById.pending, (state) => {
        state.Loading = true;
      })
      .addCase(fetchDataById.fulfilled, (state, acion) => {
        state.dataById = acion.payload;
        state.Loading = false;
      })
      .addCase(fetchDataById.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // delete data
      .addCase(deleteDataById.pending, (state) => {
        state.Loading = true;
      })
      .addCase(deleteDataById.fulfilled, (state, acion) => {
        state.deletedData = acion.payload;
        state.Loading = false;
      })
      .addCase(deleteDataById.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })
      // delete data with file
      .addCase(removeDataAndFile.pending, (state) => {
        state.Loading = true;
      })
      .addCase(removeDataAndFile.fulfilled, (state, acion) => {
        state.deletedData = acion.payload;
        state.Loading = false;
      })
      .addCase(removeDataAndFile.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })
      // update data
      .addCase(updateDataById.pending, (state) => {
        state.Loading = true;
      })
      .addCase(updateDataById.fulfilled, (state, acion) => {
        state.updatedData = acion.payload;
        state.Loading = false;
      })
      .addCase(updateDataById.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // update data with file
      .addCase(updateDataWithFile.pending, (state) => {
        state.Loading = true;
      })
      .addCase(updateDataWithFile.fulfilled, (state, acion) => {
        state.updatedData = acion.payload;
        state.Loading = false;
      })
      .addCase(updateDataWithFile.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      //view file
      .addCase(viewFile.pending, (state) => {
        state.Loading = true;
      })
      .addCase(viewFile.fulfilled, (state, acion) => {
        state.fileUrl = acion.payload;
        state.Loading = false;
      })
      .addCase(viewFile.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // download file
      .addCase(pdfDownload.pending, (state) => {
        state.Loading = true;
      })
      .addCase(pdfDownload.fulfilled, (state, acion) => {
        state.Loading = false;
      })
      .addCase(pdfDownload.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      })

      // excel Download file
      .addCase(excelDownload.pending, (state) => {
        state.Loading = true;
      })
      .addCase(excelDownload.fulfilled, (state, acion) => {
        state.Loading = false;
      })
      .addCase(excelDownload.rejected, (state, action) => {
        state.Loading = false;
        state.httpError = action.payload;
      });
  },
});

export const httpActions = httpSlice.actions;

export default httpSlice.reducer;
