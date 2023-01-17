import { LoginDto, RegisterDto } from '../models/User';
import { UserDto } from '../models/User';
import { ignoreStatusCodes } from '../utils/axios';
import { requests } from './agent';

const basePath = '/api/users';
const accountApis = {
  login: (loginModel: LoginDto) =>
    requests.post<LoginDto, UserDto>(
      `${basePath}/signin?dontUseCookie=true`,
      loginModel,
      ignoreStatusCodes()
    ),
  register: (registerModel: RegisterDto) =>
    requests.post<RegisterDto, UserDto>(
      `${basePath}/signup?dontUseCookie=true`,
      registerModel,
      ignoreStatusCodes()
    ),
  refreshToken: (refreshToken: string) =>
    requests.post<{ refreshToken: string }, UserDto>(
      `${basePath}/refresh-token`,
      { refreshToken }
    ),
};

export default accountApis;
