import { useEffect, useRef, useState } from "react";

export function Banner() {
    const [activeIndex, setActiveIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const showButton = useRef<boolean>(false);
  const progressDuration = 8000; // Thời gian chạy đầy progress bar (7 giây)
  const images = [
    "https://firebasestorage.googleapis.com/v0/b/meowwoofsocial-75790.appspot.com/o/TI%C3%8AU%20%C4%90%E1%BB%80%20(500%20x%20500%20px)%20(1000%20x%20200%20px).png?alt=media&token=9b2e6f81-0733-4e75-9910-6149784af430",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
    "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
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
    <div className="relative max-w-[1000px] h-[200px] w-full overflow-hidden rounded-xl" onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
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