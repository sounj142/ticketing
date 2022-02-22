import { useEffect, useState } from 'react';
import Link from 'next/link';
import useRequest from '../../hooks/use-request';
import { redirectToHomePageIfUnAuthorized } from '../../api/utils';

export default function ordersIndex() {
  const [orders, setOrders] = useState([]);

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'get',
  });

  useEffect(async () => {
    const data = await doRequest();
    setOrders(data);
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      {errors}

      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Pay</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>{order.ticket.price.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                {order.status === 'created' && (
                  <Link href={`/orders/${order.id}`}>Pay</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ordersIndex.getInitialProps = (context, _client, currentUser) => {
  redirectToHomePageIfUnAuthorized(context, currentUser);
  return {};
};
