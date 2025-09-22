declare module "react-mobile-datepicker" {
  import * as React from "react";

  interface DatePickerProps {
    value: Date;
    isOpen: boolean;
    onSelect: (time: Date) => void;
    onCancel: () => void;
    dateConfig?: Record<string, any>;
    confirmText?: string;
    cancelText?: string;
    showHeader?: boolean;
    theme?: string;
    [key: string]: any; 
  }

  export default class DatePicker extends React.Component<DatePickerProps> {}
}
