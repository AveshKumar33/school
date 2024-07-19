import { redirect } from "react-router-dom";
import Cookies from "js-cookie";

export function getAuthToken(userType) {
  const token = Cookies.get(userType);

  if (!token) {
    return null;
  }

  return token;
}

export function checkAuthLoader(userType) {
  const token = getAuthToken(userType);

  if (!token) {
    return redirect("/login");
  }

  return null;
}
