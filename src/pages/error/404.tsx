import NonFooterLayout from "@/layouts/non-footer";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";

export default function NotFound404() {
  return (
    <NonFooterLayout>
        <div className="flex flex-col justify-center items-center pt-20 gap-4">
          <Toaster position="bottom-left" reverseOrder={false} />
          <img src="./404.svg" alt="404" className="w-1/2" onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: "none" }}/>
          <span className="text-[#102530] text-xl">Oops, không thể tìm thấy trang này!</span>
          <Button as={Link} href="/">
            <span className="flex flex-row items-center gap-2">
              <span>Quay lại trang chủ</span>
            </span>
          </Button>
        </div>
    </NonFooterLayout>
  );
}