import React from 'react';
import { Box } from '@mui/material';

function IconLink(props) {
   const {link, title, icon} = props;
   return (
      <Box
         component="a"
         href={link}
         target="_blank"
         rel="noopener noreferrer"
         sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'inherit',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            '&:hover': {
               opacity: 0.8,
            },
            '& i': {
               fontSize: '0.9rem',
            }
         }}
      >
         <i className={icon}/> {title}
      </Box>
   );
}

export default IconLink;