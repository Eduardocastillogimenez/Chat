import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Logo from '../../logo.svg';

const Login = () => {
  const onFinish = (values: any) => {
    console.log('Received values:', values);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;