
import React, { useState } from 'react';
import { Row, Col, Input, Button, Card } from 'antd';
import { SearchOutlined, BellOutlined, SendOutlined, FolderOpenOutlined, CarOutlined } from '@ant-design/icons';
import InputEmoji from 'react-input-emoji';

import { Container, TextChatDiv } from './styles';

const { TextArea } = Input;

const textosDePrueba = [
    'hola','hola',':)',':)','Como estas','bien','y tu','bien','ok','q bueno','si','aja','bueno chao','ok','chao','chao','chao'
]


const Chat = () => {
    const [texts, setTexts] = useState(textosDePrueba);
    const [text, setText] = useState("");

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
    
  
    function handleOnEnter (text: any) {
        console.log('enter', extractContentFromString(text));
        texts.push(extractContentFromString(text));
    }

return (
    <Container>
        <Row gutter={16} style={{ height: '100%' }} align="bottom"> 
            <Col span={24} style={{
                height: 'calc(100% - 60px)', maxHeight: '600px', overflowY: 'scroll', position: 'sticky', 
                scrollbarWidth: 'thin', scrollbarColor: '#525252bc rgb(255, 255, 255, 0)'}}
            >
                <TextChatDiv>
                    {texts.map((text, i)=>{
                        return (
                            <div style={  i % 2 !== 0 ? {textAlign: 'start'}: {textAlign: 'end'}} key={i}> 
                               <p style={  i % 2 !== 0 ? {backgroundColor: '#1677ff33'}: {backgroundColor: '#1677ff'}}>
                                    {text}
                                </p> 
                            </div>
                            
                        )
                    })}
                </TextChatDiv>
            </Col>
            <Col span={24} style={{ padding: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button type="primary" icon={<CarOutlined />} style={{ margin: '5px' }} onClick={handleClick} />
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
                    <Button type="primary" icon={<SendOutlined />} style={{ margin: '5px' }}  onClick={handleClick} />
                </div>
            </Col>
        </Row>
    </Container>
    
  );
};

export default Chat;