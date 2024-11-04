import { Button } from "@nextui-org/button";
import { Card, CardBody, Divider, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface PaymentCardProps {
  orderId: string;
  refId: number;
  amount: string;
  data: { orderId: number; message: any }[];
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ orderId, refId, amount, data }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Lấy thông điệp cuối cùng từ `data` để kiểm tra trạng thái thanh toán
    const latestMessage = data[data.length - 1]?.message;
    if (latestMessage?.statusPayment === "Success") {
      setIsSuccess(true);
    }
  }, [data]); // Theo dõi `data` để cập nhật khi có tin nhắn mới

  const [secondsResend, setSecondsResend] = useState<number>(0);

  useEffect(() => {
    if (isSuccess) {
      // Gửi thông báo cho người dùng
      const createdTime = new Date();
      const returnTime = createdTime.setSeconds(createdTime.getSeconds() + 5);
      const firstNow = new Date();
      let time = returnTime - firstNow.getTime();
      setSecondsResend(Math.floor((time % (1000 * 60)) / 1000));
      const interval = setInterval(() => {
        const now = new Date();
        let time = returnTime - now.getTime();
        setSecondsResend(Math.floor((time % (1000 * 60)) / 1000));
        if(time < 0){
          clearInterval(interval);
          setSecondsResend(0);
          window.location.href = "/stores";
        }
      }, 1000);
    }
  }, [isSuccess]);

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
                  <i>{`Đang chuyển hướng về "Cửa hàng" sau ${secondsResend} giây`}</i>
                </>
              ) : (
                <Spinner size="lg" />
              )}
            </div>
          </div>
          <div className="col-span-7 items-end">
            <img 
              src={`https://api.vietqr.io/image/970415-103873806167-2oeIArK.jpg?amount=${amount}&addInfo=DH${refId}`} 
              alt="QR code" 
              className="object-cover"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
