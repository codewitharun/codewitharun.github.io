import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BlogItem from './BlogItem';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
import { getAllPosts } from '../../services/blogsApi';
function BlogSection({ innerRef }) {
   const [blogs, setBlogs] = useState([])
   useEffect(() => {
      fetchBlogs();
   }, []);
   const fetchBlogs = async () => {
      try {
         const querySnapshot = await getAllPosts()
         console.log("🚀 ~ fetchBlogs ~ querySnapshot:", querySnapshot)

         setBlogs(querySnapshot.reverse());
      } catch (error) {
         console.error("Error fetching blogs: ", error);
      }
   };

   return (
      <Box ref={innerRef} display={'flex'} flexDirection={'column'} alignItems={'center'} mt={'3rem'} id={'blog'}>

         {/* Blog Input Section */}

         {/* Blog List Section */}
         <Box display="flex" flexDirection="column" gap={2} mt={"3rem"} width="70%">
            {blogs.reverse().map((blog, index) => (
               <BlogItem key={index} blog={blog} />
            ))}
         </Box>
      </Box >
   );
}

export default BlogSection;
