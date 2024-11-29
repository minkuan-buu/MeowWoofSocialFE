import { GETRATINGORDER } from "@/api/Order";
import { RATING } from "@/api/Rating";
import Logout from "@/components/logout";
import { OrderRating } from "@/interface/order";
import { OrderRatingReq } from "@/interface/rating";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineStorefront } from "react-icons/md";
import { TiStarOutline, TiStarFullOutline } from "react-icons/ti";
import { useParams } from "react-router-dom";

export const RatingProduct: React.FC<{
  isOpen: boolean;
  onOpenChange: () => void;
}> = ({ isOpen, onOpenChange }) => {
  const { orderId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderRating, setOrderRating] = useState<OrderRating[]>([]);
  
  // Dùng useRef để lưu trạng thái đánh giá và hover
  const ratingsRef = useRef<Record<string, number>>({});
  const hoverRatingsRef = useRef<Record<string, number>>({});
  const [, forceRender] = useState<number>(0); // Trigger re-render khi cần
  // Ref để lưu nội dung Textarea cho từng sản phẩm
  const textRefs = useRef<Record<string, string>>({});

  const fetchOrderRating = async () => {
    try {
      const result = await GETRATINGORDER({
        orderId: orderId || "",
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        var data = result.res.data;
        setOrderRating(data);
        data.forEach(item => {
          item.orderDetails.forEach(product => {
            ratingsRef.current[product.productItemId] = 5;
          })
        });
      } else {
        if (result.statusCode === 401) {
          Logout();
        } else if (
          result.statusCode === 400 &&
          result.res?.message &&
          result.res?.message.includes("not found")
        ) {
          window.location.href = "/not-found";
        } else {
          throw new Error("Lỗi không xác định");
        }
      }
    } catch (e) {
      window.location.href = "/not-found";
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || isLoading) return;
    setIsLoading(true);

    if (orderId == null) {
      window.location.href = "/not-found";
      return;
    } else if (localStorage.token == null) {
      Logout();
    }

    fetchOrderRating();
  }, [isOpen]);

  const handleMouseEnter = (productId: string, star: number) => {
    hoverRatingsRef.current[productId] = star;
    forceRender((prev) => prev + 1); // Trigger re-render để cập nhật UI
  };

  const handleMouseLeave = (productId: string) => {
    hoverRatingsRef.current[productId] = 0;
    forceRender((prev) => prev + 1); // Trigger re-render để cập nhật UI
  };

  const handleClick = (productId: string, star: number) => {
    ratingsRef.current[productId] = star;
    forceRender((prev) => prev + 1); // Trigger re-render để cập nhật UI
  };

  const handleTextareaChange = (productId: string, value: string) => {
    textRefs.current[productId] = value; // Lưu nội dung của từng Textarea vào ref
  };

  const handleSubmit = async () => {
    const missingRatings = Object.entries(ratingsRef).filter(([productId, star]) => star === 0);

    if (missingRatings.length > 0) {
      alert("Vui lòng đánh giá sao cho tất cả các sản phẩm trước khi gửi!");
      return;
    }

    const dataToSubmit: OrderRatingReq[] = orderRating?.flatMap((store) =>
      store.orderDetails.map((product) => ({
        productItemId: product.productItemId,
        starRating: ratingsRef.current[product.productItemId] || 0,
        comment: textRefs.current[product.productItemId] || "",
      }))
    ) || [];  // Đảm bảo nếu orderRating là undefined, dataToSubmit sẽ là mảng rỗng
    
    console.log("Dữ liệu đánh giá gửi đi:", dataToSubmit);
    
    // Xử lý logic gửi đánh giá tại đây
    const result = await RATING({
      ratingReq: dataToSubmit,  // dataToSubmit đã có kiểu OrderRatingReq[]
      token: localStorage.token,
    });
    
    if (result.isSuccess) {
      toast.success("Gửi đánh giá thành công!");
      CloseModal();
    } else {
      if (result.statusCode === 401) {
        Logout();
      } else {
        toast.error("Gửi đánh giá thất bại! Vui lòng thử lại sau.");
      }
    }
    
  };

  function CloseModal(){
    ratingsRef.current = {};
    hoverRatingsRef.current = {};
    textRefs.current = {};
    setOrderRating([]);
    onOpenChange();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={CloseModal} size="4xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center items-center">
              Đánh giá sản phẩm
            </ModalHeader>
            {isLoading ? (
              <ModalBody className="flex flex-col justify-center items-center">
                <Spinner />
                <span>Đang tải dữ liệu...</span>
              </ModalBody>
            ) : (
              <ModalBody className="flex flex-col max-h-[650px] overflow-y-auto">
                {orderRating.length > 0 ? (
                  orderRating.map((store) => (
                    <div className="flex flex-col gap-4" key={store.id}>
                      <div className="flex flex-row items-center gap-2 text-xl p-1 bg-[#ed5c02] rounded-xl max-w-fit">
                        <MdOutlineStorefront />
                        <span>{store.name}</span>
                      </div>
                      {store.orderDetails.map((product) => (
                        <div key={product.productItemId} className="flex flex-col gap-4">
                          <div className="flex flex-row gap-3">
                            <img
                              src={product.attachment}
                              alt={product.productName}
                              className="w-20 h-20"
                            />
                            <div>
                              <span>{product.productName}</span>
                              <span>{product.productItemName}</span>
                            </div>
                          </div>
                          <div className="flex flex-row items-center gap-2">
                            <span>Đánh giá sản phẩm</span>
                            <div className="flex flex-row">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                  key={star}
                                  role="button"
                                  tabIndex={0}
                                  onMouseEnter={() =>
                                    handleMouseEnter(product.productItemId, star)
                                  }
                                  onMouseLeave={() =>
                                    handleMouseLeave(product.productItemId)
                                  }
                                  onClick={() =>
                                    handleClick(product.productItemId, star)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      handleClick(product.productItemId, star);
                                    }
                                  }}
                                  className="cursor-pointer"
                                >
                                  {star <=
                                  (hoverRatingsRef.current[product.productItemId] ||
                                    ratingsRef.current[product.productItemId] ||
                                    0) ? (
                                    <TiStarFullOutline className="text-3xl text-yellow-500" />
                                  ) : (
                                    <TiStarOutline className="text-3xl text-gray-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Textarea
                            className="w-full h-32"
                            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm"
                            onChange={(e) =>
                              handleTextareaChange(product.productItemId, e.target.value)
                            }
                          />
                          {store.orderDetails.length > 1 && <Divider />}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center"> 
                   <span>Không có sản phẩm nào để đánh giá</span>
                  </div>
                )}
              </ModalBody>
            )}
            <ModalFooter>
              <Button className="bg-[#ed5c02]" onClick={handleSubmit} isDisabled={isLoading || orderRating.length < 1}>
                Gửi đánh giá
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
