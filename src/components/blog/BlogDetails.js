import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

function BlogDetails() {
    const { state } = useLocation();
    const { blog } = state;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
            <Typography variant="h4" gutterBottom>
                {blog.name}
            </Typography>
            <Box
                component="img"
                src={blog.image}
                alt={blog.name}
                width="100%"
                maxHeight="400px"
                objectFit="cover"
                mb={4}
            />
            <Box
                dangerouslySetInnerHTML={{ __html: blog.content }}
                style={{ width: '70%', lineHeight: 1.6 }}
            />
        </Box>
    );
}

export default BlogDetails;
