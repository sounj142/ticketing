import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import { redirectToHomePageIfUnAuthorized } from '../../api/utils';

export default function orderDetail({ currentUser }) {
  const router = useRouter();
  const { orderId } = router.query;

  const [order, setOrder] = useState(null);
  const [canPay, setCanPay] = useState(false);
  const [remaningTimeString, setRemaningTimeString] = useState('');

  const { doRequest: getOrder, errors: getOrderErrors } = useRequest({
    url: `/api/orders/${orderId}`,
    method: 'get',
  });

  function formatRemaningTimeString(remainMilis) {
    let remainSeconds = Math.round(remainMilis / 1000);
    const remainMinutes = Math.trunc(remainSeconds / 60);
    if (remainMinutes > 0) {
      remainSeconds = remainSeconds - remainMinutes * 60;
    }
    setRemaningTimeString(
      remainMinutes
        ? `${remainMinutes} minute(s) ${remainSeconds} second(s)`
        : `${remainSeconds} second(s)`
    );
  }

  const { doRequest: createPayment, errors: createPaymentErrors } = useRequest({
    url: `/api/payments`,
    method: 'post',
  });

  useEffect(() => {
    let intervalTimer;

    async function fetchData() {
      const data = await getOrder();
      setOrder(data);

      const expireDate = new Date(data?.expiresAt);
      const calculatedValue =
        !!data && data.status === 'created' && expireDate - new Date() > 0;
      setCanPay(calculatedValue);

      if (calculatedValue) {
        formatRemaningTimeString(expireDate - new Date());
        intervalTimer = setInterval(() => {
          const timeRemain = expireDate - new Date();
          if (timeRemain <= 0) {
            clearInterval(intervalTimer);
            intervalTimer = undefined;
            setCanPay(false);
            setRemaningTimeString('');
          } else {
            formatRemaningTimeString(timeRemain);
          }
        }, 1000);
      }
    }

    fetchData();

    return () => {
      if (intervalTimer) {
        console.log('cleared intervalTimer');
        clearInterval(intervalTimer);
        intervalTimer = undefined;
      }
    };
  }, [orderId]);

  async function onToken(token) {
    const payment = await createPayment(undefined, {
      orderId,
      token: token.id,
    });
    if (payment) {
      Router.push('/orders');
    }
  }

  return (
    <div>
      {getOrderErrors}

      {order && (
        <>
          <h1>Purchasing {order.ticket.title}</h1>
          <h4>Order price: {order.ticket.price}</h4>

          {canPay && (
            <>
              {remaningTimeString && (
                <p>You have {remaningTimeString} left to order</p>
              )}

              {createPaymentErrors}

              <StripeCheckout
                currency='USD'
                amount={order.ticket.price * 100}
                email={currentUser.email}
                token={onToken}
                stripeKey='pk_test_51KPNJrHziHxmUuVBF4G2M68cMq9onw6HRFbEBj3HLozARa8edqCGUQtLJZFOojLFAAOeDa5Nfpk4mkz7tPkJ2Fdj00TvqN2M0U'
              />
            </>
          )}
          {!canPay && <p>Order Expired</p>}
        </>
      )}
    </div>
  );
}

orderDetail.getInitialProps = (context, _client, currentUser) => {
  redirectToHomePageIfUnAuthorized(context, currentUser);
  return {};
};
