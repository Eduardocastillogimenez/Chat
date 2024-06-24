import React, { useState } from 'react';
import {
  PieChartOutlined,
  TeamOutlined,
  BarsOutlined,
  CloseOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Avatar, Button, Row, Col, Modal } from 'antd';

import { StyleMenuMiniOption, OptionMenu, CloseMenuOption } from './styles';
import Chat from './Chat';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

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

function itemsOb(name: string){
  return getItem(name, '6', <PieChartOutlined />)
}



const ite: MenuItem[] = [
  getItem('Eduardo Castillo', '1', 
    <Avatar src="https://i.pinimg.com/originals/7d/ca/be/7dcabe92370fff0c6489aba65af5dab2.jpg" />
  ),
  getItem('Gabriel El oso abrazador por las noches', '2', 
    <Avatar src="https://avatars.githubusercontent.com/u/56564917?v=4" />
  ),
  getItem('Daniel Billingue', '3', 
    <Avatar src="https://avatars.githubusercontent.com/u/54003722?v=4" />
  ),
  getItem('Pedro El hacker', '4', 
    <Avatar src="https://avatars.githubusercontent.com/u/46542006?v=4" />
  ),
  getItem('Angel El 1 tap', '5', 
    <Avatar src="https://th.bing.com/th/id/OIP.8TTSjz2TpAaBuljEstggRwHaEo?rs=1&pid=ImgDetMain" />
  ),
]

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [items, setItems] = useState<MenuItem[]>(ite);

  function selectMenu(option: any){
      console.log(option.key)
  }
  

  // items.push(itemsOb('Option 111111111'))

  return (
    <>
      <Modal
        title={<p>Option Menu</p>}
        open={open}
        onCancel={() => setOpen(false)}
        footer="Option"
      >
        <TeamOutlined style={{ margin:'12px', fontSize: '40px', color: '#1677ffaf' }} onClick={()=> alert('aaaa')} />
      </Modal>

      <Layout style={{ minHeight: '100vh', overflowY: 'hidden' }} >

        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width='400'>
          <div style={{ textAlign: 'end' }}>
            {!collapsed ? <TeamOutlined style={{ margin:'12px', fontSize: '40px', color: 'rgb(255, 255, 255)' }} onClick={()=> alert('aaaa')} />: '' }
            <BarsOutlined style={{ margin:'12px', fontSize: '40px', color: 'rgb(255, 255, 255)' }} onClick={()=> setOpen(true)} />
          </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onSelect={(option)=> selectMenu(option)} />
        </Sider>

        <Layout >
          <Header style={{ padding: 4, background:  'rgba(0, 0, 0, 0.271)', textAlign: 'center' }}> LA UNET CON V DE VOLVIO!🥳 </Header>

          <Content style={{ padding: '0 16px', backgroundColor: 'rgba(0, 0, 0, 0.271)'  }}>
            <Chat/>
          </Content>

          <Footer style={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.271)' }}>
            Gabriel diaz y Eduardo Castillo
          </Footer>
        </Layout>
      </Layout>
    </>
    
  );
};

export default Main;