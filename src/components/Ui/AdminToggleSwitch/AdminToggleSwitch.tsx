"use client"
import React, { useState } from "react";
import "./AdminToggleSwitch.css";

interface AdminToggleSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (val: boolean) => void;
}
export default function AdminToggleSwitch ({ 
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
    <label className="admin-toggle-switch">
      <input
        className="admin-toggle-input"
        type="checkbox"
           checked={checked}
        onChange={handleChange}
      />
      <span className="admin-toggle-slider round"></span>
    </label>
  );
}
