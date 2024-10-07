import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { LoginForm, RegisterForm } from "@/components/authentication-form";
import DefaultLayout from "@/layouts/default";


export default function DocsPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [opacity, setOpacity] = useState("opacity-100");
  const handleToggle = () => {
    setOpacity("opacity-0");
    handleFaded();
  };

  useEffect(() =>{
    var token = localStorage.getItem("token");

    if (token != null) {
      window.location.href = "/";
    }
  }, []);

  const handleFaded = () => {
    setTimeout(() => {
      setIsRegistering(!isRegistering);
      setOpacity("opacity-100");
    }, 500);
  }

  return (
    <DefaultLayout>
      <section
        className="relative grid grid-cols-10 overflow-hidden"
        style={{ backgroundColor: "#e5dfca" }}
      >
        {/* Image Section */}
        <div
          className={`transition-opacity duration-700 ease-in-out col-span-6 max-h-full ${isRegistering ? `order-last translate-x-[0] ${opacity}` : `translate-x-0 ${opacity}`}`}
        >
          {isRegistering ? (
            <img src="dog-cat-sit.jpg" alt="" className="min-w-full" />
          ) : (
            <img src="dog-cat-under-sheet.jpg" alt="" className="min-w-full" />
          )}
        </div>

        {/* Form Section */}
        <div
          className={`flex justify-center col-span-4 transition-opacity duration-700 ease-in-out ${isRegistering ? `translate-x-0 ${opacity}` : `translate-x-0 ${opacity}`}`}
        >
          <div
            className={`w-96 ${!isRegistering ? "mt-52" : "mt-32"} font-literata font-bold`}
          >
            <span className="text-4xl" style={{ color: "#102530" }}>
              {isRegistering ? "Đăng ký" : "Đăng nhập"}
            </span>
            <div className="mt-10">
              {isRegistering ? (
                <RegisterForm setRegistering={setIsRegistering} IsRegistering={isRegistering} />
              ) : (
                <LoginForm />
              )}
            </div>
            <span style={{ color: "#102530" }} className="mr-4">
              {isRegistering ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
            </span>
            <Button
              style={{ backgroundColor: "#ed5c02", color: "#FFF" }}
              onClick={handleToggle}
            >
              {isRegistering ? "Quay trở lại đăng nhập" : "Đăng ký ngay"}
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}