import { GETALLPRODUCTS } from "@/api/Store";
import { ListProduct } from "@/interface/store";
import { Card, CardBody, CardFooter, Divider, Image } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import Logout from "../logout";
import { FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link } from "@nextui-org/link";

export function TopProductTrending() {
  const [products, setProducts] = useState<ListProduct[]>([]); // Mảng chứa bài viết
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái đang tải
  const pageSize = 8; // Số lượng bài viết mỗi lần fetch
  const lastPetStoreProductIdRef = useRef<string | null>(null); // Sử dụng useRef để lưu lastPostId
  const hasMoreRef = useRef<boolean>(true); // Sử dụng useRef để lưu trạng thái hasMore
  const loadedProductsRef = useRef<Set<string>>(new Set()); // Lưu các ID bài viết đã tải

  const fetchProducts = async (lastPetStoreProductId: string | null) => {
    if (isLoading || !hasMoreRef.current || !localStorage.token) return; // Tránh nhiều yêu cầu cùng lúc
    setIsLoading(true);
    try {
      const result = await GETALLPRODUCTS({
        PageSize: pageSize,
        lastPetStoreProductId: lastPetStoreProductId || "",
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const newPosts = result.res.data;

        // Lọc bỏ các bài viết đã tồn tại bằng cách kiểm tra ID trong loadedProductsRef
        const filteredPosts = newPosts.filter(
          (post) => !loadedProductsRef.current.has(post.id) // Sử dụng Set để kiểm tra nhanh
        );

        if (filteredPosts.length > 0) {
          // Cập nhật products với các bài viết mới
          setProducts((prev) => [...prev, ...filteredPosts]);

          // Cập nhật lastPostId với bài viết cuối cùng
          lastPetStoreProductIdRef.current = filteredPosts[filteredPosts.length - 1].id;

          // Thêm các ID bài viết mới vào loadedProductsRef
          filteredPosts.forEach((post) => loadedProductsRef.current.add(post.id));
        }

        // Kiểm tra điều kiện ngừng tải thêm bài viết
        if (filteredPosts.length === 0 || newPosts.length < pageSize) {
          hasMoreRef.current = false; // Cập nhật hasMore bằng useRef
        }
      } else if (!result.isSuccess) {
        if(result.statusCode === 401) {
          Logout();
        } else {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4" style={{color: "#102530"}}>
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
          ))
        }
      } else {
        hasMoreRef.current = false; // Không còn bài viết để tải
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      hasMoreRef.current = false; // Xử lý lỗi khi fetch API thất bại
    } finally {
      setIsLoading(false); // Kết thúc trạng thái tải
    }
  };

  const handleScroll = () => {
    // Check if scroll position is near the bottom of the page
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      if (!isLoading && hasMoreRef.current) {
        const lastPostId = lastPetStoreProductIdRef.current; // Sử dụng lastPostId từ useRef
        fetchProducts(lastPostId); // Fetch bài viết mới dựa trên lastPostId
      }
    }
  };

  useEffect(() => {
    // Fetch lần đầu khi component mount
    fetchProducts(null);

    // Set up scroll event listener for lazy loading
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // const list = [
  //   {
  //     title: "Orange",
  //     img: "/food.png",
  //     price: 55000,
  //   },
  //   {
  //     title: "Tangerine",
  //     img: "/food.png",
  //     price: 100000,
  //   },
  //   {
  //     title: "Raspberry Raspberry Raspberry Raspberry Raspberry Raspberry Raspberry Raspberry",
  //     img: "/food.png",
  //     price: 150000,
  //   },
  //   {
  //     title: "Lemon",
  //     img: "/food.png",
  //     price: 530000,
  //   },
  //   {
  //     title: "Avocado",
  //     img: "/food.png",
  //     price: 157000,
  //   },
  //   {
  //     title: "Lemon 2",
  //     img: "/food.png",
  //     price: 800000,
  //   },
  //   {
  //     title: "Banana",
  //     img: "/food.png",
  //     price: 75000,
  //   },
  //   {
  //     title: "Watermelon",
  //     img: "/food.png",
  //     price: 120200,
  //   },
  // ];

  return (
    <div className="flex flex-col items-center gap-2 justify-center">
        <h1 className="text-2xl text-[#102530] border-solid border-b-orange-400 mb-3"><b>Sản phẩm bán chạy</b></h1>
        
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {products.map((item, index) => (
            <Card
              as={Link}
              href={`/stores/product/${item.id}`}
              shadow="sm"
              className="min-w-[300px] max-w-[300px] h-[430px] p-0"
              key={index}
              isPressable
              onPress={() => console.log("item pressed")}
            >
                <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={item.name}
                  className="w-full object-cover h-[300px]"
                  src={item.attachments.length > 0 ? item.attachments[0].attachment : "/food.png"}
                />
                </CardBody>
                <CardFooter className="flex flex-col items-start justify-between h-full">
                {/* Title at the top, truncated to 2 lines */}
                <b className="text-large line-clamp-2">{item.name}</b>
                
                {/* Price and sold count at the bottom */}
                <div className="flex flex-row justify-between items-center w-full mt-auto">
                    <p className="text-default-500">
                    <span className="text-small">₫</span>
                    <span className="text-large ml-[2px]">{item.price.toLocaleString().replace(",", ".")}</span>
                    </p>
                    <div>Đã bán {item.totalSales}</div>
                </div>
                </CardFooter>
            </Card>
            ))}
        </div>
    </div>
  );
}