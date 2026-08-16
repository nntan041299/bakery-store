import { useEffect, useRef, useState } from "react";
import Layout from "@/layouts/Layout";
import Input from "@/components/Form/Input";
import CategoryListItem from "@/components/CategoryListItem";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useBulkDeleteCategories,
} from "@/hook/useCategories";
import { CATEGORIES_TEXT } from "@/constant/categories";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

const getErrorMessage = (err: unknown): string =>
  (err as { response?: { data?: { message?: string } } })?.response?.data
    ?.message ?? CATEGORIES_TEXT.GENERIC_ERROR;

const Categories = () => {
  const { data: categories = [], isLoading, isError } = useCategories();

  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [rawSelectedIds, setSelectedIds] = useState<number[]>([]);
  const [isConfirmingBulkDelete, setIsConfirmingBulkDelete] = useState(false);

  // Drop any ids that no longer exist (e.g. deleted elsewhere) without a
  // separate effect — derive the valid selection straight from render state.
  const selectedIds = rawSelectedIds.filter((id) =>
    categories.some((c) => c.id === id),
  );

  const { mutate: create, isPending: isCreating } = useCreateCategory();
  const { mutate: update, isPending: isUpdating, variables: updateVariables } =
    useUpdateCategory();
  const { mutate: remove, isPending: isDeleting, variables: deleteVariables } =
    useDeleteCategory();
  const { mutate: bulkDelete, isPending: isBulkDeleting } =
    useBulkDeleteCategories();

  const selectAllRef = useRef<HTMLInputElement>(null);
  const allSelected =
    categories.length > 0 && selectedIds.length === categories.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = newName.trim();
    if (!trimmed) {
      setError(CATEGORIES_TEXT.NAME_REQUIRED_ERROR);
      return;
    }
    create(trimmed, {
      onSuccess: () => setNewName(""),
      onError: (err) => setError(getErrorMessage(err)),
    });
  };

  const handleUpdate = (id: number, name: string) => {
    setError("");
    update(
      { id, name },
      { onError: (err) => setError(getErrorMessage(err)) },
    );
  };

  const handleDelete = (id: number) => {
    setError("");
    remove(id, { onError: (err) => setError(getErrorMessage(err)) });
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : categories.map((c) => c.id));
  };

  const selectedProductCount = categories
    .filter((c) => selectedIds.includes(c.id))
    .reduce((sum, c) => sum + c.productCount, 0);

  const handleConfirmBulkDelete = () => {
    setIsConfirmingBulkDelete(false);
    setError("");
    bulkDelete(selectedIds, {
      onSuccess: () => setSelectedIds([]),
      onError: (err) => setError(getErrorMessage(err)),
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Page header */}
        <div>
          <h1
            className="text-2xl font-bold text-surface-900"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {CATEGORIES_TEXT.TITLE}
          </h1>
          <p
            className="text-sm text-surface-500 mt-1"
            style={{ fontFamily: FONT_SANS }}
          >
            {CATEGORIES_TEXT.SUBTITLE}
          </p>
        </div>

        {/* New category form */}
        <form onSubmit={handleCreate} className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              setError("");
            }}
            placeholder={CATEGORIES_TEXT.NEW_CATEGORY_PLACEHOLDER}
            className="flex-1"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2.5 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                       hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                       inline-flex items-center gap-2 flex-shrink-0
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: FONT_SANS }}
          >
            <i className="pi pi-plus text-xs" />
            {isCreating ? CATEGORIES_TEXT.ADDING : CATEGORIES_TEXT.ADD}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500" style={{ fontFamily: FONT_SANS }}>
            {error}
          </p>
        )}

        {/* List */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center">
              <p
                className="text-sm text-surface-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {CATEGORIES_TEXT.LOADING}
              </p>
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {CATEGORIES_TEXT.LOAD_ERROR}
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center">
              <i className="pi pi-tags text-2xl text-surface-300" />
              <p
                className="text-sm text-surface-500 mt-3"
                style={{ fontFamily: FONT_SANS }}
              >
                {CATEGORIES_TEXT.EMPTY}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-surface-100 bg-surface-50">
                <div className="flex items-center gap-3">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label={CATEGORIES_TEXT.SELECT_ALL}
                    className="w-4 h-4 rounded border-surface-300 accent-ink-900 cursor-pointer flex-shrink-0"
                  />
                  <span
                    className="text-xs font-semibold text-surface-500 uppercase tracking-wider"
                    style={{ fontFamily: FONT_SANS }}
                  >
                    {selectedIds.length > 0
                      ? CATEGORIES_TEXT.SELECTED_COUNT(selectedIds.length)
                      : CATEGORIES_TEXT.SELECT_ALL}
                  </span>
                </div>
                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingBulkDelete(true)}
                    disabled={isBulkDeleting}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600
                               hover:bg-red-50 transition-colors duration-150 cursor-pointer
                               inline-flex items-center gap-1.5
                               disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontFamily: FONT_SANS }}
                  >
                    <i className="pi pi-trash text-xs" />
                    {CATEGORIES_TEXT.DELETE_SELECTED}
                  </button>
                )}
              </div>
              {categories.map((category) => (
                <CategoryListItem
                  key={category.id}
                  category={category}
                  isSaving={isUpdating && updateVariables?.id === category.id}
                  isDeleting={isDeleting && deleteVariables === category.id}
                  selected={selectedIds.includes(category.id)}
                  onToggleSelect={() => toggleSelect(category.id)}
                  onSave={(name) => handleUpdate(category.id, name)}
                  onDelete={() => handleDelete(category.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmingBulkDelete}
        title={CATEGORIES_TEXT.DELETE_TITLE}
        message={CATEGORIES_TEXT.BULK_DELETE_CONFIRM(
          selectedIds.length,
          selectedProductCount,
        )}
        confirmLabel={CATEGORIES_TEXT.DELETE}
        destructive
        isConfirming={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setIsConfirmingBulkDelete(false)}
      />
    </Layout>
  );
};

export default Categories;
