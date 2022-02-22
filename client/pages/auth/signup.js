import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { redirectToHomePageIfAuthorized } from '../../api/utils';

export default function signuUp() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    data: user,
  });

  function changeInput(propName, elem) {
    setUser({
      ...user,
      [propName]: elem.target.value,
    });
  }

  async function submitHandle(event) {
    const response = await doRequest(event);
    if (response) {
      Router.push('/');
    }
  }

  return (
    <form onSubmit={submitHandle}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email</label>
        <input
          className='form-control'
          value={user.email}
          onChange={(elem) => changeInput('email', elem)}
        />
      </div>

      <div className='form-group'>
        <label>Password</label>
        <input
          className='form-control'
          type='password'
          value={user.password}
          onChange={(elem) => changeInput('password', elem)}
        />
      </div>

      <div className='mt-3'>
        {errors}

        <button className='btn btn-primary'>Sign Up</button>
      </div>
    </form>
  );
}

signuUp.getInitialProps = (context, _client, currentUser) => {
  redirectToHomePageIfAuthorized(context, currentUser);
  return {};
};
