import AdminToggleSwitch from '@/components/Ui/AdminToggleSwitch/AdminToggleSwitch'
import React from 'react'
interface AbilityConfigBoxProps {
  title: string;
  enabled: boolean;
  onToggle: (val: boolean) => void;
}

export default function AbilityConfigBox({ title, enabled, onToggle }: AbilityConfigBoxProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-[1px] rounded-[.5rem] p-2 px-3 border-[#383C47]">
      <span className="text-white text-[1.2rem]">{title.toUpperCase()}</span>
      <AdminToggleSwitch checked={enabled} onChange={onToggle} />
    </div>
  );
}