import axios from 'axios';
import { useState } from 'react';

export default function useRequest({ url, method, data }) {
  const [errors, setError] = useState(null);

  const doRequest = async function (event) {
    event.preventDefault();

    try {
      const response = await axios[method](url, data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map((e) => (
              <div key={e.message}>{e.message}</div>
            ))}
          </ul>
        </div>
      );
      return undefined;
    }
  };

  return { doRequest, errors };
}
