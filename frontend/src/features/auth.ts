import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models";

const initialState: User = {
  id: 0,
  name: "",
  email: "",
  avatar: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
    logout: (state) => {
      state.id = 0;
      state.name = "";
      state.email = "";
      state.avatar = "";
    }
  }
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;