// Game data with updated settings for better gameplay
// Your existing gameData structure
  const gameData = {
    questions: [], // will be replaced with API data
    gameSettings: {
      enemyBaseSpeed: 0.01,
      speedIncreasePerWrongAnswer: 1.4,
      playerSpeed: 6,
      gameOverDistance: 1.5,
      checkpointDistance: 1.5,
      mazeSize: 24,
      wallHeight: 3,
      maxEnemies: 4,
      cameraHeight: 1.8,
    },
    maze: [],
   colors: {
      wall: "#8b138b",
      floor: "#2f4852",
      checkpoint: "#00ffff",
      checkpointRange: "#0400ff",
      enemyColors: ["#FF4444", "#4444FF", "#44FF44", "#FF44FF"],
      sky: "#87CEEB",
    },
    debug: {
      showFPS: true,
      showCameraPosition: true,
      showKeyStates: true,
      showCheckpointRanges: true,
      consoleLogging: true,
    },
    checkpointPositions: [],
  };

  // Function to get query params
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

function generateRandomMaze(size) {
      const maze = [];

      for (let y = 0; y < size; y++) {
        maze[y] = [];
        for (let x = 0; x < size; x++) {
          if (y === 0 || y === size - 1 || x === 0 || x === size - 1) {
            maze[y][x] = 1; // border walls
          } else {
            maze[y][x] = Math.random() < 0.3 ? 1 : 0; // 30% chance wall
          }
        }
      }

      return maze;
    }

