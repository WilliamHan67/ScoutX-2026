import { Button } from "@mui/material";
import { IntakeElement } from "../../../../MatchConstants";

export default function IntakeButton({
    width, 
    height, 
    element,
    selectedIntakeElement,
    setSelectedIntakeElement,
    selectedIntakeLocation,
    setSelectedIntakeLocation,
}) {
    const label = `${element}`;
    const isSelected = 
        selectedIntakeElement === (element === "Coral" ? IntakeElement.CORAL : IntakeElement.ALGAE);

    return (
        <Button
            onClick={() =>
                setSelectedIntakeElement(
                    element === "Coral" ? IntakeElement.CORAL : IntakeElement.ALGAE
                )
            }
            variant={isSelected ? "outlined" : "outlined"} 
            color={isSelected ? "primary" : "inherit"} 
            sx={{
                width: `${width}px`,
                height: `${height}px`,
                left: "-4px",
                fontSize: "0.8rem",
                borderColor: isSelected ? "primary.main" : "inherit", 
                color: isSelected ? "white" : "inherit", 
                paddingBottom: "35px"
            }}
            disabled={selectedIntakeLocation !== 0}
        >
            {"Intake " + label}
        </Button>
    );
}