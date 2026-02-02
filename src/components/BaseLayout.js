import React, { useState } from 'react';
import Style from './BaseLayout.module.scss'
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import MultiPageRoutes from './MultiPageRoutes';
import { singlePage } from '../info/Info';
import SinglePageRoutes from './SinglePageRoutes';
import useScrollObserver from '../hooks/useScrollObserver';

export default function BaseLayout() {
   const location = useLocation()

   const [active, setActive] = useState(location.pathname === '/' ? 'home' : location.pathname.slice(1, location.pathname.length));
   const refHome = useScrollObserver(setActive);
   const refAbout = useScrollObserver(setActive);
   const refPortfolio = useScrollObserver(setActive);

   return (
      <Box className={Style.dark}>
         <Grid container display={'flex'} flexDirection={'column'} minHeight={'100vh'}
            justifyContent={'space-between'}>
            <Grid item>
               <Navbar active={active} setActive={setActive} />
            </Grid>
            <Grid item flexGrow={1}>
               {singlePage ? <SinglePageRoutes refs={{ refHome, refAbout, refPortfolio }} /> : <MultiPageRoutes />}
            </Grid>
            <Grid item>
               <Box 
                  component={'footer'} 
                  display={'flex'} 
                  flexDirection={'column'} 
                  alignItems={'center'}
                  py={'2rem'} 
                  px={'1rem'}
                  sx={{ 
                     opacity: 0.8,
                     position: 'relative',
                     zIndex: 1
                  }} 
                  width={'100%'}
               >
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                     Created with ❤️ by <a href={'https://www.arun.codes'} style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 600
                     }}>Arun Kumar</a>
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.85rem' }}>&copy; ∞</p>
               </Box>
            </Grid>
         </Grid>
      </Box>
   )
}

