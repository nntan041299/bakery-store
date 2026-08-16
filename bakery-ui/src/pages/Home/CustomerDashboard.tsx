import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";
import StatCard from "@/components/StatCard";
import StoreCard from "@/components/StoreCard";
import { useTopStores } from "@/hook/useTopStores";
import { useStoreSearch } from "@/hook/useStoreSearch";
import { CUSTOMER_DASHBOARD_TEXT } from "@/constant/home";
import {
  STORES_TEXT,
  STORE_SEARCH_PAGE_SIZE,
  TOP_STORES_COUNT,
} from "@/constant/stores";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

const CustomerDashboard = () => {
  const { firstName, lastName, username, email } = useSelector(selectUser);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const isSearchMode = search.length > 0;

  const { data: topStores = [], isLoading: isLoadingTop, isError: isTopError } =
    useTopStores(TOP_STORES_COUNT);
  const {
    data: searchResult,
    isLoading: isSearching,
    isError: isSearchError,
  } = useStoreSearch({ page, size: STORE_SEARCH_PAGE_SIZE, search });

  const stores = isSearchMode ? (searchResult?.content ?? []) : topStores;
  const totalPages = searchResult?.totalPages ?? 0;
  const isLoading = isSearchMode ? isSearching : isLoadingTop;
  const isError = isSearchMode ? isSearchError : isTopError;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-surface-900"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {CUSTOMER_DASHBOARD_TEXT.TITLE}
          {fullName ? `, ${fullName}` : ""}
        </h1>
        <p
          className="text-sm text-surface-500 mt-1"
          style={{ fontFamily: FONT_SANS }}
        >
          {email ?? CUSTOMER_DASHBOARD_TEXT.DEFAULT_SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="pi-shopping-bag"
          label={CUSTOMER_DASHBOARD_TEXT.STAT_ACTIVE_ORDERS}
          value="0"
          iconBgClassName="bg-sage-50"
          iconColorClassName="text-sage-600"
        />
        <StatCard
          icon="pi-check-circle"
          label={CUSTOMER_DASHBOARD_TEXT.STAT_COMPLETED_ORDERS}
          value="0"
          iconBgClassName="bg-sage-50"
          iconColorClassName="text-sage-600"
        />
        <StatCard
          icon="pi-heart"
          label={CUSTOMER_DASHBOARD_TEXT.STAT_SAVED_FAVORITES}
          value="0"
          iconBgClassName="bg-sage-50"
          iconColorClassName="text-sage-600"
        />
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center">
        <i className="pi pi-shopping-cart text-2xl text-surface-300" />
        <p
          className="text-sm text-surface-500 mt-3"
          style={{ fontFamily: FONT_SANS }}
        >
          {CUSTOMER_DASHBOARD_TEXT.EMPTY_STATE}
        </p>
      </div>

      {/* Stores */}
      <div className="space-y-4">
        <div>
          <h2
            className="text-lg font-bold text-surface-900"
            style={{ fontFamily: FONT_DISPLAY }}
          >
            {isSearchMode
              ? STORES_TEXT.SEARCH_RESULTS_TITLE(search)
              : STORES_TEXT.POPULAR_TITLE}
          </h2>
          {!isSearchMode && (
            <p
              className="text-sm text-surface-500 mt-1"
              style={{ fontFamily: FONT_SANS }}
            >
              {STORES_TEXT.POPULAR_SUBTITLE}
            </p>
          )}
        </div>

        <div className="relative">
          <i className="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={STORES_TEXT.SEARCH_PLACEHOLDER}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-900
                       bg-white placeholder:text-surface-400
                       focus:outline-none focus:ring-2 focus:ring-ink-900/20 focus:border-ink-900/40
                       transition-all duration-150"
            style={{ fontFamily: FONT_SANS }}
          />
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-10 text-center">
            <p
              className="text-sm text-surface-500"
              style={{ fontFamily: FONT_SANS }}
            >
              {STORES_TEXT.LOADING}
            </p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-10 text-center">
            <p
              className="text-sm text-red-500"
              style={{ fontFamily: FONT_SANS }}
            >
              {STORES_TEXT.LOAD_ERROR}
            </p>
          </div>
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-10 text-center">
            <i className="pi pi-shop text-2xl text-surface-300" />
            <p
              className="text-sm text-surface-500 mt-3"
              style={{ fontFamily: FONT_SANS }}
            >
              {isSearchMode ? STORES_TEXT.EMPTY_SEARCH : STORES_TEXT.EMPTY}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}

        {isSearchMode && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p
              className="text-sm text-surface-500"
              style={{ fontFamily: FONT_SANS }}
            >
              {STORES_TEXT.PAGE_LABEL(page + 1, totalPages)}
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
                {STORES_TEXT.PREVIOUS}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3.5 py-2 rounded-xl border border-surface-200 text-sm font-medium text-surface-700
                           hover:bg-surface-50 transition-colors duration-150 cursor-pointer
                           disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: FONT_SANS }}
              >
                {STORES_TEXT.NEXT}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
