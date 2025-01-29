import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import carReducer from "./slices/carSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    car: carReducer,
  },
});

export default store;
