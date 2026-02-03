import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../services/blogsApi";
import Style from './blogDetails.module.scss';
import useSEO from '../../hooks/useSEO';

function BlogDetails({ innerRef }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getPostById(id);
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
  }, [id]);

  // SEO for individual blog posts
  useSEO({
    title: blog ? `${blog.name} | Arun Kumar's Blog` : 'Blog Post | Arun Kumar',
    description: blog ? `Read ${blog.name} on Arun Kumar's blog. React Native development insights, mobile app development tips, and software engineering articles.` : 'Read blog posts about React Native development and mobile app development.',
    keywords: blog ? `${blog.name}, React Native, Mobile Development, Blog Post, Arun Kumar` : 'React Native Blog, Mobile Development Blog',
    url: blog ? `https://www.arun.codes/blog/${id}` : 'https://www.arun.codes/blog',
    image: blog?.image || 'https://www.arun.codes/favicon_io/android-chrome-512x512.png'
  });

  if (loading) {
    return (
      <Box
        justifyContent="center"
        display="flex"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        p={4}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          We couldn't find the post you're looking for. Please check the URL or
          try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={innerRef}
      display="flex"
      justifyContent="center"
      width="100%"
      sx={{
        minHeight: "100vh",
        padding: { xs: "1rem 0.5rem", sm: "2rem 1rem" },
        transition: "0.3s ease",
      }}
    >
      <Box
        width="100%"
        maxWidth="750px"
        p={{ xs: 2, md: 4 }}
        borderRadius="12px"
        sx={{
          backgroundColor: "transparent",
          textAlign: "left",
          transition: "0.3s ease",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
            wordBreak: "break-word",
            color: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {blog.name}
        </Typography>

        <Box
          component="img"
          src={blog.image}
          alt={blog.name}
          sx={{
            width: "100%",
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            objectFit: "contain",
            display: "block",
            margin: "0 auto 1.5rem auto",
          }}
        />

        <Box
          className={Style.blogContent}
          dangerouslySetInnerHTML={{ __html: blog.content }}
          sx={{
            width: "100%",
            lineHeight: 1.8,
            fontSize: { xs: "1rem", sm: "1.05rem" },
            wordBreak: "break-word",
            color: "rgba(255, 255, 255, 0.9)",
          }}
        />
      </Box>
    </Box>
  );
}

export default BlogDetails;
