// src/services/userService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; 
// Helper to get auth header
const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.access_token) {
        return { Authorization: `Bearer ${user.access_token}` };
    }
    return {};
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.put(
            `${API_URL}/password`,
            {
                old_password: oldPassword,
                new_password: newPassword
            },
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteUser = async () => {
    try {
        const response = await axios.delete(
            `${API_URL}/user`,
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};