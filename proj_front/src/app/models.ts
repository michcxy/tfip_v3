import { ExpressionType } from "@angular/compiler"

export interface User {
    fname: string
    lname: string
    email: string
    password: string

    address1: string
    address2: string
    postal: string
    phone: string

    genre: string
    plan: string
  }

  export interface AuthenticateUser {
    email: string
    password: string
  }

  export interface Album {
    name: string;
    genre: string;
    artist: string;
    description: string;
    imgUrl: string;
    price: number;
  }