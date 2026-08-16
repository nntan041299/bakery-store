import "primeicons/primeicons.css";

import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import PageLoader from "@/components/PageLoader";
import StoreGate from "@/components/StoreGate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { SelectedStoreProvider } from "@/context/SelectedStoreProvider";
import AppRouter from "@/router/AppRouter";
import AuthRouter from "@/router/AuthRouter";

const queryClient = new QueryClient();

function Main() {
  const { token } = useAuth();

  if (!token) {
    return <AuthRouter />;
  }

  return (
    <SelectedStoreProvider>
      <StoreGate>
        <AppRouter />
      </StoreGate>
    </SelectedStoreProvider>
  );
}

export default function RouteApp() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Main />
            </Suspense>
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
