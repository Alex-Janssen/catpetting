import React, { useEffect, useState } from 'react';

const RandomCircle = ({ id, position, removeCircle, incrementScore, hoverTimeThreshold }) => {
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // State to track hovering
  const [currentPosition, setCurrentPosition] = useState(position); // State for current position
  const [velocity, setVelocity] = useState({ top: 0, left: 0 }); // Velocity state
  const [img, setImg] = useState(null)
  const randImg = () => {
    if (Math.random() > 0.5){
      return "/img/cat1.png"
    }
    return "/img/cat2.png"
  }
  if(!img){
    setImg(randImg())
  }

  // Start a timeout when hovering over the circle
  const handleMouseEnter = () => {
    console.log("Entered!")
    setIsHovered(true); // Mark as hovered
    const timeout = setTimeout(() => {
      console.log("Timeout!")
      incrementScore(); // Increment score after the hover time threshold
      removeCircle(id); // Remove the circle
    }, hoverTimeThreshold);

    setHoverTimeout(timeout); // Store the timeout to clear it later if needed
  };

  // Clear the timeout if the user stops hovering before the time threshold
  const handleMouseLeave = () => {
    setIsHovered(false); // Mark as hovered
    console.log("Leaved")
    if (hoverTimeout) {
      clearTimeout(hoverTimeout); // Clear the hover timeout
      setHoverTimeout(null); // Reset hoverTimeout
    }
  };

  const moveCircle = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const circleSize = 50;
    const maxVelocityChange = 60; // Maximum change in velocity
    const friction = 0.995; // Friction to gradually reduce speed
    var newVelocity;
    // Adjust the velocity slightly
    if (Math.random() > 0.8){
      newVelocity = {
        top: velocity.top + (Math.random() - 0.5) * maxVelocityChange,
        left: velocity.left + (Math.random() - 0.5) * maxVelocityChange,
      };
    }
    else{
      newVelocity = {
        top: velocity.top,
        left: velocity.left,
      };      
    }

    // Apply friction
    const finalVelocity = {
      top: newVelocity.top * friction,
      left: newVelocity.left * friction,
    };

    // Calculate new position based on current position and velocity
    const newTop = Math.min(Math.max(currentPosition.top + finalVelocity.top, 0), windowHeight - circleSize);
    const newLeft = Math.min(Math.max(currentPosition.left + finalVelocity.left, 0), windowWidth - circleSize);

    // Update position and velocity
    setCurrentPosition({ top: newTop, left: newLeft });
    setVelocity(finalVelocity);
  };

  useEffect(() => {
    const interval = setInterval(() => 
    {
      moveCircle()
      // Check if the circle is being hovered; don't remove if hovered
      if (!isHovered) {
        // Generate a random number; let's say there's a 20% chance (0.2)
        if (Math.random() < 0.02) {
          removeCircle(id); // Randomly remove the circle if it's not being hovered
        }
      }
    }, 100); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [id, removeCircle, hoverTimeout]);

  return (
    <img
      src={img} // Use the image source
      alt="Circle"
      style={{
        position: 'absolute',
        top: `${currentPosition.top}px`,
        left: `${currentPosition.left}px`,
        width: '50px', // Set width for the image
        height: '50px', // Set height for the image
        pointerEvents: 'auto', // Ensure pointer events work
      }}
      onMouseEnter={handleMouseEnter} // Start hover timer
      onMouseLeave={handleMouseLeave} // Cancel hover timer
    />
  );
};

const App = () => {
  const [circles, setCircles] = useState([]);
  const [score, setScore] = useState(0);
  const [blessing, setBlessing] = useState("Normalcy")
  const [isGameOver, setIsGameOver] = useState(false); // Track if the game is over
  const [timer, setTimer] = useState(10); // Initialize the timer with 60 seconds

  const getRandomPosition = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const circleSize = 50;

    const randomTop = Math.random() * (windowHeight - circleSize);
    const randomLeft = Math.random() * (windowWidth - circleSize);

    return { top: randomTop, left: randomLeft };
  };

  const spawnCircle = () => {
    const newCircle = {
      id: Math.random().toString(36).substring(7), // Unique id
      position: getRandomPosition(),
    };
    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  const adjustBlessing = () => {
    if (Math.random() > 0.85){
      var r = Math.random()
      if(r > 0.95){
        setBlessing("Abundance of Cats")
      }
      else if(r < 0.15){
        setBlessing("Drought of Cats")
      }
      else{
        setBlessing("Normalcy")
      }
    }
  }

  const removeCircle = (id) => {
    setCircles((prevCircles) => prevCircles.filter((circle) => circle.id !== id));
  };

  const incrementScore = () => {
    setScore((prevScore) => prevScore + 1); // Increase score by 1
  };

  const generateHoverTimeThreshold = () => {
    var r = Math.random()
    if (r > 0.9) {
      return 5
    }
    if (r > 0.5) {
      return 500
    }
    if (r > 0.1) {
      return 750
    }
    return 3000
  };

  useEffect(() => {
    const interval = setInterval(() => {
      adjustBlessing()
      var threshold = 0.5
      switch (blessing){
        case "Normalcy":
          threshold = 0.5
          break;
          case "Abundance of Cats":
            threshold = 0.01
            break;   
          case "Drought of Cats":
            threshold = 0.975
            break;     
      }
      if (!isGameOver && Math.random() > 0.5) {
        spawnCircle(); // 50% chance to spawn a new circle
      }
      if (timer === 0) {
        setIsGameOver(true); // Stop the game when timer hits zero
      }
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1); // Decrement the timer
      }
    }, 1000);

    return () => {clearInterval(interval);
  }}, [timer]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
    {isGameOver ? (
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <h1>Game Over</h1>
        <h2>Your Score: {score}</h2>
        <h3>Happy Birthday Lena!</h3>
      </div>
    ) : (
      <>
        {/* Score display */}
        <div style={{ position: 'fixed', top: '10px', left: '10px', fontSize: '24px', fontWeight: 'bold' }}>
          Score: {score}
        </div>
        <div style={{ position: 'fixed', top: '50px', right: '10px', fontSize: '24px', fontWeight: 'bold' }}>
        Era of {blessing}
      </div>
        {/* Timer display */}
        <div style={{ position: 'fixed', top: '10px', right: '10px', fontSize: '24px', fontWeight: 'bold' }}>
          Time Left: {timer}s
        </div>

        {/* Render all circles */}
        {circles.map((circle) => (
          <RandomCircle
            key={circle.id}
            id={circle.id}
            position={circle.position}
            removeCircle={removeCircle}
            incrementScore={incrementScore}
            hoverTimeThreshold={generateHoverTimeThreshold()}
          />
        ))}
      </>
    )}
  </div>
  );
};

export default App;