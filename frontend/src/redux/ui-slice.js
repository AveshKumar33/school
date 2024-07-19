import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pageTitle: "",
  open: false, // for modal
  multiStepForm: { value: 1 },
};

const uiSlice = createSlice({
  name: "ui-slice",
  initialState: initialState,
  reducers: {
    title(state, action) {
      state.pageTitle = action.payload;
    },
    openModal(state, action) {
      state.open = action.payload;
      state.multiStepForm.value = 1;
    },
    next(state) {
      state.multiStepForm.value = state.multiStepForm.value + 1;
    },
    prev(state) {
      if (state.multiStepForm.value !== 1) {
        state.multiStepForm.value = state.multiStepForm.value - 1;
      }
    },
    reset(state) {
      state.multiStepForm.value = 1;
    },
  },
});

export const uiAction = uiSlice.actions;
export default uiSlice.reducer;
