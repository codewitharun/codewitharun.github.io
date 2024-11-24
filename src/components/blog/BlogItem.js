import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function BlogItem({ innerRef, blog }) {
    const navigate = useNavigate();

    const handleViewBlog = () => {
        navigate(`/blog/${blog.id}`); // Passing the blog ID to the URL
    };

    return (
        <Box
            ref={innerRef}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            border="1px solid #ccc"
            borderRadius="8px"
        >
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    component="img"
                    src={blog.image}
                    alt={blog.name}
                    width="100px"
                    height="100px"
                    borderRadius="8px"
                />
                <Typography variant="h6">{blog.name}</Typography>
                <Typography variant="h7">{moment(blog.createdAt).format('DD-MMM-YYYY [at] hh:mm A')}</Typography>
            </Box>
            <Button variant="outlined" color="primary" onClick={handleViewBlog}>
                View Blog
            </Button>
        </Box>
    );
}

export default BlogItem;
