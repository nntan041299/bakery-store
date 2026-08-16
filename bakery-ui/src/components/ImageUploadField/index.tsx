import { useEffect, useMemo, useRef } from "react";
import { PRODUCT_FORM_TEXT } from "@/constant/products";

interface ImageUploadFieldProps {
  imageUrl: string;
  file: File | null;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const ImageUploadField = ({
  imageUrl,
  file,
  onSelectFile,
  onRemove,
  disabled,
}: ImageUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const previewUrl = objectUrl ?? (imageUrl || undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (selected) onSelectFile(selected);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-24 h-24">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-24 h-24 rounded-full overflow-hidden border border-surface-200 bg-surface-50
                     flex items-center justify-center cursor-pointer group relative
                     disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={PRODUCT_FORM_TEXT.UPLOAD_IMAGE}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="pi pi-image text-2xl text-surface-300" />
          )}
          <span
            className="absolute inset-0 flex items-center justify-center bg-ink-900/0
                       group-hover:bg-ink-900/40 transition-colors duration-150"
          >
            <i className="pi pi-camera text-base text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </span>
        </button>

        {previewUrl && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label={PRODUCT_FORM_TEXT.REMOVE_IMAGE}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-ink-900 text-white
                       flex items-center justify-center cursor-pointer hover:bg-ink-800
                       transition-colors duration-150 shadow"
          >
            <i className="pi pi-times text-[10px]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
