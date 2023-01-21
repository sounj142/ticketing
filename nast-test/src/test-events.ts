import axios from 'axios';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const cookie = 'session=eyJqd3QiOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall4WmpZMk9ESTRaRFl3WWpsaU5HTmlNbU5oT0RjNE9DSXNJbVZ0WVdsc0lqb2ljMjkxYm1veE5ESkFaMjFoYVd3dVkyOXRJaXdpYVdGMElqb3hOalF6TlRReU5UVXlMQ0psZUhBaU9qRTJORE0xTkRZeE5USXNJbWx6Y3lJNklraHZZVzVuSUVOdmNuQWlMQ0p6ZFdJaU9pSm9iMkZ1WjBCb2IyRnVaeTVqYjIwaWZRLkxuWW0zYUVUZEFaamprbTJMdjU2d1daanB4eW16QUo4R0Q1M1hYQUk3NTNLY1I5SmtxNUhudHpzdVE0dGdEeFl3eTRtZVU4VkZ0OWtIdFZlMlZrTi13In0=; Path=/; Secure; HttpOnly;';

async function doRequest() {
  const { data } = await axios.post(
    'https://ticketing.vn/api/tickets',
    { title: 'Ticket', price: 5 },
    { headers: { cookie } }
  );

  await axios.put(
    `https://ticketing.vn/api/tickets/${data.id}`,
    { title: 'Ticket', price: 10 },
    { headers: { cookie } }
  );

  await axios.put(
    `https://ticketing.vn/api/tickets/${data.id}`,
    { title: 'Ticket', price: 15 },
    { headers: { cookie } }
  );
}

const repeatTimes = 200;
for (let i = 0; i < repeatTimes; i++) {
  doRequest();
}
console.log('All request done!');
