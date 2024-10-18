import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import React Router hooks
import "../styles/slider.css"; // Giả sử bạn có CSS cho slider

interface ImageViewProps {
  images: {
    id: string;
    attachment: string;
  }[];
}

export const ImageView: React.FC<ImageViewProps> = ({ images }) => {
  const { postId, attachmentId } = useParams<{ postId: string; attachmentId: string }>(); // Lấy postId và attachmentId từ URL
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Khi `attachmentId` thay đổi, cập nhật `currentIndex` tương ứng với vị trí của ảnh
  useEffect(() => {
    const index = images.findIndex((image) => image.id === attachmentId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [attachmentId, images]);

  // Xử lý khi chuyển tới slide tiếp theo
  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    navigate(`/post/${postId}/attachment/${images[nextIndex].id}`); // Cập nhật attachmentId trong URL
  };

  // Xử lý khi quay lại slide trước
  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    navigate(`/post/${postId}/attachment/${images[prevIndex].id}`); // Cập nhật attachmentId trong URL
  };

  if (images.length === 0) {
    return <div>No images to display</div>;
  }

  return (
    <div className="slider w-full h-full flex items-center justify-center overflow-hidden relative">
      <div className="image-container relative w-full h-full">
        <img
          src={images[currentIndex].attachment} // Hiển thị ảnh hiện tại
          alt={`Slide ${currentIndex}`}
          className="slider-image w-full h-full object-contain py-5"
        />

        {images.length > 1 && (
          <>
            {/* Nút quay lại */}
            <button
              onClick={prevSlide}
              className="prev-button w-14 h-14 bg-gray-700 text-white absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              ❮
            </button>

            {/* Nút tiếp theo */}
            <button
              onClick={nextSlide}
              className="next-button w-14 h-14 bg-gray-700 text-white absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* Phần hiển thị số thứ tự hình hiện tại */}
      {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-3 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div> */}
    </div>
  );
};
