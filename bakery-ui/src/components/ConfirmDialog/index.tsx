import { COMMON_TEXT, FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = COMMON_TEXT.CONFIRM,
  cancelLabel = COMMON_TEXT.CANCEL,
  destructive = false,
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-ink-950/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-surface-200 shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-base font-bold text-surface-900"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {title}
        </h2>
        <p
          className="text-sm text-surface-500 mt-2 leading-relaxed"
          style={{ fontFamily: FONT_SANS }}
        >
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                       hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: FONT_SANS }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors duration-150 cursor-pointer
                       disabled:opacity-40 disabled:cursor-not-allowed
                       ${destructive ? "bg-red-500 hover:bg-red-600" : "bg-ink-900 hover:bg-ink-800"}`}
            style={{ fontFamily: FONT_SANS }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
