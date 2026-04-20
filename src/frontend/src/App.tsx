import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import GroupPage from "./pages/GroupPage";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const groupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group/$groupId",
  component: GroupPage,
});

const groupSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/group/$groupId/$section",
  component: GroupPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  groupRoute,
  groupSectionRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}
