import Grid2 from "@mui/material/Unstable_Grid2";
import {useState} from "react";
import { MatchStage } from "../../MatchConstants";

import {Box, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import {useCookies} from "react-cookie";

export default function MSPrematch(props) {
    const [cookies, setCookie] = useCookies();

    const [data, _] = useState(props.data);
    const [counter, setCounter] = useState(0);

    const update = () => {
        setCounter(counter + 1);
    };

    return (
        <>
            <Grid2 container spacing={3}>
            <TextField
                label="User Verification Code"
                variant="outlined"
                value={data.get(MatchStage.PRE_MATCH, "verificationCode")}
                onChange={(event) => { 
                    data.set(MatchStage.PRE_MATCH, "verificationCode", event.target.value);
                    update();
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Name"
                variant="outlined"
                value={data.get(MatchStage.PRE_MATCH, "name")}
                onChange={(event) => { 
                    data.set(MatchStage.PRE_MATCH, "name", event.target.value);
                    update();
                }}
                fullWidth
                margin="normal"
              />
                <TextField
                label="Team Number"
                type="number"
                variant="outlined"
                value={data.get(MatchStage.PRE_MATCH, "team")}
                onChange={(event) => { 
                    data.set(MatchStage.PRE_MATCH, "team", event.target.value);
                    update();
                }}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Match Number"
                type="number"
                variant="outlined"
                value={data.get(MatchStage.PRE_MATCH, "match")}
                onChange={(event) => { 
                    data.set(MatchStage.PRE_MATCH, "match", event.target.value);
                    update();
                }}
                fullWidth
                margin="normal"
              />

              <Box sx={{ width: "100%", my: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Alliance</InputLabel>
                <Select
                    value={data.get(MatchStage.PRE_MATCH, "alliance")}
                    onChange={(e) => {
                        data.set(MatchStage.PRE_MATCH, "alliance", e.target.value);  // Update state on change
                        update();
                    }}
                    label="Alliance"
                >
                    <MenuItem key="Blue" value="Blue">
                        Blue 
                    </MenuItem>
                    <MenuItem key="Red" value="Red">
                        Red 
                    </MenuItem>
                </Select>
              </FormControl>
              </Box>

              <Box sx={{ width: "100%" }}>
              <FormControl fullWidth>
                <InputLabel>Start Position</InputLabel>
                <Select
                    value={data.get(MatchStage.PRE_MATCH, "start_position")}
                    onChange={(e) => {
                        data.set(MatchStage.PRE_MATCH, "start_position", e.target.value);  // Update state on change
                        update();
                    }}
                    label="Start Position"
                >
                    <MenuItem key="Near Processor Side" value="Near Processor Side">
                        Near Processor Side 
                    </MenuItem>
                    <MenuItem key="Middle" value="Middle">
                        Middle 
                    </MenuItem>
                    <MenuItem key="Far Processor Side" value="Far Processor Side">
                        Far Processor Side 
                    </MenuItem>
                </Select>
              </FormControl>
              </Box>
            </Grid2>
            <Box sx={{
                my: 4
            }}/>
        </>
    );
}
