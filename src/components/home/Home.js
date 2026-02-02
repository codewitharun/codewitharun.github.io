import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Style from './Home.module.scss';
import me from '../../img/self.png';
import classNames from 'classnames';
import EmojiBullet from "./EmojiBullet";
import SocialIcon from "./SocialIcon";
import HireMeModal from "./HireMeModal";
import { Box, Button } from "@mui/material";
import { info } from "../../info/Info";
import { motion } from 'framer-motion';

// Fun, catchy titles that rotate
const catchyTitles = [
  "🚀 Code Wizard & Mobile Magician",
  "💻 Building Apps That Don't Suck",
  "⚡ Turning Coffee Into Code Since 2020",
  "🎯 Full-Stack Ninja & React Native Rockstar",
  "🔥 Making Mobile Apps Great Again",
  "✨ Crafting Digital Experiences",
  "🎨 UI/UX Enthusiast & Code Artist",
  "🚀 Shipping Apps Like It's Hot",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2
    }
  },
  hover: {
    scale: 1.05,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function Home({ innerRef }) {
   const [displayedText, setDisplayedText] = useState('');
   const [displayedSubtitle, setDisplayedSubtitle] = useState('');
   const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
   const [isTyping, setIsTyping] = useState(true);
   const [modalOpen, setModalOpen] = useState(false);

   const greeting = "Hi, I'm ";
   const name = info.firstName;
   const subtitle = `${info.position} · ${info.location}`;
   const currentCatchyTitle = catchyTitles[currentTitleIndex];

   // Typing animation for greeting and name
   useEffect(() => {
      let index = 0;
      const fullText = greeting;
      const interval = setInterval(() => {
         if (index < fullText.length) {
            setDisplayedText(fullText.substring(0, index + 1));
            index++;
         } else {
            clearInterval(interval);
            // After greeting, add name with gradient
            setTimeout(() => {
               setDisplayedText(greeting + name);
               setIsTyping(false);
            }, 300);
         }
      }, 100);

      return () => clearInterval(interval);
   }, [greeting, name]);

   // Typing animation for subtitle
   useEffect(() => {
      if (!isTyping) {
         let index = 0;
         const interval = setInterval(() => {
            if (index < subtitle.length) {
               setDisplayedSubtitle(subtitle.substring(0, index + 1));
               index++;
            } else {
               clearInterval(interval);
            }
         }, 50);

         return () => clearInterval(interval);
      }
   }, [isTyping, subtitle]);

   // Rotate catchy titles
   useEffect(() => {
      if (!isTyping && displayedSubtitle === subtitle) {
         const interval = setInterval(() => {
            setCurrentTitleIndex((prev) => (prev + 1) % catchyTitles.length);
         }, 4000);
         return () => clearInterval(interval);
      }
   }, [isTyping, displayedSubtitle, subtitle]);

   return (
      <Box 
         ref={innerRef} 
         component="main" 
         display="flex" 
         flexDirection="column"
         alignItems="center"
         justifyContent="center" 
         minHeight="calc(100vh - 175px)" 
         id="home"
         sx={{ position: 'relative', zIndex: 1 }}
      >
         <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ 
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               width: '100%'
            }}
            className={Style.homeContainer}
         >
            {/* Profile Avatar - Mobile: Top, Desktop: Left */}
            <motion.div
               variants={avatarVariants}
               whileHover="hover"
               className={Style.avatarContainer}
            >
               <Box 
                  className={classNames(Style.avatar, Style.shadowed)} 
                  alt="profile" 
                  component="img" 
                  src={me} 
                  sx={{
                     width: { xs: '280px', md: '400px' },
                     height: { xs: '280px', md: '400px' },
                     borderRadius: '50%',
                     padding: '0.75rem',
                     background: info.gradient,
                  }}
               />
            </motion.div>

            {/* Text + Socials - Mobile: Below Image, Desktop: Right */}
            <motion.div
               variants={itemVariants}
               className={Style.textContainer}
            >
               <Box display="flex" flexDirection="column">
                  <motion.h1
                     variants={itemVariants}
                     className={Style.title}
                  >
                     {(() => {
                        const isTypingGreeting = displayedText.startsWith(greeting) && !displayedText.includes(name);
                        const isComplete = displayedText === greeting + name;
                        const nameSpan = (
                           <span 
                              style={{
                                 background: info.gradient, 
                                 WebkitBackgroundClip: 'text', 
                                 WebkitTextFillColor: 'transparent',
                                 backgroundClip: 'text',
                                 fontWeight: 700
                              }}
                           >
                              {name}
                           </span>
                        );

                        if (isTypingGreeting) {
                           return (
                              <>
                                 {displayedText}
                                 {nameSpan}
                                 {isTyping && <span className={Style.cursor}>|</span>}
                              </>
                           );
                        }
                        
                        if (isComplete) {
                           return (
                              <>
                                 {greeting}
                                 {nameSpan}
                                 <span className={Style.hand}>🤚</span>
                              </>
                           );
                        }
                        
                        return (
                           <>
                              {displayedText}
                              {isTyping && <span className={Style.cursor}>|</span>}
                           </>
                        );
                     })()}
                  </motion.h1>

                  <motion.h2
                     variants={itemVariants}
                     className={Style.subtitle}
                  >
                     {displayedSubtitle}
                     {displayedSubtitle !== subtitle && isTyping && (
                        <span className={Style.cursor}>|</span>
                     )}
                  </motion.h2>

                  {/* Mini Bio */}
                  <motion.div
                     variants={itemVariants}
                  >
                     <Box component="ul" p="0.8rem" mb="0.4rem" className={Style.bioList}>
                        {info.miniBio.map((bio) => (
                           <motion.li
                              key={`${bio.emoji}-${bio.text}`}
                              variants={itemVariants}
                              whileHover={{ x: 10, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                           >
                              <EmojiBullet emoji={bio.emoji} text={bio.text} />
                           </motion.li>
                        ))}
                     </Box>
                  </motion.div>

                  {/* Dynamic Catchy Title */}
                  {displayedSubtitle === subtitle && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className={Style.catchyTitle}
                        key={currentTitleIndex}
                     >
                        {currentCatchyTitle}
                     </motion.div>
                  )}

                  {/* Socials */}
                  <motion.div
                     variants={itemVariants}
                  >
                     <Box 
                        display="flex"
                        gap="1.4rem"
                        alignItems="center"
                        justifyContent={{ xs: "center", md: "flex-start" }}
                        fontSize={{ xs: "1.9rem", md: "2.3rem" }}
                        className={Style.socials}
                        mb={{ xs: "1.5rem", md: 0 }}
                     >
                        {info.socials.map((social) => (
                           <motion.div
                              key={social.label}
                              whileHover={{ 
                                 scale: 1.2,
                                 y: -5,
                                 transition: { type: "spring", stiffness: 400, damping: 10 }
                              }}
                              whileTap={{ scale: 0.9 }}
                           >
                              <SocialIcon 
                                 link={social.link} 
                                 icon={social.icon} 
                                 label={social.label} 
                              />
                           </motion.div>
                        ))}
                     </Box>
                  </motion.div>

                  {/* Hire Me Button */}
                  <motion.div
                     variants={itemVariants}
                     style={{ width: '100%', marginTop: '1rem' }}
                  >
                     <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                     >
                        <Button
                           variant="contained"
                           onClick={() => setModalOpen(true)}
                           className={Style.hireMeButton}
                           fullWidth
                        >
                           <span className={Style.hireMeText}>Hire Me</span>
                           <span className={Style.hireMeIcon}>💼</span>
                        </Button>
                     </motion.div>
                  </motion.div>
               </Box>
            </motion.div>
         </motion.div>

         {/* Hire Me Modal */}
         <HireMeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>
   );
}

Home.propTypes = {
   innerRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.instanceOf(Element) })
   ])
};