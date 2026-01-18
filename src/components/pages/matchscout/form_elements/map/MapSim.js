import { Button, Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Stack } from "@mui/system";
import { useState, useEffect, useRef } from "react";
import { Constants } from "../../../../../Constants";
import RowButton from "./RowButton";
import DockButton from "./DockButton";
import {useCookies} from "react-cookie";
import GroundButton from "./GroundButton";
import { IntakeElement, MatchStage } from "../../../../MatchConstants";
import IntakeTable from "./IntakeTable";
import ProcessorButton from "./ProcessorButton";
import NetButton from "./NetButton";
import ReefButton from "./ReefButton";
import CoralStationButton from "./CoralStationButton";
import ReefOuttakeTable from "./ReefOuttakeTable";

export default function MapSim(
    {
        selectedIntakeElement,
        setSelectedIntakeElement,
        selectedIntakeLocation,
        setSelectedIntakeLocation,
        update,
        stage,
        data,
        handleStageChange
    }) 
    {
    
    //turn to all horizontal later
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
    const [cookies, setCookie] = useCookies(); 
    
    const outtakeCoral = selectedIntakeElement == IntakeElement.CORAL && selectedIntakeLocation != 0;

    const [elapsedTime, setElapsedTime] = useState(0); // Stopwatch time in seconds
    const [isRunning, setIsRunning] = useState(false); // Stopwatch running status
    const timerRef = useRef(null); // Reference to store the interval ID

    const [isMissed, setIsMissed] = useState(false); 

    useEffect(() => {
        const handleResize = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const startStopwatch = () => {
        clearInterval(timerRef.current); // Clear any existing interval
        setElapsedTime(0); // Reset elapsed time
        setIsRunning(true); // Set running state to true
        const startTime = Date.now();
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 10);
    };
    
    // Stop the stopwatch
    const stopStopwatch = () => {
        if (isRunning) {
            setIsRunning(false);
            clearInterval(timerRef.current); // Stop the interval
        }
    };
    
    // Cleanup interval on component unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    // Format time to MM:SS:MS
    const formatTime = (time) => {
        const milliseconds = Math.floor((time % 1000) / 10); // Show only two digits for milliseconds
        const seconds = Math.floor((time / 1000) % 60);

        return `${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(2, "0")}`;
    };

    const boxRef = useRef(null); // Reference to the Box container
    const [boxDimensions, setBoxDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const boxElement = boxRef.current;

        if (!boxElement) return;

        // Function to update box dimensions
        const updateBoxDimensions = () => {
            setBoxDimensions({
                width: boxElement.offsetWidth,
                height: boxElement.offsetHeight,
            });
        };

        // Create a ResizeObserver to observe changes in the box's size
        const resizeObserver = new ResizeObserver(updateBoxDimensions);
        resizeObserver.observe(boxElement); // Start observing

        // Update dimensions immediately after the initial render
        updateBoxDimensions();

        return () => resizeObserver.disconnect(); // Clean up observer on unmount
    }, []);





    const AutoMarkers = [
        <GroundButton
            x={83}
            y={26.8}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <ProcessorButton
            x={60}
            y={10}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,
        <NetButton
            x={49.4}
            y={10}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,
        <ReefButton
            x={64.5}
            y={35.5}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <CoralStationButton
            x={86.5}
            y={9}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <CoralStationButton
            x={(86.5)}
            y={74.3}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <Button
            variant={isMissed ? "contained" : "outlined"}
            color={"error"}
            onClick={() => {
                setIsMissed(!isMissed); 
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeLocation == 0}
            sx={{
                position: 'absolute',
                top: '75%',
                right: '22%',
                width: `${(34 / 100) * boxDimensions.height}px`,
                height: `${(10 / 100) * boxDimensions.height}px`,
            }}
        >
        Missed
        </Button>
    ]

    const AutoMarkersFlipped = [
        <GroundButton
            x={53.9}
            y={23.8}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <ProcessorButton
            x={73.3}
            y={71.7}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,
        <NetButton
            x={89.2}
            y={48}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,
        <ReefButton
            x={66.2}
            y={32.5}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <CoralStationButton
            x={50}
            y={6.5}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <CoralStationButton
            x={(50)}
            y={71.3}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <Button
            variant={isMissed ? "contained" : "outlined"}
            color={"error"}
            onClick={() => {
                setIsMissed(!isMissed);
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeLocation == 0}
            sx={{
                position: 'absolute',
                top: '9%',
                right: '12%',
                width: `${(34 / 100) * boxDimensions.height}px`,
                height: `${(13 / 100) * boxDimensions.height}px`,
            }}
        >
        Missed
        </Button>
    ]

    const TeleopMarkers = [...AutoMarkers];
    TeleopMarkers.push(
        <DockButton
            x={50.3}
            y={50.8}
            stage={stage}
            data={data}
            boxDimensions={boxDimensions}
        />,
    );
    
    const TeleopMarkersFlipped = [
        <GroundButton
            x={53.9}
            y={23.8}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <ProcessorButton
            x={73.3}
            y={71.7}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,
        <NetButton
            x={89.2}
            y={48}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,
        <ReefButton
            x={66.2}
            y={32.5}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <CoralStationButton
            x={50}
            y={6.5}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <CoralStationButton
            x={(50)}
            y={71.3}
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            boxDimensions={boxDimensions}
        />,
        <Button
            variant={isMissed ? "contained" : "outlined"}
            color={"error"}
            onClick={() => {
                setIsMissed(!isMissed);
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeLocation == 0}
            sx={{
                position: 'absolute',
                top: '9%',
                right: '12%',
                width: `${(34 / 100) * boxDimensions.height}px`,
                height: `${(13 / 100) * boxDimensions.height}px`,
            }}
        >
        Missed
        </Button>,
         <DockButton
            x={89.95}
            y={6.7}
            stage={stage}
            data={data}
            boxDimensions={boxDimensions}
        />
    ]


    const ReefMarkers = [
        <ReefOuttakeTable
            selectedIntakeElement={selectedIntakeElement}
            setSelectedIntakeElement={setSelectedIntakeElement}
            selectedIntakeLocation={selectedIntakeLocation}
            setSelectedIntakeLocation={setSelectedIntakeLocation}
            x={73.2}
            y={8}
            startStopwatch={startStopwatch}
            stopStopwatch={stopStopwatch}
            elapsedTime={elapsedTime}
            data={data}
            stage={stage}
            boxDimensions={boxDimensions}
            isMissed={isMissed}
            setIsMissed={setIsMissed}
        />,

        <Button
            variant={isMissed ? "contained" : "outlined"}
            color={"error"}
            onClick={() => {
                setIsMissed(!isMissed); 
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeLocation == 0}
            sx={{
                position: 'absolute',
                top: '81%',
                right: '1.8%',
                width: `${(86 / 100) * boxDimensions.height}px`,
                height: `${(11 / 100) * boxDimensions.height}px`,
            }}
        >
        Missed
        </Button>
    ]

    
    const markers = !outtakeCoral ? 
        (stage === MatchStage.AUTO
        ? (cookies.flipMap ? AutoMarkersFlipped : AutoMarkers)
        : (cookies.flipMap ? TeleopMarkersFlipped : TeleopMarkers))
        : ReefMarkers
        ;

    return (
        <Box>
        <Grid2 sx={{ position: "relative", mb: -7}}>

            <Stack direction={"column"} spacing={2}>
                <Stack>
                    <Box
                        draggable={"false"}
                        ref={boxRef}
                        component={"img"}
                        src={!outtakeCoral ? (cookies.flipMap ? Constants.fieldFlipped : Constants.field) : Constants.fieldReef}
                        sx={{
                            width: "100%",
                            height: "auto",
                        }}
                    />

                    <IntakeTable
                    sx={{
                        position: 'absolute',
                        top: isPortrait ? '8%' : '10%',
                        left: isPortrait ? '3%' : '2%'
                    }}
                    update={update}
                    stage={stage}
                    data={data}
                    selectedIntakeElement={selectedIntakeElement}
                    setSelectedIntakeElement={setSelectedIntakeElement}
                    selectedIntakeLocation={selectedIntakeLocation}
                    setSelectedIntakeLocation={setSelectedIntakeLocation}
                    handleStageChange={handleStageChange}
                    formatTime={formatTime}
                    elapsedTime={elapsedTime}
                    isRunning={isRunning}
                    startStopwatch={startStopwatch}
                    stopStopwatch={stopStopwatch}
                    setElapsedTime={setElapsedTime}
                    boxDimensions={boxDimensions}
                    />

                    <Stack direction={"column"}>
                    {markers.map((marker) => {
                        return marker;
                    })}

                    </Stack>
                </Stack>
            </Stack>
        </Grid2>
        </Box>
    )
}