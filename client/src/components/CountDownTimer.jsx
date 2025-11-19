import { useState, useEffect } from "react";
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

function CountDownTimer({ startTime, duration, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // reset the timer whenever startTime changes
    setTimeLeft(duration);

    const id = setInterval(() => {
      const remaining = duration - (Date.now() - startTime);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(id);
        onExpire();   // fire once
      } else {
        setTimeLeft(remaining);
      }
    }, 100);

    return () => clearInterval(id);
  }, [startTime, duration, onExpire]);

  return (
  <div className="flex justify-center">
  <div className="flex items-center gap-x-4">
    <AccessTimeRoundedIcon />
    <h2>{Math.ceil(timeLeft / 1000)}</h2>
 </div>
 </div>
  );
}

export default CountDownTimer;
