import { useState, useRef, useEffect } from "react";

export default function HoldTimer({ onTimeSubmit, isHoldMode = true }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (time) => {
    const milliseconds = Math.floor((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    return `${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
  };

  const handleMouseDown = () => {
    if (!isRunning) {
      setIsHolding(true);
      setElapsedTime(0);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
      setIsRunning(true);
    }
  };

  const handleMouseUp = () => {
    if (isRunning && isHolding) {
      clearInterval(timerRef.current);
      const finalTime = elapsedTime;
      setIsRunning(false);
      setIsHolding(false);
      onTimeSubmit?.(finalTime);
    }
  };

  const handleMouseLeave = () => {
    if (isRunning && isHolding) {
      clearInterval(timerRef.current);
      const finalTime = elapsedTime;
      setIsRunning(false);
      setIsHolding(false);
      onTimeSubmit?.(finalTime);
    }
  };

  // Touch events for mobile support
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleMouseUp();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        color: isHolding ? '#e74c3c' : '#2c3e50'
      }}>
        {formatTime(elapsedTime)}
      </div>
      
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: '200px',
          height: '80px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: isHolding ? '#e74c3c' : '#3498db',
          color: 'white',
          transition: 'all 0.15s ease',
          boxShadow: isHolding 
            ? '0 4px 0 #c0392b' 
            : '0 4px 0 #2980b9',
          transform: isHolding ? 'translateY(2px)' : 'translateY(0)',
          userSelect: 'none',
          touchAction: 'manipulation'
        }}
      >
        {isHolding ? 'Recording...' : 'Hold to Time'}
      </button>
      
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#7f8c8d',
        textAlign: 'center'
      }}>
        {isHolding ? 'Release to submit' : 'Hold button to start, release to stop'}
      </div>
    </div>
  );
}
