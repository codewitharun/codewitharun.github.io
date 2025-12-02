import React from 'react';
import Style from './Home.module.scss';
import me from '../../img/self.png';
import classNames from 'classnames';
import EmojiBullet from "./EmojiBullet";
import SocialIcon from "./SocialIcon";
import { Box } from "@mui/material";
import { info } from "../../info/Info";

export default function Home({ innerRef }) {
   return (
      <Box 
         ref={innerRef} 
         component="main" 
         display="flex" 
         flexDirection={{ xs: 'column', md: 'row' }} 
         alignItems="center"
         justifyContent="center" 
         minHeight="calc(100vh - 175px)" 
         id="home"
      >
         {/* Profile Avatar */}
         <Box 
            className={classNames(Style.avatar, Style.shadowed)} 
            alt="profile" 
            style={{ background: info.gradient }}
            component="img" 
            src={me} 
            width={{ xs: '35vh', md: '40vh' }}
            height={{ xs: '35vh', md: '40vh' }}
            borderRadius="50%" 
            p="0.75rem" 
            mb={{ xs: '1rem', md: 0 }} 
            mr={{ xs: 0, md: '2rem' }}
         />

         {/* Text + Socials */}
         <Box display="flex" flexDirection="column" maxWidth="500px">
            <h1>
               Hi, I'm 
               <span 
                  style={{
                     background: info.gradient, 
                     WebkitBackgroundClip: 'text', 
                     WebkitTextFillColor: 'transparent'
                  }}
               >
                  {info.firstName}
               </span>
               <span className={Style.hand}>🤚</span>
            </h1>

            <h2>I'm {info.position}.</h2>

            {/* Mini Bio */}
            <Box component="ul" p="0.8rem" mb="0.4rem">
               {info.miniBio.map((bio, index) => (
                  <EmojiBullet key={index} emoji={bio.emoji} text={bio.text} />
               ))}
            </Box>

            {/* Socials - Fixed alignment */}
            <Box 
               display="flex"
               gap="1.4rem"
               alignItems="center"
               ml="1.2rem"
               fontSize={{ xs: "1.9rem", md: "2.3rem" }}
            >
               {info.socials.map((social, index) => (
                  <SocialIcon 
                     key={index} 
                     link={social.link} 
                     icon={social.icon} 
                     label={social.label} 
                  />
               ))}
            </Box>
         </Box>
      </Box>
   );
}