import { GETPETSTORESERVICES } from "@/api/Services";
import Logout from "@/components/logout";
import { PetStoreServices } from "@/interface/petstoreservices";
import NonFooterLayout from "@/layouts/non-footer";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import { useLocation } from "react-router-dom";

export default function Services() {
  const location = useLocation();
  const [currentType, setCurrentType] = useState<string | null>(null);
  const queryParams = new URLSearchParams(location.search);
  const [services, setServices] = useState<PetStoreServices[]>([]);

  useEffect(() => {
    const typeFromUrl = queryParams.get("type");
    setCurrentType(typeFromUrl);
  }, [location.search]);

  useEffect(() => {
    if (currentType != null) {
      const fetchServices = async () => {
        const result = await GETPETSTORESERVICES({
          type: currentType,
          token: localStorage.getItem("token") || "",
        })

        if (result.isSuccess && result.res != null) {
          setServices(result.res.data);
        } else {
          if (result.statusCode === 401) {
            Logout();
          }
        }
      }

      fetchServices();
    }
  }, [currentType]);

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
            className="text-xl text-yellow-500"
          />
        ))}

        {/* Sao nửa */}
        {hasHalfStar && (
          <TiStarHalfOutline className="text-xl text-yellow-500" />
        )}

        {/* Sao rỗng */}
        {[...Array(emptyStars)].map((_, index) => (
          <TiStarOutline
            key={`empty-${index}`}
            className="text-xl text-gray-400"
          />
        ))}
      </div>
    );
  };

  return(
    <NonFooterLayout>
      {currentType ? (
        <>
          <div className="flex justify-center pt-5 pb-20">
            <div className="flex flex-col gap-4">
              <span className="text-2xl font-bold text-[#102530]">Dịch vụ {currentType}</span>
              <div className="gap-4">
                {services.map((service, index) => (
                  <Card as={Link} href={`/services/shop/${service.id}`} key={index} className="hover:cursor-pointer min-w-[1220px]">
                  <CardBody className="flex flex-row overflow-visible p-0">
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="300"
                      height="200"
                      alt={service.name}
                      src={service.attachment}
                    />
                    <div className="flex flex-col gap-2 ml-5 mt-5">
                      <div className="flex flex-row items-center justify-between"> {/* Dùng justify-between để căn đều */}
                        <span className="text-3xl font-bold">{service.name}</span>
                        <span className="ml-5">{renderStars(service.averageRating)}</span>
                      </div>
                
                      <span className="text-lg">{service.description}</span>
                      <span className="text-2xl">{"200000".toLocaleString().replace(",", ".")} VNĐ</span>
                    </div>
                  </CardBody>
                </Card>
                
                
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center pt-5 pb-20">
            <div className="flex flex-col gap-4">
            <Card className="relative max-w-[1225px] p-4">
                <CardBody>
                <h1 className="text-4xl font-bold text-center">Dịch vụ của chúng tôi</h1>
                <p className="text-center mt-5 text-lg text-opacity-60">MeowWoofSocial hợp tác với các bên thứ ba để cung cấp các dịch vụ về chăm sóc sắc đẹp, sức khỏe dành cho chó mèo</p>
                </CardBody>
            </Card>
            <div className="flex flex-row gap-2">
                <Card as={Link} href="/services?type=Spa" className="min-w-[300px] max-w-[300px] h-[430px] p-0 hover:cursor-pointer">
                <CardBody className="overflow-visible p-0">
                    <Image
                        shadow="sm"
                        radius="lg"
                        width="100%"
                        alt="Spa cho thú cưng"
                        className="w-full object-cover h-[300px]"
                        src="https://img.freepik.com/premium-vector/steam-dog-bath-icon-outline-vector-spa-pet-shower-wash_96318-108770.jpg"
                    />
                </CardBody>
                <CardFooter className="flex flex-col items-start justify-between h-full">
                    <b className="text-2xl line-clamp-2">Spa</b>
                </CardFooter>
                </Card>
                <Card as={Link} href="/services?type=Clinic" className="min-w-[300px] max-w-[300px] h-[430px] p-0 hover:cursor-pointer">
                <CardBody className="overflow-visible p-0">
                    <Image
                        shadow="sm"
                        radius="lg"
                        width="100%"
                        alt="Cham soc suc khoe cho thú cưng"
                        className="w-full object-cover h-[300px]"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ37UelY4I7uan-DyIVd_0V0cExPduEaPB2A&s"
                    />
                </CardBody>
                <CardFooter className="flex flex-col items-start justify-between h-full">
                    <b className="text-2xl line-clamp-2">Chăm sóc sức khỏe</b>
                </CardFooter>
                </Card>
            </div>
            </div>
        </div>
        </>
      )}
    </NonFooterLayout>
  );
}