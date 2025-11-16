import { useState } from "react";
import CountDownTimer from "../components/CountDownTimer";


function MathGame(){

    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [isRunning, setIsRunning]= useState(false);
    const [startSeconds, setStartSeconds] = useState(10);


    function generateQuestion(){
        const a = Math.floor(Math.random()*10);
        const b = Math.floor(Math.random()*10);
        
    }

    return(
        <>
        
        </>
    )
};


export default MathGame;