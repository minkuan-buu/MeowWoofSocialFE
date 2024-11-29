import { ADDTOCART } from "@/api/Cart";
import { CREATEORDER } from "@/api/Order";
import Logout from "@/components/logout";
import { CreateOrderReq } from "@/interface/order";
import { Product } from "@/interface/store";
import { Button } from "@nextui-org/button";
import { Card, CardBody, Input } from "@nextui-org/react";
import { RadioGroup, useRadio, VisuallyHidden, RadioProps, cn } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";

interface ProductBarProps {
  product: Product;
  avgRating: number;
  countRating: number;
}

export const CustomRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "inline-flex flex-row items-center justify-center hover:bg-content2", // Thay đổi từ flex-col thành flex-row
        "cursor-pointer border-2 border-default rounded-lg gap-2 p-2",
        "data-[selected=true]:border-[#ed5c02]"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div {...getLabelWrapperProps()} className="text-center ">
        {children && <span {...getLabelProps()}>{children}</span>}
      </div>
    </Component>
  );
};

export const ProductBar: React.FC<ProductBarProps> = ({ product, avgRating, countRating }) =>  {
  const [selected, setSelected] = useState<string>(
    product.petStoreProductItems[0].id,
  );
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [onAddToCart, setOnAddToCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const renderStars = (stars: number) => {
    const fullStars = Math.floor(stars); // Sao đầy
    const hasHalfStar = stars - fullStars > 0 && stars - fullStars <= 0.6; // Sao nửa
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Sao rỗng

    return (
      <div className="flex">
        {/* Sao đầy */}
        {[...Array(fullStars)].map((_, index) => (
          <TiStarFullOutline
            key={`full-${index}`}
            className="text-md text-yellow-500"
          />
        ))}

        {/* Sao nửa */}
        {hasHalfStar && (
          <TiStarHalfOutline className="text-md text-yellow-500" />
        )}

        {/* Sao rỗng */}
        {[...Array(emptyStars)].map((_, index) => (
          <TiStarOutline
            key={`empty-${index}`}
            className="text-md text-gray-400"
          />
        ))}
      </div>
    );
  };

  function handleIncrease() {
    setQuantity(quantity + 1);
  }

  function handleDecrease() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  const AddToCart = async () => {
    if(onAddToCart) return;
    setOnAddToCart(true);
    
    try {
      const result = await ADDTOCART({
        token: localStorage.token,
        productItemId: selected,
        quantity: quantity,
      });
      if (result.isSuccess && result.res != null) {
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        if (result.statusCode === 401) {
          Logout();
        }
      }
    } catch (e) {
      toast.error("Lỗi không xác định");
    } finally {
      setOnAddToCart(false);
    }
  }

  const BuyInstant = async () => {
    if (onLoading) return;
    setOnLoading(true);
    var listProduct: CreateOrderReq[] = [];

    listProduct.push({
      productItemId: selected,
      unitPrice:
        product.petStoreProductItems.find((item) => item.id === selected)
          ?.price || 0,
      quantity: quantity,
    });

    // Gọi API tạo đơn hàng
    try {
      const result = await CREATEORDER({
        product: listProduct,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        window.location.href = `/checkout/${result.res.data.id}`;
      } else {
        if (result.statusCode === 401) {
          Logout();
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOnLoading(false);
    }
  }

  return (
    <Card className="relative max-w-[1225px] w-[1225px] max-h-[475px] h-[475px] rounded-xl">
      <CardBody>
        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <img
              alt="product"
              className="w-[400px] h-[450px] rounded-md"
              src={
                product.attachments.length > 0
                  ? product.attachments[0].attachment
                  : "/food.png"
              }
            />
          </div>
          <div className="col-span-8 ml-3 flex flex-col justify-between h-full">
            <div>
              <h1 className="text-2xl line-clamp-2">{product.name}</h1>
              <div className="flex flex-row w-full items-center mt-2">
                {avgRating > 0 && countRating > 0 ? (
                  <>
                    <div className="flex items-center">
                      <span className="text-[17px] pr-1"><u>{avgRating.toFixed(1)}</u></span>
                      <span>{renderStars(avgRating)}</span>
                    </div>
                  </>
                ) : (
                  <h2 className="text-sm">Chưa có đánh giá</h2>
                )}
                <hr className="vertical-hr bg-gray-500" />
                <div className="text-sm"><span className="text-[17px] pr-1"><u>{countRating}</u></span> Đánh giá</div>
                <hr className="vertical-hr bg-gray-500" />
                <h2 className="text-sm"><span className="text-[17px] pr-1"><u>{product.totalSales}</u></span> Lượt bán</h2>
              </div>
              <div className="text-lg mt-5">
                <span>₫</span>
                <span className="text-3xl ml-1">
                  {product.petStoreProductItems
                    .find((item) => item.id === selected)?.price.toLocaleString()
                    .replace(/,/g, '.')}
                </span>
              </div>
              <RadioGroup
                className="flex flex-row gap-4 mt-7"
                defaultValue={product.petStoreProductItems[0].id}
                label="Phân loại"
                orientation="horizontal"
                onValueChange={setSelected}
              >
                {product.petStoreProductItems.map((item, index) => (
                  <CustomRadio key={index} value={item.id}>
                    {item.name}
                  </CustomRadio>
                ))}
              </RadioGroup>
            </div>
            <div>
              {/* Thêm nút số lượng ở đây */}
              <div className="flex flex-row items-center mt-5">
                <h2 className="text-sm opacity-60">Số lượng</h2>
                <div className="flex flex-row items-center ml-5">
                  <Button
                    className="!w-12 !h-10 !min-w-0 !p-0 !rounded-full flex items-center justify-center"
                    onClick={() => handleDecrease()}
                  >
                    -
                  </Button>
                  <input
                    className="text-lg text-center mx-2 w-20 h-10 rounded-lg border border-[#ed5c02]"
                    type="text"
                    value={quantity.toString()}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*$/.test(value)) {
                        setQuantity(value ? parseInt(value) : 1);
                      }
                    }}
                  />
                  <Button
                    className="!w-12 !h-10 !min-w-0 !p-0 !rounded-full flex items-center justify-center"
                    onClick={() => handleIncrease()}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-auto">
              <Button
                isLoading={onAddToCart}
                onClick={() => AddToCart()}
                className="border-[#ed5c02]"
                variant="bordered"
                size="lg"
                startContent={<FaCartPlus />}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                className="ml-4 bg-[#ed5c02]"
                isLoading={onLoading}
                size="lg"
                onClick={() => BuyInstant()} // Gọi hàm ở đây
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
