import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/blogsApi'; // Import the API function to fetch a blog by id
import Styles from "./blogDetails.module.scss";

function BlogDetails({ innerRef }) {
    const { id } = useParams(); // Get the blog ID from the URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getPostById(id); // Fetch blog details by ID
                if (response) {
                    setBlog(response);
                } else {
                    setError("Post not found");
                }
            } catch (error) {
                setError("Error fetching blog");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]); // Refetch when ID changes

    useEffect(() => {
        // Retrieve dark mode setting from local storage or default to false
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
        setDarkMode(savedDarkMode || false);
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" p={4}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    We couldn't find the post you're looking for. Please check the URL or try again later.
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            ref={innerRef}
            // className={darkMode ? Styles.dark : Styles.light} // Apply dark or light mode class
            display="flex"
            flexDirection="row"
            justifyContent="center"
            padding={2}
            gap={4}
            sx={{
                maxWidth: '100%',
                margin: '0 auto',
            }}
        >
            {/* Left Sidebar for ads (20% width) */}
            <Box
                flex={1}
                display={{ xs: 'none', sm: 'block' }} // Hidden on small screens
                padding={0}
                className="sidebar"
                borderRadius="8px"
            >

            </Box>

            {/* Main Blog Content (80% width) */}
            <Box
                flex={4}
                maxWidth="800px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={4}
                className="blog-main"
                borderRadius="8px"
                boxShadow={2}
            >
                <Typography variant="h4" gutterBottom>
                    {blog.name}
                </Typography>
                <Box
                    component="img"
                    src={blog.image}
                    alt={blog.name}
                    width="100%"

                    objectFit="cover"
                    mb={4}
                    borderRadius="8px"
                />
                <Box
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    style={{ width: '100%', lineHeight: 1.6 }}
                />
            </Box>

            {/* Right Sidebar for ads (20% width) */}
            <Box
                flex={1}
                display={{ xs: 'none', sm: 'block' }} // Hidden on small screens
                padding={0}
                className="sidebar"
                borderRadius="8px"
            >

            </Box>
        </Box>
    );
}

export default BlogDetails;
