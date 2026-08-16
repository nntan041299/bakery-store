import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/layouts/Layout";
import { SectionCard, Field, Input, Textarea } from "@/components/Form";
import CategoryPicker from "@/components/CategoryPicker";
import ImageUploadField from "@/components/ImageUploadField";
import { Product, ProductFormPayload } from "@/service/product";
import { useProduct } from "@/hook/useProduct";
import { useSaveProduct } from "@/hook/useSaveProduct";
import { PRODUCT_FORM_TEXT } from "@/constant/products";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface FormState {
  name: string;
  description: string;
  price: string;
  sku: string;
  quantity: string;
  imageUrl: string;
  active: boolean;
  categories: string[];
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  sku: "",
  quantity: "",
  imageUrl: "",
  active: true,
  categories: [],
};

const toFormState = (product?: Product): FormState =>
  product
    ? {
        name: product.name,
        description: product.description ?? "",
        price: String(product.price),
        sku: product.sku,
        quantity: String(product.quantity),
        imageUrl: product.imageUrl ?? "",
        active: product.active,
        categories: product.categories.map((c) => c.name),
      }
    : EMPTY_FORM;

const ProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const { data: existingProduct, isLoading: isLoadingProduct } =
    useProduct(id);

  if (isEdit && isLoadingProduct) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
          <p
            className="text-sm text-surface-500"
            style={{ fontFamily: FONT_SANS }}
          >
            {PRODUCT_FORM_TEXT.LOADING_PRODUCT}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <ProductFormBody id={id} isEdit={isEdit} initialProduct={existingProduct} />
  );
};

function ProductFormBody({
  id,
  isEdit,
  initialProduct,
}: {
  id?: string;
  isEdit: boolean;
  initialProduct?: Product;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(() =>
    toFormState(initialProduct),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");

  const { mutate: save, isPending: isSaving, getErrorMessage } =
    useSaveProduct(id);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError("");
    const { name, value, type } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError(PRODUCT_FORM_TEXT.ERROR_NAME_REQUIRED);
      return;
    }
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price < 0) {
      setError(PRODUCT_FORM_TEXT.ERROR_PRICE_INVALID);
      return;
    }
    if (!form.sku.trim()) {
      setError(PRODUCT_FORM_TEXT.ERROR_SKU_REQUIRED);
      return;
    }
    const quantity = Number(form.quantity);
    if (
      !form.quantity ||
      Number.isNaN(quantity) ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError(PRODUCT_FORM_TEXT.ERROR_QUANTITY_INVALID);
      return;
    }

    const payload: ProductFormPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      sku: form.sku.trim(),
      quantity,
      imageFile: imageFile ?? undefined,
      removeImage: removeImage || undefined,
      active: form.active,
      categories: form.categories,
    };

    save(payload, {
      onError: (err) => setError(getErrorMessage(err)),
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div>
          <button
            onClick={() => navigate("/products")}
            className="text-sm text-surface-500 hover:text-surface-700 transition-colors cursor-pointer
                       inline-flex items-center gap-1.5 mb-3"
            style={{ fontFamily: FONT_SANS }}
          >
            <i className="pi pi-arrow-left text-xs" />
            {PRODUCT_FORM_TEXT.BACK_TO_INVENTORY}
          </button>
          <h1
            className="text-2xl font-bold text-surface-900"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {isEdit ? PRODUCT_FORM_TEXT.TITLE_EDIT : PRODUCT_FORM_TEXT.TITLE_NEW}
          </h1>
          <p
            className="text-sm text-surface-500 mt-1"
            style={{ fontFamily: FONT_SANS }}
          >
            {isEdit
              ? PRODUCT_FORM_TEXT.SUBTITLE_EDIT
              : PRODUCT_FORM_TEXT.SUBTITLE_NEW}
          </p>
        </div>

        <SectionCard title={PRODUCT_FORM_TEXT.SECTION_TITLE}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploadField
              imageUrl={form.imageUrl}
              file={imageFile}
              onSelectFile={(file) => {
                setImageFile(file);
                setRemoveImage(false);
                setForm((p) => ({ ...p, imageUrl: "" }));
              }}
              onRemove={() => {
                setImageFile(null);
                setRemoveImage(true);
                setForm((p) => ({ ...p, imageUrl: "" }));
              }}
              disabled={isSaving}
            />

            <Field label={PRODUCT_FORM_TEXT.LABEL_NAME}>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={PRODUCT_FORM_TEXT.PLACEHOLDER_NAME}
              />
            </Field>

            <Field label={PRODUCT_FORM_TEXT.LABEL_DESCRIPTION}>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={PRODUCT_FORM_TEXT.PLACEHOLDER_DESCRIPTION}
                rows={3}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={PRODUCT_FORM_TEXT.LABEL_PRICE}>
                <Input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </Field>
              <Field label={PRODUCT_FORM_TEXT.LABEL_SKU}>
                <Input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder={PRODUCT_FORM_TEXT.PLACEHOLDER_SKU}
                />
              </Field>
            </div>

            <Field label={PRODUCT_FORM_TEXT.LABEL_QUANTITY}>
              <Input
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
              />
            </Field>

            <Field label={PRODUCT_FORM_TEXT.LABEL_CATEGORIES}>
              <CategoryPicker
                value={form.categories}
                onChange={(categories) =>
                  setForm((p) => ({ ...p, categories }))
                }
              />
            </Field>

            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="w-4 h-4 rounded border-surface-300 accent-ink-900 cursor-pointer"
              />
              <span
                className="text-sm font-medium text-surface-700"
                style={{ fontFamily: FONT_SANS }}
              >
                {PRODUCT_FORM_TEXT.LABEL_ACTIVE}
              </span>
            </label>

            {error && (
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {error}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                           hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: FONT_SANS }}
              >
                {isSaving
                  ? PRODUCT_FORM_TEXT.SAVING
                  : isEdit
                    ? PRODUCT_FORM_TEXT.SAVE_CHANGES
                    : PRODUCT_FORM_TEXT.CREATE_PRODUCT}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </Layout>
  );
}

export default ProductForm;
