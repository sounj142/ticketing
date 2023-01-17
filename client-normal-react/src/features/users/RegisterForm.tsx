import { Form, Formik } from 'formik';
import { RegisterDto } from '../../models/User';
import * as Yup from 'yup';
import { useState } from 'react';
import ValidationErrors from '../errors/ValidationErrors';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/form/MyTextInput';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { history } from '../../utils/route';

export default observer(function RegisterForm() {
  const { userStore, modalStore } = useStore();
  const initialModel: RegisterDto = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  const [serverResponse, setServerResponse] = useState<any>(undefined);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required.')
      .email('Email should be a valid email address.')
      .max(200, 'Email must not exceed 200 characters.'),
    password: Yup.string()
      .required('Password is required.')
      .min(6, 'Password must have at least 6 characters.')
      .max(100, 'Password must not exceed 100 characters.'),
    confirmPassword: Yup.string().test(
      'passwords-match',
      'Passwords must match.',
      function (value) {
        return this.parent.password === value;
      }
    ),
  });

  const formSubmitHandle = async (registerModel: RegisterDto) => {
    try {
      await userStore.register(registerModel);
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
      {({ isValid, isSubmitting, dirty }) => (
        <Form className='ui form'>
          <Header
            as='h2'
            content='Sign up to GitTix'
            color='teal'
            textAlign='center'
          />
          <MyTextInput placeholder='Email' name='email' />
          <MyTextInput placeholder='Password' name='password' type='password' />
          <MyTextInput
            placeholder='Confirm password'
            name='confirmPassword'
            type='password'
          />

          {serverResponse && (
            <ValidationErrors serverResponse={serverResponse} />
          )}

          <Button
            positive
            type='submit'
            content='Register'
            fluid
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>
  );
});
