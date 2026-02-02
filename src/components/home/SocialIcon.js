import React from 'react';
import { motion } from 'framer-motion';

function SocialIcon(props) {
    const {link, icon, label} = props;
    return (
        <motion.a 
            target="_blank" 
            aria-label={label}
            rel="noopener noreferrer" 
            href={link}
            whileHover={{ 
                scale: 1.2,
                rotate: [0, -10, 10, -10, 0],
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.9 }}
            style={{ display: 'inline-block' }}
        >
            <i className={icon} aria-hidden="true"/>
        </motion.a>
    );
}

export default SocialIcon;