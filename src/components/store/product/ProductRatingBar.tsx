import { ProductRating } from "@/interface/rating";
import { Avatar, Card, CardBody, CardHeader } from "@nextui-org/react";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface ProductRatingProps {
  rating: ProductRating[];
  avgRating: number;
}

export const ProductRatingBar: React.FC<ProductRatingProps> = ({ rating, avgRating }) => {
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

  if (!rating) {
    return (
      <Card className="relative max-w-[1225px] w-full max-h-[475px] h-auto rounded-xl">
        <CardBody className="flex justify-center items-center text-gray-500">
          Chưa có đánh giá nào.
        </CardBody>
      </Card>
    );
  }

  function formatDate(date: Date) {
    return format(new Date(date), "HH:mm dd/MM/yyyy");
  }

  return (
    <Card className="relative max-w-[1225px] w-full max-h-[475px] h-auto rounded-xl p-4">
      <CardHeader className="flex justify-between">
        <h2 className="text-2xl font-semibold">Đánh giá sản phẩm {rating.length > 0 && `(${rating.length})`}</h2>
        {rating.length > 0 ? (
          <div className="flex flex-col">
            <div className="flex flex-row items-end gap-2">
              <span className="text-3xl">{avgRating.toFixed(1)}</span>
              <span className="text-xl">trên 5</span>
            </div>
            <span>{renderStars(avgRating)}</span>
          </div>
        ) : (
          <span>Chưa có đánh giá</span>
        )}
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {rating.map((rating) => (
          <>
            {/* Thông tin người đánh giá */}
            <div className="flex flex-row gap-4">
              <Avatar
                className="w-14 h-14"
                name={rating.author.name}
                size="lg"
                src={rating.author.attachment || undefined}
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">{rating.author.name}</span>

                {/* Hiển thị sao đánh giá */}
                <div>{renderStars(rating.rating)}</div>
                <span className="text-sm text-gray-500">
                  {formatDate(rating.createdAt)} | Phân loại: {rating.productItem.productItemName}
                </span>

                {/* Nội dung đánh giá */}
                <div className="mt-2">
                  <p className={`text-md ${!rating.comment && "text-gray-400"}`}>{rating.comment || "Không có nhận xét."}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </CardBody>
    </Card>
  );
};
