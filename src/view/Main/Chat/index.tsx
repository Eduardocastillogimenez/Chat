import { useState, useEffect, useRef } from 'react';
import { Row, Col, Input, Button, message, Modal, Divider, List } from 'antd';
import { SearchOutlined, FolderOpenOutlined, SendOutlined, FileOutlined } from '@ant-design/icons';
import InputEmoji from 'react-input-emoji';

import { connectToChannel, disconnectFromChannel } from '../../../utils/pusher-client';
import { Container, TextChatDiv, ContainerTableSearh } from './styles';
import { cifrarTexto, descifrarTexto } from '../utils';
import { fetchChatMessages, sendMessage } from '../../../bd/messages';

const Chat = ({ chatSelect, user }: any) => {
    const [texts, setTexts] = useState<any>(null);
    const [textsSearch, setTextsSearch] = useState<any>(null);
    const [text, setText] = useState("");
    const [open, setOpen] = useState<boolean>(false);
    const [searhMessage, setSearhMessage] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const [channelName, setChannelName] = useState('');
    const [pusherConnection, setPusherConnection] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadMessages();
        handleConnectNewMessage();
        return () => {
            disconnectFromChannel(pusherConnection, channelName);
        };
    }, [chatSelect]);

    const handleConnectNewMessage = async () => {
        const _channelName = `chat.${chatSelect.id}`;
        setChannelName(_channelName);
        const channel = connectToChannel(_channelName);
        setPusherConnection(channel);
        channel.bind(`new-message.${user.id}`, (data: any) => {
            const message = data.message;
            setTexts((prevTexts: any) => [
                ...prevTexts,
                {
                    email: message.user?.email,
                    nameUser: message.user?.name,
                    text: descifrarTexto(message.message, user?.email),
                    chat_id: message.chat_id,
                    id: message.id,
                    type: message.type,
                    file: message.file_url
                }
            ]);
        });
    };

    const loadMessages = async () => {
        const res = await fetchChatMessages(chatSelect.id, null, user.token);
        if (res) {
            const arrayText = res.data.map((e: any) => ({
                email: e.user?.email,
                nameUser: e.user?.name,
                text: descifrarTexto(e.message, user?.email),
                chat_id: e.chat_id,
                id: e.id,
                type: e.type,
                file: e.file_url
            }));
            setTexts(arrayText);
        } else {
            messageApi.open({ type: 'error', content: 'Msg not found' });
        }
    };

    const loadSpecificMessages = async () => {
        const res = await fetchChatMessages(chatSelect.id, searhMessage, user.token);
        if (res) {
            const arrayText = res.data.map((e: any) => ({
                email: e.user?.email,
                nameUser: e.user?.name,
                text: descifrarTexto(e.message, user?.email),
                chat_id: e.chat_id,
                id: e.id,
                type: e.type
            }));
            setTextsSearch(arrayText);
        } else {
            messageApi.open({ type: 'error', content: 'Msg not found' });
        }
    };

    const handleOnEnter = async (text: any) => {
        const msjSend = extractContentFromString(text);
        const msjSendEncrypted = cifrarTexto(msjSend, user?.email);
        console.log(fileInputRef)
        const res = await sendMessage({ message: msjSendEncrypted, chat_id: chatSelect.id }, user.token);
        if (res) {
            loadMessages();
            setText('');
        } else {
            messageApi.open({ type: 'error', content: 'Msg not send' });
        }
    };

    const extractContentFromString = (htmlString: string) => {
        const regex = /<[^>]*?alt=(["'])(.*?)\1|>([^<]*)/g;
        let matches = '';
        let match;

        const ind = htmlString.indexOf('<');
        if (ind !== -1) {
            matches += htmlString.substring(0, ind).trim();
        } else {
            matches += htmlString;
        }

        while ((match = regex.exec(htmlString)) !== null) {
            if (match[2]) {
                matches += match[2];
            } else if (match[3]) {
                matches += match[3].trim();
            }
        }

        return matches;
    };

    const fileInsert = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const res = await sendMessage({ chat_id: chatSelect.id, file }, user.token);
            if (res) {
                loadMessages();
                setText('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset the input value
                }
            } else {
                messageApi.open({ type: 'error', content: 'Msg file not send' });
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset the input value
                }
            }
        }
    };

    return (
        <Container>
            {contextHolder}
            <Modal
                title={<p>Type the message you wish to search for</p>}
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setTextsSearch(null);
                    setSearhMessage('');
                }}
                footer={<Button type="primary" style={{ marginTop: '12px' }} onClick={loadSpecificMessages}>Search</Button>}
            >
                <Input placeholder="Search Message" onChange={(e) => setSearhMessage(e.target.value)} value={searhMessage} />
                {textsSearch && (
                    <ContainerTableSearh>
                        <Divider orientation="left"></Divider>
                        <List
                            size="small"
                            header={<div>Messages</div>}
                            bordered
                            dataSource={textsSearch}
                            renderItem={(item: any) => (
                                <List.Item>
                                    <TextChatDiv>
                                        {item.type !== 'removed_chat' && (
                                            <div key={item.id}>
                                                <p style={item.email === user.email ? { backgroundColor: '#1677ff' } : { backgroundColor: '#1677ff33' }}>
                                                    {item.email !== user.email && <div style={{ fontSize: '12px', color: '#001529' }}>{item.nameUser}</div>}
                                                    <div>{item.text}</div>
                                                </p>
                                            </div>
                                        )}
                                    </TextChatDiv>
                                </List.Item>
                            )}
                        />
                    </ContainerTableSearh>
                )}
            </Modal>
            <Row gutter={16} style={{ height: '100%' }} align="bottom">
                <Col span={24} style={{
                    height: 'calc(100% - 60px)', maxHeight: '600px', overflowY: 'scroll', position: 'sticky',
                    scrollbarWidth: 'thin', scrollbarColor: '#525252bc rgb(255, 255, 255, 0)'
                }}>
                    <TextChatDiv>
                        {texts ? texts.map((msj: any) => (
                            msj.file ? 
                                <div style={msj.email === user.email ? { textAlign: 'end' } : { textAlign: 'start' }} key={msj.id}>
                                    <p style={msj.email === user.email ? { backgroundColor: '#1677ff' } : { backgroundColor: '#1677ff33' }}>
                                        {msj.email !== user.email && <div style={{ fontSize: '12px', color: '#001529' }}>{msj.nameUser}</div>}
                                        <div style={{ color: '#20374e' }}>File: <FolderOpenOutlined style={{ fontSize: '20px'}} onClick={()=> alert(msj.file)} />{msj.text}</div>
                                    </p>
                                </div>
                           :msj.type === 'removed_chat' ? (
                                <p style={{ backgroundColor: 'rgba(0, 0, 0, 0.405)', borderRadius: '4px' }} key={msj.id}>
                                    {msj.email !== user.email && <span style={{ fontSize: '12px', color: '#1677ffaf' }}>&nbsp;{msj.nameUser}</span>}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; o &#160;&nbsp; o &#160;&nbsp; o &#160;
                                    has left the chat&nbsp; o &#160;&nbsp; o &#160;&nbsp; o &#160;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </p>
                            ) : (
                                <div style={msj.email === user.email ? { textAlign: 'end' } : { textAlign: 'start' }} key={msj.id}>
                                    <p style={msj.email === user.email ? { backgroundColor: '#1677ff' } : { backgroundColor: '#1677ff33' }}>
                                        {msj.email !== user.email && <div style={{ fontSize: '12px', color: '#001529' }}>{msj.nameUser}</div>}
                                        <div>{msj.text}</div>
                                    </p>
                                </div>
                            )
                        )) : ''}
                    </TextChatDiv>
                </Col>
                <Col span={24} style={{ padding: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button type="primary" icon={<SearchOutlined />} style={{ margin: '5px' }} onClick={() => setOpen(true)} />
                        <Button type="primary" icon={<FolderOpenOutlined />} style={{ margin: '5px' }} onClick={() => fileInputRef.current && fileInputRef.current.click()} />
                        <InputEmoji
                            value={text}
                            onChange={setText}
                            cleanOnEnter
                            onEnter={handleOnEnter}
                            shouldReturn
                            shouldConvertEmojiToImage
                            placeholder="Type a message"
                        />
                        <Button type="primary" icon={<SendOutlined />} style={{ margin: '5px' }} onClick={() => handleOnEnter(text)} />
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={fileInsert} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