function generateCheckpoints(maze, numCheckpoints) {
    const size = maze.length;
    const walkableTiles = [];

    // Collect all non-wall tiles (assuming 0 = walkable, 1 = wall)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 0) {
          const worldX = x - Math.floor(size / 2);
          const worldZ = y - Math.floor(size / 2);
          walkableTiles.push({ gridX: x, gridY: y, x: worldX, z: worldZ });
        }
      }
    }

    const checkpoints = [];

    // Randomly pick n unique tiles
    for (let i = 0; i < numCheckpoints && walkableTiles.length > 0; i++) {
      const idx = Math.floor(Math.random() * walkableTiles.length);
      checkpoints.push(walkableTiles[idx]);
      walkableTiles.splice(idx, 1); // remove so it’s not picked again
    }

    console.log(checkpoints);
    return checkpoints;
  }


  async function loadGameData() {
    const fpsId = getQueryParam("fps"); // from ?fps=1
    if (!fpsId) {
      console.error("FPS id not found in URL!");
      return;
    }

    try {
      // Fetch from your API
      const response = await fetch(`https://srm.startuplair.com/api/fps/${fpsId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Replace questions in gameData
      gameData.questions = data; // assuming API already returns array like [{id, question, options, correct, explanation}, ...]

      gameData.maze = generateRandomMaze(gameData.gameSettings.mazeSize);

      var chkpoints = generateCheckpoints(gameData.maze, gameData.questions.length);

      gameData.checkpointPositions =  chkpoints.map(c => ({
        x: c.x,
        z: c.z,
      }));

      // console.log("Updated gameData:", gameData);
      initializeGame();
    } catch (error) {
      console.error("Error fetching FPS data:", error);
    }
  }

    loadGameData();
  // Call function on page load



// Game class - fixed to work without ES6 imports
class QuizFPSGame {

  constructor() {
    console.log("QuizFPSGame constructor called");
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.maze = [];
    this.checkpoints = [];
    this.checkpointRanges = [];
    this.enemies = [];

    this.currentQuestionIndex = 0;
    this.score = 0;
    this.gameState = "start";
    this.currentEnemySpeed = gameData.gameSettings.enemyBaseSpeed;

    this.mazePattern = gameData.maze;

    console.log("game data in constructor",gameData)

    // Keyboard state tracking
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    // Movement variables
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveSpeed = gameData.gameSettings.playerSpeed;

    // Raycasting for shooting
    this.raycaster = new THREE.Raycaster();

    // Debug variables
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fps = 0;

    this.clock = new THREE.Clock();
    this.isInitialized = false;
    this.isPointerLocked = false;

    // Initialize after DOM is ready
    this.waitForThreeJS();
  }

  waitForThreeJS() {
    if (
      typeof THREE === "undefined" ||
      typeof THREE.PointerLockControls === "undefined"
    ) {
      console.log("Waiting for Three.js to load...");
      setTimeout(() => this.waitForThreeJS(), 100);
      return;
    }
    console.log("Three.js loaded, initializing game...");
    setTimeout(() => this.init(), 100);
  }

  init() {
    try {
      console.log("Initializing 3D Quiz FPS Game...");
      this.setupScene();
      this.setupControls();
      this.generateMaze();
      this.setupCheckpoints();
      this.setupEventListeners();
      this.isInitialized = true;
      console.log("Game initialized successfully");
    } catch (error) {
      console.error("Game initialization failed:", error);
    }
  }

  setupScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(gameData.colors.sky);
    this.scene.fog = new THREE.Fog(gameData.colors.sky, 20, 50);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Renderer
    const canvas = document.getElementById("game-canvas");
    if (!canvas) {
      throw new Error("Canvas element not found");
    }
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    console.log("Scene setup complete");
  }

  setupControls() {
    // Use the global THREE.PointerLockControls from CDN
    this.controls = new THREE.PointerLockControls(
      this.camera,
      this.renderer.domElement
    );
    this.scene.add(this.controls.getObject());

    // Set initial position close to first checkpoint
    this.controls
      .getObject()
      .position.set(6.6, gameData.gameSettings.cameraHeight, 5.8);

    console.log("Controls setup complete");
  }

  collidesWithWall(position, playerRadius = 0.3) {
    const cellSize = 2;
    const centerOffset = Math.floor(this.mazePattern.length / 2);
    
    // Check multiple points around player's position to account for player size
    const checkPoints = [
      // Center
      { x: position.x, z: position.z },

      // 1-block radius (cardinal directions)
      { x: position.x + playerRadius, z: position.z },   // Right
      { x: position.x - playerRadius, z: position.z },   // Left
      { x: position.x, z: position.z + playerRadius },   // Forward
      { x: position.x, z: position.z - playerRadius },   // Backward

      // 1-block radius (diagonals)
      { x: position.x + playerRadius, z: position.z + playerRadius }, // Forward-Right
      { x: position.x - playerRadius, z: position.z + playerRadius }, // Forward-Left
      { x: position.x + playerRadius, z: position.z - playerRadius }, // Backward-Right
      { x: position.x - playerRadius, z: position.z - playerRadius }, // Backward-Left

      // 2-block radius (cardinal directions)
      { x: position.x + 2 * playerRadius, z: position.z },   // Right 2
      { x: position.x - 2 * playerRadius, z: position.z },   // Left 2
      { x: position.x, z: position.z + 2 * playerRadius },   // Forward 2
      { x: position.x, z: position.z - 2 * playerRadius },   // Backward 2

      // 2-block radius (diagonals)
      { x: position.x + 2 * playerRadius, z: position.z + 2 * playerRadius }, // Forward-Right 2
      { x: position.x - 2 * playerRadius, z: position.z + 2 * playerRadius }, // Forward-Left 2
      { x: position.x + 2 * playerRadius, z: position.z - 2 * playerRadius }, // Backward-Right 2
      { x: position.x - 2 * playerRadius, z: position.z - 2 * playerRadius }, // Backward-Left 2
    ];
    
    for (let point of checkPoints) {
        const gridX = Math.round(point.x / cellSize) + centerOffset;
        const gridZ = Math.round(point.z / cellSize) + centerOffset;
        
        // Check bounds
        if (gridX < 0 || gridX >= this.mazePattern.length || 
            gridZ < 0 || gridZ >= this.mazePattern[0].length) {
            return true; // Outside maze = wall
        }
        
        // Check if position is in wall
        if (this.mazePattern[gridX][gridZ] === 1) {
            return true; // Hit wall
        }
    }
    
    return false; // No collision
}


  generateMaze() {
    const size = gameData.gameSettings.mazeSize;
    const wallHeight = gameData.gameSettings.wallHeight;

    // Create larger floor
    const floorGeometry = new THREE.PlaneGeometry(size * 2, size * 2);
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: gameData.colors.floor,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Create walls for larger maze
    const wallGeometry = new THREE.BoxGeometry(2, wallHeight, 2);
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: gameData.colors.wall,
    });

    // Larger, more complex maze pattern
    const mazePattern = this.mazePattern;

    const centerOffset = Math.floor(mazePattern.length / 2);

    for (let x = 0; x < mazePattern.length; x++) {
      for (let z = 0; z < mazePattern[x].length; z++) {
        if (mazePattern[x][z] === 1) {
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(
            (x - centerOffset) * 2,
            wallHeight / 2,
            (z - centerOffset) * 2
          );
          wall.castShadow = true;
          wall.receiveShadow = true;
          this.scene.add(wall);
          this.maze.push(wall);
        }
      }
    }

    console.log("Larger maze generated with", this.maze.length, "walls");
  }

  setupCheckpoints() {
        console.log("Setting up checkpoints...");
        const checkpointGeometry = new THREE.SphereGeometry(0.5, 16, 16);

        gameData.checkpointPositions.forEach((pos, index) => {
            // Create glowing checkpoint
            const checkpointMaterial = new THREE.MeshLambertMaterial({
                color: gameData.colors.checkpoint,
                emissive: gameData.colors.checkpoint,
                emissiveIntensity: 0.3,
            });

            const checkpoint = new THREE.Mesh(checkpointGeometry, checkpointMaterial);
            checkpoint.position.set(pos.x, 1, pos.z);
            
            // FIX: Initialize ALL userData properties
            checkpoint.userData = { 
                type: "checkpoint", 
                questionIndex: index,
                completed: false,      // ADD THIS
                activated: false       // ADD THIS
            };
            
            checkpoint.castShadow = true;

            this.scene.add(checkpoint);
            this.checkpoints.push(checkpoint);

            // Create visual range indicator for debugging
            if (gameData.debug.showCheckpointRanges) {
                const rangeGeometry = new THREE.RingGeometry(
                    gameData.gameSettings.checkpointDistance - 0.1,
                    gameData.gameSettings.checkpointDistance,
                    32
                );
                const rangeMaterial = new THREE.MeshBasicMaterial({
                    color: gameData.colors.checkpointRange,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide,
                });

                const range = new THREE.Mesh(rangeGeometry, rangeMaterial);
                range.position.set(pos.x, 0.1, pos.z);
                range.rotation.x = -Math.PI / 2;
                this.scene.add(range);
                this.checkpointRanges.push(range);
            }

            console.log(`Checkpoint ${index} created at (${pos.x}, ${pos.z})`);
        });

        console.log("Checkpoints setup complete:", this.checkpoints.length);
    }


  setupEventListeners() {
    console.log("Setting up event listeners...");

    // Use a more direct approach for the start button
    setTimeout(() => {
      const startBtn = document.getElementById("start-game-btn");
      console.log("Looking for start button:", startBtn);

      if (startBtn) {
        // Remove any existing listeners first
        startBtn.onclick = null;

        // Add click handler with direct function binding
        startBtn.onclick = () => {
          console.log("START BUTTON CLICKED - STARTING GAME NOW!");
          this.startGame();
        };

        // Also add event listener as backup
        startBtn.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("START BUTTON EVENT LISTENER - STARTING GAME NOW!");
            this.startGame();
          },
          false
        );

        console.log("Start button handlers attached successfully");
      } else {
        console.error("Could not find start button element!");
      }

      // Restart game button
      const restartBtn = document.getElementById("restart-game-btn");
      if (restartBtn) {
        restartBtn.onclick = () => {
          console.log("RESTART BUTTON CLICKED");
          this.restartGame();
        };
      }
    }, 500);

    // Keyboard controls
    // In setupEventListeners(), update the keydown handler:
    document.addEventListener("keydown", (event) => {
      // Allow movement during questions too
      if (
        (this.gameState !== "playing" && this.gameState !== "question") ||
        !this.isPointerLocked
      )
        return;

      switch (event.code) {
        case "KeyW":
          this.keys.w = true;
          break;
        case "KeyA":
          this.keys.a = true;
          break;
        case "KeyS":
          this.keys.s = true;
          break;
        case "KeyD":
          this.keys.d = true;
          break;
        // Add this case to your keydown switch statement
        case "KeyG": // Press G to debug game state
            this.debugGameState();
            break;

      }
      this.updateDebugKeys();
      event.preventDefault();
    });

    document.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyW":
          this.keys.w = false;
          break;
        case "KeyA":
          this.keys.a = false;
          break;
        case "KeyS":
          this.keys.s = false;
          break;
        case "KeyD":
          this.keys.d = false;
          break;
      }
      this.updateDebugKeys();
    });

    // Mouse click for shooting
    // In setupEventListeners(), update the mouse click handler:
    document.addEventListener("click", (e) => {
      // FIXED: Allow shooting during both playing and question states
      if (this.gameState === "playing" || this.gameState === "question") {
        if (this.isPointerLocked) {
          this.shoot();
        } else {
          this.controls.lock();
        }
      }
    });

    // Pointer lock events
    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === this.renderer.domElement) {
        this.isPointerLocked = true;
        console.log("Pointer lock acquired");
        const instructionsOverlay = document.getElementById(
          "instructions-overlay"
        );
        if (instructionsOverlay) instructionsOverlay.style.display = "none";
      } else {
        this.isPointerLocked = false;
        console.log("Pointer lock lost");
        this.keys = { w: false, a: false, s: false, d: false };

        if (this.gameState === "playing") {
          const instructionsOverlay = document.getElementById(
            "instructions-overlay"
          );
          if (instructionsOverlay) instructionsOverlay.style.display = "block";
        }
      }
    });

    // Window resize
    window.addEventListener("resize", () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    console.log("Event listeners setup complete");
  }

  startGame() {
    console.log("=== STARTING GAME ===");

    // Get DOM elements
    const startScreen = document.getElementById("start-screen");
    const gameHud = document.getElementById("game-hud");

    console.log("Start screen element:", startScreen);
    console.log("Game HUD element:", gameHud);

    // Hide start screen - use multiple methods to ensure it works
    if (startScreen) {
      startScreen.style.display = "none";
      startScreen.style.visibility = "hidden";
      startScreen.classList.add("hidden");
      console.log("Start screen should now be hidden");
    } else {
      console.error("Start screen element not found!");
    }

    // Show game HUD
    if (gameHud) {
      gameHud.style.display = "block";
      gameHud.style.visibility = "visible";
      gameHud.classList.remove("hidden");
      console.log("Game HUD should now be visible");
    } else {
      console.error("Game HUD element not found!");
    }

    // Set game state
    this.gameState = "playing";
    this.currentQuestionIndex = 0;
    this.score = 0;

    console.log("Game state set to:", this.gameState);

    // Update UI and start game loop
    this.updateUI();
    this.gameLoop();

    // Force a render to show the scene
    this.renderer.render(this.scene, this.camera);
    console.log("Initial render completed");

    // Request pointer lock after a delay
    setTimeout(() => {
      console.log("Requesting pointer lock...");
      try {
        this.controls.lock();
      } catch (error) {
        console.error("Error requesting pointer lock:", error);
      }
    }, 500);

    console.log("=== GAME START COMPLETE ===");
  }

  restartGame() {
    console.log("=== RESTARTING GAME ===");

    // Reset game variables
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.currentEnemySpeed = gameData.gameSettings.enemyBaseSpeed;

    // Clear enemies and reset states
    this.clearEnemies();
    this.resetCheckpointStates();

    // Reset player position
    this.controls
      .getObject()
      .position.set(6.6, gameData.gameSettings.cameraHeight, 5.8);
    this.keys = { w: false, a: false, s: false, d: false };

    // Hide all overlays and screens
    const gameOverScreen = document.getElementById("game-over-screen");
    const questionPanel = document.getElementById("question-panel");
    const messageDisplay = document.getElementById("message-display");
    const gameHud = document.getElementById("game-hud");
    const instructionsOverlay = document.getElementById("instructions-overlay");

    if (gameOverScreen) {
      gameOverScreen.style.display = "none";
      gameOverScreen.classList.add("hidden");
    }
    if (questionPanel) {
      questionPanel.classList.add("hidden");
    }
    if (messageDisplay) {
      messageDisplay.classList.add("hidden");
    }
    if (instructionsOverlay) {
      instructionsOverlay.style.display = "none";
    }

    // Show game HUD
    if (gameHud) {
      gameHud.style.display = "block";
      gameHud.classList.remove("hidden");
      gameHud.style.visibility = "visible";
    }

    // Reset game state
    this.gameState = "playing";
    this.isPointerLocked = false;

    // Update UI
    this.updateUI();

    // Start game loop
    this.gameLoop();

    // Request pointer lock after a delay
    setTimeout(() => {
      try {
        this.controls.lock();
      } catch (error) {
        console.error("Error requesting pointer lock:", error);
      }
    }, 500);

    console.log("=== GAME RESTART COMPLETE ===");
  }

  gameLoop() {
    // Allow game loop to run when showing questions too
    if (this.gameState !== "playing" && this.gameState !== "question") return;

    const delta = this.clock.getDelta();

    this.updateMovement(delta);
    this.updateEnemies(delta);

    // FIXED: Always check checkpoint proximity when in playing state (even after completing questions)
    if (this.gameState === "playing") {
      this.checkCheckpointProximity();
    }

    this.animateCheckpoints();
    this.updateDebug();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.gameLoop());
  }

    updateMovement(delta) {
        if (!this.isPointerLocked) return;

        this.direction.set(0, 0, 0);

        if (this.keys.w) this.direction.z += 1;
        if (this.keys.s) this.direction.z -= 1;
        if (this.keys.a) this.direction.x -= 1;
        if (this.keys.d) this.direction.x += 1;

        this.direction.normalize();

        if (this.direction.length() > 0) {
            const moveDistance = this.moveSpeed * delta;
            const currentPos = this.controls.getObject().position;
            
            // Calculate potential new position
            let newX = currentPos.x;
            let newZ = currentPos.z;

            if (this.keys.w || this.keys.s) {
                const forwardVector = new THREE.Vector3();
                this.camera.getWorldDirection(forwardVector);
                newX += forwardVector.x * this.direction.z * moveDistance;
                newZ += forwardVector.z * this.direction.z * moveDistance;
            }
            
            if (this.keys.a || this.keys.d) {
                const rightVector = new THREE.Vector3();
                this.camera.getWorldDirection(rightVector);
                rightVector.cross(this.camera.up);
                newX += rightVector.x * this.direction.x * moveDistance;
                newZ += rightVector.z * this.direction.x * moveDistance;
            }

            const newPosition = new THREE.Vector3(newX, currentPos.y, newZ);
            
            // Check collision before moving
            if (!this.collidesWithWall(newPosition)) {
                // Safe to move
                this.controls.getObject().position.x = newX;
                this.controls.getObject().position.z = newZ;
            }
            // If collision detected, player simply doesn't move in that direction

            // Maintain camera height
            this.controls.getObject().position.y = gameData.gameSettings.cameraHeight;

            // Apply world bounds
            const bounds = 20;
            const pos = this.controls.getObject().position;
            if (Math.abs(pos.x) > bounds) {
                pos.x = Math.sign(pos.x) * bounds;
            }
            if (Math.abs(pos.z) > bounds) {
                pos.z = Math.sign(pos.z) * bounds;
            }
        }
    }


  updateEnemies(delta) {
    const playerPosition = this.controls.getObject().position;

    this.enemies.forEach((enemy) => {
      if (!enemy.userData) return;

      const direction = new THREE.Vector3();
      direction.subVectors(playerPosition, enemy.position);
      direction.y = 0;
      direction.normalize();
      direction.multiplyScalar(enemy.userData.speed * delta * 60); // Frame rate independent

      enemy.position.add(direction);
      enemy.lookAt(
        new THREE.Vector3(playerPosition.x, enemy.position.y, playerPosition.z)
      );

      const distance = enemy.position.distanceTo(playerPosition);
      if (distance < gameData.gameSettings.gameOverDistance) {
        this.gameOver("An enemy reached you!");
        return;
      }
    });
  }

    checkCheckpointProximity() {
        const playerPosition = this.controls.getObject().position;

        console.log(`=== Checking proximity to ALL checkpoints ===`);
        console.log(`Player position:`, playerPosition);
        console.log(`Game state:`, this.gameState);
        console.log(`Enemies count:`, this.enemies.length);

        this.checkpoints.forEach((checkpoint) => {
            const distance = playerPosition.distanceTo(checkpoint.position);
            const checkpointIndex = checkpoint.userData.questionIndex;
            
            // Log all checkpoint distances for debugging
            console.log(`Checkpoint ${checkpointIndex}: distance=${distance.toFixed(2)}, completed=${checkpoint.userData.completed}`);
            
            // CHANGED: Check ALL checkpoints, not just the current one
            // Skip already completed checkpoints
            if (!checkpoint.userData.completed) {
                // Update debug display for the closest checkpoint
                const distanceDisplay = document.getElementById("checkpoint-distance-display");
                if (distanceDisplay) {
                    distanceDisplay.textContent = `Closest: ${distance.toFixed(2)}`;
                }

                console.log(`*** CHECKING CHECKPOINT ${checkpointIndex} ***`);
                console.log(`Distance: ${distance.toFixed(2)}`);
                console.log(`Required distance: ${gameData.gameSettings.checkpointDistance}`);
                console.log(`Checkpoint completed: ${checkpoint.userData.completed}`);
                console.log(`Enemies present: ${this.enemies.length > 0}`);

                if (distance < gameData.gameSettings.checkpointDistance) {
                    console.log(`*** CLOSE ENOUGH - ATTEMPTING ACTIVATION OF CHECKPOINT ${checkpointIndex} ***`);
                    this.activateCheckpoint(checkpointIndex);
                }
            } else {
                console.log(`*** CHECKPOINT ${checkpointIndex} ALREADY COMPLETED - SKIPPING ***`);
            }
        });
    }



    activateCheckpoint(questionIndex) {
        console.log(`=== ACTIVATE CHECKPOINT ${questionIndex} ===`);
        console.log(`Questions length: ${gameData.questions.length}`);
        console.log(`Current enemies: ${this.enemies.length}`);
        console.log(`Current game state: ${this.gameState}`);
        
        if (questionIndex >= gameData.questions.length) {
            console.log('Invalid question index');
            return;
        }

        // Check if checkpoint is already completed
        if (this.checkpoints[questionIndex].userData.completed) {
            console.log(`Checkpoint ${questionIndex} already completed - skipping`);
            return;
        }

        // Only show question if we don't have enemies (not currently in a question)
        if (this.enemies.length > 0) {
            console.log("Question already active - enemies present");
            return;
        }

        // Check if already in question state
        if (this.gameState === 'question') {
            console.log("Already in question state - skipping");
            return;
        }

        // CHANGED: Set the current question index to the activated checkpoint
        this.currentQuestionIndex = questionIndex;

        // Change game state to 'question'
        this.gameState = "question";
        console.log("Game state changed to:", this.gameState);

        const question = gameData.questions[questionIndex];
        console.log("Showing question:", question.question);
        this.showQuestion(question);
        this.spawnEnemies(question);
        
        console.log(`=== CHECKPOINT ${questionIndex} ACTIVATION COMPLETE ===`);
    }



  showQuestion(question) {
    const questionPanel = document.getElementById("question-panel");
    const questionText = document.getElementById("question-text");
    const questionProgress = document.getElementById("question-progress");

    if (questionText) questionText.textContent = question.question;
    if (questionProgress) {
      questionProgress.textContent = `Question ${
        this.currentQuestionIndex + 1
      } of ${gameData.questions.length}`;
    }
    if (questionPanel) questionPanel.classList.remove("hidden");
  }

  spawnEnemies(question) {
    console.log("Spawning enemies for question:", question.question);
    this.clearEnemies();
    this.currentEnemySpeed = gameData.gameSettings.enemyBaseSpeed;

    const checkpointPos =
      gameData.checkpointPositions[this.currentQuestionIndex];
    const spawnDistance = 8;

    question.options.forEach((option, index) => {
      const angle = (index / question.options.length) * Math.PI * 2;
      const x = checkpointPos.x + Math.cos(angle) * spawnDistance;
      const z = checkpointPos.z + Math.sin(angle) * spawnDistance;

      const enemy = this.createEnemy(option, index, x, z);
      // userData is now set in createEnemy

      this.scene.add(enemy);
      this.enemies.push(enemy);
      console.log(
        `Enemy ${index} spawned at (${x}, ${z}) with text: ${option}`
      );
      console.log(`Enemy userData:`, enemy.userData);
    });

    console.log(`Spawned ${this.enemies.length} enemies`);
    this.updateEnemiesCount();
  }

  createEnemy(text, index, x, z) {
    // Create main enemy mesh with proper userData
    const enemyGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const enemyMaterial = new THREE.MeshLambertMaterial({
      color:
        gameData.colors.enemyColors[index % gameData.colors.enemyColors.length],
    });

    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.set(x, 1, z);
    enemy.castShadow = true;
    enemy.receiveShadow = true;

    // Set userData immediately
    enemy.userData = {
      type: "enemy",
      optionIndex: index,
      isCorrect:
        index === gameData.questions[this.currentQuestionIndex].correct,
      speed: this.currentEnemySpeed,
      text: text,
    };

    // Create text sprite (same as before but ensure it doesn't interfere)
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 128;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#000000";
    context.font = "bold 24px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Text wrapping (same as before)
    const maxWidth = canvas.width - 40;
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = canvas.height / 2 - (lines.length - 1) * 15;
    lines.forEach((line, i) => {
      context.fillText(line, canvas.width / 2, startY + i * 30);
    });

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4, 1, 1);
    sprite.position.set(0, 2.5, 0);

    // Make sure sprite doesn't interfere with raycasting
    sprite.userData = { type: "sprite", parentEnemy: enemy };
    sprite.raycast = function () {}; // Disable raycasting for sprite

    enemy.add(sprite);

    console.log("Created enemy:", enemy.userData);
    return enemy;
  }

  shoot() {
    // FIXED: Allow shooting during both playing and question states
    if (
      !this.isPointerLocked ||
      (this.gameState !== "playing" && this.gameState !== "question")
    ) {
      console.log(
        "Cannot shoot: pointer not locked or wrong game state:",
        this.gameState
      );
      return;
    }

    // Get camera position and direction more reliably
    const camera = this.camera;
    const raycaster = this.raycaster;

    // Set raycaster from camera center (screen center)
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // Create array of all enemy meshes (not including sprites)
    const enemyMeshes = this.enemies.filter(
      (enemy) => enemy.userData && enemy.userData.type === "enemy"
    );

    console.log("Shooting... enemies available:", enemyMeshes.length);
    console.log("Player position:", camera.position);
    console.log("Camera direction:", raycaster.ray.direction);

    // Intersect with enemy meshes only
    const intersects = raycaster.intersectObjects(enemyMeshes, false); // false = don't check children

    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      console.log("Hit detected at distance:", intersects[0].distance);
      console.log("Hit object:", hitObject);

      // Find the enemy this object belongs to
      let hitEnemy = null;
      for (let enemy of this.enemies) {
        if (enemy === hitObject) {
          hitEnemy = enemy;
          break;
        }
      }

      if (hitEnemy && hitEnemy.userData) {
        console.log("Shot hit enemy with data:", hitEnemy.userData);
        this.handleEnemyHit(hitEnemy);
      } else {
        console.log("Hit object is not a valid enemy");
      }
    } else {
      console.log("Shot missed - no intersections found");

      // Debug: Check if enemies are in range
      const playerPos = camera.position;
      this.enemies.forEach((enemy, index) => {
        const distance = playerPos.distanceTo(enemy.position);
        console.log(
          `Enemy ${index} distance: ${distance.toFixed(2)} at position:`,
          enemy.position
        );
      });
    }
  }

handleEnemyHit(enemy) {
    if (!enemy.userData) return;

    console.log(`=== ENEMY HIT ===`);
    console.log(`Enemy isCorrect: ${enemy.userData.isCorrect}`);
    console.log(`Current question index: ${this.currentQuestionIndex}`);

    if (enemy.userData.isCorrect) {
        this.score += 100;
        this.showMessage("Correct!", "success");
        this.clearEnemies();
        this.hideQuestion();

        // Mark current checkpoint as completed visually
        this.markCheckpointCompleted(this.currentQuestionIndex);

        // CHANGED: Don't automatically increment currentQuestionIndex
        // Let the player choose which checkpoint to visit next

        // Reset game state to 'playing' to allow new checkpoint activation
        this.gameState = "playing";
        
        console.log(`=== CORRECT ANSWER PROCESSING ===`);
        console.log(`Completed checkpoint: ${this.currentQuestionIndex}`);
        console.log(`Game state reset to: ${this.gameState}`);

        // Check if all checkpoints are completed
        const completedCount = this.checkpoints.filter(cp => cp.userData.completed).length;
        console.log(`Completed checkpoints: ${completedCount}/${this.checkpoints.length}`);

        setTimeout(() => {
            this.hideMessage();
            if (completedCount >= gameData.questions.length) {
                console.log('All checkpoints completed!');
                this.victory();
            } else {
                console.log(`Choose your next checkpoint! ${completedCount}/${gameData.questions.length} completed`);
                this.showMessage(`${completedCount}/${gameData.questions.length} completed. Find another checkpoint!`, "success");
                setTimeout(() => this.hideMessage(), 3000);
            }
        }, 2000);
    } else {
        this.showMessage("Wrong! Enemies are faster now!", "error");
        this.scene.remove(enemy);
        this.enemies = this.enemies.filter((e) => e !== enemy);

        this.enemies.forEach((e) => {
            e.userData.speed *= gameData.gameSettings.speedIncreasePerWrongAnswer;
        });

        console.log("Wrong answer! Remaining enemies:", this.enemies.length);
        this.updateEnemiesCount();

        // If all enemies are defeated through wrong answers, reset to playing state
        if (this.enemies.length === 0) {
            this.gameState = "playing";
            this.hideQuestion();
            console.log("All enemies defeated, game state reset to playing");
        }

        setTimeout(() => this.hideMessage(), 1500);
    }

    this.updateUI();
}




  markCheckpointCompleted(checkpointIndex) {
    if (checkpointIndex < this.checkpoints.length) {
      const checkpoint = this.checkpoints[checkpointIndex];

      // Change appearance to show completion
      checkpoint.material.color.setHex(0x00ff00); // Green for completed
      checkpoint.material.emissive.setHex(0x004400); // Dark green emissive
      checkpoint.material.emissiveIntensity = 0.1;

      // Stop animation for completed checkpoint
      checkpoint.scale.setScalar(1);

      // Mark as completed
      checkpoint.userData.completed = true;
      checkpoint.userData.activated = false; // Reset activation state

      console.log(`Checkpoint ${checkpointIndex} marked as completed`);
    }
  }

  resetCheckpointStates() {
    this.checkpoints.forEach((checkpoint, index) => {
      // Reset to original golden color
      checkpoint.material.color.setHex(0xffd700); // Gold
      checkpoint.material.emissive.setHex(0xffd700); // Gold emissive
      checkpoint.material.emissiveIntensity = 0.3;
      checkpoint.scale.setScalar(1);

      // Reset userData
      checkpoint.userData.completed = false;
      checkpoint.userData.activated = false;

      console.log(`Reset checkpoint ${index} state`);
    });
  }

  clearEnemies() {
    this.enemies.forEach((enemy) => this.scene.remove(enemy));
    this.enemies = [];
    this.updateEnemiesCount();
  }

animateCheckpoints() {
    const time = Date.now() * 0.005;
    this.checkpoints.forEach((checkpoint, index) => {
        if (checkpoint.userData.completed) {
            // Keep completed checkpoints static and green
            checkpoint.scale.setScalar(1);
            checkpoint.material.emissiveIntensity = 0.1;
            checkpoint.rotation.y = 0;
        } else {
            // CHANGED: Animate ALL uncompleted checkpoints
            const scale = 1 + Math.sin(time + index) * 0.2;
            checkpoint.scale.setScalar(scale);
            checkpoint.material.emissiveIntensity = 0.2 + Math.sin(time + index) * 0.1;
            checkpoint.rotation.y += 0.01;
        }
    });
}



  showMessage(text, type) {
    const messageDisplay = document.getElementById("message-display");
    if (messageDisplay) {
      messageDisplay.textContent = text;
      messageDisplay.className = `message-display ${type}`;
      messageDisplay.classList.remove("hidden");
    }
  }

  hideMessage() {
    const messageDisplay = document.getElementById("message-display");
    if (messageDisplay) messageDisplay.classList.add("hidden");
  }

  hideQuestion() {
    const questionPanel = document.getElementById("question-panel");
    if (questionPanel) questionPanel.classList.add("hidden");
  }

    updateUI() {
        const checkpointProgress = document.getElementById("checkpoint-progress");
        const scoreDisplay = document.getElementById("score-display");

        if (checkpointProgress) {
            // CHANGED: Show completed count instead of current index
            const completedCount = this.checkpoints.filter(cp => cp.userData.completed).length;
            checkpointProgress.textContent = `Completed: ${completedCount}/${gameData.questions.length}`;
        }
        if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${this.score}`;
        }
    }


  updateDebug() {
    this.frameCount++;
    const now = performance.now();
    if (now > this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;
    }

    const fpsDisplay = document.getElementById("fps-counter");
    const positionDisplay = document.getElementById("position-display");
    const gameStateDisplay = document.getElementById("game-state-display");

    if (fpsDisplay) fpsDisplay.textContent = this.fps;
    if (positionDisplay && this.controls) {
      const pos = this.controls.getObject().position;
      positionDisplay.textContent = `${pos.x.toFixed(1)}, ${pos.y.toFixed(
        1
      )}, ${pos.z.toFixed(1)}`;
    }
    if (gameStateDisplay) gameStateDisplay.textContent = this.gameState;
  }

debugGameState() {
    console.log(`=== GAME STATE DEBUG ===`);
    console.log(`Game State: ${this.gameState}`);
    console.log(`Score: ${this.score}`);
    console.log(`Enemies Count: ${this.enemies.length}`);
    console.log(`Player Position:`, this.controls.getObject().position);
    
    const completedCount = this.checkpoints.filter(cp => cp.userData.completed).length;
    console.log(`Progress: ${completedCount}/${this.checkpoints.length} checkpoints completed`);
    
    // Show all checkpoint states
    this.checkpoints.forEach((checkpoint, index) => {
        const pos = gameData.checkpointPositions[index];
        const playerPos = this.controls.getObject().position;
        const distance = Math.sqrt(
            Math.pow(playerPos.x - pos.x, 2) + 
            Math.pow(playerPos.z - pos.z, 2)
        );
        
        console.log(`Checkpoint ${index}: (${pos.x}, ${pos.z}) - Distance: ${distance.toFixed(2)} - Completed: ${checkpoint.userData.completed}`);
    });
    console.log(`===================`);
}



  updateDebugKeys() {
    const keysDisplay = document.getElementById("keys-display");
    if (keysDisplay) {
      const activeKeys = Object.keys(this.keys).filter((key) => this.keys[key]);
      keysDisplay.textContent =
        activeKeys.length > 0 ? activeKeys.join(", ").toUpperCase() : "none";
    }
  }

  updateEnemiesCount() {
    const enemiesCount = document.getElementById("enemies-count");
    if (enemiesCount) enemiesCount.textContent = this.enemies.length;
  }

  gameOver(reason) {
    console.log("Game Over:", reason);
    this.gameState = "gameOver";
    this.clearEnemies();
    this.isPointerLocked = false;

    const gameHud = document.getElementById("game-hud");
    const gameOverScreen = document.getElementById("game-over-screen");
    const gameOverTitle = document.getElementById("game-over-title");
    const gameOverMessage = document.getElementById("game-over-message");
    const finalScore = document.getElementById("final-score");

    if (gameHud) {
      gameHud.style.display = "none";
      gameHud.classList.add("hidden");
    }
    if (gameOverTitle) gameOverTitle.textContent = "Game Over";
    if (gameOverMessage) gameOverMessage.textContent = reason;
    if (finalScore) finalScore.textContent = `Final Score: ${this.score}`;
    if (gameOverScreen) {
      gameOverScreen.style.display = "flex";
      gameOverScreen.classList.remove("hidden");
    }

    this.controls.unlock();
  }

  victory() {
    console.log("Victory! Final score:", this.score);
    this.gameState = "victory";
    this.clearEnemies();
    this.isPointerLocked = false;

    const gameHud = document.getElementById("game-hud");
    const gameOverScreen = document.getElementById("game-over-screen");
    const gameOverTitle = document.getElementById("game-over-title");
    const gameOverMessage = document.getElementById("game-over-message");
    const finalScore = document.getElementById("final-score");

    if (gameHud) {
      gameHud.style.display = "none";
      gameHud.classList.add("hidden");
    }
    if (gameOverTitle) gameOverTitle.textContent = "Victory!";
    if (gameOverMessage)
      gameOverMessage.textContent =
        "Congratulations! You completed all questions!";
    if (finalScore) finalScore.textContent = `Final Score: ${this.score}`;
    if (gameOverScreen) {
      gameOverScreen.style.display = "flex";
      gameOverScreen.classList.remove("hidden");
    }

    this.controls.unlock();

    // 🔥 Extract query params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("user"); // Bearer token
    const fpsId = urlParams.get("fps"); // fps_id

    if (token && fpsId) {
      fetch("https://srm.startuplair.com/api/fps/xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Bearer auth
        },
        body: JSON.stringify({
          fps_id: fpsId,
          xp_gained: this.score,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("XP recorded response:", data);
        })
        .catch((error) => {
          console.error("Error sending XP:", error);
        });
    } else {
      console.warn("Missing ?user (token) or ?fps in URL");
    }
  }

}

// Initialize game when DOM is loaded
let game = null;

function initializeGame() {
  console.log("Initializing game...");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM loaded, creating game instance...");
      game = new QuizFPSGame();
    });
  } else {
    console.log("DOM already loaded, creating game instance...");
    game = new QuizFPSGame();
  }
}

// Initialize the game

