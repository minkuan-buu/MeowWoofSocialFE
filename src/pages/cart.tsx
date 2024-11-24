import { GETUSERCART } from "@/api/Cart";
import { CREATEORDER } from "@/api/Order";
import Logout from "@/components/logout";
import { title } from "@/components/primitives";
import { InitialCartOrder, UserCart } from "@/interface/cart";
import { CreateOrderReq } from "@/interface/order";
import CartLayout from "@/layouts/cartLayout";
import { Button, Card, CardBody, CardHeader, Checkbox } from "@nextui-org/react";
import { set } from "date-fns";
import { fi } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { RiShoppingBag4Fill } from "react-icons/ri";

export default function CartPage() {
  const [cart, setCart] = useState<UserCart[]>([]);
  const [productCartRequest, setProductCartRequest] = useState<InitialCartOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({}); // Quản lý số lượng sản phẩm theo `cartId`.
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStores, setSelectedStores] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [productCartReqSelected, setProductCartReqSelected] = useState<CreateOrderReq[]>([]);
  const [onLoading, setOnLoading] = useState(false);

  useEffect(() => {
    const handleGetCart = async () => {
      setIsLoading(true);
      try {
        if (!localStorage.token) {
          Logout();
        }

        const result = await GETUSERCART({ token: localStorage.token });

        if (result.isSuccess && result.res) {
          const cartData = result.res;
          setCart(cartData);

          // Chuẩn bị `productCartRequest` và `quantities`:
          const initialRequests: InitialCartOrder[] = [];
          const initialQuantities: Record<string, number> = {};

          cartData.forEach((store) => {
            store.cartItems.forEach((item) => {
              initialRequests.push({
                cartId: item.cartId,
                productItemId: item.productItemId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
              });
              initialQuantities[item.cartId] = item.quantity;
            });
          });

          setProductCartRequest(initialRequests);
          setQuantities(initialQuantities);
        } else if (result.statusCode === 401) {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetCart();
  }, []);

  const handleDecrease = (cartId: string) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      if (updated[cartId] > 1) updated[cartId] -= 1;
      return updated;
    });
  };

  const handleIncrease = (cartId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [cartId]: prev[cartId] + 1,
    }));
  };

  useEffect(() => {
    let total = 0;

    cart.forEach((store) =>
      store.cartItems.forEach((item) => {
        if (selectedItems[item.cartId]) {
          total += item.unitPrice * quantities[item.cartId];
          var itemCart = productCartRequest.find(x => x.cartId === item.cartId);

          if (itemCart) {
            setProductCartReqSelected((prev) => {
              // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách
              const exists = prev.some(
                (item) => item.productItemId === itemCart?.productItemId
              );
          
              // Nếu đã tồn tại, không cần thêm
              if (exists) return prev;
          
              // Nếu chưa tồn tại, thêm vào danh sách
              return [
                ...prev,
                {
                  unitPrice: item.unitPrice,
                  productItemId: itemCart?.productItemId || "",
                  quantity: quantities[item.cartId],
                },
              ];
            });
          }
          
          // Kiểm tra log sau khi cập nhật
          console.log(productCartReqSelected);
          
        }
      })
    );

    setTotalPrice(total);
  }, [selectedItems, quantities]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
  
    const updatedSelectedStores: Record<string, boolean> = {};
    const updatedSelectedItems: Record<string, boolean> = {};
  
    cart.forEach((store) => {
      updatedSelectedStores[store.storeId] = checked;
      store.cartItems.forEach((item) => {
        updatedSelectedItems[item.cartId] = checked;
      });
    });
  
    setSelectedStores(updatedSelectedStores);
    setSelectedItems(updatedSelectedItems);
  };
  
  

  const handleSelectStore = (storeId: string, checked: boolean) => {
    setSelectedStores((prev) => ({
      ...prev,
      [storeId]: checked,
    }));
  
    const updatedSelectedItems = { ...selectedItems };
    const store = cart.find((s) => s.storeId === storeId);
  
    if (store) {
      store.cartItems.forEach((item) => {
        updatedSelectedItems[item.cartId] = checked;
      });
    }
  
    setSelectedItems(updatedSelectedItems);
  
    // Đồng bộ trạng thái tổng (selectAll)
    const allItems = cart.flatMap((store) =>
      store.cartItems.map((item) => updatedSelectedItems[item.cartId])
    );
    const allItemsChecked = allItems.every((checked) => checked);
  
    setSelectAll(allItemsChecked);
  };
  
  

  const handleSelectItem = (cartId: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const updatedSelectedItems = { ...prev, [cartId]: checked };
  
      // Đồng bộ trạng thái của store chứa sản phẩm này
      const updatedSelectedStores = { ...selectedStores };
      cart.forEach((store) => {
        const allItemsChecked = store.cartItems.every(
          (item) => updatedSelectedItems[item.cartId]
        );
  
        updatedSelectedStores[store.storeId] = allItemsChecked; // Nếu tất cả sản phẩm của store được check
      });
  
      setSelectedStores(updatedSelectedStores);
  
      // Đồng bộ trạng thái "tất cả" (selectAll)
      const allItems = cart.flatMap((store) =>
        store.cartItems.map((item) => item.cartId)
      );
      const allItemsChecked = allItems.every((id) => updatedSelectedItems[id]);
  
      setSelectAll(allItemsChecked);
  
      return updatedSelectedItems;
    });
  };

  const BuyButton = async () => {
    if (onLoading) return;
    setOnLoading(true);
    // Gọi API tạo đơn hàng
    try {
      const result = await CREATEORDER({
        product: productCartReqSelected,
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
  

  useEffect(() => {
    // Đồng bộ trạng thái từng store
    const updatedSelectedStores: Record<string, boolean> = {};
    cart.forEach((store) => {
      const allItemsChecked = store.cartItems.every(
        (item) => selectedItems[item.cartId]
      );
      updatedSelectedStores[store.storeId] = allItemsChecked;
    });
    setSelectedStores(updatedSelectedStores);
  
    // Đồng bộ trạng thái tổng (selectAll)
    const allItems = cart.flatMap((store) =>
      store.cartItems.map((item) => item.cartId)
    );
    const allItemsChecked = allItems.every((id) => selectedItems[id]);
  
    setSelectAll(allItemsChecked);
  }, [selectedItems, cart]);  
  
  function FooterSticky({ totalPrice }: { totalPrice: number }) {
    return (
      <footer
        className="sticky bottom-0 border-t border-gray-300 min-h-[100px] p-4 px-[500px] flex items-center justify-between"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Giá tiền */}
        <div className="flex flex-col">
          <p className="text-white font-semibold text-lg">Tổng tiền</p>
          <p className="text-white font-semibold text-3xl">
            ₫{totalPrice.toLocaleString().replace(/,/g, '.')}
          </p>
        </div>
  
        {/* Nút đặt hàng */}
        <Button
          size="lg"
          onClick={BuyButton}
          className="bg-white text-[#ed5c02] hover:text-[#FFF] hover:bg-[#ed5c02] hover:border-[#FFF] text-xl font-bold"
          isDisabled={!Object.values(selectedItems).includes(true)} // Disable nếu không có checkbox nào được chọn
        >
          Đặt hàng
        </Button>
  
      </footer>
    );
  }

  return (
    <CartLayout>
      <main className="flex-grow min-h-full bg-gray-100">
        <section className="bg-[#e5dfca]" style={{ minHeight: "890px" }}>
          <Toaster position="bottom-left" reverseOrder={false} />
          <div className="flex justify-center start-[100px] pt-6">
            <div className="flex flex-col gap-4 min-w-[1420px] h-full">
              <h1 className="text-4xl text-[#102530] font-bold">Giỏ hàng</h1>
              <Card>
                <CardBody className="grid grid-cols-[auto_1fr_200px_210px_110px] items-center gap-4 p-4">
                  <div className="flex justify-center items-center">
                    <Checkbox
                      isSelected={selectAll}
                      onChange={(checked) => handleSelectAll(checked.target.checked)}
                    />
                  </div>
                  <p className="font-medium">Sản phẩm</p>
                  <p>Đơn giá</p>
                  <p>Số lượng</p>
                  <p>Thành tiền</p>
                </CardBody>
              </Card>
              {isLoading ? (
                <p>Đang tải dữ liệu...</p>
              ) : cart?.length > 0 ? (
                <>
                  {cart.map((store) => (
                    <Card key={store.storeId}>
                      <CardHeader>
                        <Checkbox
                          isSelected={selectedStores[store.storeId] || false}
                          onChange={(checked) => handleSelectStore(store.storeId, checked.target.checked)}
                        />
                        <div className="ml-4 flex flex-row items-center gap-2 text-lg">
                          <RiShoppingBag4Fill className="text-[#ed5c02]"/>
                          <p className="font-medium">{store.storeName}</p>
                        </div>
                      </CardHeader>
                      <CardBody>
                        {store.cartItems.map((cartItem) => {
                          const selected = selectedItems[cartItem.cartId] || false;
                          const quantity = quantities[cartItem.cartId] || 1;
                          const totalPrice = cartItem.unitPrice * quantity;

                          return (
                            <div key={cartItem.cartId} className="grid grid-cols-[auto_1fr_185px_280px_100px] items-center mb-4">
                              <Checkbox
                                className="mr-3"
                                isSelected={selected}
                                onChange={(e) => 
                                  handleSelectItem(
                                    cartItem.cartId,
                                    e.target.checked,
                                  )
                                }
                              />
                              <div className="flex gap-4 items-center">
                                <img
                                  src={cartItem.attachment}
                                  alt={cartItem.productName}
                                  className="w-20 h-20 object-cover"
                                />
                                <div>
                                  <p>{cartItem.productName}</p>
                                  <p className="text-gray-400">Loại: {cartItem.productItemName}</p>
                                </div>
                              </div>

                              <p>₫{cartItem.unitPrice.toLocaleString().replace(/,/g, ".")}</p>
                              
                              <div className="flex items-center">
                                <Button
                                  className="!w-12 !h-10 !min-w-0 !p-0 !rounded-full flex items-center justify-center"
                                  onClick={() => handleDecrease(cartItem.cartId)}
                                >
                                  -
                                </Button>
                                <input
                                  value={quantity}
                                  readOnly
                                  className="w-12 text-center"
                                />
                                <Button
                                  className="!w-12 !h-10 !min-w-0 !p-0 !rounded-full flex items-center justify-center"
                                  onClick={() => handleIncrease(cartItem.cartId)}
                                >
                                  +
                                </Button>
                              </div>

                              <p>₫{totalPrice.toLocaleString().replace(/,/g, ".")}</p>
                            </div>
                          );
                        })}
                      </CardBody>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="flex justify-center">
                  <p>Không có sản phẩm nào trong giỏ hàng.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <FooterSticky totalPrice={totalPrice} />
    </CartLayout>
  );
}

