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
    if(user){
      navigate("/");
    }
  }, [user]);

  const onFinish = async (values: any) => {
    loadingData();
    console.log('Received values:', values);
    const res = await loginUser(values);
    if(res){
      console.log(res, 'resresresres')
      login({
        name: res?.data.name,
        token: res?.data.token,
        email: res?.data.email
      })
      loadingFinish();
    }else{
      messageApi.open({
        type: 'error',
        content: 'user not found',
      });
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
          <Form.Item name="username" rules={[{ required: true, message: 'Please enter your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
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
            <Button type="primary" style={{ width: '100%' }} onClick={()=> navigate("/register")}>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;