import {Box, Container} from "@mui/material";

export default function Page(props) {
    return (
        <Container maxWidth={"md"}>
            <Box sx={{
                ...props.sx,
            }}>
                {props.children}
            </Box>
        </Container>
    );
}