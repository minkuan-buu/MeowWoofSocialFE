import { GETLISTORDER, GETTRACKINGORDER } from "@/api/Order";
import { OrderStepper } from "@/components/store/order/orderStepper";
import { ProductOrderDetailTrackingBar } from "@/components/store/order/productOrderDetailTrackingBar";
import { OrderDetail } from "@/interface/order";
import NonFooterLayout from "@/layouts/non-footer";
import React from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";


export default function OrderDetailPage() {
  const [Order, setOrder] = useState<OrderDetail>();
  const { orderId } = useParams();

  useEffect(() => {
    const fetchListOrder = async () => {
      if (orderId == null) {
        window.location.href = "/";

        return;
      }
      
      try
      {
        const result = await GETTRACKINGORDER({
          orderId: orderId,
          token: localStorage.token,
        });
    
        if(result.isSuccess && result.res != null) {
          const order = result.res.data;
          setOrder(order);
        } else {
        if(result.statusCode === 401) {
            window.location.href = "/login";
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

    fetchListOrder();
  }, []);

  return (
    <NonFooterLayout>
      <div className="flex justify-center start-[100px] pt-6 pb-6">
        <div className="flex flex-col gap-4 min-w-[1420px] h-full">
          <h1 className="text-4xl text-[#102530] font-bold">Chi tiết đơn hàng</h1>
          <Toaster position="bottom-left" reverseOrder={false} />
          {Order && <OrderStepper order={Order}/>}
          {Order && <ProductOrderDetailTrackingBar order={Order}/>}
        </div>
      </div>
    </NonFooterLayout>
  )
}

