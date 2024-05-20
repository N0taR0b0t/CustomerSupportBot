import React, { useState, useEffect } from 'react';
import { Button, IconButton, TextField, Paper, List, ListItem, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import Banner from './Banner';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTicketFormOpen, setTicketFormOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ticket, setTicket] = useState({ service_id: '', description: '', severity: 'Low' });
    const [services, setServices] = useState([]);
    const [bannerMessage, setBannerMessage] = useState('');
    const [bannerSuccess, setBannerSuccess] = useState(true);

    const toggleChat = () => setIsOpen(!isOpen);
    const toggleTicketForm = () => setTicketFormOpen(!isTicketFormOpen);

    const handleSend = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { sender: 'user', text: input }];
            setMessages(newMessages);
            setInput('');

            try {
                const response = await axios.post('http://localhost:5001/api/chat', { user_id: 'user_id', question: input });
                setMessages([...newMessages, { sender: 'bot', text: response.data.response }]);
            } catch (error) {
                console.error('Error when sending message:', error);
                setMessages([...newMessages, { sender: 'bot', text: 'Failed to get response. Please check the server.' }]);
            }
        }
    };

    useEffect(() => {
        axios.get('http://localhost:5001/api/services')
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
    }, []);
    
    const handleTicketChange = (e) => {
        const { name, value } = e.target;
        setTicket(prev => ({ ...prev, [name]: value }));
    };

    const submitTicket = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/tickets', ticket);
            setBannerMessage('Ticket submitted successfully!');
            setBannerSuccess(true);
            setTicketFormOpen(false);
            setTicket({ service_id: '', description: '', severity: 'Low' }); // Reset form
        } catch (error) {
            console.error('Error when submitting ticket:', error.response ? error.response.data : error.message);
            setBannerMessage(`Failed to submit ticket: ${error.response ? error.response.data.error : "Server error"}`);
            setBannerSuccess(false);
        }

        setTimeout(() => {
            setBannerMessage('');
        }, 3000);
    };

    const openNetworkStatus = () => {
        window.open('https://www.dqecom.com/network-map/', '_blank');
    };

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
            <Banner message={bannerMessage} success={bannerSuccess} />
            <IconButton color="primary" onClick={toggleChat} style={{ backgroundColor: 'white', borderRadius: '50%', padding: 25 }}>
                <ChatBubbleOutlineIcon fontSize="large" style={{ fontSize: '45px' }} />
            </IconButton>
            {isOpen && (
                <Paper style={{ width: 300, height: 475, overflow: 'auto', padding: 20 }}>
                    <Button variant="contained" color="primary" onClick={toggleTicketForm} sx={{ marginBottom: 2 }}>Create Ticket</Button>
                    {isTicketFormOpen && (
                        <form>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="service-label">Service</InputLabel>
                                <Select
                                labelId="service-label"
                                id="service-select"
                                name="service_id"
                                value={ticket.service_id}
                                label="Service"
                                onChange={handleTicketChange}
                            >
                                {services.length > 0 ? (
                                    services.map(service => (
                                        <MenuItem key={service.service_id} value={service.service_id}>
                                            {service.service_name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Services Found</MenuItem>
                                )}
                            </Select>

                            </FormControl>
                            <TextField label="Description" name="description" fullWidth margin="dense" multiline maxRows={4} value={ticket.description} onChange={handleTicketChange} />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Severity</InputLabel>
                                <Select
                                    name="severity"
                                    value={ticket.severity}
                                    label="Severity"
                                    onChange={handleTicketChange}
                                >
                                    {['Low', 'Moderate', 'High', 'Severe'].map(severity => (
                                        <MenuItem key={severity} value={severity}>{severity}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button type="button" variant="contained" color="secondary" onClick={submitTicket} sx={{ marginTop: 1, marginBottom: 1 }}>Submit Ticket</Button>
                        </form>
                    )}
                    <Button variant="contained" color="primary" sx={{ marginBottom: 2 }} onClick={openNetworkStatus}>Check Network Status</Button>
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