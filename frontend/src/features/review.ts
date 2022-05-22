import { createSlice } from "@reduxjs/toolkit";
import { Review } from "../models";

export interface ReviewState {
  reviews: Review[];
}

const initialState: ReviewState = {
  reviews: [],
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    getReviews: (state, action) => {
      state.reviews = action.payload;
    }
  }
});

export const reviewActions = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;
