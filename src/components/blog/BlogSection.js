import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { getAllPosts } from "../../services/blogsApi";
import BlogItem from "./BlogItem";

function BlogSection({ innerRef }) {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const limit = 10; // Number of blogs per page

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery); // Update debounced query after delay
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchBlogs = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await getAllPosts(
        currentPage,
        limit,
        debouncedSearchQuery
      ); // Pass pagination params
      setBlogs(response.data); // Set current page's blogs
      setPage(currentPage); // Update the current page
      setTotalPages(Math.ceil(response.total / limit)); // Calculate total pages from backend response
    } catch (error) {
      console.error("Error fetching blogs: ", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, limit]);

  useEffect(() => {
    fetchBlogs(1); // Reset to the first page when query changes
  }, [fetchBlogs]);

  const handlePageChange = (event, value) => {
    fetchBlogs(value); // Fetch data for the selected page
  };

  return (
    <Box
      ref={innerRef}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      mt={'4rem'}
      mb={'4rem'}
      px={{ xs: '1rem', md: '2rem' }}
      id={"blog"}
      sx={{ width: "100%" }}
    >
      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search blogs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: "3rem",
          width: "100%",
          maxWidth: "500px",
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:hover': {
              borderColor: 'rgba(141, 83, 255, 0.5)',
            },
            '&.Mui-focused': {
              borderColor: 'rgba(141, 83, 255, 0.8)',
            }
          }
        }}
      />

      {/* Blog List Section */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ width: "100%", maxWidth: "1200px" }}
      >
        {blogs.map((blog) => (
          <Grid item xs={12} sm={10} md={8} lg={6} key={blog.id || blog.name}>
            <BlogItem blog={blog} />
          </Grid>
        ))}
      </Grid>

      {/* Loading Indicator */}
      {loading && <CircularProgress sx={{ mt: 3, color: 'primary.main' }} />}

      {/* Pagination */}
      {!loading && blogs.length > 0 && (
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'inherit',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  }
                }
              }
            }}
          />
        </Stack>
      )}

      {!loading && blogs.length === 0 && (
        <Typography 
          sx={{ 
            mt: 3, 
            fontSize: '1.2rem',
            opacity: 0.7
          }} 
          variant="h6"
        >
          No blogs found.
        </Typography>
      )}
    </Box>
  );
}

BlogSection.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default BlogSection;
