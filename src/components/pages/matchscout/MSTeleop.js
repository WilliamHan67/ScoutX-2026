import { useState } from "react";
import { MatchStage } from "../../MatchConstants";
import { Stack, Select, MenuItem, Button, FormControl, InputLabel } from "@mui/material";
import MapSim from "./form_elements/map/MapSim";

export default function MSTeleop({ data, handleStageChange }) {
    const [counter, setCounter] = useState(0);
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedIntakeElement, setSelectedIntakeElement] = useState(0);
    const [selectedIntakeLocation, setSelectedIntakeLocation] = useState(0);
    const [deleteData, setDeleteData] = useState(null); 
    const [isFocused, setIsFocused] = useState(null); 

    const update = () => {
        setCounter(counter + 1);
    };

    const handleDelete = () => {
        if (deleteData !== null) {
            data.delete(MatchStage.TELEOP, deleteData); 
            setDeleteData(null); 
            update(); 
        }
    }
    const getDisplayValue = () => {
        if (deleteData !== null) {
            const selectedOuttake = data.get(MatchStage.TELEOP, 'outtakeCounts')[deleteData];
            return `${selectedOuttake.intakeLocation} ${selectedOuttake.element} ${selectedOuttake.outtakeLocation}`;
        }
        return "";  // Default text when nothing is selected
    };

    return (
        <Stack direction={"column"} spacing={2}>
            {data.get(MatchStage.TELEOP, 'outtakeCounts').length > 0 && ( 
            <FormControl fullWidth>
            <InputLabel shrink={isFocused || deleteData !== null}>Previous Outtakes</InputLabel>
            <Select
                value={deleteData}
                onChange={(e) => setDeleteData(e.target.value)}  // Update state on change
                displayEmpty
                renderValue={getDisplayValue}
                label= { isFocused || deleteData !== null ? "Previous Outtakes" : ""}
                onFocus={() => setIsFocused(true)}  // Track focus
                onBlur={() => setIsFocused(false)}   // Track blur
            >
                {data.get(MatchStage.TELEOP, 'outtakeCounts').map((data, idx) => (
                    <MenuItem key={idx} value={idx}>
                        {idx + 1 + ". " + data.intakeLocation + " " + data.element + " " + data.outtakeLocation} 
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
            )}
            {deleteData != null && (
                <Button 
                    variant="outlined" 
                    color="error" 
                    sx={{ mt: 2 }} 
                    onClick={handleDelete} 
                    fullWidth>
                    Delete Outtake
              </Button>
            )}
            <Stack cc spacing={6}>
                <MapSim
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    selectedIntakeElement={selectedIntakeElement}
                    setSelectedIntakeElement={setSelectedIntakeElement}
                    selectedIntakeLocation={selectedIntakeLocation}
                    setSelectedIntakeLocation={setSelectedIntakeLocation}
                    update={update}
                    stage={MatchStage.TELEOP}
                    data={data}
                    handleStageChange={handleStageChange} // Pass the function correctly
                />
            </Stack>
        </Stack>
    );
}
