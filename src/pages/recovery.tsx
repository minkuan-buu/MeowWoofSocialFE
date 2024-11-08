import DefaultLayout from "@/layouts/default";
import { Button, Card, CardBody, CardHeader, Input, useDisclosure } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { RESETPASSWORD, SENDOTP, VERIFYOTP } from "@/api/User";
import toast, { Toaster } from "react-hot-toast";
import { LogoutResetPassword } from "@/components/logout";
import { set } from "date-fns";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";

export default function RecoveryPage() {
  const [onLoading, setOnLoading] = useState(false);
  const [isResetingPassword, setIsResetingPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);
  const [isOTPTyping, setIsOTPTyping] = useState(false);
  const [isTypingPassword, setTypingPassword] = useState(false);
  const [OTPCreateAt, setOTPCreateAt] = useState<Date>();
  const [minutesResend, setMinutesResend] = useState(0);
  const [secondsResend, setSecondsResend] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [onSendingOTP, setOnSendingOTP] = useState(false);
  var interval: ReturnType<typeof setInterval>;

  const formikEnterMailReset = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().min(5, "Must be at least 5 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      setOnLoading(true);
      try {
        const result = await SENDOTP({
          email: values.email,
        });
  
        if (result.isSuccess) {
          toast.success("Đã gửi OTP đến email của bạn");
          localStorage.setItem("email_reset", values.email);
          var now = new Date();
          setOTPCreateAt(now);
          setIsOTPTyping(true);
        } else {
          toast.error("Đã xảy ra lỗi khi gửi đến email của bạn");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setOnLoading(false);
      }
    },
  });

  const formikVerifyOTPReset = useFormik({
    initialValues: {
      email: localStorage.getItem("email_reset"),
      otpCode: "",
    },
    validationSchema: Yup.object({
      otpCode: Yup.string().length(6, "OTP code must be exactly 6 digits").required("Required"),
    }),
    onSubmit: async (values) => {
      values.email = localStorage.getItem("email_reset");
      console.log(values);
      setOnLoading(true);
      try {
        const result = await VERIFYOTP({
          email: values.email,
          otpCode: values.otpCode,
        });

        if (result.isSuccess) {
          toast.success("Xác thực OTP thành công");
          setIsOTPTyping(false);
          localStorage.setItem("temp_token", result.res && result.res.data.tempToken || "");
          setTypingPassword(true);
        } else {
          toast.error("Xác thực OTP không thành công");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setOnLoading(false);
      }
    },
  });

  const formikPasswordReset = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("newPassword"), undefined], "Passwords must match").required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      setOnLoading(true);
      var tempToken = localStorage.getItem("temp_token");
      try {
        const result = await RESETPASSWORD({
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
          tempToken: tempToken || "",
        });

        if (!result.isSuccess) {
          if (result.statusCode == 401) {
            toast.error("Đã hết hạn đổi mật khẩu");
            LogoutResetPassword();

            return;
          }
          toast.error("Đã xảy ra lỗi khi đổi mật khẩu");
        } else {
          toast.success("Đổi mật khẩu thành công");
          localStorage.removeItem("temp_token");
          localStorage.removeItem("email_reset");
          setIsResetingPassword(false);
          setIsOTPTyping(false);
          setTypingPassword(false);
          formikEnterMailReset.resetForm();
          formikVerifyOTPReset.resetForm();
          formikPasswordReset.resetForm();
          setCanResend(false);
          setMinutesResend(0);
          setSecondsResend(0);
          setOTPCreateAt(undefined);
          clearInterval(interval);
          window.location.href = "/authentication";
        }
      } catch (error) {
        console.log(error);
      } finally {
        setOnLoading(false);
      }
    },
  });

  useEffect(() => { 
    if (!isOTPTyping || OTPCreateAt === undefined) return;

    const createdTime = new Date(OTPCreateAt);
    const canResend = createdTime.setMinutes(createdTime.getMinutes() + 2);
    const firstNow = new Date();
    let time = canResend - firstNow.getTime();

    setMinutesResend(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    setSecondsResend(Math.floor((time % (1000 * 60)) / 1000));

    const interval = setInterval(() => {
      const now = new Date();
      let time = canResend - now.getTime();

      setMinutesResend(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
      setSecondsResend(Math.floor((time % (1000 * 60)) / 1000));

      if (time < 0) {
        setCanResend(true);
        clearInterval(interval);
        setMinutesResend(0);
        setSecondsResend(0);
      }
    }, 1000);

    return () => clearInterval(interval);
}, [isOTPTyping, OTPCreateAt]);


  function handleCancel(){
    localStorage.removeItem("temp_token");
    localStorage.removeItem("email_reset");
    formikEnterMailReset.resetForm();
    formikVerifyOTPReset.resetForm();
    formikPasswordReset.resetForm();
    setCanResend(false);
    setIsOTPTyping(false);
    setTypingPassword(false);
    setIsResetingPassword(false);
    window.location.href = "/authentication";
  }

  async function resendOTP(){
    setOnSendingOTP(true);
    try {
      const result = await SENDOTP({
        email: localStorage.getItem("email_reset") || "",
      });

      if (result.isSuccess) {
        toast.success("Đã gửi mã OTP đến email của bạn");
        var now = new Date();
        setOTPCreateAt(now);
        setCanResend(false);
      } else {
        toast.error("Đã xảy ra lỗi khi gửi mã OTP");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOnSendingOTP(false);
    }
  }

  return (
    <DefaultLayout>
      <Toaster position="bottom-left" reverseOrder={false} />
      <section className="flex items-center justify-center min-h-[750px]">
        <div className="flex flex-col justify-center items-center">
          <Card className="w-[700px]">
            <CardHeader>
              <span
                className="pl-3 pt-3 text-4xl font-literata font-bold"
              >
                Khôi phục mật khẩu
              </span>
            </CardHeader>
            <CardBody>
              {isOTPTyping ? (
                <div className="flex flex-col gap-3 px-3">
                  <p>Nhập mã OTP đã được gửi đến email của bạn</p>
                  <form onSubmit={formikVerifyOTPReset.handleSubmit}>
                    <Input name="otpCode" label="OTP Code" value={formikVerifyOTPReset.values.otpCode} onChange={formikVerifyOTPReset.handleChange} placeholder="Nhập OTP Code"/>
                    {formikVerifyOTPReset.errors.otpCode && formikVerifyOTPReset.touched.otpCode && (
                      <p style={{ color: "red" }}>{formikVerifyOTPReset.errors.otpCode}</p>
                    )}
                    <p className="mt-2">Bạn chưa nhận được OTP? <Button className={`${canResend ? "cursor-pointer" : "cursor-not-allowed"} ml-2`} isLoading={onSendingOTP} isDisabled={!canResend || onSendingOTP} onClick={() => resendOTP()}>Gửi lại {canResend ? null : `sau ${minutesResend}:${secondsResend < 10 ? "0" : ""}${secondsResend}`}</Button></p>
                    <Button fullWidth id="send-code-button" color="primary" type="submit" isLoading={onLoading} style={{ marginTop: "2vh", marginBottom:"2vh"}}>
                      Tiếp tục
                    </Button>
                    <Button onClick={() => handleCancel()}>Quay lại đăng nhập</Button>
                  </form>
                </div>
              ) : (
                <>
                  {isTypingPassword ? (
                    <div className="flex flex-col gap-3 px-3">
                      <p>Nhập mật khẩu mới</p>
                      <form onSubmit={formikPasswordReset.handleSubmit}>
                        <Input
                          name="newPassword"
                          label="Mật khẩu mới"
                          type={isVisible ? "text" : "password"}
                          value={formikPasswordReset.values.newPassword}
                          onChange={formikPasswordReset.handleChange}
                          placeholder="Nhập mật khẩu mới"
                          endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                              {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                              ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                              )}
                            </button>
                          }
                        />
                        {formikPasswordReset.errors.newPassword && formikPasswordReset.touched.newPassword && (
                          <p style={{ color: "red" }}>{formikPasswordReset.errors.newPassword}</p>
                        )}
                        <Input
                          name="confirmPassword"
                          label="Nhập lại mật khẩu mới"
                          type={isVisibleConfirm ? "text" : "password"}
                          className="mt-3"
                          value={formikPasswordReset.values.confirmPassword}
                          onChange={formikPasswordReset.handleChange}
                          placeholder="Nhập lại mật khẩu mới"
                          endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirm} aria-label="toggle password visibility">
                              {isVisibleConfirm ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                              ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                              )}
                            </button>
                          }
                        />
                        {formikPasswordReset.errors.confirmPassword && formikPasswordReset.touched.confirmPassword && (
                          <p style={{ color: "red" }}>{formikPasswordReset.errors.confirmPassword}</p>
                        )}
                        <Button fullWidth id="send-code-button" color="primary" type="submit" isLoading={onLoading} style={{ marginTop: "2vh", marginBottom:"2vh"}}>
                          Tiếp tục
                        </Button>
                        <Button onClick={() => handleCancel()}>Quay lại đăng nhập</Button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 px-3">
                      <p>Nhập email để đặt lại mật khẩu</p>
                      <form onSubmit={formikEnterMailReset.handleSubmit} className="mt-2">
                        <Input name="email" label="Email" value={formikEnterMailReset.values.email} onChange={formikEnterMailReset.handleChange} placeholder="Nhập email"/>
                        {formikEnterMailReset.errors.email && formikEnterMailReset.touched.email && (
                          <p style={{ color: "red" }}>{formikEnterMailReset.errors.email}</p>
                        )}
                        <Button fullWidth id="send-code-button" color="primary" type="submit" isLoading={onLoading} style={{ marginTop: "2vh", marginBottom:"2vh"}}>
                          Tiếp tục
                        </Button>
                        <Button onClick={() => handleCancel()}>Quay lại đăng nhập</Button>
                      </form>
                    </div>
                  )} 
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}