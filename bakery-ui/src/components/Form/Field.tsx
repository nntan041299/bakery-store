import { ReactNode } from "react";
import { FONT_SANS } from "@/constant/common";

interface FieldProps {
  label: string;
  children: ReactNode;
  error?: string;
}

const Field = ({ label, children, error }: FieldProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium text-surface-700"
        style={{ fontFamily: FONT_SANS }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500" style={{ fontFamily: FONT_SANS }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
