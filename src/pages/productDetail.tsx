import { GETPRODUCTRATING } from "@/api/Rating";
import { GETPRODUCTDETAIL } from "@/api/Store";
import Logout from "@/components/logout";
import { ProductBar } from "@/components/store/product/productBar";
import { ProductRatingBar } from "@/components/store/product/ProductRatingBar";
import { ProductRating } from "@/interface/rating";
import { Product } from "@/interface/store";
import NonFooterLayout from "@/layouts/non-footer";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiXCircle } from "react-icons/fi";
import { ThreeDot } from "react-loading-indicators";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [rating, setRating] = useState<ProductRating[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [isLoadingRating, setIsLoadingRating] = useState<boolean>(false);

  const fetchProduct = async () => {
    if (isLoadingProduct || !localStorage.token) return; // Tránh nhiều yêu cầu cùng lúc
    setIsLoadingProduct(true);
    if (productId == null) {
      window.location.href = "/";
      return;
    }
    try {
      const result = await GETPRODUCTDETAIL({
        productId: productId,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const product = result.res.data;

        setCurrentProduct(product);
      } else if (!result.isSuccess) {
        if (result.statusCode === 401) {
          Logout();
        } else {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4" style={{ color: "#102530" }}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    {/* <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                      alt=""
                    /> */}
                    <FiXCircle />
                  </div>
                  <div className="ml-3 flex-1">
                    <p>Không thể kết nối đến máy chủ</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Đóng
                </button>
              </div>
            </div>
          ));
        }
      } 
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoadingProduct(false); // Kết thúc trạng thái tải
    }
  };

  const fetchProductRating = async () => {
    if (isLoadingRating || !localStorage.token) return; // Tránh nhiều yêu cầu cùng lúc
    setIsLoadingRating(true);
    if (productId == null) {
      window.location.href = "/";
      return;
    }
    try {
      const result = await GETPRODUCTRATING({
        id: productId,
        token: localStorage.token,
      });
  
      if(result.isSuccess && result.res != null) {
        setRating(result.res.data);
        const avgRating = result.res.data?.length
          ? result.res.data.reduce((acc, cur) => acc + cur.rating, 0) /
            result.res.data.length
          : 0;

        setAvgRating(avgRating);

      } else {
        if(result.statusCode === 401) {
          Logout();
        } else {
          throw new Error("Lỗi không xác định");
        }
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    // Fetch lần đầu khi component mount
    setIsLoadingProduct(true);
    fetchProduct();
    fetchProductRating();
  }, [productId]);

  return (
    <NonFooterLayout>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4 h-full">
          {isLoadingProduct ? (
            <div className="flex justify-center">
              <ThreeDot color="#102530" size="medium" text="" textColor="" />
            </div>
          ) : (
            <>
              <div>
                <Breadcrumbs 
                  itemClasses={{
                    item: "text-[#102530]/100 data-[current=true]:text-[#102530] data-[current=true]:font-bold text-md",
                    separator: "text-[#102530]",
                  }}>
                  <BreadcrumbItem href="/stores">Cửa hàng</BreadcrumbItem>
                  <BreadcrumbItem>{currentProduct?.category.parentCategory.name}</BreadcrumbItem>
                  <BreadcrumbItem>{currentProduct?.category.name}</BreadcrumbItem>
                  <BreadcrumbItem>{currentProduct?.name}</BreadcrumbItem>
                </Breadcrumbs>
              </div>
              {currentProduct && <ProductBar product={currentProduct} avgRating={avgRating} countRating={rating.length}/>}
              {rating && <ProductRatingBar rating={rating} avgRating={avgRating}/>}
            </>
          )}
        </div>
      </div>
    </NonFooterLayout>
  );
}
