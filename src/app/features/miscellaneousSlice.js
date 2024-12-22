import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageSource: "",
  capturedImage: "",
};

export const miscellaneousSlice = createSlice({
  name: "miscellaneous",
  initialState,
  reducers: {
    setImageSource: (state, action) => {
      state.imageSource = action.payload;
    },

    setCapturedImage: (state, action) => {
      state.capturedImage = action.payload;
    },

    removeAllMiscellaneous: (state) => {
      state.imageSource = "";
      state.capturedImage = "";
    },
  },
});

export const { setImageSource, setCapturedImage, removeAllMiscellaneous } =
  miscellaneousSlice.actions;
export default miscellaneousSlice.reducer;
