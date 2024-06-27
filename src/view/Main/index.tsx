import React, { useState, useEffect } from 'react';
import {
  PieChartOutlined,
  TeamOutlined,
  BarsOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Modal, message, Button, Input, Select, Typography, Radio, Popconfirm, MenuProps, RadioChangeEvent } from 'antd';
import { connectToChannel, disconnectFromChannel } from '../../utils/pusher-client';
import { useAuth } from "../../contex";
import { fetchData, createChat, fetchContacts, deleteChatDB } from '../../bd/chats';
import { getUserData, updateUserSettings } from '../../bd/user';
import Chat from './Chat';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem => ({
  key,
  icon,
  children,
  label,
} as MenuItem);

interface Chat {
  id: number;
  is_group_chat: number;
  name: string;
  status: string;
}

const itemNewPeople: MenuItem[] = [
  getItem(
      'Welcome, add a new user up', '-111',
      <Avatar src="https://i.pinimg.com/originals/7d/ca/be/7dcabe92370fff0c6489aba65af5dab2.jpg" />
  ),
];

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [chatSelect, setChatSelect] = useState<any>(null);
  const [chats, setChats] = useState<any>(null);
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [userEmailAdd, setUserEmailAdd] = useState('');
  const [nameGroup, setNameGroup] = useState('');
  const [valueUserConfig, setValueUserConfig] = useState({ theme: 'dark' });
  const [messageApi, contextHolder] = message.useMessage();
  const [emailsNewChat, setEmailsNewChat] = useState(['']);
  const { user, logout } = useAuth();
  const [channelName, setChannelName] = useState('');
  const [pusherConnection, setPusherConnection] = useState<any>(null);

  useEffect(() => {
    loadChats();
    loadContacts();
    loadUserConfig();
  }, []);

  useEffect(() => {
    handleConnectNewChat();
    return () => {
      disconnectFromChannel(pusherConnection, channelName);
    };
  }, [user]);

  const handleConnectNewChat = async () => {
    const _channelName = `user.${user.id}`;
    setChannelName(_channelName);
    const channel = connectToChannel(_channelName);
    setPusherConnection(channel);
    channel.bind('new-chat', (data: any) => {
      // const chat = data.chat;
      // alert('Se ha creado un nuevo chat: ' + chat.name);
      // setChats((prevChats: any) => [...(prevChats || []), chat]);
      // setItems((prevItems: any) => [...(prevItems || []), itemsOb(chat)]);
      loadChats()
    });
  };

  const loadChats = async () => {
    const res = await fetchData(user?.token);
    if (res) {
      setChats(res.data);
      const arrayItems = res.data.map((chat: Chat) => itemsOb(chat));
      setItems(arrayItems);
    } else {
      messageApi.open({ type: 'error', content: 'Chats and messages not found' });
    }
  };

  const loadContacts = async () => {
    const res = await fetchContacts(user?.token);
    if (res) {
      setContacts(res.data);
    } else {
      messageApi.open({ type: 'error', content: 'Contacts not found' });
    }
  };

  const loadUserConfig = async () => {
    const res = await getUserData(user?.token);
    if (res) {
      setValueUserConfig(res);
    } else {
      messageApi.open({ type: 'error', content: 'User config not found' });
    }
  };

  const deleteChat = async (data: any) => {
    const res = await deleteChatDB(data.id, user?.token);
    if (res) {
      loadChats();
      loadContacts();
      setChatSelect(null);
    } else {
      messageApi.open({ type: 'error', content: 'Chats not deleted' });
    }
  };

  const itemsOb = (data: Chat) => getItem(
      data.name ? (
          <div style={{ position: 'relative' }}>
            {data.name}
            <Popconfirm
                title="Delete Chat"
                description="confirm that you want to delete this chat"
                onConfirm={() => deleteChat(data)}
            >
              <DeleteOutlined style={{ right: '0', marginTop: '8px', fontSize: '20px', border: '1px black', position: 'absolute' }} />
            </Popconfirm>
          </div>
      ) : 'undefined',
      `${data.id}`,
      <Avatar src="https://th.bing.com/th/id/OIP.CDN83dY3lTOoX38zHLl0AgHaE8?rs=1&pid=ImgDetMain" />
  );

  const selectMenu = (option: any) => {
    setChatSelect({
      id: option.key,
      chatName: chats.find((e: any) => e.id === +option.key)?.name
    });
  };

  const addChat = async (group?: boolean) => {
    const emails = emailsNewChat.filter((email) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    );

    const res = await createChat({
      name: group ? nameGroup : user.name,
      group: group,
      usersEmail: group ? emails : [emailsNewChat[0]],
    }, user.token);

    if (res) {
      setItems((prevItems: any) => [...(prevItems || []), itemsOb(res.data)]);
      setEmailsNewChat(['']);
    } else {
      messageApi.open({ type: 'error', content: 'Chat add error' });
    }
  };

  const handleChangeSelect = (value: any, input: boolean) => {
    const array = input ? [...emailsNewChat, userEmailAdd] : [...emailsNewChat, ...value];
    const emailsNoRepeat = array.filter((email, index) => array.indexOf(email) === index);
    setEmailsNewChat(emailsNoRepeat);
    if (input) setUserEmailAdd('');
  };

  const onChangeUserConfig = async (e: RadioChangeEvent) => {
    const res = await updateUserSettings({ name: user?.name, theme: e.target.value }, user?.token);
    if (res) {
      loadUserConfig();
    } else {
      messageApi.open({ type: 'error', content: 'User not updated' });
    }
  };

  const theme = () => ({
    background: valueUserConfig.theme === "light" ? 'azure' : 'rgba(0, 0, 0, 0.271)',
    color: valueUserConfig.theme === "light" ? 'black' : 'rgb(255, 255, 255)',
  });

  return (
      <>
        {contextHolder}
        <Modal
            title={<p>Option Menu</p>}
            open={open}
            onCancel={() => setOpen(false)}
            footer="Option"
        >
          <TeamOutlined style={{ margin: '12px', fontSize: '40px', color: '#1677ffaf' }} onClick={() => setOpen3(true)} />
          <UserAddOutlined style={{ margin: '12px', fontSize: '40px', color: '#1677ffaf' }} onClick={() => setOpen2(true)} />
          <SettingOutlined style={{ margin: '12px', fontSize: '40px', color: '#1677ffaf' }} onClick={() => setOpen4(true)} />
          <span style={{  display: 'inline-flex', paddingBottom: '5px', textAlign:'start'}}>
            <Button type="link" block onClick={()=> logout()} style={{  color:'#1677ffaf'}} > Log out </Button>
          </span>
        </Modal>
        <Modal
            title={<p>Add new chat private {'('}Email{')'}</p>}
            open={open2}
            onCancel={() => { setOpen2(false); setEmailsNewChat(['']); }}
            footer={<Button type="primary" style={{ marginTop: '12px' }} onClick={() => { addChat(false); setOpen2(false); }}>Send</Button>}
        >
          <Input placeholder="Email" onChange={(e) => setEmailsNewChat([e.target.value])} />
        </Modal>
        <Modal
            title={<Title level={3}> Add new group chat </Title>}
            open={open3}
            onCancel={() => { setOpen3(false); setEmailsNewChat(['']) }}
            footer={<Button type="primary" style={{ marginTop: '12px' }} onClick={() => { addChat(true); setOpen3(false); setEmailsNewChat(['']) }}>Send</Button>}
        >
          <Title level={5}> Name Group </Title>
          <Input placeholder="Name" onChange={(e) => setNameGroup(e.target.value)} value={nameGroup} />
          <Title level={5}> Add Users Chats </Title>
          <Select
              showSearch
              placeholder="Select person"
              optionFilterProp="label"
              onChange={(e) => handleChangeSelect(e, false)}
              mode="tags"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
              options={contacts ? contacts.map((e: any) => ({ value: e.email, label: e.name })) : [{ value: '', label: '' }]}
          />
          <Title level={5}> Add User email specific </Title>
          <Input placeholder="Email" type='email' onChange={(e) => setUserEmailAdd(e.target.value)} value={userEmailAdd} />
          <Button type="primary" style={{ marginTop: '12px' }} onClick={() => handleChangeSelect('', true)}>Add</Button>
          <Title level={5}> List users added </Title>
          {emailsNewChat.map((e) => <p key={e}>{e}</p>)}
        </Modal>
        <Modal
            title={<Title level={3}> Change user interface theme </Title>}
            open={open4}
            onCancel={() => setOpen4(false)}
            footer={null}
        >
          <Title level={5}> Options </Title>
          <Radio.Group onChange={onChangeUserConfig} value={valueUserConfig.theme}>
            <Radio value='dark'>Dark</Radio>
            <Radio value='light'>Light</Radio>
          </Radio.Group>
        </Modal>

        <Layout style={{ minHeight: '100vh', overflowY: 'hidden' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width='400'>
            <div  style={{ textAlign: 'end', background: theme().background }}>
              <span style={{  display: 'inline-flex', paddingBottom: '5px', textAlign:'start'}}>
                <Button type="link" block onClick={()=> logout()} style={{  color:'white'}} > Log out </Button>
              </span>
              {!collapsed && <TeamOutlined style={{ margin: '12px', fontSize: '40px', color: theme().color }} onClick={() => setOpen3(true)} />}
              {!collapsed && <UserAddOutlined style={{ margin: '12px', fontSize: '40px', color: theme().color }} onClick={() => setOpen2(true)} />}
              {!collapsed && <SettingOutlined style={{ margin: '12px', fontSize: '40px', color: theme().color }} onClick={() => setOpen4(true)} />}
              <BarsOutlined style={{ margin: '12px', fontSize: '40px', color: theme().color }} onClick={() => setOpen(true)} />
            </div>
            <Menu theme="dark" mode="inline" items={items || itemNewPeople} onSelect={selectMenu} />
          </Sider>

          <Layout>
            <Header style={{ padding: 4, background: theme().background, textAlign: 'center' }}>
              {chatSelect ? chatSelect.chatName : 'Chat'}
            </Header>

            <Content style={{ padding: '0 16px', backgroundColor: theme().background }}>
              {chatSelect ? <Chat user={user} chatSelect={chatSelect} /> : <div>Select a chat</div>}
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: theme().background }}>
              Gabriel Diaz y Eduardo Castillo
            </Footer>
          </Layout>
        </Layout>
      </>
  );
};

export default Main;
