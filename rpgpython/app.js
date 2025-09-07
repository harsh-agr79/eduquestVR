// Game Data
const gameData = {
  "pythonConcepts": [
    {
      "id": "variables",
      "name": "Variables & Data Types", 
      "zone": "Variables Village",
      "description": "Learn to store and manipulate data",
      "quests": [
        {
          "title": "The Naming Ceremony",
          "description": "Help villagers by creating variables for their names",
          "code_challenge": "# Create variables for three villager names\nvillager1 = \nvillager2 = \nvillager3 = \nprint(f'Welcome {villager1}, {villager2}, and {villager3}!')",
          "solution": "villager1 = 'Alice'\nvillager2 = 'Bob'\nvillager3 = 'Charlie'\nprint(f'Welcome {villager1}, {villager2}, and {villager3}!')",
          "reward_xp": 100,
          "reward_item": "Variable Crystal"
        }
      ]
    },
    {
      "id": "functions",
      "name": "Functions",
      "zone": "Function Forest", 
      "description": "Create reusable blocks of code",
      "quests": [
        {
          "title": "The Magic Spell Builder",
          "description": "Create functions to cast different spells",
          "code_challenge": "# Create a function that takes a spell name and returns a magical message\ndef cast_spell(spell_name):\n    # Your code here\n    pass\n\nprint(cast_spell('Fireball'))",
          "solution": "def cast_spell(spell_name):\n    return f'You cast {spell_name}! ✨'\n\nprint(cast_spell('Fireball'))",
          "reward_xp": 150,
          "reward_item": "Function Gem"
        }
      ]
    },
    {
      "id": "loops",
      "name": "Loops",
      "zone": "Loop Lake",
      "description": "Repeat actions efficiently", 
      "quests": [
        {
          "title": "The Endless Echo",
          "description": "Use loops to create echoes across the lake",
          "code_challenge": "# Create a loop that prints 'Echo!' 5 times\n# Your code here",
          "solution": "for i in range(5):\n    print('Echo!')",
          "reward_xp": 200,
          "reward_item": "Loop Ring"
        }
      ]
    }
  ]
};

// Game Class
class PythonQuestGame {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.npcs = [];
    this.gameState = {
      xp: 0,
      level: 1,
      health: 100,
      inventory: [],
      currentQuest: null,
      completedQuests: [],
      currentZone: 'Variables Village'
    };
    this.codeEditor = null;
    this.currentChallenge = null;
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.nearbyNPC = null;
    
