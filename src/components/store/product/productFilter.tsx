import { GETALLPRODUCTS } from "@/api/Store";
import { ListProduct } from "@/interface/store";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@nextui-org/link";

interface FilterBarProps {
  currentCategory: string | null;
  currentSubCategory: string | null;
  keyWord: string | null;
}

export function ProductFilter({
  currentCategory,
  currentSubCategory,
  keyWord
}: FilterBarProps) {
  const [products, setProducts] = useState<ListProduct[]>([]);
  const [isLoading, setIsLoadingState] = useState<boolean>(false);
  const pageSize = 8;
  const lastProductIdRef = useRef<string | null>(null);
  const hasMoreRef = useRef<boolean>(true);
  const loadedProductsRef = useRef<Set<string>>(new Set());

  const fetchProducts = async (lastProductId: string | null) => {
    if (isLoading || !hasMoreRef.current || !localStorage.token) return;
    setIsLoadingState(true);
    try {
      const result = await GETALLPRODUCTS({
        PageSize: pageSize,
        lastPetStoreProductId: lastProductId || "",
        category: currentCategory || "",
        subCategory: currentSubCategory || "",
        keyword: keyWord || "",
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const newProducts = result.res.data;
        const filteredProducts = newProducts.filter(
          (product) => !loadedProductsRef.current.has(product.id)
        );

        if (filteredProducts.length > 0) {
          setProducts((prev) => [...prev, ...filteredProducts]);
          lastProductIdRef.current = filteredProducts[filteredProducts.length - 1].id;
          filteredProducts.forEach((product) => loadedProductsRef.current.add(product.id));
        }

        if (filteredProducts.length === 0 || newProducts.length < pageSize) {
          hasMoreRef.current = false;
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      hasMoreRef.current = false;
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      if (!isLoading && hasMoreRef.current) {
        const lastPostId = lastProductIdRef.current;
        fetchProducts(lastPostId);
      }
    }
  };

  useEffect(() => {
    // Khi tham số thay đổi, reset lại trạng thái để load lại sản phẩm mới
    setProducts([]);
    loadedProductsRef.current.clear();
    lastProductIdRef.current = null;
    hasMoreRef.current = true; // reset trạng thái có thể tải thêm

    fetchProducts(null);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentCategory, currentSubCategory, keyWord]); // Lắng nghe các thay đổi của tham số filter

  return (
    <div className="flex flex-col items-center gap-2 justify-center">
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {products && products.map((item, index) => (
          <Card
            as={Link}
            href={`/stores/product/${item.id}`}
            shadow="sm"
            className="min-w-[300px] max-w-[300px] h-[430px] p-0"
            key={index}
            isPressable
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
              <b className="text-large line-clamp-2">{item.name}</b>
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
        {products.length === 0 && (
            <Card className="relative max-w-[1225px] w-full max-h-[475px] h-auto rounded-xl">
                <CardBody className="flex justify-center items-center text-gray-500">
                Không tìm thấy sản phẩm nào.
                </CardBody>
            </Card>
        )}
      </div>
    </div>
  );
}
