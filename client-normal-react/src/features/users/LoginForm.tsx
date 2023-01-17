import { Form, Formik } from 'formik';
import { LoginDto } from '../../models/User';
import * as Yup from 'yup';
import { useState } from 'react';
import ValidationErrors from '../errors/ValidationErrors';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/form/MyTextInput';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { history } from '../../utils/route';

export default observer(function LoginForm() {
  const { userStore, modalStore } = useStore();
  const initialModel: LoginDto = {
    email: '',
    password: '',
  };
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required.')
      .email('Email should be a valid email address.'),
    password: Yup.string().required('Password is required.'),
  });

  const formSubmitHandle = async (loginModel: LoginDto) => {
    try {
      await userStore.login(loginModel);
      modalStore.closeModal();
      setServerResponse(undefined);
      history.push('/tickets');
    } catch (err: any) {
      setServerResponse(err.response?.data);
    }
  };

  return (
    <Formik
      initialValues={initialModel}
      validationSchema={validationSchema}
      onSubmit={formSubmitHandle}
    >
      {({ isValid, isSubmitting, dirty, values }) => (
        <Form className='ui form'>
          <Header
            as='h2'
            content='Login to GitTix'
            color='teal'
            textAlign='center'
          />
          <MyTextInput placeholder='Email' name='email' />
          <MyTextInput placeholder='Password' name='password' type='password' />

          {serverResponse && (
            <ValidationErrors serverResponse={serverResponse} />
          )}

          <Button
            positive
            type='submit'
            content='Login'
            fluid
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});
