import { FONT_SANS } from "@/constant/common";

const Textarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) => {
  return (
    <textarea
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
        bg-white placeholder:text-surface-400 resize-none
        focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
        transition-all duration-150
        ${props.className ?? ""}
      `}
      style={{ fontFamily: FONT_SANS }}
    />
  );
};

export default Textarea;
