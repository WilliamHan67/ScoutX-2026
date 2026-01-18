import { Button } from "@mui/material";
import { useState } from "react";

export default function DockButton({ x, y, data, stage, boxDimensions }) {
    const [climbState, setClimbState] = useState(() => {
        if (data && stage !== undefined && data.get(stage, "climb") !== undefined) {
            return data.get(stage, "climb");
        }
        return "Neither"; // Default state if data isn't ready
    });

    const handleChange = () => {
        let nextState = "Neither";
        if (climbState === "Neither") {
            nextState = "Shallow";
        } else if (climbState === "Shallow") {
            nextState = "Deep";
        } else if (climbState === "Deep") {
            nextState = "Parked";
        } else if (climbState === "Parked") {
            
        }
        setClimbState(nextState);
        const climbValue = nextState === "Neither" ? 0 : nextState === "Parked" ? 1 : nextState === "Shallow" ? 2 : 3;
        if (data && stage !== undefined) {
            data.setClimb(stage, climbValue);
        }
    };

    const getColor = () => {
        return climbState === "Neither"
            ? "grey"
            : climbState === "Deep"
            ? "blue"
            : "primary";
    };

    return (
        <Button
            onClick={handleChange}
            variant="contained"
            color={getColor()}
            sx={{
                position: "absolute",
                width: `${(11.7 / 100) * boxDimensions.height}px`,
                height: `${(39.5 / 100) * boxDimensions.height}px`,
                top: `${y}%`,
                left: `${x}%`,
                fontSize: ".6rem",
                minWidth: "unset", // Override default minWidth
                minHeight: "unset", // Override default minHeight
            }}
        >
            {climbState}
        </Button>
    );
}
