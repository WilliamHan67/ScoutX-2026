import { Typography, TextField, IconButton, Stack, Button, Box, Divider, Alert, Collapse } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Constants } from "../../Constants";

const HumanPlayerScout = () => {
    const [verificationCode, setVerificationCode] = useState(''); 
    const [teamNumber, setTeamNumber] = useState('');
    const [matchNumber, setMatchNumber] = useState('');
    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [alert, setAlert] = useState({open: false, message: "", severity: "success"}); 

    const handleSubmit = async () => {
        if (teamNumber !== '' && matchNumber !== '' && verificationCode === process.env.REACT_APP_VERIFICATION_CODE) {
            const humanPlayerData = { hits, misses };
            const db = getFirestore();
            await setDoc(doc(db, "humanPlayerData", teamNumber + '_' + matchNumber), humanPlayerData);
            window.location.reload();
        } else if ((teamNumber === '' || matchNumber === '') && verificationCode !== process.env.REACT_APP_VERIFICATION_CODE) {
            setAlert({open: true, message: "Incomplete Human Player Data Submission and Incorrect Verification Code", severity: "error"})
        } else if (teamNumber === '' || matchNumber === '') {
            setAlert({open: true, message: "Incomplete Human Player Data Submission", severity: "error"})
        } else {
            setAlert({open: true, message: "Incorrect Verification Code", severity: "error"})
        }
    };

    const handleVerificationCodeChange = (event) => {
        setVerificationCode(event.target.value); 
    }

    return (
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
        }}
        >
                <Stack direction="column" spacing={4} alignItems="center" width="75%">
                    <Typography color="" variant="h4" gutterBottom width="75%" textAlign="center" sx={{ 
                        color: "white", 
                        mb: 0
                    }}
                    >
                        Human Player Scout
                    </Typography>
                    <Divider sx={{ width: "75%", backgroundColor: "#bdbdbd" }} />
                    {/* Alert is now controlled by React state */}
                    <Box sx={{ width:"100%" }}>
                    <Collapse in={alert.open}>
                    <Alert
                        sx={{ mb: 0, mt: 2 }}
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
                    </Box>
                    <TextField
                        label="User Verification Code"
                        variant="outlined"
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        fullWidth
                    />   
                    <TextField
                        type="number"
                        label="Team Number"
                        variant="outlined"
                        value={teamNumber}
                        onChange={(e) => setTeamNumber(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        type="number"
                        label="Match Number"
                        variant="outlined"
                        value={matchNumber}
                        onChange={(e) => setMatchNumber(e.target.value)}
                        fullWidth
                    />
                    <Stack direction="row" spacing={1} alignItems="center" width="100%" sx={{ border: "1px solid #bdbdbd", borderRadius: 1, padding: 3 }}>
                        <IconButton onClick={() => setHits(Math.max(hits - 1, 0))}>
                            <RemoveIcon />
                        </IconButton>
                        <TextField
                            required
                            type="number"
                            value={hits}
                            label="Hits"
                            variant="filled"
                            fullWidth
                            inputProps={{ readOnly: true }}
                        />
                        <IconButton onClick={() => setHits(hits + 1)}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" width="100%" sx={{ border: "1px solid #bdbdbd", borderRadius: 1, padding: 3 }}>
                        <IconButton onClick={() => setMisses(Math.max(misses - 1, 0))}>
                            <RemoveIcon />
                        </IconButton>
                        <TextField
                            required
                            type="number"
                            value={misses}
                            label="Misses"
                            variant="filled"
                            fullWidth
                            inputProps={{ readOnly: true }}
                        />
                        <IconButton onClick={() => setMisses(misses + 1)}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={2} width="100%">
                        <Button sx={{ backgroundColor: "#ff9800", color: "white", '&:hover': { backgroundColor: "#e65100" } }} variant="contained" fullWidth onClick={handleSubmit}>
                            Submit Human Player Scout
                        </Button>
                    </Stack>
                </Stack>
        </Box>
    );
};

export default HumanPlayerScout;
