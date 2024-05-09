import { jwtDecode } from "jwt-decode";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  
export class Global {

    public token: any;
    public user: any;
    public role: any;
    public dataLogin: any;
    public userId: number;
    public expireTime: any;

    constructor() { }

    setDataLogin(dataLogin) {
        this.dataLogin = dataLogin;
        // const decoded = jwtDecode(dataLogin);
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    setUser(user) {
        this.user = user;
    }

    getUser() {
        return this.user
    }

    setRol(role) {
        this.role = role;
    }

    getRol() {
        return this.role;
    }

    setExpireTime(expireTime) {
        this.expireTime = expireTime;
    }

    getExpireTime() {
        return this.expireTime;
    }

}