import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function BlogItem({ blog }) {
  const navigate = useNavigate();

  const handleViewBlog = () => {
    navigate(`/blog/${blog.id}`); // Navigate to blog details page
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={1.5}
      border="1px solid #ddd"
      borderRadius="6px"
      boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
    >
      {/* Image */}
      <Box
        component="img"
        src={blog.image}
        alt={blog.name}
        width="80px"
        height="80px"
        borderRadius="6px"
      />

      {/* Blog Details */}
      <Box display="flex" flexDirection="column" flex="1" ml={2}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {blog.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {moment(blog.createdAt).format("DD-MMM-YYYY [at] hh:mm A")}
        </Typography>
      </Box>

      {/* View Blog Button */}
      <Button
        variant="text"
        color="primary"
        endIcon={<ArrowForwardIcon />}
        onClick={handleViewBlog}
        sx={{
          minWidth: "fit-content",
          textTransform: "capitalize",
          fontWeight: "bold",
        }}
      >
        View Blog
      </Button>
    </Box>
  );
}

export default BlogItem;
