import { CHANGEORDERADDRESS, CREATEADDRESS, DELETEADDRESS, GETUSERADDRESS, SETDEFAULTADDRESS, UPDATEADDRESS } from "@/api/User";
import Logout from "@/components/logout";
import { OrderDetail } from "@/interface/order";
import { UserAddress, UserAddressReq } from "@/interface/user";
import { Button, Chip, cn, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, RadioGroup, RadioProps, ScrollShadow, useRadio, VisuallyHidden } from "@nextui-org/react";
import { set } from "date-fns";
import { is } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import { useParams } from "react-router-dom";

interface AddressControllerProps {
  isOpen: boolean;
  onOpenChange: () => void;
  currentAddress: UserAddress | null;
  setOrder: React.Dispatch<React.SetStateAction<OrderDetail | null>>;
  setCurrentAddress: React.Dispatch<React.SetStateAction<UserAddress | null>>;
}

interface CustomRadioProps extends RadioProps {
  address: UserAddress;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setEditAddressData: React.Dispatch<React.SetStateAction<UserAddress | null>>;
}

export const CustomRadio = ({ address, setEditMode, setEditAddressData, ...props }: CustomRadioProps) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:bg-content2 flex-row justify-between",
        "w-full cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-[#ed5c02]"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div className="flex items-center gap-4">
        <span
          {...getWrapperProps()}
          className={cn(
            "flex items-center justify-center w-[22px] h-[22px] p-1 border-default rounded-full border-2 transition-colors",
            isSelected && "border-[#ed5c02]"
          )}
        >
          <span
            {...getControlProps()}
            className={cn(
              "w-[10px] h-[10px] rounded-full transition-colors",
              isSelected && "bg-[#ed5c02]"
            )}
          />
        </span>
        <div {...getLabelWrapperProps()}>
          {children && (
            <span {...getLabelProps()}>
              {children}
              {address.isDefault && (
                <Chip className="ml-3 bg-[#ed5c02]" color="default" size="sm">
                  Mặc định
                </Chip>
              )}
            </span>
          )}
          {description && (
            <>
              <span className="text-small text-foreground opacity-70">
                {description.toString().split("_")[0]}
              </span>
              <span className="text-small text-foreground opacity-70">
                {description.toString().split("_")[1]}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <Button
          className="bg-[#ed5c02]"
          size="sm"
          onPress={() => {
            setEditMode(true);
            setEditAddressData(address);
          }}
        >
          Cập nhật
        </Button>
      </div>
    </Component>
  );
};

