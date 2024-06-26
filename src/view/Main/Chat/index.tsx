
import { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Card, message, Modal, Divider, List } from 'antd';
import { SearchOutlined, BellOutlined, SendOutlined, FolderOpenOutlined, CarOutlined } from '@ant-design/icons';
import InputEmoji from 'react-input-emoji';

import { Container, TextChatDiv, ContainerTableSearh } from './styles';
import {cifrarTexto, descifrarTexto}  from '../utils';
import { fetchChatMessages, sendMessage } from '../../../bd/messages';

const textosDePrueba = [ 'hola','hola',':)',':)','Como estas','bien','y tu','bien','ok','q bueno','si','aja','bueno chao','ok','chao','chao','chao']

const Chat = (props: any) => {
    const [texts, setTexts] = useState<any>(null);
    const [textsSearch, setTextsSearch] = useState<any>(null);
    const [text, setText] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [searhMessage, setSearhMessage] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    
    async function loadMessages() {
        const res = await fetchChatMessages(props.chatSelect.id, null, props.user.token);
        if(res){
          console.log('load msg', res.data);
          const arrayText:any = [];
          
          res.data.forEach((e:any)=>{
            arrayText.push({
                email: e.user?.email, 
                nameUser: e.user?.name, 
                text: descifrarTexto(e.message, props?.user?.email),
                chat_id: e.chat_id,
                id: e.id,
                type: e.type
            });
          })
          setTexts(arrayText);
        }else{
          messageApi.open({ type: 'error', content: 'Msg not found' });
        }
    }

    async function loadSpecificMessages() {
        const res = await fetchChatMessages(props.chatSelect.id, searhMessage, props.user.token);
        if(res){
          console.log('load msg Specific', res.data);
          const arrayText:any = [];
          
          res.data.forEach((e:any)=>{
            arrayText.push({
                email: e.user?.email, 
                nameUser: e.user?.name, 
                text: descifrarTexto(e.message, props?.user?.email),
                chat_id: e.chat_id,
                id: e.id,
                type: e.type
            });
          })
          setTextsSearch(arrayText);
        }else{
          messageApi.open({ type: 'error', content: 'Msg not found' });
        }
    }

    useEffect(() => {
        loadMessages();
    }, [props.chatSelect]);

    const handleClick = () => {
        alert('¡Haz hecho clic en el botón!');
    };

    function extractContentFromString(htmlString: string) {
        const regex = /<[^>]*?alt=(["'])(.*?)\1|>([^<]*)/g;
        let matches = '';
        let match;

        const ind = htmlString.indexOf('<');
        if (ind !== -1) {
            const before = htmlString.substring(0, ind);
            matches = matches + before.trim();
        }else{
            matches = matches + htmlString;
        }
    
        while ((match = regex.exec(htmlString)) !== null) {
            if (match[2]) {
                // matches.push(match[2]); // Contenido del atributo alt
                matches = matches + match[2];
            } else if (match[3]) {
                // matches.push(match[3].trim()); // Texto fuera de las etiquetas
                matches = matches + match[3];
            }
        }
        
        return matches;
    }
    
  
    async function handleOnEnter (text: any) {
        const msjSend = extractContentFromString(text);
        const msjSendEncrypted = cifrarTexto(msjSend, props?.user?.email);
        // const arrayMsg = [...texts];
        // arrayMsg.push(msjSend);
        // setTexts(arrayMsg);
        const res = await sendMessage({ message: msjSendEncrypted, chat_id: props.chatSelect.id }, props.user.token );
        if(res){
            console.log('send msg ok');
            loadMessages();
            setText('');
        }else{
            messageApi.open({ type: 'error', content: 'Msg not send' });
        }
    }

    function searhMsg(){
        loadSpecificMessages();
    }

return (
    <Container>
        {contextHolder}
        <Modal
            title={<p>Type the message you wish to search for</p>}
            open={open}
            onCancel={() => {setOpen(false); setTextsSearch(null); setTextsSearch(null); setSearhMessage('')}}
            footer={<Button type="primary" style={{ marginTop:'12px' }} onClick={()=> searhMsg()}>Searh</Button>}
        >
            <Input placeholder="Searh Message" onChange={(e)=> setSearhMessage(e.target.value)} value={searhMessage}/>
            {textsSearch ? <ContainerTableSearh>
                <Divider orientation="left"></Divider>
                <List
                size="small"
                header={<div>message</div>}
                bordered
                dataSource={textsSearch}
                renderItem={(item:any) => 
                <List.Item>
                    <TextChatDiv>
                        {
                            item.type === 'removed_chat' ?'':
                            <div key={item.id}> 
                                <p style={  item.email === props.user.email ? {backgroundColor: '#1677ff'} : {backgroundColor: '#1677ff33'}}>
                                    {item.email === props.user.email? '' : <div style={{fontSize:'12px', color:'#001529'}}>{item.nameUser}</div>}
                                    <div>{item.text}</div>
                                </p> 
                            </div>
                        }
                        
                    </TextChatDiv>
                </List.Item>}
                />
            </ContainerTableSearh>: ''}
            
        </Modal>
        <Row gutter={16} style={{ height: '100%' }} align="bottom"> 
            <Col span={24} style={{
                height: 'calc(100% - 60px)', maxHeight: '600px', overflowY: 'scroll', position: 'sticky', 
                scrollbarWidth: 'thin', scrollbarColor: '#525252bc rgb(255, 255, 255, 0)'}}
            >
                <TextChatDiv>
                    {texts ? texts.map((msj:any)=>{
                        return (
                            msj.type === 'removed_chat' ? 
                               <p style={{backgroundColor: 'rgba(0, 0, 0, 0.405)', borderRadius: '4px'} }key={msj.id}>
                                    {msj.email === props.user.email? '' : <span style={{fontSize:'12px', color:'#1677ffaf'}}>&nbsp;{msj.nameUser}</span>}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; o &#160;&nbsp; o &#160;&nbsp; o &#160;
                                        has left the chat&nbsp; o &#160;&nbsp; o &#160;&nbsp; o &#160;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;             
                                </p> 
                            :<div style={  msj.email === props.user.email ? {textAlign: 'end'} : {textAlign: 'start'}} key={msj.id}> 
                               <p style={  msj.email === props.user.email ? {backgroundColor: '#1677ff'} : {backgroundColor: '#1677ff33'}}>
                                    {msj.email === props.user.email? '' : <div style={{fontSize:'12px', color:'#001529'}}>{msj.nameUser}</div>}
                                    <div>{msj.text}</div>
                                </p> 
                            </div>
                            
                        )
                    }): ''}
                </TextChatDiv>
            </Col>
            <Col span={24} style={{ padding: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" icon={<SearchOutlined />} style={{ margin: '5px' }}  onClick={()=>setOpen(true)} />
                    <Button type="primary" icon={<FolderOpenOutlined />} style={{ margin: '5px' }} onClick={handleClick} />
                    {/* <TextArea rows={2} placeholder="Buscar..." /> */}
                    <InputEmoji
                        value={text}
                        onChange={setText}
                        cleanOnEnter
                        onEnter={handleOnEnter}
                        shouldReturn
                        shouldConvertEmojiToImage
                        placeholder="Type a message"
                    />
                    {/* <Input style={{ flex: '1', marginRight: '10px' }}  /> */}
                    <Button type="primary" icon={<SendOutlined />} style={{ margin: '5px' }}  onClick={()=>handleOnEnter(text)} />
                </div>
            </Col>
        </Row>
    </Container>
    
  );
};

export default Chat;