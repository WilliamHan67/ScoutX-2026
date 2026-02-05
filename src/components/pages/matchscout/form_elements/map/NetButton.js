import { Button } from "@mui/material";
import { IntakeElement, IntakeLocations } from "../../../../MatchConstants";

export default function NetButton({
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
  setIsMissed,
}) {
  return (
    <Button
      onClick={() => {
        if (selectedIntakeElement == IntakeElement.ALGAE) {
          isMissed
            ? data.addOuttakeEntry(
                stage,
                selectedIntakeElement,
                selectedIntakeLocation,
                elapsedTime,
                "MISSED NET"
              )
            : data.addOuttakeEntry(
                stage,
                selectedIntakeElement,
                selectedIntakeLocation,
                elapsedTime,
                "NET"
              );
          setIsMissed(false);
        }
        setSelectedIntakeElement(0);
        setSelectedIntakeLocation(0);
        stopStopwatch();
      }}
      variant={"outlined"}
      color={"inherit"}
      sx={{
        position: "absolute",
        minWidth: "unset",
        minHeight: "unset",
        width: `${(8.3 / 100) * boxDimensions.width}px`,
        height: `${(39 / 100) * boxDimensions.height}px`,
        top: `${y}%`,
        left: `${x}%`,
      }}
      disabled={
        selectedIntakeElement == 0 ||
        selectedIntakeLocation == 0 ||
        selectedIntakeElement == IntakeElement.CORAL
      }
    ></Button>
  );
}
