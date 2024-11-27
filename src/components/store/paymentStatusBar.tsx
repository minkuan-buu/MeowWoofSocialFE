import { MAKEPAYMENT } from "@/api/Order";
import { OrderDetail } from "@/interface/order";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import React from "react";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { GoXCircleFill } from "react-icons/go";
import { FaLocationDot } from "react-icons/fa6";

interface PaymentStatusBarProps {
    status: string; 
}

export const PaymentStatusBar: React.FC<PaymentStatusBarProps> = ({ status }) =>  {
  return (
    <Card className="p-7">
      <CardHeader className="text-xl">
        <FaCreditCard className="text-[#ed5c02] mr-2" /> 
        <span className="text-2xl">
          <b>Trạng thái giao dịch</b>
        </span>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center justify-center h-full">
          {status == "PAID" ? (
            <FaCheckCircle className="text-4xl text-success" />
          ) : status == "CANCELLED" ? (
            <GoXCircleFill className="text-4xl text-danger" />
          ) : (
            <Spinner size="lg" />
          )}
          <span className="text-md mt-2">
            <i>{status == "PAID" ? "Thanh toán thành công" : status == "CANCELLED" ? "Giao dịch đã bị hủy" : "Đang xử lý"}</i>
          </span>
        </div>
        <div className="flex justify-end">
          <Button as={Link} href="/stores">
            <span className="flex flex-row items-center gap-2">
              <span>Quay lại cửa hàng</span>
            </span>
          </Button>
        </div>
      </CardBody>
    </Card>
  ); // Replace null with your desired JSX code
}