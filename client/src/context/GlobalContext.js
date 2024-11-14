import { BASE_URL } from '@/utils';
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
        const [posts, setPosts] = useState([]);
        const [socket, setSocket] = useState(null);

        useEffect(() => {
                const newSocket = io(BASE_URL);
                setSocket(newSocket);

                newSocket.on('connect', () => console.log('Connected to WebSocket server'));

                newSocket.on('newPost', (post) => {
                        setPosts((prevPosts) => [post, ...prevPosts]);
                });

                return () => newSocket.close();
        }, []);

        useEffect(() => {
                const fetchPosts = async () => {
                        try {
                                const response = await fetch(`${BASE_URL}/posts/`);
                                const data = await response.json();
                                setPosts(data);
                        } catch (error) {
                                console.error('Failed to fetch posts:', error);
                        }
                };

                fetchPosts();
        }, []);

        return (
                <GlobalContext.Provider value={{ posts, setPosts }}>
                        {children}
                </GlobalContext.Provider>
        );
};