import React, { useState, useEffect } from 'react';
import Style from './About.module.scss';
import Terminal from "./Terminal";
import { Box } from "@mui/material";
import { info } from "../../info/Info";
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
};

const terminalVariants = {
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

export default function About({ innerRef }) {
    const [line1Text, setLine1Text] = useState('');
    const [line2Text, setLine2Text] = useState('');
    const firstName = info.firstName.toLowerCase();
    const [line1Full, setLine1Full] = useState('');
    const [line2Full, setLine2Full] = useState('');

    useEffect(() => {
        setLine1Full(`${firstName}${info.lastName.toLowerCase()}@portfolio $ cat about_${firstName}`);
        setLine2Full(`${info.bio}`);
    }, [firstName]);

    useEffect(() => {
        if (!line1Full) return;

        let index = 0;
        const interval = setInterval(() => {
            setLine1Text(line1Full.substring(0, index + 1));
            index++;
            if (index === line1Full.length) {
                clearInterval(interval);
                // Start typing line 2 after a short delay
                setTimeout(() => {
                    let index2 = 0;
                    const interval2 = setInterval(() => {
                        setLine2Text(line2Full.substring(0, index2 + 1));
                        index2++;
                        if (index2 === line2Full.length) clearInterval(interval2);
                    }, 25);
                }, 500);
            }
        }, 25);

        return () => clearInterval(interval);
    }, [line1Full, line2Full]);

    function skillsText() {
        return (
            <>
                <p><span style={{ color: info.baseColor }}>{firstName}@skills $</span> cd skills</p>
                <p><span style={{ color: info.baseColor }}>skills <span className={Style.green}>(workspace)</span> $ </span>ls</p>

                <p style={{ color: info.baseColor }}><strong>Proficient With</strong></p>
                <ul className={Style.skills}>
                    {info.skills.proficientWith.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>

                <p style={{ color: info.baseColor }}><strong>Currently Learning</strong></p>
                <ul className={Style.skills}>
                    {info.skills.learning.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            </>
        );
    }

    function miscText() {
        return (
            <>
                <p><span style={{ color: info.baseColor }}>{firstName}@life $</span> cd hobbies</p>
                <p><span style={{ color: info.baseColor }}>hobbies <span className={Style.green}>(main)</span> $ </span>ls</p>
                <ul>
                    {info.hobbies.map((hobby, index) => (
                        <li key={index}>
                            <Box component={'span'} mr={'1rem'}>{hobby.emoji}</Box>{hobby.label}
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    return (
        <Box 
            ref={innerRef} 
            display={'flex'} 
            flexDirection={'column'} 
            alignItems={'center'} 
            mt={'4rem'} 
            mb={'4rem'}
            px={{ xs: '1rem', md: '2rem' }}
            id={'about'}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                style={{ width: '100%', maxWidth: '1200px' }}
            >
                <motion.div variants={terminalVariants}>
                    <Terminal text={
                        <div>
                            <div>
                                <span style={{ color: info.baseColor }}>{line1Text}</span>
                            </div>
                            {line1Text.length === line1Full.length && (
                                <div>
                                    <span style={{ color: info.baseColor }}>about_{firstName} </span>
                                    <span className={Style.green}>(main)</span>
                                    <span style={{ color: info.baseColor }}> $ </span>
                                    <span>{line2Text}</span>
                                </div>
                            )}
                        </div>
                    } />
                </motion.div>
                <motion.div variants={terminalVariants}>
                    <Terminal text={skillsText()} />
                </motion.div>
                <motion.div variants={terminalVariants}>
                    <Terminal text={miscText()} />
                </motion.div>
            </motion.div>
        </Box>
    );
}