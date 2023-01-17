import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function SignIn() {
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required.')
      .email('Email must be a valid email address.'),
    password: Yup.string().required('Password is required.'),
  });

  const { doRequest, serverErrors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
  });

  const onSubmitHandle = async (signInData) => {
    const response = await doRequest(signInData);
    if (response?.id) {
      Router.push('/');
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandle}
    >
      {({ errors, touched }) => (
        <Form>
          <h1>Sign In</h1>

          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <Field
              id='email'
              name='email'
              placeholder='Email'
              className='form-control'
            />
            {errors.email && touched.email ? (
              <div className='validation-error'>{errors.email}</div>
            ) : null}
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <Field
              id='password'
              name='password'
              type='password'
              placeholder='Password'
              className='form-control'
            />
            {errors.password && touched.password ? (
              <div className='validation-error'>{errors.password}</div>
            ) : null}
          </div>

          <div className='mt-3'>
            {serverErrors}

            <button type='submit' className='btn btn-primary'>
              Sign In
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
