import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentState {
  triggerSubmit: boolean;
  permissions: any[];
  isLoading: boolean;
}

const initialState: PaymentState = {
  triggerSubmit: false,
  permissions: [],
  isLoading: false,
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setTriggerSubmit, resetTriggerSubmit, setPermissions, setLoading } = paymentSlice.actions;
export default paymentSlice.reducer;