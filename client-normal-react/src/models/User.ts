export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserDto {
  email: string;
  token: string;
  refreshToken: string;
}
