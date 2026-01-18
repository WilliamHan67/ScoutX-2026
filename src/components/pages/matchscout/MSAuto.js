import { useEffect, useRef, useState } from "react";
import { Button, MenuItem, Select, Stack, InputLabel, Box, FormControl, Collapse, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MatchStage, IntakeElement, IntakeLocations } from "../../MatchConstants";
import LeaveButton from "./form_elements/LeaveButton";
import MapSim from "./form_elements/map/MapSim";

export default function MSAuto({ data, handleStageChange }) {
    const [counter, setCounter] = useState(0);
    const [deleteData, setDeleteData] = useState(null);
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedIntakeElement, setSelectedIntakeElement] = useState(IntakeElement.CORAL);
    const [selectedIntakeLocation, setSelectedIntakeLocation] = useState(IntakeLocations.PRELOAD);
    const [isFocused, setIsFocused] = useState(false);
    const [alert, setAlert] = useState({ open: false, severity: "info", message: "Remember to switch to Tele Page" });
    const [timer, setTimer] = useState(false); 

    useEffect(() => {
        const alertTimer = setTimeout(() => {
            setAlert({ open: true, severity: "info", message: "Remember to switch to Tele Page" });
            setTimeout(() => {
                setAlert((prev) => ({ ...prev, open: false }));
                setTimer(!timer);
            }, 10000);
        }, 15000);

        return () => clearTimeout(alertTimer);
    }, [timer]);

    const update = () => {
        setCounter(counter + 1);
    };

    const handleDelete = () => {
        if (deleteData !== null) {
            data.delete(MatchStage.AUTO, deleteData);
            setDeleteData(null);
            update();
        }
    };

    const getDisplayValue = () => {
        if (deleteData !== null) {
            const selectedOuttake = data.get(MatchStage.AUTO, 'outtakeCounts')[deleteData];
            return `${selectedOuttake.intakeLocation} ${selectedOuttake.element} ${selectedOuttake.outtakeLocation}`;
        }
        return "";
    };

    return (
        <Stack direction={"column"} spacing={2}>
            <LeaveButton
                label={"Leave?"}
                value={data.get(MatchStage.AUTO, "leave")}
                onClick={(newValue) => {
                    data.set(MatchStage.AUTO, "leave", newValue);
                    update();
                }}
                showCheckbox={false}
            />
            {data.get(MatchStage.AUTO, 'outtakeCounts').length > 0 && (
                <FormControl fullWidth>
                    <InputLabel shrink={isFocused || deleteData !== null}>Previous Outtakes</InputLabel>
                    <Select
                        value={deleteData}
                        onChange={(e) => setDeleteData(e.target.value)}
                        displayEmpty
                        renderValue={getDisplayValue}
                        label={isFocused || deleteData !== null ? "Previous Outtakes" : ""}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    >
                        {data.get(MatchStage.AUTO, 'outtakeCounts').map((data, idx) => (
                            <MenuItem key={idx} value={idx}>
                                {idx + 1 + ". " + data.intakeLocation + " " + data.element + " " + data.outtakeLocation}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {deleteData != null && (
                <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={handleDelete} fullWidth>
                    Delete Outtake
                </Button>
            )}
            <Stack position="relative">
                <MapSim
                    selectedRow={selectedRow}
                    setSelectedRow={setSelectedRow}
                    selectedIntakeElement={selectedIntakeElement}
                    setSelectedIntakeElement={setSelectedIntakeElement}
                    selectedIntakeLocation={selectedIntakeLocation}
                    setSelectedIntakeLocation={setSelectedIntakeLocation}
                    update={update}
                    stage={MatchStage.AUTO}
                    data={data}
                    handleStageChange={handleStageChange}
                />
                <Collapse in={alert.open} sx={{ position: "absolute", top: 30, left: 0, right: 0, zIndex: 10 }}>
                    <Alert
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setAlert({ ...alert, open: false })}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        severity={alert.severity}
                    >
                        {alert.message}
                    </Alert>
                </Collapse>
            </Stack>
        </Stack>
    );
}
