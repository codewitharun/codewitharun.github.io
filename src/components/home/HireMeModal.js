import React from 'react';
import PropTypes from 'prop-types';
import { Box, Modal, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { info } from '../../info/Info';
import Style from './HireMeModal.module.scss';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export default function HireMeModal({ open, onClose }) {
  const handleCall = () => {
    // eslint-disable-next-line no-restricted-globals
    window.location.href = `tel:${info.contact.phone}`;
  };

  const handleEmail = () => {
    // eslint-disable-next-line no-restricted-globals
    window.location.href = `mailto:${info.contact.email}?subject=Hiring Inquiry - ${info.firstName} ${info.lastName}`;
  };

  const handleDownloadResume = () => {
    if (info.contact.resume && info.contact.resume !== '#') {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = info.contact.resume;
      link.download = `${info.firstName}_${info.lastName}_Resume.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback: create a mailto link if resume not available
      // eslint-disable-next-line no-restricted-globals
      window.location.href = `mailto:${info.contact.email}?subject=Resume Request - ${info.firstName} ${info.lastName}`;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={Style.modalContent}
      >
        <Box className={Style.modalHeader}>
          <Typography variant="h4" className={Style.modalTitle}>
            Let's Work Together! 🚀
          </Typography>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={Style.closeButton}
            aria-label="Close"
          >
            ×
          </motion.button>
        </Box>

        <Box className={Style.modalBody}>
          <motion.div variants={itemVariants} className={Style.contactItem}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCall}
              className={Style.contactButton}
              startIcon={<span className={Style.icon}>📞</span>}
            >
              <Box className={Style.buttonContent}>
                <Typography variant="h6" className={Style.buttonTitle}>
                  Call Me
                </Typography>
                <Typography variant="body2" className={Style.buttonSubtitle}>
                  {info.contact.phone}
                </Typography>
              </Box>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className={Style.contactItem}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleEmail}
              className={Style.contactButton}
              startIcon={<span className={Style.icon}>📧</span>}
            >
              <Box className={Style.buttonContent}>
                <Typography variant="h6" className={Style.buttonTitle}>
                  Email Me
                </Typography>
                <Typography variant="body2" className={Style.buttonSubtitle}>
                  {info.contact.email}
                </Typography>
              </Box>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className={Style.contactItem}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleDownloadResume}
              className={Style.contactButton}
              startIcon={<span className={Style.icon}>📄</span>}
            >
              <Box className={Style.buttonContent}>
                <Typography variant="h6" className={Style.buttonTitle}>
                  Download Resume
                </Typography>
                <Typography variant="body2" className={Style.buttonSubtitle}>
                  Get my latest CV
                </Typography>
              </Box>
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Modal>
  );
}

HireMeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
