import { Button } from "@mui/material";

export default function RowButton({rowNumber, x, y, setSelectedRow, selectedRow}) {
    const label = `CENTER ${rowNumber}`;
    return (
        <Button 
            onClick={() => setSelectedRow(rowNumber)}
            variant={selectedRow == rowNumber ? "contained" : "outlined"}
            color={selectedRow == rowNumber ? "primary" : "white"}
            sx={{
                position: "absolute",
                width: "200px",
                height: "90px",
                fontSize: "1.8rem",
                top: `${y}%`,
                left: `${x}%`,
            }}>{label}
        </Button>
    )
}