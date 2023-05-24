export interface claim{
    name: string;
    value: string;
}

export interface userCredentials{
    email: string;
    password: string;
}

export interface userDetails{
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    surname: string;
    birthday: Date;
    gender: string;
    address: string;
}

export interface individualUserDetails{
    email: string;
    name: string;
    surname: string;
    birthday: Date;
    gender: string;
    address: string;
}

export interface editUser{
    name: string;
    surname: string;
    birthday: Date;
    gender: string;
    address: string;
}

export interface userCreationDTO{
    email: string;
    password: string;
    name: string;
    surname: string;
    birthday: Date;
    gender: string;
    address: string;
}

export interface authenticationResponse{
    token: string;
    expiration: Date;
}

export interface userDTO{
    id: string;
    email: string;
}

export interface changePasswordForm{
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface changePassword{
    email: string;
    oldPassword: string;
    newPassword: string;
}