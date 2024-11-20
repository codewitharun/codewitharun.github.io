import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BlogItem from './BlogItem';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

function BlogSection({ innerRef }) {
   const [blogs, setBlogs] = useState([]);
   const [addBlog, setAddBlog] = useState(true);
   const [formData, setFormData] = useState({
      name: '',
      image: '',
      content: '',

   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleContentChange = (content) => {
      setFormData((prev) => ({ ...prev, content }));
   };

   const handleSubmit = () => {
      const newBlog = {
         id: uuidv4(),
         createdAt: new Date().toISOString(),
         ...formData
      }
      setBlogs([newBlog, ...blogs]);
      setFormData({ name: '', image: '', content: '' });
   };

   return (
      <Box ref={innerRef} display={'flex'} flexDirection={'column'} alignItems={'center'} mt={addBlog ? '3rem' : "0rem"} id={'blog'}>

         {/* Blog Input Section */}
         {addBlog &&
            <Box display="flex" flexDirection="column" width="50%" gap={2}>
               <TextField
                  label="Blog Title"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
               />
               <TextField
                  label="Image URL"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  fullWidth
               />
               <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  style={{ height: '200px' }}
               />
               <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Add Blog
               </Button>
               <Button variant="contained" color="primary" onClick={() => {
                  setAddBlog((prevAddBlog) => !prevAddBlog);
               }}>
                  Hide
               </Button>
            </Box>}

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
