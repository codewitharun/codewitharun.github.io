import axios from 'axios';

// Define the API base URL
const API_URL = 'https://api.arun.codes/api/blogs';

// Create a new Post
export const createPost = async (postData) => {
    try {
        const response = await axios.post(`${API_URL}/post`, postData);
        return response.data; // Return the response with post data
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Get all Posts
export const getAllPosts = async (page = 1, limit = 10, search = '') => {
    try {
        // Build the query string with optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search: search
        });

        // Make the API request with query parameters
        const response = await axios.get(`${API_URL}/posts?${queryParams.toString()}`);

        return response.data; // Return the response data
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};


// Get a single Post by ID
export const getPostById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/post/${id}`);
        return response.data; // Return the post data
    } catch (error) {
        console.error('Error fetching post:', error);
        throw error;
    }
};

// Edit a Post by ID
export const editPost = async (id, postData) => {
    try {
        const response = await axios.put(`${API_URL}/post/${id}`, postData);
        return response.data; // Return the success message
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

// Delete a Post by ID
export const deletePost = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/post/${id}`);
        return response.data; // Return the success message
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

// Report a Post (Flagging)
export const reportPost = async (id, reason) => {
    try {
        const response = await axios.post(`${API_URL}/post/${id}/report`, { reason });
        return response.data; // Return the success message
    } catch (error) {
        console.error('Error reporting post:', error);
        throw error;
    }
};
