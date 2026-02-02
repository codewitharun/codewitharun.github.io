import React from 'react';
import Style from './Navbar.module.scss';
import { useLocation } from "react-router-dom";
import { HashLink as Link } from 'react-router-hash-link';
import { Box } from "@mui/material";
import { info } from "../info/Info";
import { singlePage } from '../info/Info';
import { motion, useScroll, useTransform } from 'framer-motion';

const links = [
    {
        name: 'Home',
        to: '',
        active: 'home'
    },
    {
        name: 'About Me',
        to: 'about',
        active: 'about'
    },
    {
        name: info.initials,
        type: 'initials',
        to: '',
        active: 'home'
    },
    {
        name: 'Portfolio',
        to: 'portfolio',
        active: 'portfolio'
    },
    {
        name: 'Blog',
        to: 'blog',
        active: 'blog'
    }
]

// This function is used to create a scroll offset to compensate for the navbar
// when you click on the nav buttons to scroll down.
const scrollWidthOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
}

const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.1
        }
    }
};

const linkVariants = {
    hover: {
        y: -3,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

export default function Navbar({ active, setActive }) {
    const { scrollY } = useScroll();
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.8)']
    );
    const backdropFilter = useTransform(
        scrollY,
        [0, 100],
        ['blur(0px)', 'blur(20px)']
    );

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={navVariants}
            style={{
                width: '100%',
                position: singlePage ? 'fixed' : 'relative',
                top: 0,
                zIndex: 1000,
            }}
        >
            <motion.div
                style={{
                    backgroundColor,
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                }}
                className={Style.dark}
            >
                <Box component={'ul'} display={'flex'} justifyContent={'center'} alignItems={'center'}
                    gap={{ xs: '1.5rem', sm: '3rem', md: '6rem', lg: '8rem' }}
                    textTransform={'lowercase'} fontSize={'1rem'}
                    py={{ xs: '1rem', md: '1.5rem' }}
                    px={{ xs: '1rem', md: '2rem' }}
                >
                    {links.map((link, index) => (
                        <motion.li
                            key={index}
                            variants={linkVariants}
                            whileHover="hover"
                            style={{ listStyle: 'none' }}
                        >
                            <Box 
                                component={'div'} 
                                className={(link.active === active && !link.type) ? Style.active : ''}
                                sx={{ 
                                    position: 'relative',
                                    borderImageSource: info.gradient 
                                }}
                            >
                                <Link 
                                    to={singlePage ? `#${link.to}` : `/${link.to}`}
                                    scroll={el => scrollWidthOffset(el)}
                                    smooth
                                    onClick={() => setActive(link.active)} 
                                    className={Style.link}
                                >
                                    {!link.type && (
                                        <motion.p 
                                            style={{ padding: '0.5rem 0', margin: 0 }}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {link.name}
                                        </motion.p>
                                    )}
                                    {link.type && (
                                        <motion.h1 
                                            style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            {link.name}
                                        </motion.h1>
                                    )}
                                </Link>
                            </Box>
                        </motion.li>
                    ))}
                </Box>
            </motion.div>
        </motion.nav>
    )
}