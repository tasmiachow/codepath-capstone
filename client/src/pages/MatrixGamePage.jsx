
import { useState, useEffect } from "react";


function MatrixGamePage(){
    const [ time, setTime ] = useState(0);
    const [ path, setPath ] = useState(
        [
            {
                row:0,
                col:0
            }
        ]
    );

    

    function startGame(){

    };
    
    function recordPath(){
        
    }
    
    return(
        <>
        <button onclick="">Start</button>    
        </>
    )
}

export default MatrixGamePage;