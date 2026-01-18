import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ScatterChart, Scatter, PolarRadiusAxis
} from "recharts";
import { Box, Stack, useMediaQuery  } from "@mui/material";
import { ElementPointsAuto, ElementPointsTele } from "../../MatchConstants";

const colors = [
  "#f57c00",   // Orange
  "#ffffff",   // White
  "#ffb74d",   // Light Orange
  "#616161",   // Dark Grey
  "#c0c0c0",   // Light Grey (Silver)
];

const TeamGraphs = ({ matches }) => {
  // Ensure matches is an array of objects where each object contains a team and matchData
  const processedTeams = matches.map((teamData, index) => {
    const team = teamData.team;
    const matchData = teamData.matchData;
    
    // Process match data for line chart
    const lineData = matchData
      .filter(match => match.matchNumber !== "Averages") // Exclude "Averages" row
      .map((match) => ({
      matchNumber: match.matchNumber,
      Points: match.Points,
      }))
    .sort((a, b) => a.matchNumber - b.matchNumber);

    // Process match data for scatter plot
    const scatterData = matchData
      .filter(match => match.matchNumber !== "Averages") // Exclude "Averages" row
      .map((match) => {
      const algaePoints =
        (match.AutoAlgaeNet || 0) * ElementPointsAuto.ALGAENET +
        (match.AutoAlgaeProcessor || 0) * ElementPointsAuto.ALGAEPROCESSOR +
        (match.TeleAlgaeNet || 0) * ElementPointsTele.ALGAENET +
        (match.TeleAlgaeProcessor || 0) * ElementPointsTele.ALGAEPROCESSOR;
      const coralPoints =
        (match.AutoCoralL1 || 0) * ElementPointsAuto.CORALL1 +
        (match.AutoCoralL2 || 0) * ElementPointsAuto.CORALL2 +
        (match.AutoCoralL3 || 0) * ElementPointsAuto.CORALL3 +
        (match.AutoCoralL4 || 0) * ElementPointsAuto.CORALL4 +
        (match.TeleCoralL1 || 0) * ElementPointsTele.CORALL1 +
        (match.TeleCoralL2 || 0) * ElementPointsTele.CORALL2 +
        (match.TeleCoralL3 || 0) * ElementPointsTele.CORALL3 +
        (match.TeleCoralL4 || 0) * ElementPointsTele.CORALL4;
      return { algaePoints, coralPoints, matchNumber: match.matchNumber };
    }).sort((a, b) => a.coralPoints - b.coralPoints);

    // Calculate averages for radar chart
    const totalMatches = matchData.length;
    const averages = matchData
    // .filter(match => String(match.matchNumber).trim().toLowerCase() !== "averages") // For some reeason when I add this it includes Avareges, but when I do not, it doesn't 
    .reduce((acc, match) => {
      acc.AveragePoints += match.Points || 0;
      acc.AverageAlgaeCycles += match.AlgaeCycles || 0;
      acc.AverageCoralCycles += match.CoralCycles || 0;
      acc.AverageAutoPoints += (match.Leave || 0) * ElementPointsAuto.LEAVE +
                               (match.AutoAlgaeNet || 0) * ElementPointsAuto.ALGAENET +
                               (match.AutoAlgaeProcessor || 0) * ElementPointsAuto.ALGAEPROCESSOR +
                               (match.AutoCoralL1 || 0) * ElementPointsAuto.CORALL1 +
                               (match.AutoCoralL2 || 0) * ElementPointsAuto.CORALL2 +
                               (match.AutoCoralL3 || 0) * ElementPointsAuto.CORALL3 +
                               (match.AutoCoralL4 || 0) * ElementPointsAuto.CORALL4;
      acc.AverageClimbPoints += match.Climb || 0;
      return acc;
    }, {
      AveragePoints: 0,
      AverageAlgaeCycles: 0,
      AverageCoralCycles: 0,
      AverageAutoPoints: 0,
      AverageClimbPoints: 0,
    });

    Object.keys(averages).forEach(key => {
      averages[key] = Math.round((averages[key] / totalMatches) * 10) / 10;
    });

    const radarData = [
      { metric: "Points", value: averages.AveragePoints },
      { metric: "Climb Points", value: averages.AverageClimbPoints },
      { metric: "Algae Cycles", value: averages.AverageAlgaeCycles },
      { metric: "Coral Cycles", value: averages.AverageCoralCycles },
      { metric: "Auto Points", value: averages.AverageAutoPoints },
    ];

    return { team, lineData, scatterData, radarData, color: colors[index % colors.length] };
  });

  let formattedRadarData = [
    { subject: 'Points', fullMark: 150 },
    { subject: 'Climb Points', fullMark: 150 },
    { subject: 'Algae Cycles', fullMark: 150 },
    { subject: 'Coral Cycles', fullMark: 150 },
    { subject: 'Auto Points', fullMark: 150 },
  ];

  formattedRadarData = formattedRadarData.map((subjectData) => {
    const radarItem = { subject: subjectData.subject, fullMark: subjectData.fullMark };

    processedTeams.forEach(({ team, radarData }) => {
      const metricData = radarData.find(data => data.metric === subjectData.subject);
      if (metricData) {
        radarItem[team] = metricData.value;
      }
    });

    return radarItem;
  });

  // Custom Tooltip Component for RadarChart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { subject, ...teamData } = payload[0].payload; // Extract subject and team data
    return (
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          borderRadius: "6px",
          fontSize: "14px",
          padding: "6px 12px",
          border: "1px solid white",
        }}
      >
          <strong style={{ color: "#f57c00", fontSize: "16px" }}>{subject}</strong>
          {Object.keys(teamData).map((team, index) => {
            // Display team-specific data
            if (team !== "subject" && team !== "fullMark") {
              return (
                <div key={index}>
                    {team}: {teamData[team]}
                </div>
              );
            }
            return null;
          })}
        </div>
    );
  }
  return null;
};

