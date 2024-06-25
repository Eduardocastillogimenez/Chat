import { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Logo from '../../logo.png';
import registerUser from '../../bd/register';
import { useAuth } from "../../contex";


const Register = () => {
  const { user, loadingData, loadingFinish } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if(user){
      navigate("/");
    }
  }, [user]);

  const onFinish = async (values: any) => {
    loadingData();
    // console.log('Received values:', values);
    const res = await registerUser(values);
    if(res){
      loadingFinish();
      navigate("/login");
    }else{
      messageApi.open({
        type: 'error',
        content: 'user could not be registered',
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
        <Form name="register-form" onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '10px' }}>
              Register
            </Button>
            <Button type="primary" style={{ width: '100%' }} onClick={()=> navigate("/login")}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;