import { jwtDecode } from "jwt-decode";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  
export class Global {

    public token: any;
    public esSuperAdmin: boolean = false;
    public user: any;
    public userId: number;
    public role: any;
    public roleId: number;
    public dataLogin: any;
    public expireTime: any;
    public decodeToken: any = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : '';

    constructor() { }

    setDataLogin(dataLogin) {
        this.dataLogin = dataLogin;
        // const decoded = jwtDecode(dataLogin);
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setUser() {
        this.user = this.decodeToken.user;
        this.userId = this.decodeToken.user.id;
        this.setRol(this.decodeToken.user.roles[0])
    }
    
    getUser() {
        return this.decodeToken.user
    }

    setRol(role) {
        this.role = role;
        this.roleId = this.role.id
    }

    getRol() {
        return this.decodeToken.user.roles[0];
    }

    getEsSuperAdmin() {
        return this.decodeToken.user.roles[0].nameRole == 'ROLE_ADMIN_GRAL' ? false : true;
    }

    setExpireTime() {
        this.expireTime = this.decodeToken.exp;
    }

    getExpireTime() {
        return this.expireTime;
    }

}