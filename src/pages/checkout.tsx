import { GETORDER } from "@/api/Order";
import Logout from "@/components/logout";
import { AddressBar } from "@/components/store/order/addressBar";
import { OrderDetailBar } from "@/components/store/order/orderDetailBar";
import { PaymentBar } from "@/components/store/order/paymentBar";
import { OrderDetail } from "@/interface/order";
import NonFooterLayout from "@/layouts/non-footer";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function Checkout() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const fetchOrder = async () => {
    try {
      if (orderId == null) {
        window.location.href = "/stores";
        return;
      }

      const result = await GETORDER({
        orderId: orderId,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        setOrder(result.res.data);
      } else {
        if (result.statusCode === 401) {
          Logout();
        } else if(result.statusCode === 400 && result.res?.message && result.res?.message.includes("not found")) {
          window.location.href = "/not-found";
        } else {
          throw new Error("Lỗi không xác định");
        }
      }
    } catch (e: any) {
      window.location.href = "/not-found";
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <NonFooterLayout>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4 min-w-[1220px] h-full">
          {order && <AddressBar order={order} setOrder={setOrder} />}
          {order && <OrderDetailBar order={order} />}
          {order && <PaymentBar order={order} />}
        </div>
      </div>
    </NonFooterLayout>
  );
}