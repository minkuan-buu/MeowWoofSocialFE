import { BOOKING } from "@/api/Booking";
import { GETPETSTORE } from "@/api/PetStore";
import { GETUSERPET } from "@/api/UserPet";
import Logout from "@/components/logout";
import { PetStore } from "@/interface/petStore";
import { PetStoreReq } from "@/interface/petstoreservices";
import { UserPet } from "@/interface/userPet";
import NonFooterLayout from "@/layouts/non-footer";
import { Card, CardBody, Select, SelectItem, Input, Button } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface PetCareBookingDetail {
  petId: string;
  typeTakeCare: string;
  typeOfDisease: string;
  bookingDate: string; // Sử dụng kiểu chuỗi thay vì Date
}

interface PetStoreReq {
  petStoreId: string;
  petCareBookingDetails: PetCareBookingDetail[]; // Change to array type
}
  

export default function ServicePageShop() {
  const { petStoreId } = useParams();
  const [petStore, setPetStore] = useState<PetStore>();
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const bookingDetailsRef = useRef<PetCareBookingDetail[]>([]); // Lưu danh sách đặt lịch
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentBooking, setCurrentBooking] = useState<PetCareBookingDetail>({
    petId: "",
    typeTakeCare: "",
    typeOfDisease: "",
    bookingDate: new Date().toISOString(), // Chuyển đổi sang ISO string
  });

  useEffect(() => {
    if (petStoreId == null) {
      window.location.href = "/";
      return;
    }

    const fetchPetStore = async () => {
      const result = await GETPETSTORE({
        petStoreId: petStoreId,
        token: localStorage.getItem("token") || "",
      });

      if (result.isSuccess && result.res != null) {
        setPetStore(result.res.data);
        setCurrentBooking((prev) => ({
          ...prev,
          typeTakeCare: result.res.data.typeStore,
        }));
      } else {
        if (result.statusCode === 401) {
          Logout();
        }
      }
    };

    const fetchUserPet = async () => {
      const result = await GETUSERPET({
        token: localStorage.getItem("token") || "",
      });

      if (result.isSuccess && result.res != null) {
        setUserPets(result.res.data);
      } else {
        if (result.statusCode === 401) {
          Logout();
        }
      }
    };

    fetchPetStore();
    fetchUserPet();
  }, [petStoreId]);

  const handleAddBooking = () => {
    console.log("Current Booking:", currentBooking);
    if (
      currentBooking.petId &&
      currentBooking.typeTakeCare &&
      currentBooking.typeOfDisease &&
      currentBooking.bookingDate
    ) {
      bookingDetailsRef.current.push({ ...currentBooking }); // Thêm vào danh sách
      setCurrentBooking({
        petId: "",
        typeTakeCare: petStore?.typeStore || "",
        typeOfDisease: "",
        bookingDate: new Date().toISOString(), // Cập nhật lại ngày giờ dưới dạng ISO string
      });
    }
  };

  const handleSubmit = async () => {
    if (petStoreId == null || isLoading) return;
    setIsLoading(true);
    const requestPayload: PetStoreReq = {
      petStoreId: petStoreId,
      petCareBookingDetails: bookingDetailsRef.current.map((detail) => ({
        ...detail,
        bookingDate: new Date(detail.bookingDate), // Chuyển đổi bookingDate thành chuỗi ISO
      })),
    };

    if (requestPayload.petCareBookingDetails.length === 0) return;

    await BOOKING(requestPayload, localStorage.getItem("token") || "");

    console.log("Request Payload:", requestPayload);
    // Thực hiện gửi request tới API
  };

  return (
    <NonFooterLayout>
      <div className="flex justify-center pt-5 pb-20">
        <div className="flex flex-col gap-4">
          <span className="text-4xl p-4 font-bold text-[#102530]">Đặt lịch</span>
          {petStore && (
            <Card className="w-[1225px]">
              <CardBody>
                <div className="flex flex-row gap-4">
                  <div>
                    <img
                      width={300}
                      height={100}
                      src={petStore.attachment}
                      alt={petStore.name}
                    />
                  </div>
                  <div>
                    <span className="text-4xl">{petStore.name}</span>
                    <p className="text-xl">{petStore.description}</p>
                    <span className="text-xl">
                      Giá đặt lịch: <span className="text-3xl text-[#ed5c02]">₫200.000</span>
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Form thêm thông tin */}
          <Card className="text-xl">
            <CardBody className="p-4">
              <div className="mt-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Thêm thú cưng đặt lịch</h2>
                {userPets && (
                  <Select
                    label="Chọn thú cưng"
                    placeholder="Chọn thú cưng"
                    onChange={(e) =>
                      setCurrentBooking((prev) => ({
                        ...prev,
                        petId: e.target.value, // Giá trị trả về từ Select là chuỗi
                      }))
                    }
                    value={currentBooking.petId}
                  >
                    <SelectItem key="default" value="">
                      Chọn thú cưng
                    </SelectItem>
                    {userPets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <Input
                  label="Loại chăm sóc"
                  placeholder="Nhập loại chăm sóc"
                  value={petStore?.typeStore}
                  defaultValue={petStore?.typeStore}
                  isDisabled
                  onChange={(e) =>
                    setCurrentBooking((prev) => ({ ...prev, typeTakeCare: e.target.value }))
                  }
                />
                <Input
                  label="Tình trạng bệnh lý"
                  placeholder="Nhập tình trạng bệnh lý"
                  value={currentBooking.typeOfDisease}
                  onChange={(e) =>
                    setCurrentBooking((prev) => ({ ...prev, typeOfDisease: e.target.value }))
                  }
                />
                <Input
                  label="Ngày và giờ đặt lịch"
                  type="datetime-local"
                  value={currentBooking.bookingDate.slice(0, 16)} // Lấy phần "YYYY-MM-DDTHH:mm"
                  onChange={(e) =>
                    setCurrentBooking((prev) => ({
                      ...prev,
                      bookingDate: new Date(e.target.value).toISOString(),
                    }))
                  }
                />

                <Button color="primary" onPress={handleAddBooking}>
                  Thêm thú cưng
                </Button>
              </div>

              {/* Danh sách thú cưng đã thêm */}
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Danh sách thú cưng đã thêm</h2>
                {bookingDetailsRef.current.map((detail, index) => (
                  <div key={index} className="border p-4 mb-2">
                    <p>
                      <strong>Thú cưng:</strong>{" "}
                      {userPets.find((pet) => pet.id === detail.petId)?.name}
                    </p>
                    <p>
                      <strong>Loại chăm sóc:</strong> {detail.typeTakeCare}
                    </p>
                    <p>
                      <strong>Tình trạng bệnh lý:</strong> {detail.typeOfDisease}
                    </p>
                    <p>
                      <strong>Ngày đặt lịch:</strong>{" "}
                      {`${detail.bookingDate.split("T")[0]} ${detail.bookingDate.split("T")[1].slice(0, 5)}`}
                    </p>
                  </div>
                ))}
                <Button isDisabled={isLoading} color="success" onPress={handleSubmit}>
                  Gửi yêu cầu
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </NonFooterLayout>
  );
}
