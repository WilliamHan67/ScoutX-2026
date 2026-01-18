import { Grid, Button, Box, Typography, useMediaQuery } from "@mui/material";
import IntakeButton from "./IntakeButton";
import { Stack } from "@mui/system";
import {useCookies} from "react-cookie";
import { IntakeElement, IntakeLocations, MatchStage } from "../../../../MatchConstants";
import { Constants } from "../../../../../Constants";
import { useNavigate } from "react-router-dom";

export default function IntakeTable ({
    sx,
    update,
    stage,
    data,
    selectedIntakeElement,
    setSelectedIntakeElement,
    selectedIntakeLocation,
    setSelectedIntakeLocation,
    handleStageChange,
    formatTime,
    elapsedTime,
    isRunning,
    startStopwatch,
    stopStopwatch,
    setElapsedTime,
    boxDimensions
}) {

    const [cookies, setCookie] = useCookies(); 

    // Use `useMediaQuery` to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 960px)");
    const isSuperSmallScreen = useMediaQuery("(max-width: 800px"); 

    return (
        
        <Grid
        container
        sx={{
            position: 'absolute',
            ...sx,
        }}
        >
            <Stack 
            alignItems="center" justifyContent="center" direction={'column'} spacing={1}>

                <Stack alignContent="center" direction={'row'} spacing={1}>

                <Typography 
                    variant="h6" 
                    style={{
                    fontSize: '18px', 
                    color: 'white', 
                    margin: '-40px', 
                    position: 'relative', 
                    top: '-2px', 
                    left: '165%', 
                    }}
                >
                {"⏰: " + formatTime(elapsedTime)}
                </Typography>


                 <Box
                        draggable={"false"}
                        component={"img"}
                        src={Constants.coralGamepiece}
                        sx={{
                            position: "absolute",
                            width: "30px",
                            height: "40px",
                            top: "34%",
                            left: "9%",
                            pointerEvents: "none",
                        }}
                    />
                    <Box
                        draggable={"false"}
                        component={"img"}
                        src={Constants.algaeGamepiece}
                        sx={{
                            position: "absolute",
                            width: "40px",
                            height: "40px",
                            top: "34%",
                            left: "32%",
                            pointerEvents: "none", 
                        }}
                    />

                    <IntakeButton 
                        width={(40 / 100) * boxDimensions.height} 
                        height={(55.3 / 100) * boxDimensions.height} 
                        element={"Coral"}
                        selectedIntakeElement={selectedIntakeElement}
                        setSelectedIntakeElement={setSelectedIntakeElement}
                        selectedIntakeLocation={selectedIntakeLocation}
                        setSelectedIntakeLocation={setSelectedIntakeLocation}
                    />
                    <IntakeButton 
                        width={(40 / 100) * boxDimensions.height} 
                        height={(55.3 / 100) * boxDimensions.height}
                        element={"Algae"}
                        selectedIntakeElement={selectedIntakeElement}
                        setSelectedIntakeElement={setSelectedIntakeElement}
                        selectedIntakeLocation={selectedIntakeLocation}
                        setSelectedIntakeLocation={setSelectedIntakeLocation}
                    />
                    
                </Stack>

                <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                    sx={{ width: "100%" }}
                        
                    >
                <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                setSelectedIntakeElement(0);
                                setSelectedIntakeLocation(0);
                                stopStopwatch();
                                setElapsedTime(0);
                            }}
                            sx={{
                                width:(40 / 100) * boxDimensions.height,
                                borderRadius: "8px",
                                fontSize: isSuperSmallScreen ? "10px" : isSmallScreen ? "13px" : "16px",
                                height:(12 / 100) * boxDimensions.height,
                            }}
                        >
                            Cancel
                        </Button>
                         
                    
                    <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                                data.deletePrevious(stage);
                                update();
                            }}
                            sx={{
                                width:(40 / 100) * boxDimensions.height,
                                height:(12 / 100) * boxDimensions.height,
                                borderRadius: "8px",
                                fontSize: isSuperSmallScreen ? "10px" : isSmallScreen ? "13px" : "16px",
                            }}
                        >
                            Delete Previous {data.getOuttakeCount(stage)}
                        </Button>



                </Stack>



                    <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                    sx={{ width: "100%" }}
                       
                    >
                    {data.stage !== MatchStage.PRE_MATCH && (
                        <Button
                            fullWidth
                            variant={"outlined"}
                            onClick={() => {
                                handleStageChange(data.stage - 1);
                                update();
                                setSelectedIntakeElement(0);
                                setSelectedIntakeLocation(0);
                            }}
                            sx={{
                            borderRadius: "8px",
                            fontSize: isSuperSmallScreen ? "10px" : isSmallScreen ? "13px" : "16px",
                            height:(12 / 100) * boxDimensions.height,
                            width:(40 / 100) * boxDimensions.height,
                            }}
                        >
                            Previous
                        </Button>
                    )}
                    {data.stage !== MatchStage.POST_MATCH && (
                   <Button
                   variant="outlined"
                   color="primary"
                   fullWidth
                   onClick={() => {
                       handleStageChange(data.stage + 1);
                       update();
                       setSelectedIntakeElement(IntakeElement.CORAL);
                       setSelectedIntakeLocation(IntakeLocations.PRELOAD);
                   }}
                   sx={{
                       borderRadius: "8px",
                       fontSize: isSuperSmallScreen ? "10px" : isSmallScreen ? "13px" : "16px",
                       height:(12 / 100) * boxDimensions.height,
                       width:(40 / 100) * boxDimensions.height,
                   }}
               >
                   Next
               </Button>
                    )}
                    
                    {data.stage === MatchStage.POST_MATCH && (
                        <Button
                            fullWidth
                            color={"success"}
                            variant={"outlined"}
                            onClick={() => {
                                data.submit();
                                handleStageChange(data.stage + 1);
                                update();
                            }}
                        >
                            Submit
                        </Button>
                    )}
                </Stack>
                </Stack>

                <Button
    variant="outlined"
    onClick={() => {
        setCookie('flipMap', !cookies.flipMap);
        update();
    }}
    sx={{
        height: "20px",
        width: "10%",
        mx: 1,
        position: 'relative',
        top: '-45px',
        left: '39%',
        color: cookies.flipMap ? "rgba(73, 133, 230)" : "rgba(251, 0, 0)",
        borderColor: cookies.flipMap ? "rgba(73, 133, 230)" : "rgba(251, 0, 0)",
        '&:hover': {
            color: cookies.flipMap ? "rgba(73, 133, 230)" : "rgba(251, 0, 0)", // Ensures the color doesn't change
            borderColor: cookies.flipMap ? "rgba(73, 133, 230)" : "rgba(251, 0, 0)", // Ensures border color doesn't change
            backgroundColor: 'transparent', // Avoid any hover background changes
        },
    }}
>
    {cookies.flipMap ? "Flip" : "Flip"}
</Button>

                
        </Grid>
    )
}