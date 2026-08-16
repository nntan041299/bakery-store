import { FONT_SANS } from "@/constant/common";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
        bg-white placeholder:text-surface-400
        focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
        disabled:bg-surface-50 disabled:text-surface-400
        transition-all duration-150
        ${props.className ?? ""}
      `}
      style={{ fontFamily: FONT_SANS }}
    />
  );
};

export default Input;
