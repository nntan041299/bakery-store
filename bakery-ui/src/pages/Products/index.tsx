import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/layouts/Layout";
import StatusBadge from "@/components/StatusBadge";
import SortableHeader from "@/components/SortableHeader";
import CategoryFilter from "@/components/CategoryFilter";
import { Product } from "@/service/product";
import { useCategories } from "@/hook/useCategories";
import { useProducts } from "@/hook/useProducts";
import { PRODUCTS_PAGE_SIZE, PRODUCTS_TEXT } from "@/constant/products";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

type ActiveFilter = "all" | "active" | "inactive";
type SortField = "name" | "price" | "sku" | "active";
type SortDir = "asc" | "desc";

const Products = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
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

  const { data: categories = [] } = useCategories();

  const { data, isLoading, isError } = useProducts({
    page,
    size: PRODUCTS_PAGE_SIZE,
    search,
    active: activeParam,
    categoryId,
    sortField,
    sortDir,
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

  const handleCategoryFilterChange = (value: number | undefined) => {
    setCategoryId(value);
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
              style={{ fontFamily: FONT_DISPLAY }}
            >
              {PRODUCTS_TEXT.TITLE}
            </h1>
            <p
              className="text-sm text-surface-500 mt-1"
              style={{ fontFamily: FONT_SANS }}
            >
              {PRODUCTS_TEXT.SUBTITLE}
            </p>
          </div>
          <button
            onClick={() => navigate("/products/new")}
            className="px-4 py-2.5 rounded-xl bg-ink-900 text-parchment text-sm font-semibold
                       hover:bg-ink-800 transition-colors duration-150 cursor-pointer
                       inline-flex items-center gap-2 flex-shrink-0"
            style={{ fontFamily: FONT_SANS }}
          >
            <i className="pi pi-plus text-xs" />
            {PRODUCTS_TEXT.NEW_PRODUCT}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={PRODUCTS_TEXT.SEARCH_PLACEHOLDER}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
                         bg-white placeholder:text-surface-400
                         focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
                         transition-all duration-150"
              style={{ fontFamily: FONT_SANS }}
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
            style={{ fontFamily: FONT_SANS }}
          >
            <option value="all">{PRODUCTS_TEXT.STATUS_ALL}</option>
            <option value="active">{PRODUCTS_TEXT.STATUS_ACTIVE}</option>
            <option value="inactive">{PRODUCTS_TEXT.STATUS_INACTIVE}</option>
          </select>
          <CategoryFilter
            categories={categories}
            value={categoryId}
            onChange={handleCategoryFilterChange}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center">
              <p
                className="text-sm text-surface-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {PRODUCTS_TEXT.LOADING}
              </p>
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <p
                className="text-sm text-red-500"
                style={{ fontFamily: FONT_SANS }}
              >
                {PRODUCTS_TEXT.LOAD_ERROR}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <i className="pi pi-box text-2xl text-surface-300" />
              <p
                className="text-sm text-surface-500 mt-3"
                style={{ fontFamily: FONT_SANS }}
              >
                {search || activeFilter !== "all"
                  ? PRODUCTS_TEXT.EMPTY_FILTERED
                  : PRODUCTS_TEXT.EMPTY}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100">
                    <SortableHeader
                      label={PRODUCTS_TEXT.COLUMN_NAME}
                      field="name"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label={PRODUCTS_TEXT.COLUMN_SKU}
                      field="sku"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <SortableHeader
                      label={PRODUCTS_TEXT.COLUMN_PRICE}
                      field="price"
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider"
                      style={{ fontFamily: FONT_SANS }}
                    >
                      {PRODUCTS_TEXT.COLUMN_QUANTITY}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider"
                      style={{ fontFamily: FONT_SANS }}
                    >
                      {PRODUCTS_TEXT.COLUMN_CATEGORIES}
                    </th>
                    <SortableHeader
                      label={PRODUCTS_TEXT.COLUMN_STATUS}
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
                        style={{ fontFamily: FONT_SANS }}
                      >
                        {product.name}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-surface-500"
                        style={{ fontFamily: FONT_SANS }}
                      >
                        {product.sku}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-surface-700"
                        style={{ fontFamily: FONT_SANS }}
                      >
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-surface-700"
                        style={{ fontFamily: FONT_SANS }}
                      >
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.length === 0 ? (
                            <span
                              className="text-sm text-surface-400"
                              style={{ fontFamily: FONT_SANS }}
                            >
                              {PRODUCTS_TEXT.NO_CATEGORIES}
                            </span>
                          ) : (
                            product.categories.map((category) => (
                              <span
                                key={category.id}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 text-surface-600"
                                style={{ fontFamily: FONT_SANS }}
                              >
                                {category.name}
                              </span>
                            ))
                          )}
                        </div>
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
              style={{ fontFamily: FONT_SANS }}
            >
              {PRODUCTS_TEXT.PAGE_LABEL(page + 1, totalPages)}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3.5 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                           hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: FONT_SANS }}
              >
                {PRODUCTS_TEXT.PREVIOUS}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3.5 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                           hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: FONT_SANS }}
              >
                {PRODUCTS_TEXT.NEXT}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
