export default function Logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  window.location.href = "/";
}