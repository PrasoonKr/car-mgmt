import { createSlice } from "@reduxjs/toolkit";

const carSlice = createSlice({
  name: "car",
  initialState: [],
  reducers: {
    addOneCar: (state, action) => {
      state.push(action.payload);
    },
    addCar: (state, action) => {
      return action.payload;
    },
    clearCar: () => {
      return [];
    },
  },
});

export const { addCar, clearCar, addOneCar } = carSlice.actions;
export default carSlice.reducer;
