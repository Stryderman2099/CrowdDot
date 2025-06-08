// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ADMIN_KEY = process.env.ADMIN_KEY; // Define the admin key
const PORT = process.env.PORT || 4000; // Use environment variable or default to 3000

let sharedPlayer = { x: 10, y: 10 };
let currentLevel = 0;
let devTokensRemainingPercent = 1;//Iniatially dev holds 100% of initial dev tokens
let devTokensLockedPercent = 0; //Initially no dev tokens are locked
let devTokensSoldPercent = 0; //Initially no dev tokens are sold
const levels = [
  // Level 1
  {
    maze: [
      { x: 100, y: 100, width: 300, height: 20 },
      { x: 100, y: 200, width: 20, height: 200 },
      { x: 200, y: 300, width: 200, height: 20 },
    ],
    greenCircle: { x: 250, y: 250, radius: 15 },
  },
  // Level 2
  {
    maze: [ 
      { x: 50, y: 50, width: 20, height: 400 },    
      { x: 430, y: 50, width: 20, height: 400 },   
      { x: 120, y: 120, width: 260, height: 20 },  
      { x: 120, y: 120, width: 20, height: 260 },  
      { x: 180, y: 300, width: 160, height: 20 },  
       
    ],
    greenCircle: { x: 320, y: 220, radius: 15 }, 
  },
  // Level 3
  {
    maze: [
      { x: 40, y: 0, width: 20, height: 300 },
      { x: 440, y: 40, width: 20, height: 420 },
      { x: 40, y: 440, width: 420, height: 20 },
      { x: 100, y: 100, width: 20, height: 250 },
      { x: 380, y: 100, width: 20, height: 200 },
      { x: 160, y: 380, width: 240, height: 20 },
      { x: 220, y: 220, width: 20, height: 120 },
      { x: 220, y: 220, width: 80, height: 20 },
    ],
    greenCircle: { x: 260, y: 320, radius: 15 },
  },
  // Level 4
  {
    maze: [
      { x: 60, y: 60, width: 380, height: 20 },
      { x: 420, y: 60, width: 20, height: 380 },
      { x: 60, y: 420, width: 380, height: 20 },
      { x: 120, y: 120, width: 240, height: 20 },
      { x: 120, y: 120, width: 20, height: 240 },
      { x: 340, y: 120, width: 20, height: 90 },
      { x: 180, y: 340, width: 180, height: 20 },
      { x: 200, y: 200, width: 20, height: 100 },
      { x: 200, y: 200, width: 80, height: 20 },
    ],
    greenCircle: { x: 320, y: 320, radius: 15 },
  },
  // Level 5
  {
    maze: [
      { x: 80, y: 80, width: 340, height: 20 },
      { x: 400, y: 80, width: 20, height: 340 },
      { x: 80, y: 400, width: 340, height: 20 },
      { x: 140, y: 140, width: 220, height: 20 },
      { x: 140, y: 140, width: 20, height: 220 },
      { x: 340, y: 140, width: 20, height: 160 },
      { x: 200, y: 340, width: 140, height: 20 },
      { x: 220, y: 220, width: 20, height: 80 },
      { x: 220, y: 220, width: 60, height: 20 },
    ],
    greenCircle: { x: 260, y: 260, radius: 15 },
  },
  // Level 6
  {
    maze: [
      { x: 60, y: 60, width: 380, height: 20 },
      { x: 420, y: 60, width: 20, height: 380 },
      { x: 60, y: 420, width: 380, height: 20 },
      { x: 60, y: 60, width: 20, height: 320 },
      { x: 100, y: 100, width: 300, height: 20 },
      { x: 380, y: 100, width: 20, height: 150 },
      { x: 100, y: 340, width: 300, height: 20 },
      { x: 140, y: 140, width: 150, height: 20 },
      { x: 340, y: 140, width: 20, height: 160 },
      { x: 140, y: 280, width: 220, height: 20 },
      { x: 140, y: 160, width: 20, height: 120 },
    ],
    greenCircle: { x: 250, y: 250, radius: 15 },
  },
  // Level 7
  {
    maze: [
      { x: 50, y: 50, width: 400, height: 20 },
      { x: 430, y: 50, width: 20, height: 400 },
      { x: 50, y: 430, width: 400, height: 20 },
      { x: 50, y: 50, width: 20, height: 300 },
      { x: 90, y: 90, width: 320, height: 20 },
      { x: 390, y: 90, width: 20, height: 320 },
      { x: 90, y: 390, width: 250, height: 20 },
      { x: 90, y: 110, width: 20, height: 280 },
      { x: 130, y: 130, width: 240, height: 20 },
      { x: 350, y: 130, width: 20, height: 240 },
      { x: 130, y: 350, width: 180, height: 20 },
      { x: 130, y: 150, width: 20, height: 200 },
      { x: 170, y: 170, width: 100, height: 20 },
      { x: 310, y: 170, width: 20, height: 160 },
      { x: 170, y: 310, width: 160, height: 20 },
      { x: 170, y: 190, width: 20, height: 120 },
    ],
    greenCircle: { x: 250, y: 250, radius: 15 },
  },
  
];

const users = {}; // Store usernames for connected users
const activeUsernames = new Set(); // Track active usernames
const lastMoveTime = {}; // Track the last move time for each player
let collisionHandled = false; // Flag to prevent duplicate messages
let winHandled = false; // Flag to prevent duplicate win messages
let gameLocked = false; 
// Serve the intro.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'intro.html'));
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add this endpoint to serve the CA
const caFilePath = path.join(__dirname, 'ca.txt');

