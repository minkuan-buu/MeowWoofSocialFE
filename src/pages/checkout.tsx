import { GETORDER } from "@/api/Order";
import Logout from "@/components/logout";
import { AddressBar } from "@/components/store/order/addressBar";
import { OrderDetailBar } from "@/components/store/order/orderDetailBar";
import { PaymentBar } from "@/components/store/order/paymenBar";
import { OrderDetail } from "@/interface/order";
import NonFooterLayout from "@/layouts/non-footer";
import { useEffect, useState } from "react";
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
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <NonFooterLayout>
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4 min-w-[1220px] h-full">
          {order && <AddressBar order={order} />}
          {order && <OrderDetailBar order={order} />}
          {order && <PaymentBar order={order} />}
        </div>
      </div>
    </NonFooterLayout>
  );
}