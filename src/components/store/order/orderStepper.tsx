import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Stepper, Step } from 'react-form-stepper';
import { RiArrowLeftSLine } from 'react-icons/ri';
//import "../../../styles/stepper.css"
import { FaShippingFast } from 'react-icons/fa';
import { FaBoxOpen } from "react-icons/fa6";
import { TbInvoice } from 'react-icons/tb';
import { OrderDetail } from '@/interface/order';

interface OrderStepperProp {
    order: OrderDetail;
}
export const OrderStepper: React.FC<OrderStepperProp> = ({ order }) => {
  return(
    <Card>
      <CardHeader className='flex flex-row justify-between items-center p-6'>
        <div className="flex flex-row items-center hover:bg-neutral-500 p-2 hover:rounded-md" onMouseDownCapture={() => window.location.href = "/orders"}>
          <RiArrowLeftSLine className='text-xl' /> 
          <span className='select-none'>Trở lại</span>
        </div>
        <div className='flex justify-between gap-4 pr-4'>
          <div>
            MÃ ĐƠN HÀNG. {order.id}
          </div>
          <div>
            |
          </div>
          <div>
          {order.status == "Delivering"
              ? "ĐANG VẬN CHUYỂN"
              : order.status == "Cancelled"
                ? "ĐÃ HỦY"
                : "GIAO HÀNG THÀNH CÔNG"}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {order.status == "Cancelled" ? (
          <h1 className='pl-8 pb-8 text-3xl text-[#ed5c02]'>Đã hủy đơn hàng</h1>
        ) : (
          <>
            <Stepper 
              activeStep={order.status == "Delivering" ? 1 : 2}
              stepClassName="flex text-xl items-center justify-center" 
              connectorStyleConfig={{
                activeColor: '#4CAF50', // Màu connector cho bước hiện tại
                completedColor: "#4CAF50", // Màu connector cho bước hoàn thành
                disabledColor: '#ccc', // Màu connector cho bước chưa hoàn thành
                size: 2, // Độ dày của connector
                style: 'margin-top: 1rem;', // Chuỗi CSS hợp lệ
              }}
              styleConfig={{
                activeBgColor: '#4CAF50', // Màu nền cho bước hiện tại
                completedBgColor: '#4CAF50', // Màu nền cho bước đã hoàn thành
                inactiveBgColor: '#ccc', // Màu nền cho bước chưa hoàn thành
                activeTextColor: '#fff', // Màu chữ cho bước hiện tại
                completedTextColor: '#fff', // Màu chữ cho bước hoàn thành
                inactiveTextColor: '#000', // Màu chữ cho bước chưa hoàn thành
                size: '3.5rem', // Kích thước vòng tròn
                circleFontSize: '1.5rem', // Kích thước chữ trong vòng tròn
                labelFontSize: '0.875rem', // Kích thước chữ cho nhãn
                fontWeight: 600, // Độ đậm của chữ
                borderRadius: '50%', // Giữ hình tròn
              }}
            >
              <Step label="Tạo đơn"><TbInvoice /></Step>
              <Step label="Đang vận chuyển"><FaShippingFast /></Step>
              <Step label="Đã giao hàng"><FaBoxOpen /></Step>
            </Stepper>
            <Divider />
            <div className="flex justify-end p-6">
              <Button size='lg' isDisabled={order.status != "Success"} className="bg-[#ed5c02]">Đánh giá ngay</Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}