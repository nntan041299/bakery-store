import { useState } from "react";
import Input from "@/components/Form/Input";
import { Store } from "@/service/store";
import { useCreateStore } from "@/hook/useMyStores";
import { STORE_SELECTION_TEXT } from "@/constant/storeSelection";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface ChooseStoreProps {
  stores: Store[];
  selectedStoreId: number | null;
  onSelect: (storeId: number) => void;
}

const ChooseStore = ({ stores, selectedStoreId, onSelect }: ChooseStoreProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { mutate: create, isPending } = useCreateStore();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = name.trim();
    if (!trimmed) {
      setError(STORE_SELECTION_TEXT.NAME_REQUIRED_ERROR);
      return;
    }
    create(trimmed, {
      onSuccess: (res) => {
        setName("");
        setIsAdding(false);
        onSelect((res.data.data as Store).id);
      },
      onError: () => setError(STORE_SELECTION_TEXT.GENERIC_ERROR),
    });
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl border border-surface-200 shadow-sm p-6 space-y-5">
      <div>
        <h1
          className="text-xl font-bold text-surface-900"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {STORE_SELECTION_TEXT.TITLE}
        </h1>
        <p
          className="text-sm text-surface-500 mt-1"
          style={{ fontFamily: FONT_SANS }}
        >
          {STORE_SELECTION_TEXT.SUBTITLE}
        </p>
      </div>

      <div className="space-y-2">
        {stores.map((store) => {
          const isSelected = store.id === selectedStoreId;
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelect(store.id)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left
                          transition-colors duration-150 cursor-pointer
                          ${
                            isSelected
                              ? "border-ink-900 bg-surface-50"
                              : "border-surface-200 hover:bg-surface-50"
                          }`}
            >
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold text-surface-900 truncate"
                  style={{ fontFamily: FONT_SANS }}
                >
                  {store.name}
                </p>
                <p
                  className="text-xs text-surface-500 mt-0.5"
                  style={{ fontFamily: FONT_SANS }}
                >
                  {STORE_SELECTION_TEXT.PRODUCT_COUNT(store.productCount)}
                </p>
              </div>
              {isSelected && (
                <i className="pi pi-check text-sm text-ink-900 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isAdding ? (
        <form onSubmit={handleCreate} className="space-y-2">
          <Input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder={STORE_SELECTION_TEXT.NEW_STORE_PLACEHOLDER}
            disabled={isPending}
          />
          {error && (
            <p className="text-xs text-red-500" style={{ fontFamily: FONT_SANS }}>
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-3.5 py-2 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                         hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                         disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: FONT_SANS }}
            >
              {isPending ? STORE_SELECTION_TEXT.CREATING : STORE_SELECTION_TEXT.CREATE}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setName("");
                setError("");
              }}
              disabled={isPending}
              className="px-3.5 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                         hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                         disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: FONT_SANS }}
            >
              {STORE_SELECTION_TEXT.CANCEL}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-dashed border-surface-300 text-sm font-medium text-surface-600
                     hover:bg-surface-50 hover:border-surface-400 transition-colors duration-150 cursor-pointer
                     inline-flex items-center justify-center gap-2"
          style={{ fontFamily: FONT_SANS }}
        >
          <i className="pi pi-plus text-xs" />
          {STORE_SELECTION_TEXT.ADD_STORE}
        </button>
      )}
    </div>
  );
};

export default ChooseStore;
