import { useEffect, useRef, useState } from "react";

export function Banner() {
    const [activeIndex, setActiveIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const showButton = useRef<boolean>(false);
  const progressDuration = 8000; // Thời gian chạy đầy progress bar (7 giây)
  const images = [
    "https://firebasestorage.googleapis.com/v0/b/meowwoofsocial-75790.appspot.com/o/banner%2F1.png?alt=media&token=c3d38a39-ef9a-4a73-b0ff-ea4584b42d2f",
    "https://firebasestorage.googleapis.com/v0/b/meowwoofsocial-75790.appspot.com/o/banner%2F8.png?alt=media&token=e3dd0aed-d9a4-4756-bd96-3521d6919e86",
    "https://firebasestorage.googleapis.com/v0/b/meowwoofsocial-75790.appspot.com/o/banner%2F2.png?alt=media&token=e3b59713-785a-4821-a28b-2cbb9c16eec9",
    "https://firebasestorage.googleapis.com/v0/b/meowwoofsocial-75790.appspot.com/o/banner%2F4.png?alt=media&token=a53ec937-fa40-404d-bd89-72b025b20e46",
    "https://firebasestorage.googleapis.com/v0/b/meowwoofsocial-75790.appspot.com/o/banner%2F5.png?alt=media&token=bf8d7ed4-09f4-47e0-b7ff-e5d049cc4c91",
  ];
  const length = images.length;

  useEffect(() => {
    let interval: NodeJS.Timeout; // Khai báo biến interval
    let resetTimeout: NodeJS.Timeout; // Khai báo biến resetTimeout

    // Chỉ chạy interval nếu progressValue chưa đạt 100%
    if (progressValue < 100) {
      interval = setInterval(() => {
        setProgressValue((prevProgress) => {
          return Math.min(prevProgress + (100 / (progressDuration / 70)), 100); // Cập nhật progress
        });
      }, 70); // Cập nhật mỗi 70ms
    } else {
      // Nếu progressValue đạt 100%
      setActiveIndex((prevIndex) => (prevIndex + 1) % length); // Chuyển ảnh
      setProgressValue(0); // Reset progress về 0

      // Đợi 1 giây trước khi bắt đầu tăng lại progress
      resetTimeout = setTimeout(() => {
        setProgressValue(0); // Chỉ cần set lại để bắt đầu lại
      }, 1000); // Đợi 1 giây
    }

    return () => {
      clearInterval(interval); // Dọn dẹp interval khi component unmount
      clearTimeout(resetTimeout); // Dọn dẹp timeout khi component unmount
    };
  }, [progressValue, length, progressDuration]);

  // Hàm để chuyển hình và reset progressValue về 0
  const handleImageChange = (newIndex: number) => {
    setActiveIndex(newIndex);
    setProgressValue(0); // Reset progress về 0 ngay lập tức khi chuyển hình
  };

  const handleMouseEnter = () => {
    showButton.current = true;
  }

  const handleMouseLeave = () => {
    showButton.current = false;
  }
  
  return (
    <div className="relative max-w-[1225px] h-[200px] w-full overflow-hidden rounded-xl" onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
            transform: `translateX(-${activeIndex * 100}%)`, // Lướt qua dựa trên activeIndex
        }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`image${index + 1}`}
            className="w-full flex-shrink-0 object-cover"
            style={{ width: "100%", height: "200px" }} // Điều chỉnh kích thước hình ảnh
          />
        ))}
      </div>
      {/* Nút điều hướng nằm trên hình */}
      {showButton.current && (
        <>
          <button 
            onClick={() => handleImageChange((activeIndex - 1 + length) % length)} 
            className="absolute left-4 top-1/2 w-10 h-10 transform -translate-y-1/2 bg-black/50 text-white rounded-full z-10"
          >
            ←
          </button>
          <button 
            onClick={() => handleImageChange((activeIndex + 1) % length)} 
            className="absolute right-4 top-1/2 w-10 h-10 transform -translate-y-1/2 bg-black/50 text-white rounded-full z-10"
          >
            →
          </button>
        </>
      )}
      {/* Điều hướng slide dưới cùng */}
      <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`block h-1 cursor-pointer rounded-2xl transition-all ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"}`}
            onClick={() => handleImageChange(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleImageChange(i);
              }
            }}
          />
        ))}
      </div>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
        <div
          className="h-full bg-[#ed5c02]"
          style={{ width: `${progressValue}%`, transition: 'width 0.1s linear' }}
      />
      </div>
    </div>
  );
}