// src/components/Chatbot.js
import React, { useState } from 'react';
import { IconButton, TextField, Paper, List, ListItem, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { sender: 'user', text: input }];
            setMessages(newMessages);
            setInput('');

            try {
                const response = await axios.post('http://localhost:5001/api/chat', { user_id: 'your_user_id', question: input });
                console.log("Received response:", response.data);  // Check what is received from the server
                setMessages([...newMessages, { sender: 'bot', text: response.data.response }]);
            } catch (error) {
                console.error('Error when sending message:', error);
                setMessages([...newMessages, { sender: 'bot', text: 'Failed to get response. Please check the server.' }]);
            }
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
            <IconButton color="primary" onClick={toggleChat}>
                <ChatBubbleOutlineIcon fontSize="large" />
            </IconButton>
            {isOpen && (
                <Paper style={{ width: 300, height: 400, overflow: 'auto', padding: 16 }}>
                    <Typography variant="h6">Chat with Us</Typography>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem key={index}>
                                <Typography color={msg.sender === 'user' ? 'primary' : 'secondary'}>
                                    {msg.sender === 'user' ? `You: ${msg.text}` : `Bot: ${msg.text}`}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={handleSend}>
                                    <SendIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Paper>
            )}
        </div>
    );
};

export default Chatbot;