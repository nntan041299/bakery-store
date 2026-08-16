import { ReactNode, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { useMyStores } from "@/hook/useMyStores";
import { useSelectedStore } from "@/context/SelectedStoreProvider";
import PageLoader from "@/components/PageLoader";
import ChooseStore from "@/components/ChooseStore";
import { STORE_SELECTION_TEXT } from "@/constant/storeSelection";
import { FONT_SANS } from "@/constant/common";

interface StoreGateProps {
  children: ReactNode;
}

/**
 * Blocks the app behind a store picker for shop owners until a valid store
 * is selected. Customers pass straight through — stores don't apply to them.
 */
const StoreGate = ({ children }: StoreGateProps) => {
  const { id, role } = useSelector(selectUser);
  useCurrentUser();

  if (!id) {
    return <PageLoader />;
  }

  if (role !== "SHOP_OWNER") {
    return <>{children}</>;
  }

  return <ShopOwnerStoreGate>{children}</ShopOwnerStoreGate>;
};

const ShopOwnerStoreGate = ({ children }: StoreGateProps) => {
  const { data: stores, isLoading, isError } = useMyStores();
  const { selectedStoreId, selectStore } = useSelectedStore();

  const storeList = useMemo(() => stores ?? [], [stores]);
  const hasValidSelection = storeList.some((s) => s.id === selectedStoreId);

  useEffect(() => {
    if (storeList.length === 1 && storeList[0].id !== selectedStoreId) {
      selectStore(storeList[0].id);
    }
  }, [storeList, selectedStoreId, selectStore]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <CenteredMessage
        title={STORE_SELECTION_TEXT.LOAD_ERROR}
        message=""
      />
    );
  }

  if (storeList.length === 0) {
    return (
      <CenteredMessage
        title={STORE_SELECTION_TEXT.NO_STORES_TITLE}
        message={STORE_SELECTION_TEXT.NO_STORES_MESSAGE}
      />
    );
  }

  if (!hasValidSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <ChooseStore
          stores={storeList}
          selectedStoreId={selectedStoreId}
          onSelect={selectStore}
        />
      </div>
    );
  }

  return <>{children}</>;
};

const CenteredMessage = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 text-center">
    <div>
      <p
        className="text-base font-semibold text-surface-900"
        style={{ fontFamily: FONT_SANS }}
      >
        {title}
      </p>
      {message && (
        <p
          className="text-sm text-surface-500 mt-1"
          style={{ fontFamily: FONT_SANS }}
        >
          {message}
        </p>
      )}
    </div>
  </div>
);

export default StoreGate;
