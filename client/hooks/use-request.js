import axios from 'axios';
import { useState } from 'react';

export default function useRequest({ url, method }) {
  const [serverErrors, setServerErrors] = useState(null);

  const doRequest = async function (data) {
    try {
      const response = await axios[method](url, data);
      setServerErrors(null);
      return response.data;
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerErrors(
          <div className='alert alert-danger'>
            <h4>Ooops...</h4>
            <ul className='my-0'>
              {err.response.data.errors.map((e) => (
                <li key={e.message}>{e.message}</li>
              ))}
            </ul>
          </div>
        );
      }
      return undefined;
    }
  };

  return { doRequest, serverErrors };
}
