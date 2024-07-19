import { redirect } from "react-router-dom";

export function action() {
  if (window.confirm("are you really want to logout?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
  }
  return redirect("/");
}
