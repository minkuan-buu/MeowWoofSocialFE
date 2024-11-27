import { GETLISTORDER } from "@/api/Order";
import { ProductOrderTrackingBar } from "@/components/store/order/productOrderTrackingBar";
import { OrderDetail } from "@/interface/order";
import NonFooterLayout from "@/layouts/non-footer";
import React from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function Order() {
  const [listOrder, setListOrder] = useState<OrderDetail[]>([]);
  useEffect(() => {
    const fetchListOrder = async () => {
      try
      {
        const result = await GETLISTORDER({
            token: localStorage.token,
          });
    
          if(result.isSuccess && result.res != null) {
            setListOrder(result.res.data);
          } else {
            if(result.statusCode === 401) {
              window.location.href = "/login";
            } else {
              toast.error("Lỗi không xác định");
            }
          }
      } catch (e) {
        toast.error("Lỗi không xác định");
      }
    }

    fetchListOrder();
  }, []);

  return (
    <NonFooterLayout>
      <div className="flex justify-center start-[100px] pt-6 pb-6">
        <div className="flex flex-col gap-4 min-w-[1420px] h-full">
          <h1 className="text-4xl text-[#102530] font-bold">Đơn hàng ({listOrder.length})</h1>
          <Toaster position="bottom-left" reverseOrder={false} />
          {listOrder.map((order) => (
            <React.Fragment key={order.id}>
              <ProductOrderTrackingBar order={order}/>
            </React.Fragment>
          ))}
        </div>
      </div>
    </NonFooterLayout>
  )
}

