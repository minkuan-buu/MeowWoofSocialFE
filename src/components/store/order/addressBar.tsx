import { OrderDetail } from "@/interface/order";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { AddressController } from "./addressController";
import { UserAddress } from "@/interface/user";
import { set } from "date-fns";

interface AddressBarProps {
  order: OrderDetail;
  setOrder: React.Dispatch<React.SetStateAction<OrderDetail | null>>;
}

export const AddressBar: React.FC<AddressBarProps> = ({ order, setOrder }) =>  {
  const {
    isOpen: isOpenAddress,
    onOpen: onOpenAddress,
    onOpenChange: onOpenChangeAddress,
  } = useDisclosure();

  const [currentAddress, setCurrentAddress] = useState<UserAddress | null>(null);

  function handleOpenAddress() {
    onOpenAddress();
  }

  useEffect(() => {
    if (order.userAddress != null) {
      var getCurrentAddress = {
        id: order.userAddress?.id,
        name: order.userAddress?.name,
        phone: order.userAddress?.phone,
        address: order.userAddress?.address,
        isDefault: order.userAddress?.isDefault,
      };
      setCurrentAddress(getCurrentAddress);
    }
  }, [order]);

  return (
    <>
      <AddressController isOpen={isOpenAddress} onOpenChange={onOpenChangeAddress} currentAddress={currentAddress} setOrder={setOrder} setCurrentAddress={setCurrentAddress}/>
      <Card className="p-7">
        <CardHeader className="text-xl">
          <FaLocationDot className="text-[#ed5c02] mr-2" /> 
          <span className="text-2xl">
            <b>Địa chỉ giao hàng</b>
          </span>
        </CardHeader>
        <CardBody className="flex text-lg flex-row gap-4 items-center">
          {order.userAddress != null ? (
            <>
              <span><b>{order.userAddress.name}</b></span> <span><b>{order.userAddress.phone}</b></span> <span className="ml-10">{"->"}
              </span> <span className="ml-10">{order.userAddress.address}</span>
              <Button onPress={handleOpenAddress}>Thay đổi địa chỉ</Button>
            </>
          ) : (
            <div className="flex flex-row items-center gap-2">
              <AiFillWarning className="text-[#ed5c02]" />
              <span>Không có thông tin địa chỉ</span>
              <Button className="ml-2" onPress={handleOpenAddress}>Thêm địa chỉ</Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  ); // Replace null with your desired JSX code
}