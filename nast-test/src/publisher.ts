import { natsWrapper, applyLogLevel } from '@hoangorg/common';
import cuid from 'cuid';
import prompt from 'prompt';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
import { configGracefulShutdown } from './graceful-shutdown';

applyLogLevel('debug');

prompt.start();

natsWrapper
  .connect('ticketing', cuid(), 'http://localhost:4222')
  .then(processAfterConnected);

configGracefulShutdown();

function processAfterConnected() {
  const publisher = new TicketCreatedPublisher(natsWrapper.client);

  promptAndPublish();

  function promptAndPublish() {
    prompt.get(['title'], function (err, result) {
      if (err) {
        console.error(err);
        return;
      }

      if (!result.title) return;

      publisher
        .publish({
          id: 'aaaa',
          title: result.title as string,
          price: Math.random() * 1000,
          userId: 'asasds',
          version: 1,
        })
        .then(() => {
          console.log('Event published!');
        });

      setTimeout(() => {
        promptAndPublish();
      });
    });
  }
}
