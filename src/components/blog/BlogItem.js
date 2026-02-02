import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

function BlogItem({ blog }) {
  const navigate = useNavigate();

  const handleViewBlog = () => {
    navigate(`/blog/${blog.id}`); // Navigate to blog details page
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ width: '100%' }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        p={2}
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 60px rgba(141, 83, 255, 0.2)',
            borderColor: 'rgba(141, 83, 255, 0.5)',
          }
        }}
      >
        {/* Image */}
        <Box
          component="img"
          src={blog.image}
          alt={blog.name}
          sx={{
            width: { xs: '100%', sm: '100px' },
            height: { xs: '200px', sm: '100px' },
            borderRadius: '0.75rem',
            objectFit: 'cover',
            mb: { xs: 1, sm: 0 },
            mr: { xs: 0, sm: 2 }
          }}
        />

        {/* Blog Details */}
        <Box display="flex" flexDirection="column" flex="1" width="100%">
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
            sx={{
              mb: 0.5,
              fontSize: { xs: '1rem', md: '1.1rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {blog.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              fontSize: '0.85rem'
            }}
          >
            {moment(blog.createdAt).format("DD-MMM-YYYY [at] hh:mm A")}
          </Typography>
        </Box>

        {/* View Blog Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginTop: { xs: '1rem', sm: 0 } }}
        >
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleViewBlog}
            sx={{
              minWidth: "fit-content",
              textTransform: "capitalize",
              fontWeight: "bold",
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50px',
              px: 2,
              py: 1,
              mt: { xs: 1, sm: 0 },
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
              }
            }}
          >
            View Blog
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
}

export default BlogItem;
