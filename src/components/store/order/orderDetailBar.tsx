import { OrderDetail } from "@/interface/order";
import { Button } from "@nextui-org/button";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
} from "@nextui-org/react";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineStorefront } from "react-icons/md";
import { RiShoppingBag4Fill } from "react-icons/ri";

interface OrderDetailBarProps {
  order: OrderDetail;
}

export const OrderDetailBar: React.FC<OrderDetailBarProps> = ({ order }) => {
  return (
    <Card className="pl-7 pt-9 pb-2">
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
              <th className="text-sm">Đơn giá</th>
              <th className="text-sm">Số lượng</th>
              <th className="text-sm">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.petStores.map((item, index) => (
              <>
                {item.orderDetails.map((itemProduct, index) => (
                  <tr key={index} className="my-1">
                    {" "}
                    {/* Giảm margin giữa các hàng */}
                    <td className="py-3">
                      {" "}
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
                        <span className="text-lg">
                          {itemProduct.productName}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3 ${index === 0 && "pt-12"}`}>₫{itemProduct.unitPrice.toLocaleString().replace(/,/g, '.')}</td>
                    <td className={`py-3 ${index === 0 && "pt-12"}`}>{itemProduct.quantity}</td>
                    <td className={`py-3 ${index === 0 && "pt-12"}`}>
                      ₫{(itemProduct.unitPrice * itemProduct.quantity).toLocaleString().replace(/,/g, '.')}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
        <Divider />
        <div className="flex flex-row justify-end gap-4">
          <Input placeholder="Nhập mã giảm giá" />
          <Button>Áp dụng</Button>
        </div>
        <div className="flex justify-end gap-4 pr-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between gap-52">
              <span className="text-xl">Tạm tính:</span>
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
  ); // Replace null with your desired JSX code
};
