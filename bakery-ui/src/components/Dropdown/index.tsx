import { useEffect, useRef, useState } from "react";
import { FONT_SANS } from "@/constant/common";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
  dotClassName?: string;
}

interface DropdownProps<T extends string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

const Dropdown = <T extends string>({
  value,
  options,
  onChange,
  className,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-left
                   bg-white focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
                   transition-all duration-150 cursor-pointer inline-flex items-center gap-2 min-w-[160px] justify-between
                   ${className ?? ""}`}
        style={{ fontFamily: FONT_SANS }}
      >
        <span className="inline-flex items-center gap-2 text-surface-900">
          {selected?.dotClassName && (
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${selected.dotClassName}`}
            />
          )}
          {selected?.label}
        </span>
        <i
          className={`pi pi-chevron-down text-[10px] text-surface-400 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 mt-1 left-0 right-auto sm:left-auto sm:right-0 w-52
                     bg-white rounded-xl border border-surface-200 shadow-lg overflow-hidden py-1"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm cursor-pointer transition-colors
                  ${isSelected ? "text-ink-900 font-medium bg-surface-50" : "text-surface-700 hover:bg-surface-50"}`}
                style={{ fontFamily: FONT_SANS }}
              >
                <span className="inline-flex items-center gap-2">
                  {option.dotClassName && (
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${option.dotClassName}`}
                    />
                  )}
                  {option.label}
                </span>
                {isSelected && (
                  <i className="pi pi-check text-[10px] text-ink-900" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
