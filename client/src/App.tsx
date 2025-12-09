import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import StorePage from "./pages/StorePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import AdminPage from "@/pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminHealthPage from "./pages/AdminHealthPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import AdminMetricsPage from "./pages/AdminMetricsPage";
import AdminMetricsAdvancedPage from "./pages/AdminMetricsAdvancedPage";
import AdminReconciliationPage from "./pages/AdminReconciliationPage";
import DriverAppPage from "./pages/DriverAppPage";
import DriverLoginPage from "./pages/DriverLoginPage";
import DriverHomePage from "./pages/DriverHomePage";
import HistoryPage from "./pages/HistoryPage";
import CouponsPage from "./pages/CouponsPage";
import MerchantSignup from "./pages/MerchantSignup";
import MerchantDashboard from "./pages/MerchantDashboard";
import ProductManager from "./pages/ProductManager";
import MerchantMetrics from "./pages/MerchantMetrics";
import MerchantSettings from "./pages/MerchantSettings";
import MerchantOrders from "./pages/MerchantOrders";
import OrderDetail from "./pages/OrderDetail";
import MerchantAnalytics from "./pages/MerchantAnalytics";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/store/:id"} component={StorePage} />
      <Route path={"/checkout"} component={CheckoutPage} />
      <Route path={"/order/:id"} component={OrderPage} />
      <Route path={"/history"} component={HistoryPage} />
      <Route path={"/coupons"} component={CouponsPage} />
      <Route path={"/merchant/signup"} component={MerchantSignup} />
      <Route path={"/merchant/dashboard/:merchantId"} component={MerchantDashboard} />
      <Route path={"/merchant/products/:merchantId"} component={ProductManager} />
      <Route path={"/merchant/metrics/:merchantId"} component={MerchantMetrics} />
      <Route path={"/merchant/settings/:merchantId"} component={MerchantSettings} />
      <Route path={"/merchant/orders/:merchantId"} component={MerchantOrders} />
      <Route path={"/merchant/orders/:merchantId/:orderId"} component={OrderDetail} />
      <Route path={"/merchant/analytics/:merchantId"} component={MerchantAnalytics} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/admin"} component={AdminPage} />
      <Route path={"/admin/login"} component={AdminLoginPage} />
      <Route path={"/admin/health"} component={AdminHealthPage} />
      <Route path={"/admin/logs"} component={AdminLogsPage} />
      <Route path={"/admin/metrics"} component={AdminMetricsPage} />
      <Route path={"/admin/metrics-advanced"} component={AdminMetricsAdvancedPage} />
      <Route path={"/admin/reconciliation"} component={AdminReconciliationPage} />
      <Route path={"/driver/login"} component={DriverLoginPage} />
      <Route path={"/driver"} component={DriverHomePage} />
      <Route path={"/driver/app"} component={DriverAppPage} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

