import { connectToNats } from '@hoangrepo/common';
import { Stan } from 'node-nats-streaming';
import prompt from 'prompt';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
prompt.start();

connectToNats('ticketing', 'http://localhost:4222', processAfterConnected);

function onErr(err: any) {
  console.log(err);
  return 1;
}

function processAfterConnected(stan: Stan) {
  const publisher = new TicketCreatedPublisher(stan);

  promptAndPublish();

  function promptAndPublish() {
    prompt.get(['title'], function (err, result) {
      if (err) {
        return onErr(err);
      }

      if (!result.title) return;

      publisher
        .publish({
          id: 'aaaa',
          title: result.title as string,
          price: Math.random() * 1000,
          userId: 'asasds',
        })
        .then(() => {
          console.log('event published!');
        });

      setTimeout(() => {
        promptAndPublish();
      });
    });
  }
}
