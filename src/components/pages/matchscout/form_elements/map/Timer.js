import { useState, useEffect, useRef } from "react";

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0); // Stopwatch time in seconds
  const [isRunning, setIsRunning] = useState(false); // Stopwatch running status
  const timerRef = useRef(null); // Reference to store the interval ID

  const startStopwatch = () => {
    clearInterval(timerRef.current); // Clear any existing interval
    setElapsedTime(0); // Reset elapsed time
    setIsRunning(true); // Set running state to true
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 10);
  };

  const stopStopwatch = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current); // Stop the interval
    }
  };

  //   Cleanup interval on component unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Format time to MM:SS:MS
  const formatTime = (time) => {
    const milliseconds = Math.floor((time % 1000) / 10); // Show only two digits for milliseconds
    const seconds = Math.floor((time / 1000) % 60);

    return `${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(
      2,
      "0"
    )}`;
  };

  // Return object with time functionality
  return {
    elapsedTime,
    isRunning,
    startStopwatch,
    stopStopwatch,
    formattedTime: formatTime(elapsedTime),
  };
}
