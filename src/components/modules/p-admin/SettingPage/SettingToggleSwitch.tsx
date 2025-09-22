"use client";
import React, { useState } from "react";
import "./SettingToggleSwitch.css";

interface SettingToggleSwitchProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (val: boolean) => void;
}
export default function SettingToggleSwitch({
  checked: checkedProp,
  disabled=false,
  onChange,
}: SettingToggleSwitchProps) {
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
    <div className="flex items-center gap-4">
      <span className="text-white mb-1">{checked ? "On" : "Off"}</span>
      <label className="admin-toggle-setting-switch">
        <input
          className="admin-toggle-setting-input"
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
        />
        <span className="admin-toggle-setting-slider round"></span>
      </label>
    </div>
  );
}
