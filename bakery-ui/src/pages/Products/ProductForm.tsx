import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/layouts/Layout";
import {
  createProduct,
  getProduct,
  updateProduct,
  Product,
  ProductFormPayload,
} from "@/service/product";

interface FormState {
  name: string;
  description: string;
  price: string;
  sku: string;
  quantity: string;
  imageUrl: string;
  active: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  sku: "",
  quantity: "",
  imageUrl: "",
  active: true,
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-100">
        <h2
          className="text-sm font-semibold text-surface-700 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium text-surface-700"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
        bg-white placeholder:text-surface-400
        focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
        disabled:bg-surface-50 disabled:text-surface-400
        transition-all duration-150
        ${props.className ?? ""}
      `}
      style={{ fontFamily: "var(--font-sans)" }}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
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
      style={{ fontFamily: "var(--font-sans)" }}
    />
  );
}

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
      }
    : EMPTY_FORM;

const ProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const { data: existingProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await getProduct(id!);
      return res.data.data as Product;
    },
    enabled: isEdit,
  });

  if (isEdit && isLoadingProduct) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
          <p
            className="text-sm text-surface-500"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Loading product…
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
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() =>
    toFormState(initialProduct),
  );
  const [error, setError] = useState("");

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (payload: ProductFormPayload) =>
      isEdit ? updateProduct(id!, payload) : createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["product", id] });
      }
      navigate("/products");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to save product. Please try again.";
      setError(message);
    },
  });

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
      setError("Name is required.");
      return;
    }
    const price = Number(form.price);
    if (!form.price || Number.isNaN(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }
    if (!form.sku.trim()) {
      setError("SKU is required.");
      return;
    }
    const quantity = Number(form.quantity);
    if (
      !form.quantity ||
      Number.isNaN(quantity) ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError("Enter a valid quantity.");
      return;
    }

    save({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      sku: form.sku.trim(),
      quantity,
      imageUrl: form.imageUrl.trim() || undefined,
      active: form.active,
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
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <i className="pi pi-arrow-left text-xs" />
            Back to inventory
          </button>
          <h1
            className="text-2xl font-bold text-surface-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isEdit ? "Edit product" : "New product"}
          </h1>
          <p
            className="text-sm text-surface-500 mt-1"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {isEdit
              ? "Update the details of this product."
              : "Add a new product to your inventory."}
          </p>
        </div>

        <SectionCard title="Product details">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Name">
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sourdough loaf"
              />
            </Field>

            <Field label="Description">
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
                rows={3}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price">
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
              <Field label="SKU">
                <Input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. BRD-001"
                />
              </Field>
            </div>

            <Field label="Quantity">
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

            <Field label="Image URL">
              <Input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://…"
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
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Active (visible for sale)
              </span>
            </label>

            {error && (
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: "var(--font-sans)" }}
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
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {isSaving
                  ? "Saving…"
                  : isEdit
                    ? "Save changes"
                    : "Create product"}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </Layout>
  );
}

export default ProductForm;
