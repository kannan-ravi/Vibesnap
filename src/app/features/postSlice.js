import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    fetchAllPost: (state, action) => {
      state.posts = action.payload.reverse();
    },

    increasePostTotalLike: (state, action) => {
      const post = state.posts.find((post) => post.id === action.payload);
      post ? (post.total_likes = post.total_likes + 1) : null;
    },

    decreasePostTotalLike: (state, action) => {
      const post = state.posts.find((post) => post.id === action.payload);
      post ? (post.total_likes = post.total_likes - 1) : null;
    },

    removeAllPost: (state) => {
      state.posts = [];
    },
  },
});

export const {
  fetchAllPost,
  increasePostTotalLike,
  decreasePostTotalLike,
  removeAllPost,
} = postSlice.actions;
export default postSlice.reducer;
