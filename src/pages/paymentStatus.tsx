import { CHECKTRANSACTION } from "@/api/Order";
import Logout from "@/components/logout";
import { OrderDetailBar } from "@/components/store/order/orderDetailBar";
import { PaymentBar } from "@/components/store/order/paymentBar";
import { PaymentStatusBar } from "@/components/store/paymentStatusBar";
import { OrderDetail, OrderPaymentDetail } from "@/interface/order";
import NonFooterLayout from "@/layouts/non-footer";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

export default function PaymentStatus() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const cancel = queryParams.get("cancel");
  const status = queryParams.get("status");
  const [order, setOrder] = useState<OrderPaymentDetail | null>(null);

  const fetchOrder = async () => {
    try {
      // Kiểm tra id có hợp lệ không
      if (!id) {
        window.location.href = "/stores";
        return;
      }

      // Gọi API để lấy thông tin đơn hàng
      const result = await CHECKTRANSACTION({
        id: id,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        setOrder(result.res.data);
      } else {
        if (result.statusCode === 401) {
          Logout();
        } else {
          window.location.href = "/stores";
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]); // Re-fetch khi id thay đổi

  return (
    <NonFooterLayout>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4 min-w-[1220px] h-full">
          {order && <OrderDetailBar order={order} />}
          {order && <PaymentStatusBar status={order.statusPayment || ""} />}
        </div>
      </div>
    </NonFooterLayout>
  );
}
