import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import BlogItem from './BlogItem';
import { getAllPosts } from '../../services/blogsApi';

function BlogSection({ innerRef }) {
   const [blogs, setBlogs] = useState([]);

   useEffect(() => {
      fetchBlogs();
   }, []);

   const fetchBlogs = async () => {
      try {
         const querySnapshot = await getAllPosts();
         console.log("🚀 ~ fetchBlogs ~ querySnapshot:", querySnapshot);
         setBlogs(querySnapshot.reverse());
      } catch (error) {
         console.error("Error fetching blogs: ", error);
      }
   };

   return (
      <Box ref={innerRef} display={'flex'} flexDirection={'column'} alignItems={'center'} mt={'3rem'} id={'blog'}>

         {/* Blog List Section */}
         <Grid container spacing={2} justifyContent="center" sx={{ mt: '3rem', width: '100%' }}>
            {blogs.reverse().map((blog, index) => (
               <Grid item xs={12} sm={6} md={4} lg={4} key={index}> {/* Set lg={4} to show 3 items per row */}
                  <BlogItem blog={blog} />
               </Grid>
            ))}
         </Grid>
      </Box>
   );
}

export default BlogSection;
