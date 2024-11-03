import { OrderDetail } from "@/interface/order";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react";
import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

interface PaymentCardProps {
  orderId: string;
  refId: number;
  amount: string;
  data: any;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({orderId, refId, amount, data}) =>  {
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  useEffect(() => {
    if (data.statusPayment === "Success") {
      setIsSuccess(true);
    }
  }, [data]);

  return (
    <Card className="p-7">
      <CardBody>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <div className="flex flex-col items-start">
              <span>Mã giao dịch</span>
              <span>{orderId}</span>
            </div>
            <Divider />
            <div className="flex flex-col items-start mt-4">
              <span>Mã tham chiếu</span>
              <span>{refId}</span>
            </div>
            <div className="flex flex-col items-center mt-24">
              {isSuccess ? (
                <>
                  <FaCheckCircle className="w-10 h-10 text-[#00bf23]" />
                  <span>Giao dịch thành công</span>
                </>
              ) : (
                <Spinner size="lg" />
              )}
            </div>
          </div>
          <div className="col-span-7 items-end">
            <img 
                src={`https://api.vietqr.io/image/970436-1020546203-2oeIArK.jpg?amount=${amount}&addInfo=DH${refId}`} 
                alt="QR code" 
                className="object-cover"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  ); // Replace null with your desired JSX code
}