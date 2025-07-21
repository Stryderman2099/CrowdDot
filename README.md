# CrowdDot

CrowdDot is a collaborative online game where players work together in real time to control a single dot on a shared game board. The goal is to navigate the dot through various levels and obstacles by voting on its movement, demonstrating the power of community coordination.

## Features
- **Collective Control:** All players influence the movement of a single dot on the board.
- **Real-Time Interaction:** The game uses WebSockets for instant updates and communication.
- **Level Progression:** Navigate through increasingly challenging levels as a group.
- **Community Focus:** Emphasizes teamwork, coordination, and fun over competition.
- **Live Chat:** Built-in chat for player communication.

## How to Play
1. Enter a unique username to join the game.
2. Every player can vote to move the dot every few seconds.
3. Work together to avoid obstacles and reach the goal.
4. If the dot hits a wall, the level restarts.
5. Reach the green circle to advance to the next level.

## Getting Started (Local)
1. Clone the repository:
   ```sh
   git clone https://github.com/Stryderman2099/CrowdDot.git
   ```
2. Install dependencies:
   ```sh
   cd communal-pixel-game/backend
   npm install
   ```
3. Start the server:
   ```sh
   node server.js
   ```
4. Open your browser and go to `http://localhost:3000` (or the port specified in your server).

## Deployment

This project is deployed using [Render](https://render.com/), a cloud platform for hosting web services.

### How it was deployed:

1. **Create a new Web Service on Render:**
   - Go to your Render dashboard and click "New Web Service".
   - Connect your GitHub repository and select the `communal-pixel-game/backend` directory as the root for the service.
2. **Configure the build and start commands:**
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
3. **Set the environment:**
   - Make sure your environment variables (if any) are set in the Render dashboard.
4. **Deploy:**
   - Render will automatically build and deploy your app. You will get a public URL to share your game.

For more details, see the [Render documentation](https://render.com/docs/deploy-node-express-app).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for suggestions or improvements.

## License
This project is licensed under the MIT License.

## Disclaimer
This project is for educational and entertainment purposes. No cryptocurrency or blockchain integration is required to play.

---

## Author's Note

Building CrowdDot opened up my skills in both backend and frontend web development. I learned how to:
- Design and implement real-time multiplayer logic using WebSockets and Node.js (backend)
- Create interactive, responsive user interfaces with modern HTML, CSS, and JavaScript (frontend)
- Deploy and manage a full-stack application using cloud services like Render

This project was a valuable experience in bringing together all aspects of web development, from server logic to user experience and deployment.
