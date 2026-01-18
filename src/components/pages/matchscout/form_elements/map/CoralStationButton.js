import { Button } from "@mui/material";
import { IntakeElement, IntakeLocations } from "../../../../MatchConstants";

export default function CoralStationButton({
    x, 
    y, 
    selectedIntakeElement, 
    setSelectedIntakeElement, 
    selectedIntakeLocation, 
    setSelectedIntakeLocation,
    startStopwatch,
    stopStopwatch,
    timeElapsed,
    boxDimensions
}) {
    const isSelected = selectedIntakeLocation == IntakeLocations.STATION;
    return (
        <Button
            onClick={() => {
                setSelectedIntakeLocation(IntakeLocations.STATION);
                startStopwatch();
            }}
            variant={"outlined"}
            color={isSelected ? "primary" : "inherit"}
            sx={{
                position: "absolute",
                width: `${(18.5 / 100) * boxDimensions.height}px`,
                height: `${(16.5 / 100) * boxDimensions.height}px`,
                top: `${y}%`,
                left: `${x}%`,
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeElement == IntakeElement.ALGAE}
        >
        </Button>
    )
}