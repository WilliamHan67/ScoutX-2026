import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import {Button} from "@mui/material";

export default function ReefOuttakeTable({
    selectedIntakeElement, 
    setSelectedIntakeElement, 
    setSelectedIntakeLocation,
    selectedIntakeLocation, 
    x, 
    y,
    startStopwatch,
    stopStopwatch,
    elapsedTime,
    data,
    stage,
    boxDimensions,
    isMissed,
    setIsMissed, 
}) {

    const buttonHeight = `${(16.4 / 100) * boxDimensions.height}px`;

    return (
        <Grid
            sx={{
                top: `${y}%`,
                left: `${x}%`,
                position: "absolute",
                width: `${(45 / 100) * boxDimensions.height}px`
            }}
        >
            <Stack direction={"column"} spacing={"5px"}>
                <Button
                    onClick={()=> {
                        isMissed ? data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "MISSED L4") : data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "L4"); 
                        setIsMissed(false);
                        setSelectedIntakeElement(0);
                        setSelectedIntakeLocation(0);
                        stopStopwatch();
                    }}
                    variant= "outlined"
                    color= "white"
                    maxwidth
                    sx={{
                        height: buttonHeight,
                        fontSize: "1.0rem",
                    }}
                >
                L4
                </Button>

                <Button
                    onClick={()=> {
                        isMissed ? data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "MISSED L3") : data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "L3"); 
                        setIsMissed(false);
                        setSelectedIntakeElement(0);
                        setSelectedIntakeLocation(0);
                        stopStopwatch();
                    }}
                    variant= "outlined"
                    color= "white"
                    maxwidth
                    sx={{
                        height: buttonHeight,
                        fontSize: "1.0rem",
                    }}
                >
                L3
                </Button>

                <Button
                    onClick={()=> {
                        isMissed ? data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "MISSED L2") : data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "L2"); 
                        setIsMissed(false);
                        setSelectedIntakeElement(0);
                        setSelectedIntakeLocation(0);
                        stopStopwatch();
                    }}
                    variant= "outlined"
                    color= "white"
                    maxwidth
                    sx={{
                        height: buttonHeight,
                        fontSize: "1.0rem",
                    }}
                >
                L2
                </Button>

                <Button
                    onClick={()=> {
                        isMissed ? data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "MISSED L1") : data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "L1"); 
                        setIsMissed(false);
                        setSelectedIntakeElement(0);
                        setSelectedIntakeLocation(0);
                        stopStopwatch();
                    }}
                    variant= "outlined"
                    color= "white"
                    maxwidth
                    sx={{
                        height: buttonHeight,
                        fontSize: "1.0rem",
                    }}
                >
                Trough
                </Button>
            </Stack>
        </Grid>
    );
}