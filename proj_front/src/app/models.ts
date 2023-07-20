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