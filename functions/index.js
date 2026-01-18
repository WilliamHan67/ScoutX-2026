const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.analyzeTeamData = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const teamData = req.body.teamData;
      const userRequest = req.body.userRequest;

      if (!teamData) {

        console.error('No team data provided');
        return res.status(400).send({ error: 'No team data provided' });
      }

      const openaiApiKey = process.env.OPENAI_API_KEY

      const openaiUrl = 'https://api.openai.com/v1/chat/completions';

      // Updated prompt to handle multiple teams
      let prompt;

      prompt = `
      You are an expert in FRC Robotics Scouting, and you are tasked with analyzing multiple teams' match data.

      You will receive data in the form of an array where **each item** corresponds to **a different team's** performance across multiple matches. Each item contains:
      1. **team**: the team number for that specific team (**USE THIS NUMBER TO REFERENCE THIS TEAM DURING ANALYSIS**).
      2. **matchData**: an array of match results for the given team. Each match contains the following fields:
        - **matchNumber**: the match number (String).
        - **Points**: the total points scored in that match (Integer).
        - **Cycles**: the total number of cycles the robot completed (Integer).
        - **CoralCycles**: the number of coral-related cycles completed (Integer).
        - **AlgaeCycles**: the number of algae-related cycles completed (Integer).
        - **Climb**: the climbing points (12 points is "Deep Climb", 6 points is "Shallow Climb", 3 points is "Parked", 0 points is "None") (Integer).
        - **Leave**: 3 points means they left their parked position during the auto phase (Integer).
        - **Extra Information**: a list of any relevant robot performance issues (String).
        - **Detailed Scoring for Coral and Algae Outtakes**: Each of the following fields corresponds to a different amount of points during the match:
          - Auto and Teleop: 
            - AutoCoralL1, AutoCoralL2, AutoCoralL3, AutoCoralL4 (Auto phase scoring for Coral outtakes)
            - AutoAlgaeProcessor, AutoAlgaeNet (Auto phase scoring for Algae outtakes)
            - TeleCoralL1, TeleCoralL2, TeleCoralL3, TeleCoralL4 (Teleop phase scoring for Coral outtakes)
            - TeleAlgaeProcessor, TeleAlgaeNet (Teleop phase scoring for Algae outtakes)
      
      Additionally, you may receive a **userRequest**, which contains specific considerations or aspects to focus on in the analysis. If present, incorporate the request into your analysis without making it a separate section.

      ### How you should analyze the teams:
      - **Each team must be analyzed separately**. You should clearly reference the **team number** throughout the analysis (e.g., "Team 972").
      - For each team, follow the steps below:
        1. Provide **one to two sentencec** on **Auto Scoring**: Analyze their performance during the autonomous phase (including both Coral and Algae outtakes).
        2. Provide **one to two sentences** on **Tele Scoring**: Analyze their performance during the teleop phase (including both Coral and Algae outtakes).
        3. Provide **two sentences on their weaknesses**: Identify any limitations or issues with their performance (e.g., mechanical failures, poor cycle consistency, scoring inconsistencies).
        4. Provide **two sentences on their strengths**: Identify the strengths of their robot and performance (e.g., consistent scoring, good autonomous, solid robot functionality, etc.).
        5. Provide **two to three sentences** on **overall robot functionality**: Analyze their robot's overall performance and functionality across all matches.
      
      
      ### Formatting Rules:
      - Each team's analysis must start with a numbered header in the format "1. Team {team number}"
      - Each section must be structured as "{Type}: {Analysis}". The possible types are:
        - Auto Scoring
        - Tele Scoring
        - Weaknesses
        - Strengths
        - Overall Robot Functionality
      - Each section must be separated by **a double newline ("\n\n")**.
      - If there are **multiple teams**, separate their analysis with "---" on its own line.
      - **Do NOT use markdown symbols** such as "###", "**", or bullet points.
      
      ### Final Recommendation:
      - After you have provided the analysis for all teams, give a **final recommendation**. In **three to four sentences**, recommend which team you would choose as an alliance partner based on the analysis. 
      - **Always use the team number** to reference the team in your analysis (e.g., "Team 972" or "Team 971").
      - If there is **only one team**, focus solely on that team's performance and provide the recommendation for that team.

      ### Example input of two teams (972 and 971) with each team having played 2 matches each:

      - matches: [
        {
          matchData: [
            {
              AlgaeCycles: 0, 
              AutoAlgaeNet: 0, 
              AutoAlgaeProcessor: 0, 
              AutoCoralL1: 0, 
              AutoCoralL2: 0, 
              AutoCoralL3: 0, 
              AutoCoralL4: 6, 
              Climb: 12, 
              CoralCycles: 11,
              Cycles: 11, 
              Extra Information: "None",
              Leave: 0, 
              Points: 79, 
              TeleAlgaeNet: 0, 
              TeleAlgaeProcessor: 0, 
              TeleCoralL1: 0,
              TeleCoralL2: 0,
              TeleCoralL3: 0, 
              TeleCoralL4: 5, 
              matchNumber: "1" 
            },
            {
              AlgaeCycles: 7, 
              AutoAlgaeNet: 3, 
              AutoAlgaeProcessor: 3, 
              AutoCoralL1: 0, 
              AutoCoralL2: 1, 
              AutoCoralL3: 0, 
              AutoCoralL4: 5, 
              Climb: 0, 
              CoralCycles: 6,
              Cycles: 13, 
              Extra Information: "outtakeBroken, aStopped, failedClimb",
              Leave: 0, 
              Points: 59, 
              TeleAlgaeNet: 0, 
              TeleAlgaeProcessor: 1, 
              TeleCoralL1: 0,
              TeleCoralL2: 0,
              TeleCoralL3: 0, 
              TeleCoralL4: 0, 
              matchNumber: "6" 
            }
          ],
          team: "972"
        },
        {
          matchData: [
            {
              AlgaeCycles: 2, 
              AutoAlgaeNet: 1, 
              AutoAlgaeProcessor: 1, 
              AutoCoralL1: 4, 
              AutoCoralL2: 5, 
              AutoCoralL3: 3, 
              AutoCoralL4: 1, 
              Climb: 2, 
              CoralCycles: 13,
              Cycles: 15, 
              Extra Information: "wobbly",
              Leave: 0, 
              Points: 65, 
              TeleAlgaeNet: 0, 
              TeleAlgaeProcessor: 0, 
              TeleCoralL1: 0,
              TeleCoralL2: 0,
              TeleCoralL3: 0, 
              TeleCoralL4: 0, 
              matchNumber: "2" 
            },
            {
              AlgaeCycles: 2, 
              AutoAlgaeNet: 0, 
              AutoAlgaeProcessor: 0, 
              AutoCoralL1: 0, 
              AutoCoralL2: 0, 
              AutoCoralL3: ,0 
              AutoCoralL4: 1, 
              Climb: 0, 
              CoralCycles: 2,
              Cycles: 4, 
              Extra Information: "failedClimb",
              Leave: 1, 
              Points: 19, 
              TeleAlgaeNet: 0, 
              TeleAlgaeProcessor: 2, 
              TeleCoralL1: 0,
              TeleCoralL2: 0,
              TeleCoralL3: 0, 
              TeleCoralL4: 0, 
              matchNumber: "6" 
            }
          ],
          team: "971"
        }
      ]
      `
      
      const response = await axios.post(
        openaiUrl,
        {
          model: 'gpt-4o-mini-2024-07-18',
          messages: [
            {
              role: 'system',
              content: prompt,
            },
            {
              role: 'user',
              content: `Here is the team data: ${JSON.stringify(teamData)}${userRequest ? `\n\nUser Request: ${userRequest}` : ''}`,
            },
          ],
          // max_tokens: 350,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );

      const analysis = response.data.choices[0].message.content;
      return res.status(200).send({ analysis });
    } catch (error) {
      console.error('Error in analyzeTeamData function:', error);

      // Log error response from GPT (if available)
      if (error.response) {
        console.error('Error response from GPT:', error.response.data);
        return res.status(400).send({ error: error.response.data });
      }

      return res.status(500).send({ error: error.message });
    }
  });
});
