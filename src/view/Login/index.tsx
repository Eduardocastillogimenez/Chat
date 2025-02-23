import { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contex";
import loginUser from '../../bd/login';
import Logo from '../../logo.png';

const Login = () => {
  const { user, login, loadingData, loadingFinish } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onFinish = async (values: any) => {
    loadingData();
    try {
      const res = await loginUser(values);
      if (res) {
        login({
          name: res.data.name,
          token: res.data.token,
          email: res.data.email,
          id: res.data.id,
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'User not found',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'An error occurred while logging in',
      });
    } finally {
      loadingFinish();
    }
  };

  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {contextHolder}
        <Card style={{ width: 300, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <img src={Logo} alt="Logo" style={{ height: 90 }} />
          </div>
          <Form name="login-form" onFinish={onFinish}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}>
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '10px' }}>
                Log In
              </Button>
              <Button type="primary" style={{ width: '100%' }} onClick={() => navigate("/register")}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
  );
};

export default Login;
