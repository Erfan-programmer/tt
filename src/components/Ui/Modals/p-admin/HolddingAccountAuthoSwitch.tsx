"use client"
import React, { useState } from "react";
import "@/styles/p-admin/HolddingAccountAuthoSwitch.css";

interface AdminToggleSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (val: boolean) => void;
}
export default function HolddingAccountAuthoSwitch ({
  checked: checkedProp,
  onChange,
}: AdminToggleSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;

  const handleChange = () => {
    if (!isControlled) {
      setInternalChecked(!checked);
    }
    onChange?.(!checked);
  };
  return (
    <label className="admin-toggle-hold-account-switch  ml-2">
      <input
        className="admin-toggle-hold-account-input"
        type="checkbox"
           checked={checked}
        onChange={handleChange}
      />
      <span className="admin-toggle-hold-account-slider round"></span>
    </label>
  );
}
