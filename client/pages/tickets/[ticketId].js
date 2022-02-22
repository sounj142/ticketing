import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function ticketDetail({ currentUser }) {
  const router = useRouter();
  const { ticketId } = router.query;

  const [ticket, setTicket] = useState(null);

  const { doRequest: getTicket, errors: getTicketErrors } = useRequest({
    url: `/api/tickets/${ticketId}`,
    method: 'get',
  });

  const { doRequest: createOrder, errors: createOrderErrors } = useRequest({
    url: `/api/orders`,
    method: 'post',
    data: {
      ticketId,
    },
  });

  useEffect(async () => {
    const data = await getTicket();
    setTicket(data);
  }, [ticketId]);

  async function createOrderHandle() {
    const order = await createOrder();
    if (order) {
      Router.push(`/orders/${order.id}`);
    }
  }

  return (
    <div>
      {getTicketErrors}

      {ticket && (
        <>
          <h1>{ticket.title}</h1>
          <h4>Price: {ticket.price}</h4>
          {createOrderErrors}
          {currentUser && (
            <button
              className='btn btn-primary'
              type='button'
              onClick={createOrderHandle}
            >
              Purchase
            </button>
          )}
        </>
      )}
    </div>
  );
}
