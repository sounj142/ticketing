const AuthError = {
  Auth0001: '',
  Auth0002: '',
  Auth0003: '',
  Auth0004: '',
  Auth0005: '',
};

const _error: any = AuthError;
for (const key in _error) {
  _error[key] = key;
}

export default AuthError;
