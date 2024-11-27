import { ADDTOCART } from "@/api/Cart";
import { CREATEORDER } from "@/api/Order";
import Logout from "@/components/logout";
import { CreateOrderReq, OrderDetail } from "@/interface/order";
import { Product } from "@/interface/store";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { RadioGroup, useRadio, VisuallyHidden, RadioProps, cn } from "@nextui-org/react";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import { MdOutlineStorefront } from "react-icons/md";
import { RiShoppingBag4Fill, RiTruckLine } from "react-icons/ri";

interface productOrderTrackingBarProps {
  order: OrderDetail; 
}
export const ProductOrderTrackingBar: React.FC<productOrderTrackingBarProps> = ({ order }) =>  {
  return (
    <Card className="pl-7 pt-9 pb-2">
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-row pr-8 gap-2">
          MÃ ĐƠN HÀNG. {order.id}
        </div>
        <div className="flex flex-row items-center pr-8 gap-2">
          <RiTruckLine />
          <span className="text-md">
            {order.status == "Delivering"
              ? "Đang vận chuyển"
              : "Giao hàng thành công"}
          </span>
        </div>
      </CardHeader>
      <CardBody className="flex text-lg flex-col gap-4">
        <table className="table-auto w-full items-center">
          <thead>
            <tr>
              <th className="text-2xl">
                <div className="flex flex-row items-center gap-2">
                  <RiShoppingBag4Fill className="text-[#ed5c02]"/>
                  <span>Sản phẩm</span>
                </div>
              </th>
              <th className="text-sm text-default-500 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {order.petStores.map((item, index) => (
              <React.Fragment key={item.id}>
                {item.orderDetails.map((itemProduct, index) => (
                  <tr key={index} className="my-1">
                    {/* Giảm margin giữa các hàng */}
                    <td className="py-3">
                      {/* Giảm padding trên và dưới */}
                      {index === 0 && (
                        <div className="flex flex-row items-center gap-2 text-xl p-1 bg-[#ed5c02] rounded-xl max-w-fit">
                          <MdOutlineStorefront />
                          <span>{item.name}</span>
                        </div>
                      )}
                      <div className="flex flex-row items-center gap-4 pt-2">
                        <img
                          src={itemProduct.attachment}
                          alt=""
                          className="w-16 h-16 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-lg line-clamp-1">
                            {itemProduct.productName}
                          </span>
                          <span className="text-sm">
                            Phân loại: <span className="text-[#a1a1aa]">{itemProduct.productItemName}</span>
                          </span>
                          <span className="text-sm text-[#a1a1aa]">x{itemProduct.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`py-3 text-[15px] ${index === 0 && "pt-12"} pr-8 flex justify-end`}>₫{itemProduct.unitPrice.toLocaleString().replace(/,/g, '.')}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <Divider />
        <div className="flex justify-end gap-4 pr-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between gap-44">
              <span className="text-xl">Thành tiền:</span>
              <div>
                <span className="text-lg text-[#ed5c02]">₫</span>
                <span className="text-2xl text-[#ed5c02]">
                  {order.totalPrice.toLocaleString().replace(/,/g, '.')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
