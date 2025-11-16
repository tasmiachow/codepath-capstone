import { useState, useEffect } from "react";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';



function CountDownTimer({startSeconds, isRunning, onFinish}){
    const [seconds, setSeconds] = useState((startSeconds!=null) ? startSeconds: 10);

   useEffect(()=>{
    setSeconds(startSeconds);
   }, [startSeconds]);

   useEffect(()=>{
    if(!isRunning) return;
    if(seconds <=0) return;
    const timerId = setTimeout(()=>{
        setSeconds((prev)=>prev -1);
    },1000);
    return () => clearTimeout(timerId);
   }, [isRunning, seconds]);


   useEffect(()=>{
    if(seconds ===0 && isRunning){
        onFinish?.();
    }
   }, [seconds, isRunning, onFinish]);
    
    return(
            <div>
                <AccessTimeRoundedIcon />
                <h2>{seconds}</h2>
            </div>


    )
};


export default CountDownTimer;