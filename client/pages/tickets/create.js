import { useState } from 'react';
import Router from 'next/router';
import { redirectToHomePageIfUnAuthorized } from '../../api/utils';
import useRequest from '../../hooks/use-request';

export default function createTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  function onBlurHandle() {
    const value = Number(price);
    if (isNaN(value) || value <= 0) {
      return;
    } else {
      setPrice(value.toFixed(2));
    }
  }

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    data: {
      title,
      price,
    },
  });

  async function submitHandle(event) {
    const response = await doRequest(event);
    if (response) {
      Router.push('/');
    }
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={submitHandle}>
        <div className='form-group'>
          <label className='form-label'>Title</label>
          <input
            className='form-control'
            value={title}
            onChange={(elem) => setTitle(elem.target.value)}
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>Price</label>
          <input
            className='form-control'
            value={price}
            onChange={(elem) => setPrice(elem.target.value)}
            onBlur={onBlurHandle}
          />
        </div>

        <div className='mt-3'>
          {errors}

          <button className='btn btn-primary'>Submit</button>
          <button
            className='btn btn-secondary m-2'
            onClick={() => Router.push('/')}
            type='button'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

createTicket.getInitialProps = (context, _client, currentUser) => {
  redirectToHomePageIfUnAuthorized(context, currentUser);
  return {};
};
