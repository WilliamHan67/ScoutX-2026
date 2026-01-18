import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TableContainer, CircularProgress, Select, MenuItem, FormControl, InputLabel, IconButton, Divider, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebase from "../../../firebase";
import { ElementPointsTele, ElementPointsAuto } from "../../MatchConstants";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TeamGraphs from "./TeamGraphs";
import { Stack } from "@mui/system";

const TeamMatches = () => {
  const [team, setTeam] = useState("");
  const [matches, setMatches] = useState([]); // Stores match data for each team
  const [deletedRows, setDeletedRows] = useState([]); // Stores deleted rows
  const [sortBy, setSortBy] = useState("matchNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [error, setError] = useState(""); // To track errors
  const [restoreMatch, setRestoreMatch] = useState(""); // Selected match to restore
  const [teamToRestore, setTeamToRestore] = useState(""); 
  const [clearFilter, setClearFilter] = useState(true);

  const coralFilterFields = [
    "CoralCycles",
    "CoralAccuracy", 
    "CoralGroundIntakes", 
    "CoralStationIntakes", 
    "AutoCoralL1",
    "AutoCoralL2",
    "AutoCoralL3",
    "AutoCoralL4",
    "AutoMissedCoralL1",
    "AutoMissedCoralL2",
    "AutoMissedCoralL3",
    "AutoMissedCoralL4",
    "TeleCoralL1",
    "TeleCoralL2",
    "TeleCoralL3",
    "TeleCoralL4",
    "TeleMissedCoralL1",
    "TeleMissedCoralL2",
    "TeleMissedCoralL3",
    "TeleMissedCoralL4",
  ]

  const algaeFilterFields = [
    "AlgaeCycles",
    "AlgaeAccuracy",
    "AlgaeGroundIntakes", 
    "AlgaeReefIntakes", 
    "AutoAlgaeNet", 
    "AutoAlgaeProcessor", 
    "AutoMissedAlgaeNet", 
    "AutoMissedAlgaeProcessor", 
    "TeleAlgaeNet",
    "TeleAlgaeProcessor",
    "TeleMissedAlgaeNet",
    "TeleMissedAlgaeProcessor",
  ]

  const otherFilterFields = [
    "Points",
    "Cycles", 
    "Leave",
    "Climb",
    "Extra Information",
    "Comments", 
    "Human Player Makes",
    "Human Player Misses",
    "Human Player Accuracy",  
  ]

  const [coralFilters, setCoralFilters] = useState(coralFilterFields); 
  const [algaeFilters, setAlgaeFilters] = useState(algaeFilterFields); 
  const [otherFilters, setOtherFilters] = useState(otherFilterFields); 

  const matchScoutDataRef = collection(firebase, "matchScoutData");
  const humanPlayerDataRef = collection(firebase, "humanPlayerData");
  
  const handleGetData = async () => {
    setError(""); // Reset error message

    try {
      const querySnapshot = await getDocs(matchScoutDataRef);

      const humanPlayerQuerySnapshot = await getDocs(humanPlayerDataRef);

      let teamDocs = [];
      // if (team === '972!1') {
      //   teamDocs = querySnapshot.docs.filter((doc) => {
      //     const docId = doc.id.split('_')[0]; 
      //     return docId === '972';
      //   });
      // } else if (team === '972') {
      //   setError('Unable to provide data for 972');
      //   setTeam("");
      //   return;
      // } else {
        teamDocs = querySnapshot.docs.filter((doc) => {
          const docId = doc.id.split('_')[0]; 
          return docId === team;
        });
      // }

      console.log("dataaaa: ", teamDocs); 

      const humanPlayerDocs = humanPlayerQuerySnapshot.docs.filter((doc) => {
        const docId = doc.id.split('_')[0];
        return docId === team;
      });

      if (teamDocs.length === 0) {
        setError("No matches found for this team number");
        setTeam(""); 
        return; 
      }

      const humanPlayerData = {}; 
      humanPlayerDocs.forEach((doc) => {
        const data = doc.data();
        const matchNumber = doc.id.split('_')[1];
        humanPlayerData[matchNumber] = {
          hits: data.hits || 0,
          misses: data.misses || 0,
          accuracy: data.hits + data.misses > 0 
            ? ((data.hits / (data.hits + data.misses)) * 100).toFixed(1) + '%'
            : '0%'
      }});

      const fields = [
        "leave",
        "AutoAlgaeNet",
        "AutoAlgaeProcessor",
        "AutoMissedAlgaeNet",
        "AutoMissedAlgaeProcessor",
        "AutoCoralL1",
        "AutoCoralL2",
        "AutoCoralL3",
        "AutoCoralL4",
        "AutoMissedCoralL1",
        "AutoMissedCoralL2",
        "AutoMissedCoralL3",
        "AutoMissedCoralL4",
        "TeleAlgaeNet",
        "TeleAlgaeProcessor",
        "TeleMissedAlgaeNet",
        "TeleMissedAlgaeProcessor",
        "TeleCoralL1",
        "TeleCoralL2",
        "TeleCoralL3",
        "TeleCoralL4",
        "TeleMissedCoralL1",
        "TeleMissedCoralL2",
        "TeleMissedCoralL3",
        "TeleMissedCoralL4",
        "ClimbPosition",
      ];

      const extraInfo = [
        "intakeBroken",
        "outtakeBroken",
        "elevatorBroken",
        "armBroken",
        "brownsOut",
        "wobbly",
        "canKnockAlgae",
        "missesOuttakesConsistently",
        "slowIntakes",
        "disabled",
        "goodDefenseFromOpponents",
        "playedMajorityDefense",
        "touchItOwnIt",
        "aStopped",
        "eStopped",
        "knockedCage",
        "failedClimb",
      ];

      const Points = [
        { field: 'Leave', multiplier: ElementPointsAuto.LEAVE },
        { field: 'AutoAlgaeNet', multiplier: ElementPointsAuto.ALGAENET },
        { field: 'AutoAlgaeProcessor', multiplier: ElementPointsAuto.ALGAEPROCESSOR },
        { field: 'AutoCoralL1', multiplier: ElementPointsAuto.CORALL1 },
        { field: 'AutoCoralL2', multiplier: ElementPointsAuto.CORALL2 },
        { field: 'AutoCoralL3', multiplier: ElementPointsAuto.CORALL3 },
        { field: 'AutoCoralL4', multiplier: ElementPointsAuto.CORALL4 },
        { field: 'TeleAlgaeNet', multiplier: ElementPointsTele.ALGAENET },
        { field: 'TeleAlgaeProcessor', multiplier: ElementPointsTele.ALGAEPROCESSOR },
        { field: 'TeleCoralL1', multiplier: ElementPointsTele.CORALL1 },
        { field: 'TeleCoralL2', multiplier: ElementPointsTele.CORALL2 },
        { field: 'TeleCoralL3', multiplier: ElementPointsTele.CORALL3 },
        { field: 'TeleCoralL4', multiplier: ElementPointsTele.CORALL4 },
        { field: 'Climb', multiplier: 1 },
      ];

      const matchData = teamDocs.map((doc) => {
        const data = doc.data();
        let matchObject = {
          matchNumber: data["match"], // Get match number from Firebase
          Points: 0,
          Cycles: 0,
          CoralCycles: 0,
          AlgaeCycles: 0,
          CoralAccuracy: 0, 
          AlgaeAccuracy: 0, 
          CoralGroundIntakes: 0,
          CoralStationIntakes: 0, 
          AlgaeGroundIntakes: 0, 
          AlgaeReefIntakes: 0,
        };

        fields.forEach((field) => {
          if (field === "ClimbPosition") {
            if (data[field] === "Deep") {
              matchObject["Climb"] = ElementPointsTele.DEEP;
            } else if (data[field] === "Shallow") {
              matchObject["Climb"] = ElementPointsTele.SHALLOW;
            } else if (data[field] === "Parked") {
              matchObject["Climb"] = ElementPointsTele.PARK;
            } else {
              matchObject["Climb"] = 0;
            }
          } else if (field === 'leave') {
            matchObject['Leave'] = data[field] === 'true' ? 1 : 0;
          } else {
            matchObject[field] = data[field] !== undefined ? data[field] : 0;
          }
        });

        let points = 0;
        let coralCycles = 0;
        let algaeCycles = 0;
        let coralAccuracy = 0; 
        let algaeAccuracy = 0; 
        let coralGroundIntakes = 0; 
        let coralStationIntakes = 0;
        let algaeGroundIntakes = 0;
        let algaeReefIntakes = 0; 

        const outtakeCounts = [
          'autoOuttakeCounts', 
          'teleOuttakeCounts'
        ]

        outtakeCounts.forEach((count) => {
          data[count].map((intake) => {
            const location = intake.intakeLocation; 
            const element = intake.element; 
            if (element === "CORAL") {
              if (location === "GROUND") {
                coralGroundIntakes++; 
              }
              else if (location === "STATION") {
                coralStationIntakes++; 
              }
            }
            if (element === "ALGAE") {
              if (location === "GROUND") {
                algaeGroundIntakes++; 
              }
              else if (location === "REEF") {
                algaeReefIntakes++; 
              }
            }
          })
        })

        Points.forEach((fieldConfig) => {
            let fieldValue = matchObject[fieldConfig.field];
            const multiplier = fieldConfig.multiplier;
            points += fieldValue * multiplier;
            if (fieldConfig.field.includes("Coral")) coralCycles += fieldValue;
            if (fieldConfig.field.includes("Algae")) algaeCycles += fieldValue;
        });

        const totalCoralAttempts = coralCycles + 
          (matchObject["AutoMissedCoralL1"]) + 
          (matchObject["AutoMissedCoralL2"]) + 
          (matchObject["AutoMissedCoralL3"]) + 
          (matchObject["AutoMissedCoralL4"]) + 
          (matchObject["TeleMissedCoralL1"]) + 
          (matchObject["TeleMissedCoralL2"]) + 
          (matchObject["TeleMissedCoralL3"]) + 
          (matchObject["TeleMissedCoralL4"]);

        const totalAlgaeAttempts = algaeCycles + 
          (matchObject["AutoMissedAlgaeNet"]) + 
          (matchObject["AutoMissedAlgaeProcessor"]) + 
          (matchObject["TeleMissedAlgaeNet"]) + 
          (matchObject["TeleMissedAlgaeProcessor"]);

        coralAccuracy = totalCoralAttempts > 0 ? `${((coralCycles / totalCoralAttempts) * 100).toFixed(1)}%` : "No Attempts";
        algaeAccuracy = totalAlgaeAttempts > 0 ? `${((algaeCycles / totalAlgaeAttempts) * 100).toFixed(1)}%` : "No Attemps";

        let totalCycles = coralCycles + algaeCycles;

        matchObject.Points = points;
        matchObject.Cycles = totalCycles;
        matchObject.CoralCycles = coralCycles;
        matchObject.AlgaeCycles = algaeCycles;
        matchObject.CoralAccuracy = coralAccuracy; 
        matchObject.AlgaeAccuracy = algaeAccuracy; 
        matchObject.CoralGroundIntakes = coralGroundIntakes;
        matchObject.CoralStationIntakes = coralStationIntakes; 
        matchObject.AlgaeGroundIntakes = algaeGroundIntakes;
        matchObject.AlgaeReefIntakes = algaeReefIntakes; 

        let extraInfoList = [];
        extraInfo.forEach((info) => {
          if (data[info] === "true") {  
            extraInfoList.push(formatExtraInfo(info));
          }
        });
        matchObject["Extra Information"] = extraInfoList.join(", ") || "None";

        // Add comments 
        matchObject['Comments'] = data['comments'] !== '' ? data['comments'] : "None"; 

        const humanPlayerStats = humanPlayerData[matchObject.matchNumber] || {
          hits: 'N/A',
          misses: 'N/A',
          accuracy: 'N/A',
        };
        
        matchObject["Human Player Makes"] = humanPlayerStats.hits;
        matchObject["Human Player Misses"] = humanPlayerStats.misses;
        matchObject["Human Player Accuracy"] = humanPlayerStats.accuracy;

        return matchObject;
      });

      const updatedMatchData = handleAverages(matchData);

      // Update matches with the new matchData for this team
      setMatches((prevMatches) => [
        ...prevMatches.filter((m) => m.team !== team),  // Remove previous data for this team
        { team, matchData: updatedMatchData }
      ]);
      setTeam("");

    } catch (error) {
      console.error("Error fetching match data:", error);
      setError("Error fetching match data. Please try again.");
    }
  };

  const handleDeleteTeamData = (team) => {
    // Remove the team's data from the state
    setMatches((prevMatches) => prevMatches.filter((teamData) => teamData.team !== team));
  };

  const handleAverages = (matchData) => {
    if (matchData.length === 1) return matchData;

    // Ensure we are only working with valid matches (no "Averages")
    const filteredMatchData = matchData.filter(match => match.matchNumber !== "Averages");

    if (filteredMatchData.length === 0) return []; // Ensure no empty average is added

    let averageMatch = { matchNumber: "Averages" };
    const numMatches = filteredMatchData.length; // Use filtered data for count
    const sumFields = {};

    // Sum up all numerical fields
    filteredMatchData.forEach((match) => {
        for (const key in match) {
            if (typeof match[key] === "number") {
                sumFields[key] = (sumFields[key] || 0) + match[key];
            }
        }
    });

    // Compute averages
    for (const key in sumFields) {
        averageMatch[key] = parseFloat((sumFields[key] / numMatches).toFixed(1));
    }

    // Calculate Coral and Algae accuracy
    const totalCoralAttempts = ((sumFields["CoralCycles"] || 0) +
        ["AutoMissedCoralL1", "AutoMissedCoralL2", "AutoMissedCoralL3", "AutoMissedCoralL4",
        "TeleMissedCoralL1", "TeleMissedCoralL2", "TeleMissedCoralL3", "TeleMissedCoralL4"]
        .reduce((sum, key) => sum + (sumFields[key] ?? 0), 0)) || 0; 

    const totalAlgaeAttempts = ((sumFields["AlgaeCycles"] || 0) +
        ["AutoMissedAlgaeNet", "AutoMissedAlgaeProcessor",
        "TeleMissedAlgaeNet", "TeleMissedAlgaeProcessor"]
        .reduce((sum, key) => sum + (sumFields[key] ?? 0), 0)) || 0; 

    const coralAccuracy = totalCoralAttempts > 0 ? `${(sumFields["CoralCycles"] / totalCoralAttempts * 100).toFixed(1)}%` : "No Attempts";
    const algaeAccuracy = totalAlgaeAttempts > 0 ? `${(sumFields["AlgaeCycles"] / totalAlgaeAttempts * 100).toFixed(1)}%` : "No Attempts";

    // Construct a reordered object with CoralAccuracy and AlgaeAccuracy after AlgaeCycles
    const reorderedAverageMatch = {};
    for (const key in averageMatch) {
        reorderedAverageMatch[key] = averageMatch[key];
        if (key === "AlgaeCycles") {
            reorderedAverageMatch["CoralAccuracy"] = coralAccuracy;
            reorderedAverageMatch["AlgaeAccuracy"] = algaeAccuracy;
        }
    }

    // Set placeholders for fields that shouldn't be averaged
    reorderedAverageMatch["Extra Information"] = "N/A";
    reorderedAverageMatch["Comments"] = "N/A"; 
    reorderedAverageMatch["Human Player Makes"] = "N/A";
    reorderedAverageMatch["Human Player Misses"] = "N/A";
    reorderedAverageMatch["Human Player Accuracy"] = "N/A";

    return [...filteredMatchData, reorderedAverageMatch]; // Append the updated "Averages" match
  };
  
  // Ensure updates in delete and restore functions
  const handleDeleteRow = (team, matchNumber) => {
    setError(""); // Reset error message
  
    const teamData = matches.find((teamData) => teamData.team === team);
  
    if (teamData.matchData.length > 2) {
      const updatedMatchData = teamData.matchData.filter(match => match.matchNumber !== matchNumber);
  
      const deletedMatch = teamData.matchData.find(match => match.matchNumber === matchNumber);
  
      const newMatchDataWithAverages = handleAverages(updatedMatchData);
  
      // Update matches state
      setMatches(matches.map(teamData =>
        teamData.team === team ? { ...teamData, matchData: newMatchDataWithAverages } : teamData
      ));
  
      // Store deleted row
      setDeletedRows(prevState => ({
        ...prevState,
        [team]: [...(prevState[team] || []), deletedMatch],
      }));
    } else {
      setError("At least one match is necessary for visualization");
    }
  };
  
    const handleRestoreRow = () => {
      setError("");
      setRestoreMatch("");

      const matchToRestore = deletedRows[teamToRestore]?.find(
        (match) => match.matchNumber === restoreMatch
      );
      
      
      setMatches(
        matches.map((teamData) => {
            if (teamData.team === teamToRestore) {
                // Ensure previous "Averages" row is removed before recalculating
                const updatedMatchData = [
                    ...teamData.matchData,
                    matchToRestore
                ];

                // Recalculate new averages with the correct data
                const newMatchDataWithAverages = handleAverages(updatedMatchData);

                return {
                    ...teamData,
                    matchData: newMatchDataWithAverages,
                };
            }
            return teamData;
        })
      );
    
      setDeletedRows((prevState) => ({
        ...prevState,
        [teamToRestore]: prevState[teamToRestore].filter(
          (match) => match.matchNumber !== restoreMatch
        ),
      }));
    };

  useEffect(() => {
    if (restoreMatch) {
      handleRestoreRow();  // Only call when restoreMatch is updated
    }
  }, [restoreMatch]); 

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

   // Helper function to format extraInfo field keys
  const formatExtraInfo = (info) => {
    return info
      .replace(/([a-z])([A-Z])/g, "$1 $2")  // Adds space between camelCase words
      .replace(/^./, (str) => str.toUpperCase()); // Capitalizes the first letter
  };

  // Use `useMediaQuery` to determine if the screen is small
  const isSmallScreen = useMediaQuery("(max-width: 960px)");

const handleFilter = (filterType, selectedValues) => {
  if (filterType === "coral") {
    setCoralFilters(selectedValues);
  } else if (filterType === "algae") {
    setAlgaeFilters(selectedValues);
  } else if (filterType === "other") {
    setOtherFilters(selectedValues);
  }
};

const handleClearFilter = () => {
  if (clearFilter) {
    setClearFilter(false); 
    setCoralFilters([]);
    setAlgaeFilters([]);
    setOtherFilters([]); 
  } else {
    setClearFilter(true); 
    setCoralFilters(coralFilterFields);
    setAlgaeFilters(algaeFilterFields); 
    setOtherFilters(otherFilterFields); 
  }
}

const visibleColumns = new Set([...coralFilters, ...algaeFilters, ...otherFilters]);

// Sort the filtered data
const sortedData = matches.map((teamData) => ({
  ...teamData,
  matchData: [...teamData.matchData].sort((a, b) => {

    if (a.matchNumber === "Averages") return -1; // Keep "Averages" at the top
    if (b.matchNumber === "Averages") return 1; 

    const valueA = a[sortBy];
    const valueB = b[sortBy];

    return sortDirection === 'asc' ? valueB - valueA : valueA - valueB;
  }),
}));

return (
  <>
    <TextField
      label="Enter Team Number"
      variant="outlined"
      value={team}
      onChange={(e) => setTeam(e.target.value)}
      fullWidth
      margin="normal"
    />
    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleGetData} fullWidth>
      Get Data
    </Button>

    {error && <Typography color="error" variant="body1" sx={{ mt: 2 }}>{error}</Typography>}

    {matches.length > 0 && (
      <Stack direction={"column"} spacing={4} mt={9}>
        <TeamGraphs matches={matches} />

        <Box>
        <Stack direction="row" spacing={2} mt={isSmallScreen ? -4 : 3}>
          <FormControl fullWidth>
            <Select
              displayEmpty
              multiple
              value={coralFilters}
              onChange={(e) => handleFilter("coral", e.target.value)}
              renderValue={() => "Coral Filters"}
            >
              {coralFilterFields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              displayEmpty
              multiple
              value={algaeFilters}
              onChange={(e) => handleFilter("algae", e.target.value)}
              renderValue={() => "Algae Filters"}
            >
              {algaeFilterFields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              displayEmpty
              multiple
              value={otherFilters}
              onChange={(e) => handleFilter("other", e.target.value)}
              renderValue={() => "Other Filters"}
            >
              {otherFilterFields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Box mt={3} mb={isSmallScreen ? 2 : 0}>
        <Button fullWidth onClick={handleClearFilter} variant="outlined">
          {clearFilter ? "Clear All Filters" : "Set All Filters"}
        </Button>
        </Box>
        </Box>

        {/* Displaying filtered and sorted data */}
        {sortedData.map((teamData) => (
          <Box key={teamData.team}>
            <TableContainer sx={{ maxWidth: '100%', margin: '0 auto', mt: isSmallScreen ? -4 : 0 }}>
              <Stack direction={"row"} spacing={4}>
                <IconButton
                  sx={{ color: "primary", fontSize: 20 }}
                  onClick={() => handleDeleteTeamData(teamData.team)}
                >
                  <RemoveCircleIcon />
                </IconButton>
                <Typography variant="h5" sx={{ color: "#f57c00", position: "relative", top: "5px" }}>
                  {`Team ${teamData.team}`}
                </Typography>
              </Stack>
              <Divider sx={{ width: '75%', backgroundColor: 'grey.800', marginY: 4, mt: 2, mb: 4 }} />
              <Table sx={{ minWidth: 650, backgroundColor: "#f57c00" }}>
                <TableHead sx={{ backgroundColor: "#222", color: "white" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#f57c00", fontWeight: "bold" }}></TableCell>
                    <TableCell sx={{ color: "#f57c00", fontWeight: "bold" }}>Match Number</TableCell>
                    {Object.keys(teamData.matchData[0]).map((column) =>
                      column !== "matchNumber" && visibleColumns.has(column) ? (
                        <TableCell key={column} sx={{ color: "white" }}>
                          <TableSortLabel
                            active={sortBy === column}
                            direction={sortDirection}
                            onClick={() => handleSort(column)}
                            sx={{
                              color: "white",
                              "&.MuiTableSortLabel-active": { color: "#f57c00" },
                              "&:hover": { color: "#f57c00" },
                            }}
                          >
                            {column.replace(/([a-z])([A-Z])/g, "$1 $2")}
                          </TableSortLabel>
                        </TableCell>
                      ) : null
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {teamData.matchData.map((match, index) => (
                    <TableRow
                      key={match.matchNumber}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#333" : "#444",
                        "&:hover": { backgroundColor: "#555" },
                      }}
                    >
                      <TableCell>
                        {match.matchNumber !== "Averages" ? (
                          <IconButton
                            sx={{ color: "primary", fontSize: 20 }}
                            onClick={() => handleDeleteRow(teamData.team, match.matchNumber)}
                          >
                          <RemoveCircleIcon />
                          </IconButton>
                          ) : (
                            // Empty cell to maintain row height
                          <Box sx={{ width: 24, height: 43 }} />
                        )}
                      </TableCell>
                      <TableCell sx={{ color: "#f57c00" }}>{match.matchNumber}</TableCell>
                      {Object.entries(match).map(
                        ([key, value]) =>
                          key !== "matchNumber" && visibleColumns.has(key) && (
                            <TableCell
                              key={key}
                              sx={{
                                color: "white",
                                whiteSpace: key === "Extra Information" ? "nowrap" : "normal",
                              }}
                            >
                              {value}
                            </TableCell>
                          )
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Show restore dropdown and button under the team table */}
            <Stack spacing={1} direction="column" sx={{ mt: 4 }}>
              {deletedRows[teamData.team]?.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel id="restore-select-label">Restore Match</InputLabel>
                  <Select
                    labelId="restore-select-label"
                    value={restoreMatch}
                    label="Restore Match"
                    onChange={(e) => {
                      setTeamToRestore(teamData.team)
                      setRestoreMatch(e.target.value)}} // Handle change
                  >
                    {deletedRows[teamData.team].map((match) => (
                      <MenuItem
                        key={match.matchNumber}
                        value={match.matchNumber}
                      >
                        Match {match.matchNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    )}
  </>
);
};

export default TeamMatches;