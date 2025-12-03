import {
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchBlogs(1); // Reset to the first page when query changes
  }, [debouncedSearchQuery]);

  const fetchBlogs = async (currentPage = 1) => {
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
  };

  const handlePageChange = (event, value) => {
    fetchBlogs(value); // Fetch data for the selected page
  };

  return (
    <Box
      ref={innerRef}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      // mt={'3rem'}
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
          mb: "2rem",
          width: "100%",
          maxWidth: "400px",
        }}
      />

      {/* Blog List Section */}
      <Grid
        container
        columns={2}
        spacing={2}
        justifyContent="center"
        sx={{ width: "60%" }}
      >
        {blogs.map((blog, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index.toString()}>
            <BlogItem blog={blog} />
          </Grid>
        ))}
      </Grid>

      {/* Loading Indicator */}
      {loading && <CircularProgress sx={{ mt: 3 }} />}

      {/* Pagination */}
      {!loading && blogs.length > 0 && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}

      {!loading && blogs.length === 0 && (
        <Typography sx={{ mt: 3 }} variant="h6">
          No blogs found.
        </Typography>
      )}
    </Box>
  );
}

export default BlogSection;
