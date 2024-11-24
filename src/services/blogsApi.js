import axios from 'axios';

// Define the API base URL
const API_URL = 'https://appaura-backend.vercel.app/api/blogs';

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
export const getAllPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts`);
        return response.data; // Return the list of posts
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
