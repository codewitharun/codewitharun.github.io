import React from 'react';
import IconLink from "./IconLink";
import {Box, Typography, Chip} from "@mui/material";
import { motion } from 'framer-motion';
import Style from './PortfolioBlock.module.scss';

function PortfolioBlock(props) {
   const {image, live, source, title, description, tech, status} = props;
   return (
      <motion.div
         whileHover={{ y: -10 }}
         transition={{ type: "spring", stiffness: 300, damping: 20 }}
         style={{ width: '100%' }}
      >
         <Box 
            className={Style.portfolioCard}
            display={'flex'} 
            flexDirection={'column'} 
            justifyContent={'center'} 
            alignItems={'center'}
            className={Style.portfolioCard}
            sx={{
               borderRadius: '1.5rem',
               overflow: 'hidden',
               backdropFilter: 'blur(10px)',
               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
               height: '100%',
            }}
         >
            <Box 
               component={'img'} 
               src={image} 
               alt={title}
               sx={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                     transform: 'scale(1.05)'
                  }
               }}
            />
            <Box p={'2rem'} width={'100%'} display={'flex'} flexDirection={'column'} flexGrow={1}>
               <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={1}>
                  <Typography 
                     variant="h3"
                     sx={{
                        fontSize: { xs: '1.3rem', md: '1.8rem' },
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                     }}
                  >
                     {title}
                  </Typography>
                  {status && (
                     <Chip 
                        label={status}
                        size="small"
                        sx={{
                           background: status.includes('Live') 
                              ? 'linear-gradient(135deg, rgba(39, 201, 63, 0.3), rgba(39, 201, 63, 0.4))'
                              : status.includes('Development')
                              ? 'linear-gradient(135deg, rgba(255, 189, 46, 0.3), rgba(255, 189, 46, 0.4))'
                              : 'linear-gradient(135deg, rgba(141, 83, 255, 0.3), rgba(202, 107, 230, 0.4))',
                           color: '#fff',
                           fontSize: '0.7rem',
                           fontWeight: 600,
                           border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                     />
                  )}
               </Box>
               
               {description && (
                  <Typography 
                     variant="body2"
                     className={Style.description}
                     sx={{
                        mb: '1rem',
                        fontSize: { xs: '0.85rem', md: '0.95rem' },
                        lineHeight: 1.6,
                     }}
                  >
                     {description}
                  </Typography>
               )}

               {tech && tech.length > 0 && (
                  <Box display={'flex'} flexWrap={'wrap'} gap={0.5} mb={'1.5rem'}>
                     {tech.map((item, index) => (
                        <Chip
                           key={index}
                           label={item}
                           size="small"
                           className={Style.techChip}
                           sx={{
                              fontSize: '0.7rem',
                           }}
                        />
                     ))}
                  </Box>
               )}

               <Box 
                  className={Style.portfolioLinks} 
                  display={'flex'} 
                  flexDirection={'row'}
                  gap={'0.75rem'}
                  alignItems={'center'} 
                  justifyContent={'center'}
                  fontSize={'1rem'}
                  mt={'auto'}
                  flexWrap={'wrap'}
               >
                  {live && live !== '#' && (
                     <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                     >
                        <Box 
                           className={Style.linkButton}
                           p={'0.5rem 1rem'} 
                           borderRadius={'50px'}
                           sx={{
                              background: 'linear-gradient(135deg, rgba(141, 83, 255, 0.2), rgba(202, 107, 230, 0.2))',
                              border: '1.5px solid rgba(141, 83, 255, 0.5)',
                              transition: 'all 0.3s',
                              fontSize: '0.85rem',
                              '&:hover': {
                                 background: 'linear-gradient(135deg, rgba(141, 83, 255, 0.4), rgba(202, 107, 230, 0.4))',
                                 borderColor: 'rgba(141, 83, 255, 0.8)',
                              }
                           }}
                        >
                           <IconLink link={live} title={'View App'} icon={'fa fa-external-link'}/>
                        </Box>
                     </motion.div>
                  )}
                  {source && source !== '#' && (
                     <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                     >
                        <Box 
                           className={Style.linkButton}
                           p={'0.5rem 1rem'} 
                           borderRadius={'50px'}
                           sx={{
                              background: 'linear-gradient(135deg, rgba(141, 83, 255, 0.2), rgba(202, 107, 230, 0.2))',
                              border: '1.5px solid rgba(141, 83, 255, 0.5)',
                              transition: 'all 0.3s',
                              fontSize: '0.85rem',
                              '&:hover': {
                                 background: 'linear-gradient(135deg, rgba(141, 83, 255, 0.4), rgba(202, 107, 230, 0.4))',
                                 borderColor: 'rgba(141, 83, 255, 0.8)',
                              }
                           }}
                        >
                           <IconLink link={source} title={source.includes('github') ? 'GitHub' : 'Play Store'} icon={source.includes('github') ? 'fa fa-github' : 'fa fa-google-play'}/>
                        </Box>
                     </motion.div>
                  )}
               </Box>
            </Box>
         </Box>
      </motion.div>
   );
}

export default PortfolioBlock;