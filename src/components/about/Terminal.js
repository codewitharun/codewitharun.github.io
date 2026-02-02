import React from 'react';
import Style from "./Terminal.module.scss";
import classNames from "classnames";
import { Box } from "@mui/material";
import { motion } from 'framer-motion';

const iconClass = "fa fa-circle";

function Terminal(props) {
   const { text } = props;

   return (
      <motion.div
         whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300, damping: 20 }
         }}
         style={{ width: '100%', marginBottom: '2rem' }}
      >
         <Box 
            component={'section'} 
            className={classNames(Style.terminal, Style.shadowed)}
            width={'100%'} 
            borderRadius={'1rem'} 
            overflow={'hidden'}
            sx={{
               background: 'rgba(39, 36, 47, 0.95)',
               backdropFilter: 'blur(10px)',
               WebkitBackdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
         >
            <Box 
               sx={{ 
                  background: 'linear-gradient(135deg, #2d2d2d, #1a1a1a)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
               }} 
               fontSize={'0.9rem'}
            >
               <i className={classNames(iconClass, Style.red)} />
               <i className={classNames(iconClass, Style.amber)} />
               <i className={classNames(iconClass, Style.green)} />
               <Box 
                  component={'span'} 
                  sx={{ 
                     ml: 'auto', 
                     fontSize: '0.8rem', 
                     opacity: 0.7,
                     fontFamily: 'JetBrains Mono, monospace'
                  }}
               >
                  terminal
               </Box>
            </Box>
            <Box 
               py={{ xs: '1.5rem', md: '2rem' }} 
               px={{ xs: '1.5rem', md: '2.5rem' }} 
               sx={{ 
                  backgroundColor: 'rgba(27, 27, 39, 0.8)',
                  color: '#e0e0e0'
               }} 
               fontSize={{ xs: '0.9rem', md: '1rem' }} 
               fontFamily={'JetBrains Mono, Courier New, Courier, monospace'}
               lineHeight={1.8}
            >
               {text}
            </Box>
         </Box>
      </motion.div>
   );
}

export default Terminal;
