import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Row, Col, Form, Input, Button, Divider } from 'antd';
import { AuthFormWrap } from '../styles/style';
import { register } from '@/redux/authentication/actionCreator';

function SignUp() {
  const dispatch = useDispatch();
  const history = useRouter();

  const handleSubmit = useCallback(
    (values: any) => {
      register(dispatch, values, () => history.push('/signin'));
    },
    [history, dispatch],
  );

  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/');
    }
  }, []);

  return (
    <Row justify="center" className="flex h-[100vh] items-center bg-white">
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <AuthFormWrap className="mt-6 rounded-md bg-white shadow-regular dark:bg-white10 dark:shadow-none">
          <div className="border-b border-gray-200 px-5 py-4 text-center dark:border-white10">
            <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white87">
              Sign Up
            </h2>
          </div>
          <div className="px-10 pb-6 pt-8">
            <Form name="register" onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                className="[&>div>div>label]:text-sm [&>div>div>label]:font-medium [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60"
                rules={[
                  { required: true, message: 'Please input your Full name!' },
                ]}
              >
                <Input placeholder="Full name" size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email Address"
                className="[&>div>div>label]:text-sm [&>div>div>label]:font-medium [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                    type: 'email',
                  },
                ]}
              >
                <Input placeholder="name@example.com" size="large" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                className="[&>div>div>label]:text-sm [&>div>div>label]:font-medium [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>
              <div className="flex items-center justify-between"></div>
              <Form.Item>
                <Button
                  className="my-6 h-12 w-full bg-sky-500 p-0 text-sm font-medium"
                  htmlType="submit"
                  type="primary"
                  size="large"
                >
                  Create Account
                </Button>
              </Form.Item>
              <Divider orientation="center">Or</Divider>
            </Form>
          </div>
          <div className="rounded-b-md bg-gray-100 p-6 text-center dark:bg-white10">
            <a href="/signin">
              <p className="mb-0 text-sm font-medium text-body dark:text-white60">
                Already have an account?
              </p>
            </a>
          </div>
        </AuthFormWrap>
      </Col>
    </Row>
  );
}

export default SignUp;
