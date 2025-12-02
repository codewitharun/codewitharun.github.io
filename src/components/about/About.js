import React, { useState, useEffect } from 'react';
import Style from './About.module.scss';
import Terminal from "./Terminal";
import { Box } from "@mui/material";
import { info } from "../../info/Info";

export default function About({ innerRef }) {
    const [typedText, setTypedText] = useState('');
    const firstName = info.firstName.toLowerCase();
    const [fullText, setFullText] = useState('');

    useEffect(() => {
        setFullText(
            `<p><span style="color:${info.baseColor}">${firstName}${info.lastName.toLowerCase()}@portfolio $</span> cat about_${firstName}</p>` +
            `<p><span style="color:${info.baseColor}">about_${firstName} <span class="${Style.green}">(main)</span> $ </span>${info.bio}</p>`
        );
    }, []);

    useEffect(() => {
        if (!fullText) return;

        let index = 0;
        const interval = setInterval(() => {
            setTypedText((prev) => prev + fullText[index]);
            index++;
            if (index === fullText.length) clearInterval(interval);
        }, 25);

        return () => clearInterval(interval);
    }, [fullText]);

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
        <Box ref={innerRef} display={'flex'} flexDirection={'column'} alignItems={'center'} mt={'3rem'} id={'about'}>
            <Terminal text={<div dangerouslySetInnerHTML={{ __html: typedText }} />} />
            <Terminal text={skillsText()} />
            <Terminal text={miscText()} />
        </Box>
    );
}