import React from 'react';
import PropTypes from 'prop-types';
import PortfolioBlock from "./PortfolioBlock";
import { Box, Grid, Typography } from "@mui/material";
import { info } from "../../info/Info";
import { motion } from 'framer-motion';
import useSEO from '../../hooks/useSEO';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

export default function Portfolio({ innerRef }) {
    // SEO for Portfolio page
    useSEO({
        title: 'Portfolio | Arun Kumar - React Native Projects & Apps',
        description: 'View my portfolio of React Native mobile applications including Ageas Federal Life Insurance, Sodality, TaskFlow, EzySplit, and more. Built with React Native, TypeScript, and Firebase.',
        keywords: 'Arun Kumar Portfolio, React Native Projects, Mobile App Portfolio, React Native Apps, iOS Apps, Android Apps, Mobile Development Projects',
        url: 'https://www.arun.codes/portfolio',
        image: 'https://www.arun.codes/favicon_io/android-chrome-512x512.png'
    });
    return (
        <Box 
            id={'portfolio'} 
            ref={innerRef}
            mt={'4rem'}
            mb={'4rem'}
            px={{ xs: '1rem', md: '2rem' }}
            sx={{ width: '100%' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 800,
                        textAlign: 'center',
                        mb: '3rem',
                        background: info.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Portfolio
                </Typography>
            </motion.div>
            
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <Grid container spacing={4} display={'flex'} justifyContent={'center'}>
                    {info.portfolio.map((project) => (
                        <Grid item xs={12} sm={10} md={6} lg={4} key={project.title}>
                            <motion.div variants={itemVariants}>
                                <PortfolioBlock 
                                    image={project.image} 
                                    live={project.live} 
                                    source={project.source} 
                                    title={project.title}
                                    description={project.description}
                                    tech={project.tech}
                                    status={project.status}
                                />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>
        </Box>
    );
}

Portfolio.propTypes = {
    innerRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ])
};