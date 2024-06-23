import React, { useState } from 'react';
import {
  PieChartOutlined,
  TeamOutlined,
  BarsOutlined,
  CloseOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Avatar, Button, Row, Col } from 'antd';

import { StyleMenuMiniOption, OptionMenu, CloseMenuOption } from './styles'

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
  getItem('Pedro El enfermito de mal a peor', '4', 
    <Avatar src="https://avatars.githubusercontent.com/u/46542006?v=4" />
  ),
  getItem('Angel El 1 tap', '5', 
    <Avatar src="https://th.bing.com/th/id/OIP.8TTSjz2TpAaBuljEstggRwHaEo?rs=1&pid=ImgDetMain" />
  ),
]

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [MenuMiniOption, setMenuMiniOption] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(ite);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  

  // items.push(itemsOb('Option 111111111'))

  return (
    <>
      {MenuMiniOption?
        <StyleMenuMiniOption>
          <Row gutter={16} style={{ height: '100%', textAlign: 'end' }}>
            <Col span={12}></Col>
            <Col span={12} style={{ background: 'rgb(255, 255, 255)', padding: '3%' }}>
            <CloseMenuOption>
              <p>Close -{'>'} </p>
              <CloseOutlined onClick={()=> setMenuMiniOption(false)}/>
            </CloseMenuOption>
            
              <OptionMenu>Titulo 1</OptionMenu>
              <OptionMenu>Titulo 2</OptionMenu>
              <OptionMenu>Titulo 3</OptionMenu>
            </Col>
          </Row>
          
        </StyleMenuMiniOption>: ''
      }
      <Layout style={{ minHeight: '100vh' }} >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width='400'>
          <div style={{ textAlign: 'end' }}>
            {!collapsed ? <TeamOutlined style={{ margin:'12px', fontSize: '40px', color: 'rgb(5, 80, 80)' }} onClick={()=> alert('aaaa')} />: '' }
            <BarsOutlined style={{ margin:'12px', fontSize: '40px', color: 'rgb(5, 80, 80)' }} onClick={()=> setMenuMiniOption(true)} />
          </div>
          
          
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout >
          <Header style={{ padding: 0, background: colorBgContainer }}> hola </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Name user</Breadcrumb.Item>
            </Breadcrumb>
            <div
              style={{
                padding: 24,
                height: '100%',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              Buenas noches zorritas
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Si se quiere un Footer
          </Footer>
        </Layout>
      </Layout>
    </>
    
  );
};

export default Main;