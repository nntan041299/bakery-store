import { useState } from "react";
import Input from "@/components/Form/Input";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name: string;
}

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  name,
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
        tabIndex={-1}
      >
        <i className={`pi ${show ? "pi-eye-slash" : "pi-eye"} text-sm`} />
      </button>
    </div>
  );
};

export default PasswordInput;
