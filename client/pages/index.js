import { useEffect, useState } from 'react';
import Link from 'next/link';
import useRequest from '../hooks/use-request';

export default function homeIndex({ currentUser }) {
  const [tickets, setTickets] = useState([]);

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'get',
  });

  useEffect(async () => {
    const data = await doRequest();
    setTickets(data);
  }, []);

  return (
    <div>
      <h1>Tickets</h1>
      {errors}
      {currentUser && (
        <div className='text-right'>
          <Link href='/tickets/create'>
            <span className='btn btn-primary'>Create Ticket</span>
          </Link>
        </div>
      )}
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.price.toFixed(2)}</td>
              <td>
                <Link href={`/tickets/${ticket.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
