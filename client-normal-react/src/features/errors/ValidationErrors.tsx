import { Message } from 'semantic-ui-react';

interface Props {
  serverResponse: any;
}
export default function ValidationErrors({ serverResponse }: Props) {
  if (typeof serverResponse === 'string')
    return (
      <Message error className='error-messages'>
        {serverResponse}
      </Message>
    );

  if (serverResponse?.errors) {
    const errors = serverResponse.errors;
    return (
      <Message error className='error-messages'>
        {errors.length < 2
          ? errors[0].message
          : errors.map((err: any, index: number) => (
              <Message.Item key={index}>{err.message}</Message.Item>
            ))}
      </Message>
    );
  }

  return (
    <Message error className='error-messages'>
      Unknown Error.
    </Message>
  );
}