    this.init();
  }

  init() {
    try {
      this.setupThreeJS();
      this.createWorld();
      this.setupPlayer();
      this.setupNPCs();
      this.setupControls();
      this.setupUI();
      this.setupCodeEditor();
      this.startGameLoop();
      
      // Hide loading screen
      setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
          loadingScreen.style.display = 'none';
        }
        console.log('Game initialized successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Game initialization error:', error);
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
    }
  }

  setupThreeJS() {
    const canvas = document.getElementById('gameCanvas');
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    
    // Camera  
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  createWorld() {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({color: 0x90EE90});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
    
    // Create world areas
    this.createVillage();
    this.createForest();
    this.createLake();
  }

  createVillage() {
    for (let i = 0; i < 3; i++) {
      const houseGeometry = new THREE.BoxGeometry(6, 6, 6);
      const houseMaterial = new THREE.MeshLambertMaterial({color: 0x8B4513});
      const house = new THREE.Mesh(houseGeometry, houseMaterial);
      house.position.set(-15 + i * 15, 3, -20);
      house.castShadow = true;
      this.scene.add(house);
      
      const roofGeometry = new THREE.ConeGeometry(5, 3, 4);
      const roofMaterial = new THREE.MeshLambertMaterial({color: 0xFF6347});
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.set(-15 + i * 15, 7.5, -20);
      roof.rotation.y = Math.PI / 4;
      this.scene.add(roof);
    }
  }

  createForest() {
    for (let i = 0; i < 8; i++) {
      const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
      const trunkMaterial = new THREE.MeshLambertMaterial({color: 0x8B4513});
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      
      const leavesGeometry = new THREE.SphereGeometry(3);
      const leavesMaterial = new THREE.MeshLambertMaterial({color: 0x228B22});
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      
      const x = 25 + Math.random() * 20;
      const z = -15 + Math.random() * 30;
      
      trunk.position.set(x, 4, z);
      leaves.position.set(x, 8, z);
      
      trunk.castShadow = true;
      leaves.castShadow = true;
      
      this.scene.add(trunk);
      this.scene.add(leaves);
    }
  }

  createLake() {
    const lakeGeometry = new THREE.CylinderGeometry(15, 15, 0.2);
    const lakeMaterial = new THREE.MeshLambertMaterial({
      color: 0x4169E1, 
      transparent: true, 
      opacity: 0.7
    });
    const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
    lake.position.set(-40, 0.1, 30);
    this.scene.add(lake);
  }

  setupPlayer() {
    const playerGeometry = new THREE.BoxGeometry(1, 4, 1);
    const playerMaterial = new THREE.MeshLambertMaterial({color: 0xFF1493});
    this.player = new THREE.Mesh(playerGeometry, playerMaterial);
    this.player.position.set(0, 2, 0);
    this.player.castShadow = true;
    this.scene.add(this.player);
    
    this.camera.position.set(0, 6, 8);
    this.camera.lookAt(this.player.position);
  }

  setupNPCs() {
    // Create NPCs with clear positions
    this.createNPC(-5, 0, -10, 'Professor Py', '🧙‍♂️', gameData.pythonConcepts[0]);
    this.createNPC(30, 0, 0, 'Function Master', '🧝‍♀️', gameData.pythonConcepts[1]);
    this.createNPC(-40, 0, 35, 'Loop Guardian', '🏊‍♂️', gameData.pythonConcepts[2]);
    
    console.log(`Created ${this.npcs.length} NPCs`);
  }

  createNPC(x, y, z, name, avatar, concept) {
    const npcGeometry = new THREE.ConeGeometry(1.5, 4);
    const npcMaterial = new THREE.MeshLambertMaterial({color: 0xFFD700});
    const npc = new THREE.Mesh(npcGeometry, npcMaterial);
    npc.position.set(x, y + 2, z);
    npc.castShadow = true;
    
    npc.userData = {
      name: name,
      avatar: avatar, 
      concept: concept,
      isNPC: true
    };
    
    this.npcs.push(npc);
    this.scene.add(npc);
    
    console.log(`Created NPC: ${name} at position (${x}, ${y + 2}, ${z})`);
    return npc;
  }

  setupControls() {
    document.addEventListener('keydown', (event) => {
      this.keys[event.code] = true;
      
      if (event.code === 'Tab') {
        event.preventDefault();
        this.toggleInventory();
      }
      
      if (event.code === 'KeyE') {
        event.preventDefault();
        this.checkInteractions();
      }
    });
    
    document.addEventListener('keyup', (event) => {
      this.keys[event.code] = false;
    });
    
    // Mouse controls
    const canvas = document.getElementById('gameCanvas');
    let isLocked = false;
    
    canvas.addEventListener('click', () => {
      if (!isLocked) {
        canvas.requestPointerLock();
      }
    });
    
    document.addEventListener('pointerlockchange', () => {
      isLocked = document.pointerLockElement === canvas;
    });
    
    document.addEventListener('mousemove', (event) => {
      if (isLocked) {
        this.mouseX += event.movementX * 0.002;
        this.mouseY += event.movementY * 0.002;
        this.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouseY));
      }
    });
  }

  setupUI() {
    this.updateUI();
    
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setupCodeEditor() {
    const codeEditorDiv = document.getElementById('codeEditor');
    if (codeEditorDiv) {
      const textarea = document.createElement('textarea');
      textarea.style.cssText = `
        width: 100%; height: 100%; border: none; outline: none; resize: none;
        font-family: monospace; font-size: 14px; padding: 10px;
        background-color: #1e1e1e; color: #d4d4d4;
      `;
      textarea.value = '# Your code here';
      
      codeEditorDiv.appendChild(textarea);
      
      this.codeEditor = {
        getValue: () => textarea.value,
        setValue: (value) => { textarea.value = value; }
      };
    }
  }

  updatePlayer() {
    if (!this.player) return;
    
    const speed = 0.3;
    const moveVector = new THREE.Vector3();
    
    if (this.keys['KeyW']) moveVector.z -= speed;
    if (this.keys['KeyS']) moveVector.z += speed;
    if (this.keys['KeyA']) moveVector.x -= speed;
    if (this.keys['KeyD']) moveVector.x += speed;
    
    if (moveVector.length() > 0) {
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
      this.player.position.add(moveVector);
      
      const cameraOffset = new THREE.Vector3(0, 6, 8);
      cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
      this.camera.position.copy(this.player.position).add(cameraOffset);
      
      this.updateCurrentZone();
      this.updateMinimap();
    }
    
    // Always update camera rotation
    this.camera.rotation.set(this.mouseY, this.mouseX, 0, 'YXZ');
    
    // Check for nearby NPCs
    this.checkNearbyNPCs();
  }

  checkNearbyNPCs() {
    if (!this.player) return;
    
    const playerPos = this.player.position;
    this.nearbyNPC = null;
    
    for (const npc of this.npcs) {
      const distance = playerPos.distanceTo(npc.position);
      if (distance < 8) {
        this.nearbyNPC = npc;
        break;
      }
    }
    
    // Update quest panel to show interaction hint
    if (this.nearbyNPC && !this.gameState.currentQuest) {
      const questContent = document.getElementById('questContent');
      if (questContent) {
        questContent.innerHTML = `
          <p>Press <strong>E</strong> to talk to ${this.nearbyNPC.userData.name}</p>
        `;
      }
    }
  }

  updateCurrentZone() {
    const pos = this.player.position;
    let newZone = 'Variables Village';
    
    if (pos.x > 15) {
      newZone = 'Function Forest';
    } else if (pos.x < -25 && pos.z > 15) {
      newZone = 'Loop Lake';  
    }
    
    if (newZone !== this.gameState.currentZone) {
      this.gameState.currentZone = newZone;
      const zoneElement = document.getElementById('currentZone');
      if (zoneElement) {
        zoneElement.textContent = newZone;
      }
    }
  }

  updateMinimap() {
    const playerDot = document.getElementById('playerDot');
    if (!playerDot) return;
    
    const pos = this.player.position;
    const mapX = ((pos.x + 50) / 100) * 100;
    const mapZ = ((pos.z + 50) / 100) * 100;
    
    playerDot.style.left = Math.max(0, Math.min(100, mapX)) + '%';
    playerDot.style.top = Math.max(0, Math.min(100, mapZ)) + '%';
  }

  checkInteractions() {
    console.log('Checking interactions...');
    
    if (this.nearbyNPC) {
      console.log(`Interacting with ${this.nearbyNPC.userData.name}`);
      this.interactWithNPC(this.nearbyNPC);
    } else {
      console.log('No nearby NPC found');
    }
  }

  interactWithNPC(npc) {
    const npcData = npc.userData;
    console.log(`Opening dialog with ${npcData.name}`);
    
    document.getElementById('npcName').textContent = npcData.name;
    document.getElementById('npcAvatar').textContent = npcData.avatar;
    
    const quest = npcData.concept.quests[0];
    const isCompleted = this.gameState.completedQuests.includes(quest.title);
    
    if (isCompleted) {
      document.getElementById('npcDialog').textContent = 
        `Well done! You've completed "${quest.title}" and mastered ${npcData.concept.name}.`;
      document.getElementById('acceptQuestBtn').style.display = 'none';
    } else {
      document.getElementById('npcDialog').textContent = 
        `Greetings! I have a quest about ${npcData.concept.name}. ${quest.description}`;
      document.getElementById('acceptQuestBtn').style.display = 'inline-block';
    }
    
    document.getElementById('dialogModal').classList.remove('hidden');
  }

  acceptQuest(quest) {
    console.log(`Quest accepted: ${quest.title}`);
    this.gameState.currentQuest = quest;
    this.updateQuestDisplay();
    this.closeDialog();
    
    setTimeout(() => {
      this.startCodingChallenge(quest);
    }, 500);
  }

  startCodingChallenge(quest) {
    console.log(`Starting coding challenge: ${quest.title}`);
    this.currentChallenge = quest;
    
    document.getElementById('challengeTitle').textContent = quest.title;
    document.getElementById('challengeDescription').textContent = quest.description;
    
    if (this.codeEditor) {
      this.codeEditor.setValue(quest.code_challenge);
    }
    
    document.getElementById('codeOutput').textContent = '';
    document.getElementById('codeModal').classList.remove('hidden');
  }

  updateQuestDisplay() {
    const questContent = document.getElementById('questContent');
    if (questContent && this.gameState.currentQuest) {
      questContent.innerHTML = `
        <strong>${this.gameState.currentQuest.title}</strong>
        <span class="quest-status active">Active</span>
        <p>${this.gameState.currentQuest.description}</p>
      `;
    }
  }

  updateUI() {
    document.getElementById('healthValue').textContent = `${this.gameState.health}/100`;
    
    const xpNeeded = this.gameState.level * 250;
    const xpPercent = (this.gameState.xp / xpNeeded) * 100;
    document.getElementById('xpBar').style.width = xpPercent + '%';
    document.getElementById('xpValue').textContent = `${this.gameState.xp}/${xpNeeded}`;
    
    this.updateInventory();
  }

  updateInventory() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;
    
    inventoryGrid.innerHTML = '';
    
    this.gameState.inventory.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'inventory-item';
      
      let icon = '💎';
      if (item.includes('Ring')) icon = '💍';
      
      itemDiv.innerHTML = `
        <div class="item-icon">${icon}</div>
        <div class="item-name">${item}</div>
      `;
      
      inventoryGrid.appendChild(itemDiv);
    });
  }

  toggleInventory() {
    const inventory = document.getElementById('inventoryPanel');
    if (inventory) {
      inventory.classList.toggle('hidden');
    }
  }

  closeDialog() {
    document.getElementById('dialogModal').classList.add('hidden');
  }

  closeCodeModal() {
    document.getElementById('codeModal').classList.add('hidden');
  }

  completeQuest(quest) {
    console.log(`Quest completed: ${quest.title}`);
    this.gameState.completedQuests.push(quest.title);
    this.gameState.xp += quest.reward_xp;
    this.gameState.inventory.push(quest.reward_item);
    this.gameState.currentQuest = null;
    
    const xpNeeded = this.gameState.level * 250;
    if (this.gameState.xp >= xpNeeded) {
      this.gameState.level++;
      this.showMessage(`Level up! You are now level ${this.gameState.level}`, 'success');
    }
    
    this.updateUI();
    this.updateQuestDisplay();
    this.showMessage(`Quest completed! +${quest.reward_xp} XP, +${quest.reward_item}`, 'success');
  }

  showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
      position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
      z-index: 400; max-width: 400px; text-align: center;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  startGameLoop() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.updatePlayer();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
}

