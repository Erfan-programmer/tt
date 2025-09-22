"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentState {
  triggerSubmit: boolean;
  permissions: any[]; 
}

const initialState: PaymentState = {
  triggerSubmit: false,
  permissions: [],
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setTriggerSubmit(state) {
      state.triggerSubmit = true;
    },
    resetTriggerSubmit(state) {
      state.triggerSubmit = false;
    },
    setPermissions(state, action: PayloadAction<any[]>) {
      state.permissions = action.payload;
    },
  },
});

export const { setTriggerSubmit, resetTriggerSubmit, setPermissions } = paymentSlice.actions;
export default paymentSlice.reducer;
