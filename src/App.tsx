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
import Transaction from "./pages/transactionPage";

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
      <Route element={<Transaction />} path="/payment" />
      <Route element={<TransactionNotifications />} path="/test" />
    </Routes>
  );
}

export default App;
