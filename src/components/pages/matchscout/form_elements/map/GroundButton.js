import { Button } from "@mui/material";
import { IntakeElement, IntakeLocations} from "../../../../MatchConstants";

export default function GroundButton({ 
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
    const isSelected = selectedIntakeLocation == IntakeLocations.GROUND;

    return (
        <Button
            onClick={() => {
                setSelectedIntakeLocation(IntakeLocations.GROUND);
                startStopwatch();
            }}
            variant={"outlined"}
            color="inherit"
            sx={{
                position: "absolute",
                width: `${(18 / 100) * boxDimensions.height}px`,
                height: `${(46.5 / 100) * boxDimensions.height}px`,
                top: `${y}%`,
                left: `${x}%`,
            }}
            disabled={selectedIntakeElement == 0 || selectedIntakeLocation != 0}
        >
        </Button>
    );
}
