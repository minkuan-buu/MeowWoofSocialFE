import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";

import { LOGIN, REGISTER } from "@/api/Auth";
import { RiLockPasswordLine } from "react-icons/ri";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icons";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaPhone } from "react-icons/fa";

import toast, { Toaster } from 'react-hot-toast';

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Bắt buộc"),
      password: Yup.string().min(6, "Must be at least 6 characters").required("Bắt buộc"),
    }),
    onSubmit: async (value) => {
      setOnLoading(true);
      // Toast for login process
      toast.promise(callAPILogin(value.email, value.password), {
        loading: "Đang đăng nhập...",
        success: <b>Đăng nhập thành công!</b>,
        error: (err) => <b>{err.message || 'Có lỗi xảy ra khi đăng ký.'}</b>,
      });
      async function callAPILogin(email: string, password: string) {
        try {
          const response = await LOGIN({
            email: email,
            password: password,
          });
      
          if (response.isSuccess && 'data' in response.res!) {
            const successResponse = response.res.data;
            setOnLoading(false);
            localStorage.setItem("id", successResponse.id);
            localStorage.setItem("token", successResponse.token);
            localStorage.setItem("name", successResponse.name);
            localStorage.setItem("role", successResponse.role);
            setTimeout(() =>{
              window.location.href = "/"
            }, 1000);
            return successResponse;
          } else if ('message' in response.res!) {
            const errorResponse = response.res as { message: string };
            setOnLoading(false);
            if(errorResponse.message == "Wrong Password!"){
              errorResponse.message = "Sai mật khẩu!";
            } else if(errorResponse.message == "Account Not Found!"){
              errorResponse.message = "Tài khoản không tồn tại!";
            }
            throw new Error(errorResponse.message); // Ném lỗi để toast xử lý
          } else {
            setOnLoading(false);
            throw new Error("Không thể đăng nhập!"); // Lỗi chung
          }
        } catch (error: any) {
          setOnLoading(false);
          throw new Error(error.message || "Có lỗi xảy ra");
        }
      }
    },
  });

  return (
    <div>
      <Toaster />
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          name="email"
          startContent={<HiOutlineMail/>}
          placeholder="Nhập email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.errors.email && formik.touched.email && (
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        )}
        <Input
          className="mt-3"
          label="Mật khẩu"
          name="password"
          placeholder="Nhập mật khẩu"
          startContent={<RiLockPasswordLine />}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.password && formik.touched.password && (
          <p style={{ color: "red" }}>{formik.errors.password}</p>
        )}
        <Button
          fullWidth
          color="primary"
          id="send-code-button"
          isLoading={onLoading}
          style={{ marginTop: "2vh", marginBottom: "2vh" }}
          type="submit"
        >
          Tiếp tục
        </Button>
      </form>
    </div>
  );
}

export const RegisterForm = ({
  setRegistering,
  IsRegistering,
}: {
  setRegistering: Dispatch<SetStateAction<boolean>>;
  IsRegistering: boolean;
}) => {
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const toggleVisibilityPassword = () => setIsVisiblePassword(!isVisiblePassword);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);
  const toggleVisibilityConfirmPassword = () => setIsVisibleConfirmPassword(!isVisibleConfirmPassword);
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(12, "Tên ít nhất có 12 ký tự").required("Bắt buộc"),
      email: Yup.string().email().required(),
      password: Yup.string().min(8, "Mật khẩu ít nhất có 8 ký tự").required("Bắt buộc"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu không trùng khớp")
        .required("Bắt buộc"),
      phone: Yup.string()
        .length(10, "Số điện thoại không đúng định dạng")
        .required("Bắt buộc"),
    }),
    onSubmit: async (value) => {
      setOnLoading(true);
      // Toast for login process
      toast.promise(callAPIRegister(value.name, value.email, value.password, value.phone), {
        loading: "Đang đăng ký...",
        success: <b>Đăng ký thành công!</b>,
        error: (err) => <b>{err.message || 'Có lỗi xảy ra khi đăng ký.'}</b>,
      });

      async function callAPIRegister(name: string, email: string, password: string, phone: string) {
        try {
          const response = await REGISTER({
            name: name,
            email: email,
            password: password,
            phone: phone,
          });
      
          if (response.isSuccess) {
            setOnLoading(false);
            setTimeout(() =>{
              setRegistering(!IsRegistering);
            }, 1000);
          } else if (!response.isSuccess && 'message' in response.res!) {
            const errorResponse = response.res as { message: string };
            setOnLoading(false);
            if(errorResponse.message == "Email Is Existed!"){
              errorResponse.message = "Email đã tồn tại!";
            }
            throw new Error(errorResponse.message); // Ném lỗi để toast xử lý
          } else {
            setOnLoading(false);
            throw new Error("Không thể đăng ký lúc này!"); // Lỗi chung
          }
        } catch (error: any) {
          setOnLoading(false);
          throw new Error(error.message || "Có lỗi xảy ra");
        }
      }
      // const response = await REGISTER({
      //   name: value.name,
      //   email: value.email,
      //   password: value.password,
      //   phone: value.phone,
      // });

      // if (response.isSuccess && response.res) {
      //   setOnLoading(false);
      // } else {
      //   setOnLoading(false);
      //   console.log("Login failed");
      // }
    },
  });

  return (
    <div>
      <Toaster />
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Tên của bạn"
          name="name"
          placeholder="Nhập tên"
          startContent={<MdOutlineDriveFileRenameOutline />}
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.errors.name && formik.touched.name && (
          <p style={{ color: "red" }}>{formik.errors.name}</p>
        )}
        <Input
          className="mt-3"
          label="Email"
          name="email"
          startContent={<HiOutlineMail/>}
          placeholder="Nhập email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.errors.email && formik.touched.email && (
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        )}
        <Input
          className="mt-3"
          label="Mật khẩu"
          name="password"
          placeholder="Nhập mật khẩu"
          startContent={<RiLockPasswordLine />}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibilityPassword} aria-label="toggle password visibility">
              {isVisiblePassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisiblePassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.errors.password && formik.touched.password && (
          <p style={{ color: "red" }}>{formik.errors.password}</p>
        )}
        <Input
          className="mt-3"
          label="Xác thực mật khẩu"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          startContent={<RiLockPasswordLine />}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirmPassword} aria-label="toggle password visibility">
              {isVisibleConfirmPassword ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisibleConfirmPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
        />
        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
          <p style={{ color: "red" }}>{formik.errors.confirmPassword}</p>
        )}
        <Input
          className="mt-3"
          label="Số điện thoại của bạn"
          name="phone"
          placeholder="Nhập số điện thoại"
          startContent={
            <div style={{ transform: "scaleX(-1)" }}>
              <FaPhone />
            </div>
          }
          value={formik.values.phone}
          onChange={formik.handleChange}
        />
        {formik.errors.phone && formik.touched.phone && (
          <p style={{ color: "red" }}>{formik.errors.phone}</p>
        )}
        <Button
          fullWidth
          color="primary"
          id="send-code-button"
          isLoading={onLoading}
          style={{ marginTop: "2vh", marginBottom: "2vh" }}
          type="submit"
        >
          Tiếp tục
        </Button>
      </form>
    </div>
  );
}