export const AddressController: React.FC<AddressControllerProps> = ({
  isOpen,
  onOpenChange,
  currentAddress,
  setOrder,
  setCurrentAddress,
}) => {
  const initCreateAddressData: UserAddressReq = {
    name: "",
    phone: "",
    address: "",
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [handleSetDefaultLoading, setHandleSetDefaultLoading] = useState<boolean>(false);
  const [handleChangeAddressLoading, setHandleChangeAddressLoading] = useState<boolean>(false);
  const [addressSelected, setAddressSelected] = useState<string | undefined>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editAddressData, setEditAddressData] = useState<UserAddress | null>(null);
  const [createAddressData, setCreateAddressData] = useState<UserAddressReq>(initCreateAddressData);
  const [address, setAddress] = useState<UserAddress[]>([]);
  const { orderId } = useParams();

  const fetchUserAddress = async() => {
    try {
      const result = await GETUSERADDRESS({
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const address = result.res.data;

        if (address.length === 0) return;

        setAddress(address);
      } else {
        if (result.statusCode === 401) {
          Logout();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(!isOpen) return;
    if (isLoading || !localStorage.token) return;
    setIsLoading(true);
    setAddressSelected(currentAddress?.id);
    fetchUserAddress();
  }, [isOpen]);

  function checkDefaultAddress() {
    return addressSelected == address.find(x => x.isDefault)?.id;
  }

  const setDefaultAddress = async() => {
    if (addressSelected == null || handleSetDefaultLoading) return;
    setHandleSetDefaultLoading(true);
    try {
      const result = await SETDEFAULTADDRESS({
        addressId: addressSelected,
        token: localStorage.token,
      })

      if (result.isSuccess && result.res != null) {
        const addressId = result.res.data;

        setAddressSelected(addressId.id);
        setAddress(
          address.map((item) => {
            if (item.id === addressId.id) {
              item.isDefault = true;
            } else {
              item.isDefault = false;
            }
            return item;
          }),
        );
        toast.success("Đã thay đổi địa chỉ mặc định");
      } else {
        if (result.statusCode === 401) {
          Logout();
          toast.error("Hết phiên đăng nhập!");
          return;
        }
        toast.error("Có lỗi khi thay đổi địa chỉ mặc định");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi khi thay đổi địa chỉ mặc định");
    } finally {
      setHandleSetDefaultLoading(false);
    }
  };

  const changOrderAddress = async() => {
    if (
      addressSelected == null ||
      handleChangeAddressLoading ||
      orderId == null
    )
      return;
    setHandleChangeAddressLoading(true);
    try {
      const result = await CHANGEORDERADDRESS({
        orderId: orderId,
        addressId: addressSelected,
        token: localStorage.token,
      })

      if (result.isSuccess && result.res != null) {
        const address = result.res.data;

        setOrder((prev) => {
          if (prev == null) return prev;

          return {
            ...prev,
            userAddress: address,
          };
        });
        setCurrentAddress(address);
        onOpenChange();
        toast.success("Đã thay đổi địa chỉ giao hàng");
      } else {
        if (result.statusCode === 401) {
          Logout();
          toast.error("Hết phiên đăng nhập!");
          return;
        }
        toast.error("Có lỗi khi thay đổi địa chỉ giao hàng");
      }
    } catch(error) {
      console.log(error);
      toast.error("Có lỗi khi thay đổi địa chỉ giao hàng");
    } finally {
      setHandleChangeAddressLoading(false);
    }
  }

  const handleSaveChange = async () => {
    if (editMode) {
      if (editAddressData == null || localStorage.token == null) return;
      var userAddressReq: UserAddressReq = {
        name: editAddressData.name,
        phone: editAddressData.phone,
        address: editAddressData.address,
      };

      const result = await UPDATEADDRESS({
        userAddress: userAddressReq,
        addressId: editAddressData.id,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const address = result.res.data;

        setAddress((prev) => {
          return prev.map((item) => {
            if (item.id === address.id) {
              return address;
            }

            return item;
          });
        });
        setEditMode(false);
        setEditAddressData(null);
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        if (result.statusCode === 401) {
          Logout();
          toast.error("Hết phiên đăng nhập!");
        } else {
          toast.error("Có lỗi khi cập nhật địa chỉ");
        }
      }
    } else if (createMode) {
      if (createAddressData == null || localStorage.token == null) return;
      const result = await CREATEADDRESS({
        userAddress: createAddressData,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const address = result.res.data;

        setAddress((prev) => {
          return [...prev, address];
        });
        setAddressSelected(address.id);
        setCreateMode(false);
        setCreateAddressData(initCreateAddressData);
        toast.success("Thêm địa chỉ thành công");
      } else {
        if (result.statusCode === 401) {
          Logout();
          toast.error("Hết phiên đăng nhập!");
        } else {
          toast.error("Có lỗi khi thêm địa chỉ");
        }
      }
    }
  }

  function closeModal() {
    setEditMode(false);
    setEditAddressData(null);
    setCreateMode(false);
    setCreateAddressData(initCreateAddressData);
    onOpenChange();
  }

  const handleDeleteAddress = async () => {
    if (addressSelected == null || localStorage.token == null) return;
    const result = await DELETEADDRESS({
      addressId: addressSelected,
      token: localStorage.token,
    });

    if (result.isSuccess && result.res != null) {
      setAddress((prev) => {
        return prev.filter((item) => item.id !== addressSelected);
      });
      setAddressSelected(address[0].id);
      toast.success("Xóa địa chỉ thành công");
    } else {
      if (result.statusCode === 401) {
        Logout();
        toast.error("Hết phiên đăng nhập!");
      } else {
        toast.error("Có lỗi khi xóa địa chỉ");
      }
    }
  }

  return(
    <Modal isOpen={isOpen} onOpenChange={closeModal} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col items-start">
              <span className="mb-2">
                {editMode
                  ? "Cập nhật địa chỉ"
                  : createMode
                    ? "Tạo địa chỉ mới"
                    : "Địa chỉ giao hàng"}
              </span>
              <Divider />
            </ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <ThreeDot color="#FFFFFF" size="medium" text="" textColor="" />
                </div>
              ) : (
                <>
                  {editMode && editAddressData != null ? (
                    <div>
                      <div className="flex flex-col gap-4">
                        <Input
                          placeholder="Họ và tên"
                          type="text"
                          value={editAddressData.name}
                          onChange={(event) => {
                            setEditAddressData({
                              ...editAddressData,
                              name: event.target.value,
                            });
                          }}
                        />
                        <Input
                          placeholder="Số điện thoại"
                          type="text"
                          value={editAddressData.phone}
                          onChange={(event) => {
                            setEditAddressData({
                              ...editAddressData,
                              phone: event.target.value,
                            });
                          }
                        }/>
                        <Input
                          placeholder="Địa chỉ"
                          type="text"
                          value={editAddressData.address}
                          onChange={(event) =>
                            setEditAddressData({
                              ...editAddressData,
                              address: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : createMode ? (
                    <div>
                      <div className="flex flex-col gap-4">
                        <Input
                          placeholder="Họ và tên"
                          type="text"
                          value={createAddressData.name}
                          onChange={(event) => {
                            setCreateAddressData({
                              ...createAddressData,
                              name: event.target.value
                            });
                          }}
                        />
                        <Input
                          placeholder="Số điện thoại"
                          type="text"
                          value={createAddressData.phone}
                          onChange={(event) => {
                            setCreateAddressData({
                              ...createAddressData,
                              phone: event.target.value
                            });
                          }}
                        />
                        <Input
                          placeholder="Địa chỉ"
                          type="text"
                          value={createAddressData.address}
                          onChange={(event) => {
                            setCreateAddressData({
                              ...createAddressData,
                              address: event.target.value
                            });
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <ScrollShadow
                      hideScrollBar 
                      offset={100}
                      orientation="horizontal" 
                      className="max-h-[550px]"
                    >
                      <RadioGroup
                        className="flex flex-row gap-4 w-full"
                        defaultValue={addressSelected}
                        orientation="horizontal"
                        onValueChange={(value) => {
                          setAddressSelected(value);
                        }}
                      >
                        {address.map((item, index) => (
                          <CustomRadio key={index} value={item.id} description={`${item.phone}_${item.address}`} address={item} setEditMode={setEditMode} setEditAddressData={setEditAddressData}>
                            {item.name}
                          </CustomRadio>
                        ))}
                      </RadioGroup> 
                    </ScrollShadow>
                  )}
                </>
              )}
            </ModalBody>
            {editMode || createMode ? (
              <ModalFooter>
                <Button
                  onPress={() => {
                    setEditMode(false);
                    setEditAddressData(null);
                    setCreateMode(false);
                  }}
                >
                  Quay lại
                </Button>
                <Button className="bg-[#ed5c02]" onPress={handleSaveChange}>Lưu thay đổi</Button>
              </ModalFooter>
            ) : (
              <ModalFooter className="flex justify-center items-center">
                <Button
                  color="danger"
                  isDisabled={
                    addressSelected == null ||
                    address.find((x) => x.id == addressSelected)?.isDefault
                  }
                  onPress={handleDeleteAddress}
                >
                  Xóa địa chỉ
                </Button>
                <Button
                  isDisabled={checkDefaultAddress()}
                  onPress={setDefaultAddress}
                  isLoading={handleSetDefaultLoading}
                >
                  Đặt làm địa chỉ mặc định
                </Button>
                <Button onPress={() => setCreateMode(!createMode)} color="primary">Thêm địa chỉ mới</Button>
                <Button onPress={changOrderAddress} isLoading={handleChangeAddressLoading} color="success">Xác nhận</Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  ); 
};