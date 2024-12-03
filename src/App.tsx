import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/authentication-page";
import PricingPage from "@/pages/pricing";
import { ImageViewPage } from "@/pages/ImageViewPage";
import UserInfo from "@/pages/userProfile";
import Store from "./pages/stores";
import TransactionNotifications from "./pages/test";
import ProductDetail from "./pages/productDetail";
import Checkout from "./pages/checkout";
import RecoveryPage from "./pages/recovery";
import Cart from "./pages/cart";
import PaymentStatus from "./pages/paymentStatus";
import NotFound404 from "./pages/error/404";
import Order from "./pages/order";
import OrderDetailPage from "./pages/orderDetail";
import Services from "./pages/services";
import ServicePageShop from "./pages/servicesShop";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/authentication" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<ImageViewPage />} path="/post/:postId/attachment/:attachmentId" />
      <Route element={<UserInfo />} path="/user/:userId" />
      <Route element={<Store />} path="/stores" />
      <Route element={<ProductDetail />} path="/stores/product/:productId" />
      <Route element={<Checkout />} path="/checkout/:orderId" />
      <Route element={<PaymentStatus />} path="/payment" />
      <Route element={<Cart />} path="/cart" />
      <Route element={<RecoveryPage />} path="/recovery" />
      <Route element={<TransactionNotifications />} path="/test" />
      <Route element={<NotFound404 />} path="/not-found" />
      <Route element={<Order />} path="/orders" />
      <Route element={<OrderDetailPage />} path="/order/:orderId" />
      <Route element={<Services />} path="/services" />
      <Route element={<ServicePageShop />} path="/services/shop/:petStoreId" />
    </Routes>
  );
}

export default App;
