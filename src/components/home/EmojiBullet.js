import React from 'react';
import PropTypes from 'prop-types';
import {Box} from "@mui/material";
import { motion } from 'framer-motion';

function EmojiBullet(props) {
    const {emoji, text} = props;

    return (
        <Box 
            component={'li'} 
            fontSize={{ xs: '0.9rem', md: '1rem' }} 
            lineHeight={1.6} 
            style={{cursor: 'default'}}
            sx={{
                display: 'flex',
                alignItems: 'center',
                mb: '0.5rem'
            }}
        >
            <motion.span
                animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                }}
                style={{ 
                    marginRight: '0.75rem',
                    fontSize: '1.5rem',
                    display: 'inline-block'
                }}
                aria-label="emoji"
                role="img"
            >
                {emoji}
            </motion.span>
            <span>{text}</span>
        </Box>
    );
}

EmojiBullet.propTypes = {
    emoji: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default EmojiBullet;