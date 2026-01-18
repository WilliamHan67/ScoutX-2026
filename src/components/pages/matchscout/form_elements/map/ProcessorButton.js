import { Button } from "@mui/material";
import { IntakeLocations } from "../../../../MatchConstants";

export default function ProcessorButton({
    x, 
    y, 
    selectedIntakeElement, 
    setSelectedIntakeElement, 
    selectedIntakeLocation, 
    setSelectedIntakeLocation,
    startStopwatch,
    stopStopwatch,
    elapsedTime,
    data,
    stage,
    boxDimensions,
    isMissed,
    setIsMissed
}) {
    return (
        <Button
            onClick={() => {
                isMissed ? data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "MISSED PROCESSOR") : data.addOuttakeEntry(stage, selectedIntakeElement, selectedIntakeLocation, elapsedTime, "PROCESSOR");
                setIsMissed(false); 
                setSelectedIntakeElement(0);
                setSelectedIntakeLocation(0);
                stopStopwatch();
            }}
            variant={"outlined"}
            color={"inherit"}
            sx={{
                position: "absolute",
                width: `${(24 / 100) * boxDimensions.height}px`,
                height: `${(15 / 100) * boxDimensions.height}px`,
                top: `${y}%`,
                left: `${x}%`,
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeLocation == 0}
        >
        </Button>
    )
}