// Use `useMediaQuery` to determine if the screen is small
const isSmallScreen = useMediaQuery("(max-width: 960px)");
const isIPadScreen = useMediaQuery("(max-width: 1400px)")
  
  return (
    <Stack  direction={isSmallScreen ? "column" : "row"} spacing={isSmallScreen ? 4 : isIPadScreen ? 1 : 5} mt={4}>
      {/* Line Chart */}
      <ResponsiveContainer width={isSmallScreen ? "100%" : "40%"} height={500}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="matchNumber"
            label={{ value: "Matches", position: "bottom", offset: 5 }}
            scale="linear"  // Ensure linear scaling
            domain={[
              Math.min(
                ...processedTeams.flatMap(({ lineData }) => lineData.map(d => d.matchNumber))
              ), // Global minimum match number across all teams
              Math.max(
                ...processedTeams.flatMap(({ lineData }) => lineData.map(d => d.matchNumber))
              )  // Global maximum match number across all teams
            ]}
            type="number"  // Ensure the x-axis is treating the match number as a numeric value, not an index
            ticks={  // Dynamic ticks from all unique match numbers
              [...new Set(
                processedTeams.flatMap(({ lineData }) => lineData.map(d => d.matchNumber))
              )].sort((a, b) => a - b)  // Sort the match numbers
            }
          />
          <YAxis 
            label={{ value: "Points", angle: -90, position: "insideLeft" }} />
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { matchNumber, Points } = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "14px",
                      padding: "6px 12px",
                      border: "1px solid white",
                    }}
                  >
                    <strong style={{ color: "#f57c00" }}>Match Number: {matchNumber}</strong>
                    <br />
                    Points: {Points}
                  </div>
                );
              }
              return null;
            }}
            cursor={false}
          />
          <Legend align="left" />
          {processedTeams.map(({ team, lineData, color }) => (
            <Line key={team} data={lineData} type="linear" dataKey="Points" stroke={color} name={team} />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Scatter Chart */}
      <ResponsiveContainer width={isSmallScreen ? "100%" : "30%"} height={500}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3"  />
          <XAxis
            dataKey="coralPoints"
            name="Coral Points"
            stroke="gray"
            label={{ value: "Coral Points", position: "bottom", offset: 5 }}
          />
          <YAxis
            dataKey="algaePoints"
            name="Algae Points"
            stroke="gray"
            label={{ value: "Algae Points", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { matchNumber, algaePoints, coralPoints } = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "6px",
                      fontSize: "14px",
                      padding: "6px 12px",
                      border: "1px solid white",
                    }}
                  >
                    <strong style={{ color: "#f57c00" }}>Match Number: {matchNumber}</strong>
                    <br />
                    Algae Points: {algaePoints}
                    <br />
                    Coral Points: {coralPoints}
                  </div>
                );
              }
              return null;
            }}
            cursor={false}
          />
          <Legend align="left" />
          {processedTeams.map(({ team, scatterData, color }) => (
            <Scatter key={team} data={scatterData} name={team} fill={color} shape="circle" />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      {/* Radar Chart */}
      <ResponsiveContainer width={isSmallScreen ? "100%" : isIPadScreen ? "52%" : "30%"} height={500}> 
        <RadarChart data={formattedRadarData}>
          <PolarGrid stroke="gray" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            stroke="white"
            tickLine={false}
            radius={20}
            tick={({ payload, x, y }) => {
              const words = payload.value.split(" "); // Split label into words
              const offset = {
                "Points": { x: 0, y: -4 },
                "Climb Points": { x: 25, y: 0 },
                "Algae Cycles": { x: 25, y: 15 },
                "Coral Cycles": { x: -25, y: 15 },
                "Auto Points": { x: -25, y: 0 },
              };

              const { x: offsetX, y: offsetY } = offset[payload.value] || { x: 0, y: 0 };

              return (
                <text x={x + offsetX} y={y + offsetY} textAnchor="middle" fill="white" fontSize={14}>
                  {words.map((word, index) => (
                    <tspan key={index} x={x + offsetX} dy={index === 0 ? 0 : 18}>
                        {word}
                    </tspan>
                  ))}
                </text>
              );
            }}
          />
          {processedTeams.map(({ team, color }) => {
             const gradientId = `gradient-${team}`;  // Unique gradient ID based on the team
             return (
               <React.Fragment key={team}>
                 {/* Define the gradient for each team */}
                 <defs>
                   <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                     <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                   </linearGradient>
                 </defs>
         
                 {/* Render Radar with the unique gradient */}
                 <Radar
                   key={team}
                   name={team}
                   dataKey={team}
                   stroke={color}  // Stroke color remains the team's color
                   fill={`url(#${gradientId})`}  // Use the unique gradient for fill
                   fillOpacity={0.6}  // Lower opacity to make overlapping radars distinguishable
                   outerRadius={80}  // Static outer radius (or dynamic, as needed)
                 />
               </React.Fragment>
             );
          })}
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend 
            verticalAlign="top" 
            align="center" 
            />
        </RadarChart> 
     </ResponsiveContainer> 
    </Stack>
  );
};

export default TeamGraphs;
