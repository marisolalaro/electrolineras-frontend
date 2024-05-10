import { jwtDecode } from "jwt-decode";

export function decodeLocal(): any {
    return jwtDecode(localStorage.getItem('token'))
}