app.get('/api/ca', (req, res) => {
  fs.readFile(caFilePath, 'utf8', (err, data) => {
    if (err) {
      res.json({ ca: "CA unavailable" });
    } else {
      res.json({ ca: data.trim() });
    }
  });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Emit player count to all clients
  function emitPlayerCount() {
    io.emit('playerCount', activeUsernames.size);
  }

  // Function to emit the current token state to all clients
  function emitTokenState() {
    io.emit('tokenState', {
      remaining: devTokensRemainingPercent,
      locked: devTokensLockedPercent,
      sold: devTokensSoldPercent,
    });
  }

  // Handle username availability check
  socket.on('checkUsername', (username, callback) => {
    const isAvailable = !activeUsernames.has(username);
    callback(isAvailable); // Send the result back to the client
  });

  // Handle username setup
  socket.on('setUsername', (username) => {
    if (activeUsernames.has(username)) {
      socket.emit('usernameError', 'This username is already taken. Please choose another one.');
      return;
    }

    users[socket.id] = username;
    activeUsernames.add(username);
    lastMoveTime[socket.id] = 0;

    socket.emit('updatePosition', sharedPlayer);
    io.emit('chatMessage', `${username} has joined the game.`);
    emitPlayerCount();
  });

  // Send the current level data to the newly connected client
  socket.emit('levelData', { currentLevel, ...levels[currentLevel], sharedPlayer });

  // Emit the initial state on connection
  socket.emit('tokenState', {
    remaining: devTokensRemainingPercent,
    locked: devTokensLockedPercent,
    sold: devTokensSoldPercent,
  });

  // Handle movement from any player
  socket.on('move', ({ dx, dy }) => {
    if (!users[socket.id]) return; // Ignore if the user hasn't set a username

    if (gameLocked) {
      socket.emit('chatMessage', {
        text: 'Please wait for the next level to start!',
        color: 'orange',
      });
      return;
    }

    const now = Date.now();
    const cooldown = 1000; // 1 second cooldown

    // Check if the user is an admin
    if (users[socket.id] !== ADMIN_KEY) {
      if (now - lastMoveTime[socket.id] < cooldown) {
        // Send a red chat message to the player
        socket.emit('chatMessage', {
          text: 'You must wait 1 second before moving again!',
          color: 'red',
        });
        return;
      }
      lastMoveTime[socket.id] = now; // Update last move time
    }

    
    // Ensure dx and dy are within the range of -5 to 5, for security
    dx = Math.max(-5, Math.min(5, dx));
    dy = Math.max(-5, Math.min(5, dy));


    
    const newX = sharedPlayer.x + dx;
    const newY = sharedPlayer.y + dy;

    //game area boundaries
    const gameArea = { width: 500, height: 500 }; 

    // Check boundaries
    if (newX >= 0 && newX <= gameArea.width - 10 && newY >= 0 && newY <= gameArea.height - 10) {
      sharedPlayer.x = newX;
      sharedPlayer.y = newY;

      // Broadcast the updated position and a chat message
      io.emit('updatePosition', sharedPlayer);
      io.emit(
        'chatMessage',
        `${users[socket.id]} moved ${dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up'}.`
      );
    } else {
      // Notify the player they hit the boundary
      socket.emit('chatMessage', {
        text: 'You cannot move outside the game area!',
        color: 'orange',
      });
    }
  });

  // Handle maze collision
  socket.on('mazeCollision', () => {
    if (users[socket.id] && !collisionHandled) {
      devTokensRemainingPercent -= 0.05; // Reduce dev tokens by 5%
      devTokensSoldPercent += 0.05; // Increase dev tokens sold by 5%
      console.log('Dev tokens percent:', devTokensRemainingPercent);
      console.log('Lose event triggered');
      console.log('Current level:', currentLevel);
      collisionHandled = true; //flag to true to prevent duplicate handling

      sharedPlayer = { x: 10, y: 10 }; // Reset the shared player's position
      io.emit('updatePosition', sharedPlayer); // Broadcast the reset position

      // Send the message only once from the server
      io.emit('chatMessage', {
        text: `A red wall has been hit and everyone has been sent back to the start! 5% of dev tokens sold!`,
        color: 'red',
      });

      emitTokenState(); // Update the token state after collision

      // Reset the flag after a short delay to allow future collisions
      setTimeout(() => {
        collisionHandled = false;
      }, 1000); // Adjust the delay as needed
    }
  });

  // Handle win event
  socket.on('win', () => {
    if (users[socket.id] && !winHandled) {
      devTokensRemainingPercent -= 0.1; // Reduce dev tokens by 10%
      devTokensLockedPercent += 0.1; // Increase dev tokens locked by 10%
      console.log('Win event triggered');
      console.log('Current level:', currentLevel);
      
      winHandled = true;
      gameLocked = true; 
      io.emit('chatMessage', {
        text: `Level ${currentLevel + 1} has been completed! 10% of dev tokens are being locked. Next level in 20 seconds...`,
        color: 'green',
      });

      emitTokenState(); // Update the token state after winning

      setTimeout(() => {
        // Advance to next level or loop back to first
        currentLevel = (currentLevel + 1) % levels.length;
        sharedPlayer = { x: 10, y: 10 };
        io.emit('levelData', { currentLevel, ...levels[currentLevel], sharedPlayer });
        io.emit('chatMessage', {
          text: `Level ${currentLevel + 1} has started!`,
          color: 'blue',
        });
        winHandled = false;
        gameLocked = false; // Unlock the game
      }, 20000);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      io.emit('chatMessage', `${username} has left the game.`);
      activeUsernames.delete(username);
      delete users[socket.id];
      delete lastMoveTime[socket.id];
      emitPlayerCount(); // Update player count on leave
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
