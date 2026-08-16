import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCategories, Category } from "@/service/category";

interface CategoryPickerProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

const CategoryPicker = ({ value, onChange }: CategoryPickerProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await listCategories();
      return res.data.data as Category[];
    },
  });

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

  const selectedLower = value.map((v) => v.toLowerCase());
  const query = inputValue.trim();

  const suggestions = categories
    .map((c) => c.name)
    .filter(
      (name) =>
        !selectedLower.includes(name.toLowerCase()) &&
        (query === "" || name.toLowerCase().includes(query.toLowerCase())),
    );

  const hasExactMatch = categories.some(
    (c) => c.name.toLowerCase() === query.toLowerCase(),
  );
  const canCreate = query !== "" && !hasExactMatch;

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (selectedLower.includes(trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...value, trimmed]);
    setInputValue("");
    setIsOpen(false);
  };

  const removeCategory = (name: string) => {
    onChange(value.filter((v) => v !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query) {
        addCategory(query);
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeCategory(value[value.length - 1]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="w-full min-h-[46px] px-2 py-1.5 rounded-xl border border-surface-200 bg-white
                   flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-ink-900/20
                   focus-within:border-ink-900/40 transition-all duration-150"
        onClick={() => setIsOpen(true)}
      >
        {value.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-medium"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeCategory(name);
              }}
              className="cursor-pointer hover:text-sage-900"
              aria-label={`Remove ${name}`}
            >
              <i className="pi pi-times text-[10px]" />
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Add a category…" : ""}
          className="flex-1 min-w-[100px] px-1.5 py-1 text-sm text-surface-900 placeholder:text-surface-400
                     bg-transparent focus:outline-none"
          style={{ fontFamily: "var(--font-sans)" }}
        />
      </div>

      {isOpen && (canCreate || suggestions.length > 0) && (
        <div
          className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-surface-200 shadow-lg
                     overflow-hidden max-h-56 overflow-y-auto"
        >
          {canCreate && (
            <button
              type="button"
              onClick={() => addCategory(query)}
              className="w-full text-left px-3.5 py-2.5 text-sm text-ink-900 font-medium hover:bg-surface-50
                         cursor-pointer flex items-center gap-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <i className="pi pi-plus text-xs" />
              Create category &quot;{query}&quot;
            </button>
          )}
          {suggestions.map((name) => (
            <button
              type="button"
              key={name}
              onClick={() => addCategory(name)}
              className="w-full text-left px-3.5 py-2.5 text-sm text-surface-700 hover:bg-surface-50 cursor-pointer"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPicker;
