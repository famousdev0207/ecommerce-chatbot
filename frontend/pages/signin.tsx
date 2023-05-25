import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Row, Col, Divider } from 'antd';
import { login } from '../redux/authentication/actionCreator';
import { AiOutlineGoogle } from 'react-icons/ai';

const SignIn = () => {
  const dispatch = useDispatch();
  const history = useRouter();
  const isLoading = useSelector((state: any) => state.auth.loading);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/');
    }
  }, []);

  const handleSubmit = useCallback(
    (values: any) => {
      login(dispatch, { ...values, gmail: false }, () => history.push('/'));
    },
    [history, dispatch],
  );

  return (
    <Row justify="center" className="flex h-[100vh] items-center bg-white">
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <div className="mt-6 rounded-md bg-white shadow-regular dark:bg-white10 dark:shadow-none">
          <div className="border-b border-gray-200 px-5 py-4 text-center dark:border-white10">
            <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white87">
              Sign in
            </h2>
          </div>
          <div className="px-10 pb-6 pt-8">
            <Form
              name="login"
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    message: 'Please input your username or Email!',
                    required: true,
                  },
                ]}
                label="Username or Email Address"
                className="[&>div>div>label]:text-sm [&>div>div>label]:font-medium [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60"
              >
                <Input placeholder="name@example.com" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                className="[&>div>div>label]:text-sm [&>div>div>label]:font-medium [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>
              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <Link className=" text-13 text-primary" href="/forgotPassword">
                  Forgot password?
                </Link>
              </div>
              <Form.Item>
                <Button
                  className="my-6 h-12 w-full bg-sky-500 p-0 text-sm font-medium"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  {isLoading ? 'Loading...' : 'Sign In'}
                </Button>
              </Form.Item>
              <Divider orientation="center">Or</Divider>
            </Form>
            <ul className="mb-0 flex items-center justify-center">
              <li className="w-full px-1.5 pb-2.5 pt-3">
                <a
                  href="http://localhost:4000/api/google"
                  className={
                    'basis-[90]% bg-cBlue-500 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-red-500 px-4 py-2 text-base tracking-wide text-white shadow-sm focus:outline-none'
                  }
                >
                  <AiOutlineGoogle />
                  Sign in with Google
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-b-md bg-gray-100 p-6 text-center dark:bg-white10">
            <a href="/signup">
              <p className="mb-0 text-sm font-medium text-body dark:text-white60">
                Don`t have an account? Sign up
              </p>
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default SignIn;