// Global UI Functions
function toggleInventory() {
  if (window.game) {
    window.game.toggleInventory();
  }
}

function closeCodeModal() {
  if (window.game) {
    window.game.closeCodeModal();
  }
}

function closeDialog() {
  if (window.game) {
    window.game.closeDialog();
  }
}

function acceptQuest() {
  if (window.game && window.game.nearbyNPC) {
    const quest = window.game.nearbyNPC.userData.concept.quests[0];
    window.game.acceptQuest(quest);
  }
}

function runCode() {
  if (!window.game || !window.game.codeEditor) return;
  
  const code = window.game.codeEditor.getValue();
  const output = document.getElementById('codeOutput');
  
  try {
    const result = simulatePythonExecution(code);
    output.textContent = result;
    output.className = 'code-output';
    
    if (window.game.currentChallenge && isCorrectSolution(code, window.game.currentChallenge)) {
      output.textContent += '\n\n✅ Correct! Quest completed!';
      output.className = 'code-output success-message';
      
      setTimeout(() => {
        window.game.completeQuest(window.game.currentChallenge);
        window.game.closeCodeModal();
      }, 2000);
    }
    
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
    output.className = 'code-output error-message';
  }
}

function simulatePythonExecution(code) {
  let output = '';
  
  if (code.includes('print(')) {
    const printMatches = code.match(/print\((.*?)\)/g);
    if (printMatches) {
      printMatches.forEach(match => {
        let content = match.slice(6, -1);
        
        if (content.includes('f\'') || content.includes('f"')) {
          content = content.replace(/f['"]/, '').replace(/['"]$/, '');
          content = content.replace(/\{(\w+)\}/g, (match, varName) => {
            const varMatch = code.match(new RegExp(`${varName}\\s*=\\s*['"]([^'"]*?)['"]`));
            return varMatch ? varMatch[1] : varName;
          });
        } else {
          content = content.replace(/['\"]/g, '');
        }
        
        output += content + '\n';
      });
    }
  }
  
  return output || 'Code executed successfully!';
}

function isCorrectSolution(code, challenge) {
  const userCode = code.toLowerCase();
  
  if (challenge.title === 'The Naming Ceremony') {
    return userCode.includes('villager1 =') && 
           userCode.includes('villager2 =') && 
           userCode.includes('villager3 =') &&
           userCode.includes('print(');
  } else if (challenge.title === 'The Magic Spell Builder') {
    return userCode.includes('def cast_spell') && 
           userCode.includes('return') &&
           userCode.includes('spell_name');
  } else if (challenge.title === 'The Endless Echo') {
    return userCode.includes('for') && 
           userCode.includes('range(5)') &&
           userCode.includes('print(');
  }
  
  return false;
}

function showHint() {
  const hints = {
    'The Naming Ceremony': 'Assign string values to variables: variable_name = "value"',
    'The Magic Spell Builder': 'Use def to create functions and return to return values',
    'The Endless Echo': 'Use for i in range(5): to repeat code 5 times'
  };
  
  const hint = hints[window.game.currentChallenge?.title];
  if (hint) {
    alert(hint);
  }
}

function resetCode() {
  if (window.game && window.game.codeEditor && window.game.currentChallenge) {
    window.game.codeEditor.setValue(window.game.currentChallenge.code_challenge);
    document.getElementById('codeOutput').textContent = '';
  }
}

// Initialize game
window.addEventListener('load', () => {
  window.game = new PythonQuestGame();
});