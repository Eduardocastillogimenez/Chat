import React, { useState, useEffect, useRef } from 'react';
import {
  PieChartOutlined,
  TeamOutlined,
  BarsOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import type { MenuProps, InputRef, RadioChangeEvent  } from 'antd';
import {  Layout, Menu, Avatar, Modal, message, Button, Input, Select, Typography, Radio, theme, Popconfirm } from 'antd';

import { useAuth } from "../../contex";
import { fetchData, createChat, fetchContacts, deleteChatDB } from '../../bd/chats';
import { getUserData, updateUserSettings } from '../../bd/user';
import Chat from './Chat';

const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];
const { Title } = Typography;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

interface Chat {
  id: number;
  is_group_chat: number;
  name: string;
  status: string;
}



const itemNewPeople: MenuItem[] = [
  getItem('Welcome, add a new user up', '-111', 
    <Avatar src="https://i.pinimg.com/originals/7d/ca/be/7dcabe92370fff0c6489aba65af5dab2.jpg" />
  ),
]

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [open2, setOpen2] = React.useState<boolean>(false);
  const [open3, setOpen3] = React.useState<boolean>(false);
  const [open4, setOpen4] = React.useState<boolean>(false);
  const [chatSelect, setChatSelect] = useState<any>(null);
  const [chats, setChats] = useState<any>(null);
  const [items, setItems] = useState<MenuItem[] | null>(null);
  const [contacts, setContacts] = useState<any>(null);
  const [userEmailAdd, setUserEmailAdd] = useState<any>('');
  const [nameGroup, setNameGroup] = useState<any>('');
  const [valueUserConfig, setValueUserConfig] = useState({theme: 'light'});
  const [messageApi, contextHolder] = message.useMessage();
  const [emailsNewChat, setEmailsNewChat] = useState(['']);
  const { user } = useAuth();

  async function loadChats() {
    const res = await fetchData(user?.token);
    if(res){
      console.log('load chats', res.data);
      setChats(res.data);
      const arrayItems = items ? [...items] : [];
      res.data.forEach((chat: Chat)=>{
        arrayItems.push(itemsOb(chat))
      });
      console.log('load chats arrayItems', arrayItems);
      setItems(null);
      setItems(arrayItems);
    }else{
      messageApi.open({ type: 'error', content: 'Chats and messages not found' });
    }
  }
  async function loadContacts() {
    const res = await fetchContacts(user?.token);
    if(res){
      console.log('load contacts', res.data);
      setContacts(res.data);
    }else{
      messageApi.open({ type: 'error', content: 'Contacts not found' });
    }
  }
  async function loadUserConfig() {
    const res = await getUserData(user?.token);
    if(res){
      console.log('load user config', res);
      setValueUserConfig(res);
    }else{
      messageApi.open({ type: 'error', content: 'User config not found' });
    }
  }

  useEffect(() => {
    loadChats();
    loadContacts();
    loadUserConfig();
  }, []);


  async function deleteChat(data:any){
    console.log('hola')
    const res = await deleteChatDB(data.id, user?.token);
      if(res){
        console.log('Chats Delete');
        loadChats();
        loadContacts();
        setChatSelect(null);
      }else{
        messageApi.open({ type: 'error', content: 'Chats not deleted' });
      }
  };
  
  function itemsOb(data: Chat){
    return getItem(data && data.name ? 
      <div style={{display:'relative'}}>
        {data.name} 
        <Popconfirm
          title="Delete Chat"
          description="confirm that you want to delete this chat"
          onConfirm={()=>deleteChat(data)}
        >
          <DeleteOutlined style={{right: '0', marginTop: '8px', fontSize: '20px', border: '1px black', position:'absolute'}}/>
        </Popconfirm>
    
  
        
      </div> : 'undefined', 
      `${data?.id}`, <Avatar src="https://th.bing.com/th/id/OIP.CDN83dY3lTOoX38zHLl0AgHaE8?rs=1&pid=ImgDetMain" />
    )
  }

  function selectMenu(option: any){
      setChatSelect({
        id: option.key,
        chatName: chats.find((e:any) => e.id === +option.key)?.name
      });
  }
  
  async function addChat(group?: boolean){
    const emails = emailsNewChat.filter((elemento) => {
      // Verifica si el elemento es un correo electronico
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(elemento);
    });

    const res = await createChat({
        name: group ? nameGroup.target.value : user.name,
        group: group,
        usersEmail: group ? emails : [ emailsNewChat[0] ],
      }, 
      user.token
    );
    if(res){
      const arrayItems = items ? [...items] : [];
      arrayItems.push(itemsOb(res.data));
      setItems(arrayItems);
      setEmailsNewChat(['']);
    }else{
      messageApi.open({ type: 'error', content: 'Chat add error' });
    } 
  };

  
  const handleChangeSelect = (value: any, input: boolean) => {
    console.log('search:', value, input);
    if(input){
      const array = [...emailsNewChat, userEmailAdd.target.value]; // email viejos mas nuevos
      const emailsNoRepeat = array.filter((valor, indice) => { // para evitar repeticiones de correos
        return array.indexOf(valor) === indice;
      });
      setEmailsNewChat([...emailsNoRepeat]); // emails completos
      let userAdd = userEmailAdd;
      userAdd.target.value = '';
      setUserEmailAdd(userAdd);
    }else{
      const array = [...emailsNewChat, ...value]; // email viejos mas nuevos
      const emailsNoRepeat = array.filter((valor, indice) => { // para evitar repeticiones de correos
        return array.indexOf(valor) === indice;
      });
      setEmailsNewChat([...emailsNoRepeat]); // emails completos
    }
  };

  const onChangeUserConfig = async (e: RadioChangeEvent) => {
    console.log('setValueUserConfig', e.target.value);
    // setValueUserConfig(e.target.value);
    const res = await updateUserSettings( { name: user?.name, theme: e.target.value}, user?.token);
    if(res){
      loadUserConfig();
    }else{
      messageApi.open({ type: 'error', content: 'User not updated' });
    }
    
  };

  const theme = () => {
    return {
      background: valueUserConfig.theme === "light" ? 'azure' : 'rgba(0, 0, 0, 0.271)',
      color: valueUserConfig.theme === "light" ? 'black' : 'rgb(255, 255, 255)',
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={<p>Option Menu</p>}
        open={open}
        onCancel={() => setOpen(false)}
        footer="Option"
      >
        <TeamOutlined style={{ margin:'12px', fontSize: '40px', color: '#1677ffaf' }} onClick={()=> setOpen3(true)} />
        <UserAddOutlined style={{ margin:'12px', fontSize: '40px', color: '#1677ffaf' }} onClick={()=> setOpen2(true)} />
        <SettingOutlined style={{ margin:'12px', fontSize: '40px', color: '#1677ffaf' }} onClick={()=> setOpen4(true)} />
      </Modal>
      <Modal
        title={<p>Add new chat private {'('}Email{')'}</p>}
        open={open2}
        onCancel={() => {setOpen2(false); setEmailsNewChat(['']);}}
        footer={<Button type="primary" style={{ marginTop:'12px' }} onClick={()=> {addChat(false); setOpen2(false);}}>Send</Button>}
      >
        <Input placeholder="Email" onChange={(e)=> setEmailsNewChat([e.target.value])}/>
      </Modal>
      <Modal
        title={<Title level={3}> Add new group chat </Title>}
        open={open3}
        onCancel={() => {setOpen3(false); setEmailsNewChat([''])}}
        footer={<Button type="primary" style={{ marginTop:'12px' }} onClick={()=> {addChat(true); setOpen3(false); setEmailsNewChat([''])}}>Send</Button>}
      >
        <Title level={5}> Name Group </Title>
          <Input placeholder="Name" onChange={setNameGroup} value={nameGroup?.target?.value}/>
        <Title level={5}> Add Users Chats </Title>
          <Select showSearch placeholder="Select person" optionFilterProp="label" onChange={(e)=> handleChangeSelect(e, false)} 
            mode="tags" tokenSeparators={[',']} style={{ width: '100%' }}
            options={contacts? contacts.map((e: any)=> (
              {
                value: e.email,
                label: e.name,
              }
            )) :  [ { value: '', label: '', }, ]}
          />
        <Title level={5}> Add User email specific </Title>
          <Input placeholder="Email" type='email' onChange={setUserEmailAdd} value={userEmailAdd?.target?.value}/>
          <Button type="primary" style={{ marginTop:'12px' }} onClick={()=> handleChangeSelect('', true)}>Add</Button>
        <Title level={5}> List users added </Title>
          {emailsNewChat.map((e)=> <p>{e}</p> )}
      </Modal>
      <Modal
        title={<Title level={3}> Change user interface theme </Title>}
        open={open4}
        onCancel={() => setOpen4(false)}
        footer={<></>}
      >
        <Title level={5}> Options </Title>
        <Radio.Group onChange={onChangeUserConfig}>
          <Radio value='dark'>Dark</Radio>
          <Radio value='light'>Light</Radio>
        </Radio.Group>
      </Modal>

      <Layout style={{ minHeight: '100vh', overflowY: 'hidden' }} >

        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width='400'>
          <div style={{ textAlign: 'end', background: theme().background }}>
            {!collapsed ? <TeamOutlined style={{ margin:'12px', fontSize: '40px', color: theme().color }} onClick={()=> setOpen3(true)} />: '' }
            {!collapsed ? <UserAddOutlined style={{ margin:'12px', fontSize: '40px', color: theme().color }} onClick={()=> setOpen2(true)} />: '' }
            {!collapsed ? <SettingOutlined style={{ margin:'12px', fontSize: '40px', color: theme().color }} onClick={()=> setOpen4(true)} />: '' }
            <BarsOutlined style={{ margin:'12px', fontSize: '40px', color: theme().color }} onClick={()=> setOpen(true)} />
          </div>
            <Menu theme="dark"  mode="inline" items={items ? items : itemNewPeople} onSelect={(option)=> selectMenu(option)} /> 
        </Sider>

        <Layout >
          <Header style={{ padding: 4, background: theme().background, textAlign: 'center' }}> { chatSelect? chatSelect.chatName: 'Chat'} </Header>

          <Content style={{ padding: '0 16px', backgroundColor: theme().background  }}>
            {chatSelect ? <Chat user={user} chatSelect={chatSelect} /> : <div> Select 1 chat </div> }
          </Content>

          <Footer style={{ textAlign: 'center', backgroundColor: theme().background }}>
            Gabriel diaz y Eduardo Castillo
          </Footer>
        </Layout>
      </Layout>
    </>
    
  );
};

export default Main;