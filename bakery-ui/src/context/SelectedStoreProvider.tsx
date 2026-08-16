import { createContext, useContext, useState, ReactNode } from "react";

const STORAGE_KEY = "selectedStoreId";

interface SelectedStoreContextType {
  selectedStoreId: number | null;
  selectStore: (storeId: number) => void;
}

const SelectedStoreContext = createContext<SelectedStoreContextType | null>(
  null,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useSelectedStore = (): SelectedStoreContextType => {
  const context = useContext(SelectedStoreContext);
  if (!context) {
    throw new Error(
      "useSelectedStore must be used within SelectedStoreProvider",
    );
  }
  return context;
};

interface SelectedStoreProviderProps {
  children: ReactNode;
}

export function SelectedStoreProvider({
  children,
}: SelectedStoreProviderProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? Number(stored) : null;
    },
  );

  const selectStore = (storeId: number): void => {
    localStorage.setItem(STORAGE_KEY, String(storeId));
    setSelectedStoreId(storeId);
  };

  return (
    <SelectedStoreContext.Provider value={{ selectedStoreId, selectStore }}>
      {children}
    </SelectedStoreContext.Provider>
  );
}
