import api from './api';

const authService = {
    /**
     * Sign up a new user
     * @param {string} username - User's username
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise} Response with user data
     */
    signup: async (username, email, password) => {
        const response = await api.post('/api/v1/auth/signup', {
            username,
            email,
            password,
        });
        return response.data;
    },

    /**
     * Login user
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise} Response with token and user data
     */
    login: async (email, password) => {
        const response = await api.post('/api/v1/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    /**
     * Logout user
     * @returns {Promise} Response confirming logout
     */
    logout: async () => {
        const response = await api.post('/api/v1/auth/logout');
        return response.data;
    },

    /**
     * Refresh access token
     * @returns {Promise} Response with new access token
     */
    refreshToken: async () => {
        const response = await api.post('/api/v1/auth/refresh-token');
        return response.data;
    },
};

export default authService;
