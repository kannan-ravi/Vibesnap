import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    editProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    editPost: (state, action) => {
      state.user.posts = action.payload;
    },

    addLikedPost: (state, action) => {
      state.user.liked_posts.push(action.payload);
    },

    removeLikedPost: (state, action) => {
      state.user.liked_posts = state.user.liked_posts.filter(
        (post) => post !== action.payload
      );
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

export const {
  addUser,
  editProfile,
  addLikedPost,
  removeLikedPost,
  removeUser,
  editPost,
} = userSlice.actions;

export default userSlice.reducer;
