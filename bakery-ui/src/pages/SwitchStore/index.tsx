import { useNavigate } from "react-router-dom";
import Layout from "@/layouts/Layout";
import ChooseStore from "@/components/ChooseStore";
import { useMyStores } from "@/hook/useMyStores";
import { useSelectedStore } from "@/context/SelectedStoreProvider";

const SwitchStore = () => {
  const navigate = useNavigate();
  const { data: stores = [] } = useMyStores();
  const { selectedStoreId, selectStore } = useSelectedStore();

  const handleSelect = (storeId: number) => {
    selectStore(storeId);
    navigate("/");
  };

  return (
    <Layout>
      <div className="min-h-full flex items-center justify-center px-4 py-8">
        <ChooseStore
          stores={stores}
          selectedStoreId={selectedStoreId}
          onSelect={handleSelect}
        />
      </div>
    </Layout>
  );
};

export default SwitchStore;
