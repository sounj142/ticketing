const AuthError = {
  Auth0001: '',
};

const _error: any = AuthError;
for (const key in _error) {
  _error[key] = key;
}

export default AuthError;
