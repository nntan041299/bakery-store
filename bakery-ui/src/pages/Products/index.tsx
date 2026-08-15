import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/layouts/Layout";
import { listProducts, Product, ProductPage } from "@/service/product";

type ActiveFilter = "all" | "active" | "inactive";
type SortField = "name" | "price" | "sku" | "active";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        active ? "bg-sage-100 text-sage-700" : "bg-surface-100 text-surface-500"
      }`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function SortHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const isActive = sortField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider cursor-pointer select-none"
      style={{ fontFamily: "var(--font-sans)" }}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <i
          className={`pi ${
            isActive
              ? sortDir === "asc"
                ? "pi-sort-up-fill"
                : "pi-sort-down-fill"
              : "pi-sort-alt"
          } text-[10px] ${isActive ? "text-ink-900" : "text-surface-300"}`}
        />
      </span>
    </th>
  );
}

const Products = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const activeParam =
    activeFilter === "all" ? undefined : activeFilter === "active";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, search, activeFilter, sortField, sortDir],
    queryFn: async () => {
      const res = await listProducts({
        page,
        size: PAGE_SIZE,
        search: search || undefined,
        active: activeParam,
        sort: `${sortField},${sortDir}`,
      });
      return res.data.data as ProductPage;
    },
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  };

  const handleActiveFilterChange = (value: ActiveFilter) => {
    setActiveFilter(value);
    setPage(0);
  };

  const products: Product[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-surface-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Inventory
            </h1>
            <p
              className="text-sm text-surface-500 mt-1"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Create, edit, and search your products.
            </p>
          </div>
          <button
            onClick={() => navigate("/products/new")}
            className="px-4 py-2.5 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                       hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                       inline-flex items-center gap-2 flex-shrink-0"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <i className="pi pi-plus text-xs" />
            New product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or SKU"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
                         bg-white placeholder:text-surface-400
                         focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
                         transition-all duration-150"
              style={{ fontFamily: "var(--font-sans)" }}
            />
          </div>
          <select
            value={activeFilter}
            onChange={(e) =>
              handleActiveFilterChange(e.target.value as ActiveFilter)
            }
            className="px-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
                       bg-white focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
                       transition-all duration-150 cursor-pointer"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center">
              <p
                className="text-sm text-surface-500"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Loading products…
              </p>
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Failed to load products. Please try again.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <i className="pi pi-box text-2xl text-surface-300" />
              <p
                className="text-sm text-surface-500 mt-3"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {search || activeFilter !== "all"
                  ? "No products match your search."
                  : "No products yet. Create your first one."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100">
                    <SortHeader
                      label="Name"
                      field="name"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortHeader
                      label="SKU"
                      field="sku"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortHeader
                      label="Price"
                      field="price"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      Quantity
                    </th>
                    <SortHeader
                      label="Status"
                      field="active"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                      className="border-b border-surface-50 last:border-b-0 hover:bg-surface-50 cursor-pointer transition-colors"
                    >
                      <td
                        className="px-4 py-3 text-sm font-medium text-surface-900"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {product.name}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-surface-500"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {product.sku}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-surface-700"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-surface-700"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge active={product.active} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <i className="pi pi-chevron-right text-xs text-surface-300" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p
              className="text-sm text-surface-500"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3.5 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                           hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3.5 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                           hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
