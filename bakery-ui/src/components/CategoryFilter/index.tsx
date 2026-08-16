import { useRef, useState } from "react";
import { Category } from "@/service/category";
import { useCreateCategory } from "@/hook/useCategories";
import { useClickOutside } from "@/hook/useClickOutside";
import { CATEGORY_FILTER_TEXT } from "@/constant/products";
import { FONT_SANS } from "@/constant/common";

interface CategoryFilterProps {
  categories: Category[];
  value: number | undefined;
  onChange: (categoryId: number | undefined) => void;
}

const CategoryFilter = ({ categories, value, onChange }: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { mutate: addCategory, isPending: isCreating } = useCreateCategory();

  useClickOutside(containerRef, () => setIsOpen(false));

  const query = inputValue.trim();
  const hasExactMatch = categories.some(
    (c) => c.name.toLowerCase() === query.toLowerCase(),
  );
  const canCreate = query !== "" && !hasExactMatch;

  const selected = categories.find((c) => c.id === value);

  const handleCreate = () => {
    if (!query || isCreating) return;
    addCategory(query, { onSuccess: () => setInputValue("") });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-left
                   bg-white focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
                   transition-all duration-150 cursor-pointer inline-flex items-center gap-2 min-w-[160px] justify-between"
        style={{ fontFamily: FONT_SANS }}
      >
        <span className={selected ? "text-surface-900" : "text-surface-500"}>
          {selected ? selected.name : CATEGORY_FILTER_TEXT.ALL_CATEGORIES}
        </span>
        <i className="pi pi-chevron-down text-[10px] text-surface-400" />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 mt-1 left-0 right-auto sm:left-auto sm:right-0 w-64
                     bg-white rounded-xl border border-surface-200 shadow-lg
                     overflow-hidden max-h-64 flex flex-col"
        >
          <div className="p-2 border-b border-surface-100">
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={CATEGORY_FILTER_TEXT.CREATE_PLACEHOLDER}
              className="w-full px-3 py-2 rounded-lg border border-surface-200 text-sm text-surface-900
                         placeholder:text-surface-400 bg-white
                         focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40"
              style={{ fontFamily: FONT_SANS }}
            />
            {canCreate && (
              <button
                type="button"
                onClick={handleCreate}
                disabled={isCreating}
                className="w-full mt-1.5 text-left px-3 py-2 text-sm text-ink-900 font-medium rounded-lg
                           hover:bg-surface-50 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                style={{ fontFamily: FONT_SANS }}
              >
                <i className="pi pi-plus text-xs" />
                {isCreating
                  ? CATEGORY_FILTER_TEXT.CREATING
                  : CATEGORY_FILTER_TEXT.CREATE_OPTION(query)}
              </button>
            )}
          </div>

          <div className="overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-surface-50 cursor-pointer ${
                value === undefined
                  ? "text-ink-900 font-medium"
                  : "text-surface-700"
              }`}
              style={{ fontFamily: FONT_SANS }}
            >
              {CATEGORY_FILTER_TEXT.ALL_CATEGORIES}
            </button>
            {categories
              .filter(
                (c) =>
                  query === "" ||
                  c.name.toLowerCase().includes(query.toLowerCase()),
              )
              .map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => {
                    onChange(category.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-sm hover:bg-surface-50 cursor-pointer ${
                    value === category.id
                      ? "text-ink-900 font-medium"
                      : "text-surface-700"
                  }`}
                  style={{ fontFamily: FONT_SANS }}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
