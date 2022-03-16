import {useRef} from 'react';
import * as React from 'react';

const Canvas = (props) => {

    const canvasRef = useRef(null); 
    const provider = props.providerref; 

    React.useEffect(() => {
        const canvas = canvasRef.current; 
        const context = canvas.getContext('2d'); 
        
        provider.interval = setInterval(() => {
            provider.draw(context);  
        }, 100); 
        
    }, [provider]);

    return <canvas id="drawingCanvas" ref={canvasRef} {...props} />; 
}

export default Canvas; 
  