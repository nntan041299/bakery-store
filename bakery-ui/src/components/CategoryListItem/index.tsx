import { useState } from "react";
import Input from "@/components/Form/Input";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Category } from "@/service/category";
import { CATEGORIES_TEXT } from "@/constant/categories";
import { FONT_SANS } from "@/constant/common";

interface CategoryListItemProps {
  category: Category;
  isSaving: boolean;
  isDeleting: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onSave: (name: string) => void;
  onDelete: () => void;
}

const CategoryListItem = ({
  category,
  isSaving,
  isDeleting,
  selected,
  onToggleSelect,
  onSave,
  onDelete,
}: CategoryListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(category.name);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const startEditing = () => {
    setValue(category.name);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setValue(category.name);
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmed = value.trim();
    setIsEditing(false);
    if (!trimmed || trimmed === category.name) {
      return;
    }
    onSave(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const handleConfirmDelete = () => {
    setIsConfirmingDelete(false);
    onDelete();
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-50 last:border-b-0">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggleSelect}
        aria-label={category.name}
        className="w-4 h-4 rounded border-surface-300 accent-ink-900 cursor-pointer flex-shrink-0"
      />

      {isEditing ? (
        <>
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="flex-1"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-2 rounded-lg bg-ink-900 text-parchment text-xs font-semibold
                       hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: FONT_SANS }}
          >
            {CATEGORIES_TEXT.SAVE}
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            disabled={isSaving}
            className="px-3 py-2 rounded-lg border border-surface-200 text-surface-700 text-xs font-medium
                       hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: FONT_SANS }}
          >
            {CATEGORIES_TEXT.CANCEL}
          </button>
        </>
      ) : (
        <>
          <span
            className="flex-1 text-sm font-medium text-surface-900 truncate"
            style={{ fontFamily: FONT_SANS }}
          >
            {category.name}
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-600 flex-shrink-0"
            style={{ fontFamily: FONT_SANS }}
          >
            {CATEGORIES_TEXT.PRODUCT_COUNT(category.productCount)}
          </span>
          <button
            type="button"
            onClick={startEditing}
            aria-label={CATEGORIES_TEXT.EDIT}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400
                       hover:bg-surface-100 hover:text-surface-700 transition-colors duration-150 cursor-pointer flex-shrink-0"
          >
            <i className="pi pi-pencil text-xs" />
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            disabled={isDeleting}
            aria-label={CATEGORIES_TEXT.DELETE}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400
                       hover:bg-red-50 hover:text-red-500 transition-colors duration-150 cursor-pointer flex-shrink-0
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="pi pi-trash text-xs" />
          </button>
        </>
      )}

      <ConfirmDialog
        open={isConfirmingDelete}
        title={CATEGORIES_TEXT.DELETE_TITLE}
        message={CATEGORIES_TEXT.DELETE_CONFIRM(
          category.name,
          category.productCount,
        )}
        confirmLabel={CATEGORIES_TEXT.DELETE}
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </div>
  );
};

export default CategoryListItem;
