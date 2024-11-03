import { OrderDetail } from "@/interface/order";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";

interface AddressBarProps {
    order: OrderDetail; 
}

export const AddressBar: React.FC<AddressBarProps> = ({ order }) =>  {
  return (
    <Card className="p-7">
      <CardHeader className="text-xl">
        <FaLocationDot className="text-[#ed5c02] mr-2" /> 
        <span className="text-2xl">
          <b>Địa chỉ giao hàng</b>
        </span>
      </CardHeader>
      <CardBody className="flex text-lg flex-row gap-4 items-center">
        <span><b>{order.userAddress.name}</b></span> <span><b>{order.userAddress.phone}</b></span> <span className="ml-10">{"->"}
        </span> <span className="ml-10">{order.userAddress.address}</span>
        <Button>Thay đổi địa chỉ</Button>
      </CardBody>
    </Card>
  ); // Replace null with your desired JSX code
}