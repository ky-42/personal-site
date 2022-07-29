import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import styled from 'styled-components';

const CanvasParent = styled.div`
    z-index: -1;
    position: fixed;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const AsteroidsBackground = () => {
    
    let CanvasParentRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        if (CanvasParentRef.current != null) {
            new p5((p: p5) => {
                p.setup = () => {
                    p.createCanvas(window.innerWidth, window.innerHeight);
                    p.background(155);
                };
            }, CanvasParentRef.current);
        }
    });

    return (
        <CanvasParent
            ref={CanvasParentRef}
        />
    );
};

export default AsteroidsBackground;