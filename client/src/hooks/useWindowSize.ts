import react, { useEffect, useState } from "react";

const useWindowSize = () => {
    const [currentSize, setCurrentSize] = useState({
        "width": window.innerWidth,
        "height": window.innerHeight
    });

    useEffect(() => {
        const resizeHandle = () => {
            setCurrentSize({
                "width": window.innerWidth,
                "height": window.innerHeight
            })
        };

        window.addEventListener("resize", resizeHandle)

        return () => {
            window.removeEventListener("resize", resizeHandle);
        }
    })
    
    return currentSize
};

export default useWindowSize;