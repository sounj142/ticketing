import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function SignUp() {
  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required.')
      .email('Email must be a valid email address.'),
    password: Yup.string()
      .required('Password is required.')
      .min(6, 'Password must have at least 6 characters.'),
    confirmPassword: Yup.string().test(
      'passwords-match',
      'Passwords must match.',
      function (value) {
        return this.parent.password === value;
      }
    ),
  });

  const { doRequest, serverErrors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
  });

  const onSubmitHandle = async ({ email, password }) => {
    const response = await doRequest({ email, password });
    if (response?.id) {
      Router.push('/');
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandle}
    >
      {({ errors, touched }) => (
        <Form>
          <h1>Sign Up</h1>

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

          <div className='form-group'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <Field
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='Confirm Password'
              className='form-control'
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <div className='validation-error'>{errors.confirmPassword}</div>
            ) : null}
          </div>

          <div className='mt-3'>
            {serverErrors}

            <button type='submit' className='btn btn-primary'>
              Sign Up
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
