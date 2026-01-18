import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderMedical from "@/components/HeaderMedical";
import { Footer } from "@/components/Footer";
import HomeMedical from "./pages/HomeMedical";
import ShopMedical from "./pages/ShopMedical";
import ProductPageMedical from "./pages/ProductPageMedical";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminProducts from "./pages/Admin/Products";
import AdminOrders from "./pages/Admin/Orders";
import AdminSettings from "./pages/Admin/Settings";
import NotFound from "./pages/NotFound";
import "./styles/animations.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HeaderMedical />
        <Routes>
          <Route path="/" element={<HomeMedical />} />
          <Route path="/shop" element={<ShopMedical />} />
          <Route path="/product/:slug" element={<ProductPageMedical />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

export default App;
