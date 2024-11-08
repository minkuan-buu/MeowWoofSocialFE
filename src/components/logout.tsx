export default function Logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  window.location.href = "/";
}

export const LogoutResetPassword = () => {
  localStorage.removeItem("temp_token");
  localStorage.removeItem("email_reset");
  window.location.href = "/";
}