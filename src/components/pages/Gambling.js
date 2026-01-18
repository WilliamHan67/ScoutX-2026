import React, { useState, useEffect } from 'react';
import { Avatar, Button, Card, CardContent, Grid, Stack, Typography, Box } from '@mui/material';
import { Casino } from '@mui/icons-material';
import { Wheel } from 'react-custom-roulette';

const prizes = [
    { option: "🧋 Jackpot! 🧋", style: { fontSize: '10' }},
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "🎲 Free Spin!", style: { fontSize: '10' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "🎲 Free Spin!", style: { fontSize: '10' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
    { option: "👾 Scout More!", style: { fontSize: '9' } },
];

const WheelGame = () => {
    const [wheelMounted, setWheelMounted] = useState(false);
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [message, setMessage] = useState("Click Spin to Win!");
    const [rollsRemaining, setRollsRemaining] = useState(1);

    useEffect(() => {
        setWheelMounted(true);
        return () => setWheelMounted(false);
    }, []);

    const spinWheel = () => {
        if (!wheelMounted || rollsRemaining <= 0) return;
        
        const newPrize = Math.floor(Math.random() * prizes.length);
        setPrizeNumber(newPrize);
        setMustSpin(true);
        setRollsRemaining(prev => prev - 1);
    };

    const handleStopSpinning = () => {
        setMustSpin(false);
        const prize = prizes[prizeNumber].option;

        if (prize === "🎲 Free Spin!") {
            setMessage("You won a Free Roll! Click Spin to use it.");
            setRollsRemaining(prev => prev + 1);
        } else if (prize === "👾 Scout More!") {
            setMessage('Get back to work!');
        } else {
            setMessage('Congratualtions!! 🎊🎉 Make sure to take a screenshot and send it to Eric on slack to redeem your prize.');
        }
    };

    return (
        <Box alignItems="center">
            <Stack spacing={3} alignItems="center" sx={{ padding: 3 }}>
                <Typography variant="h2" color="orange" gutterBottom>
                    Spin the Wheel!
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    Click "Spin" to test your luck!
                </Typography>
                <Typography variant="h6" color="warning.main">
                    Rolls Remaining: {rollsRemaining}
                </Typography>

                <Card raised sx={{ 
                    maxWidth: 1000, 
                    width: '100%',
                    textAlign: 'center', 
                    padding: 1, 
                    backgroundColor: 'black',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <CardContent>
                        {wheelMounted && (
                            <Wheel
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                backgroundColors={['#3e3e3e', '#fa7f05']}
                                data={prizes}
                                textColors={['#ffffff']}
                                fontFamily="Arial"
                                outerBorderColor="#000000"
                                innerBorderColor="#fa7f05"
                                onStopSpinning={handleStopSpinning}
                                spinDuration={0.8}
                            />
                        )}
                        <Typography variant="body1" color="white" mt={2}>
                            {message}
                        </Typography>
                        <Button
                            variant="contained"
                            color="warning"
                            startIcon={<Casino />}
                            onClick={spinWheel}
                            sx={{ mt: 2 }}
                            disabled={mustSpin || !wheelMounted || rollsRemaining <= 0}
                        >
                            Spin
                        </Button>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default WheelGame;