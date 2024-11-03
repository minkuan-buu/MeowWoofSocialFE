import { OrderDetail } from "@/interface/order";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";
import { FaCreditCard } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

interface PaymentBarProps {
    order: OrderDetail; 
}

export const PaymentBar: React.FC<PaymentBarProps> = ({ order }) =>  {
  return (
    <Card className="p-7">
      <CardHeader className="text-xl">
        <FaCreditCard className="text-[#ed5c02] mr-2" /> 
        <span className="text-2xl">
          <b>Thanh toán</b>
        </span>
      </CardHeader>
      <CardBody className="flex flex-col text-xl">
        <div className="flex flex-row justify-end items-center mb-10">
          <span>Phương thức thanh toán:</span>
          <span className="ml-10">Chuyển khoản</span>
          <Button className="ml-4">Chuyển đổi</Button>
        </div>
        <div className="flex justify-end gap-4 text-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between gap-52">
              <span>Tạm tính:</span>
              <div>
                <span className="text-md">₫</span>
                <span className="text-lg">
                  {order.totalPrice.toLocaleString().replace(/,/g, '.')}
                </span>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="flex flex-row justify-between">
              <span>Giảm giá:</span>
              <div>
                <span className="text-md">₫</span>
                <span className="text-lg">
                  0
                </span>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <span>Tổng thanh toán:</span>
              <div>
                <span className="text-md text-[#ed5c02]">₫</span>
                <span className="text-3xl text-[#ed5c02]">
                  {order.totalPrice.toLocaleString().replace(/,/g, '.')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Button className="mt-5 p-7 text-xl bg-[#ed5c02]" as={Link} href={`/payment?orderId=${order.id}&refId=${order.refId}&amount=${order.totalPrice}`}>Đặt hàng</Button>
        </div>
      </CardBody>
    </Card>
  ); // Replace null with your desired JSX code
}