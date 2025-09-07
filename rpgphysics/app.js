// // Game Data // pythonConcepts
// const gameData = {
//   "physicsTopics": [
//     {
//       "id": "motion",
//       "name": "Motion & Speed", 
//       "zone": "Motion Village",
//       "description": "Learn about distance, speed, and time",
//       "quests": [
//         {
//           "title": "The Village Race",
//           "description": "Help calculate how fast the villagers need to run",
//           "question": "A villager needs to travel 100 meters in 20 seconds to win the race. What speed must they maintain?\n\nFormula: Speed = Distance ÷ Time\n\nDistance = 100 m\nTime = 20 s\nSpeed = ?",
//           "solution": "Speed = Distance ÷ Time\nSpeed = 100 m ÷ 20 s\nSpeed = 5 m/s\n\nThe villager must run at 5 meters per second.",
//           "reward_xp": 100,
//           "reward_item": "Speed Crystal"
//         }
//       ]
//     },
//     {
//       "id": "forces",
//       "name": "Forces & Newton's Laws",
//       "zone": "Force Forest", 
//       "description": "Understand pushes, pulls, and motion",
//       "quests": [
//         {
//           "title": "The Magical Push",
//           "description": "Help the forest wizard understand forces",
//           "question": "A wizard pushes a 10 kg magical stone with a force of 50 N. What is the stone's acceleration?\n\nFormula: Force = Mass × Acceleration\nF = m × a\n\nForce = 50 N\nMass = 10 kg\nAcceleration = ?",
//           "solution": "F = m × a\n50 N = 10 kg × a\na = 50 N ÷ 10 kg\na = 5 m/s²\n\nThe stone accelerates at 5 meters per second squared.",
//           "reward_xp": 150,
//           "reward_item": "Force Gem"
//         }
//       ]
//     },
//     {
//       "id": "energy",
//       "name": "Energy & Work",
//       "zone": "Energy Lake",
//       "description": "Learn about potential and kinetic energy", 
//       "quests": [
//         {
//           "title": "The Diving Competition",
//           "description": "Calculate the potential energy of divers at the lake",
//           "question": "A diver with mass 60 kg stands on a 10 m high diving board. What is their gravitational potential energy?\n\nFormula: PE = m × g × h\nwhere g = 9.8 m/s² (gravity)\n\nMass = 60 kg\nHeight = 10 m\nPE = ?",
//           "solution": "PE = m × g × h\nPE = 60 kg × 9.8 m/s² × 10 m\nPE = 5,880 J\n\nThe diver has 5,880 Joules of potential energy.",
//           "reward_xp": 200,
//           "reward_item": "Energy Ring"
//         }
//       ]
//     }
//   ]
// };

// // Game Class
// class PythonQuestGame {
//   constructor() {
//     this.scene = null;
//     this.camera = null;
//     this.renderer = null;
//     this.player = null;
//     this.npcs = [];
//     this.gameState = {
//       xp: 0,
//       level: 1,
//       health: 100,
//       inventory: [],
//       currentQuest: null,
//       completedQuests: [],
//       currentZone: 'Variables Village'
//     };
//     this.codeEditor = null;
//     this.currentChallenge = null;
//     this.keys = {};
//     this.mouseX = 0;
//     this.mouseY = 0;
//     this.nearbyNPC = null;
    
//     this.init();
//   }

//   init() {
//     try {
//       this.setupThreeJS();
//       this.createWorld();
//       this.setupPlayer();
//       this.setupNPCs();
//       this.setupControls();
//       this.setupUI();
//       this.setupCodeEditor();
//       this.startGameLoop();
      
//       // Hide loading screen
//       setTimeout(() => {
//         const loadingScreen = document.getElementById('loadingScreen');
//         if (loadingScreen) {
//           loadingScreen.style.display = 'none';
//         }
//         console.log('Game initialized successfully');
//       }, 1000);
      
//     } catch (error) {
//       console.error('Game initialization error:', error);
//       const loadingScreen = document.getElementById('loadingScreen');
//       if (loadingScreen) {
//         loadingScreen.style.display = 'none';
//       }
//     }
//   }

//   setupThreeJS() {
//     const canvas = document.getElementById('gameCanvas');
    
//     // Scene
//     this.scene = new THREE.Scene();
//     this.scene.background = new THREE.Color(0x87CEEB);
    
//     // Camera  
//     this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
//     // Renderer
//     this.renderer = new THREE.WebGLRenderer({canvas, antialias: true});
//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     this.renderer.shadowMap.enabled = true;
//     this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     this.scene.add(ambientLight);
    
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(50, 50, 25);
//     directionalLight.castShadow = true;
//     this.scene.add(directionalLight);
//   }

//   createWorld() {
//     // Ground plane
//     const groundGeometry = new THREE.PlaneGeometry(200, 200);
//     const groundMaterial = new THREE.MeshLambertMaterial({color: 0x90EE90});
//     const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//     ground.rotation.x = -Math.PI / 2;
//     ground.receiveShadow = true;
//     this.scene.add(ground);
    
//     // Create world areas
//     this.createVillage();
//     this.createForest();
//     this.createLake();
//   }

//   createVillage() {
//     for (let i = 0; i < 3; i++) {
//       const houseGeometry = new THREE.BoxGeometry(6, 6, 6);
//       const houseMaterial = new THREE.MeshLambertMaterial({color: 0x8B4513});
//       const house = new THREE.Mesh(houseGeometry, houseMaterial);
//       house.position.set(-15 + i * 15, 3, -20);
//       house.castShadow = true;
//       this.scene.add(house);
      
//       const roofGeometry = new THREE.ConeGeometry(5, 3, 4);
//       const roofMaterial = new THREE.MeshLambertMaterial({color: 0xFF6347});
//       const roof = new THREE.Mesh(roofGeometry, roofMaterial);
//       roof.position.set(-15 + i * 15, 7.5, -20);
//       roof.rotation.y = Math.PI / 4;
//       this.scene.add(roof);
//     }
//   }

//   createForest() {
//     for (let i = 0; i < 8; i++) {
//       const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
//       const trunkMaterial = new THREE.MeshLambertMaterial({color: 0x8B4513});
//       const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      
//       const leavesGeometry = new THREE.SphereGeometry(3);
//       const leavesMaterial = new THREE.MeshLambertMaterial({color: 0x228B22});
//       const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      
//       const x = 25 + Math.random() * 20;
//       const z = -15 + Math.random() * 30;
      
//       trunk.position.set(x, 4, z);
//       leaves.position.set(x, 8, z);
      
//       trunk.castShadow = true;
//       leaves.castShadow = true;
      
//       this.scene.add(trunk);
//       this.scene.add(leaves);
//     }
//   }

//   createLake() {
//     const lakeGeometry = new THREE.CylinderGeometry(15, 15, 0.2);
//     const lakeMaterial = new THREE.MeshLambertMaterial({
//       color: 0x4169E1, 
//       transparent: true, 
//       opacity: 0.7
//     });
//     const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
//     lake.position.set(-40, 0.1, 30);
//     this.scene.add(lake);
//   }

//   setupPlayer() {
//     const playerGeometry = new THREE.BoxGeometry(1, 4, 1);
//     const playerMaterial = new THREE.MeshLambertMaterial({color: 0xFF1493});
//     this.player = new THREE.Mesh(playerGeometry, playerMaterial);
//     this.player.position.set(0, 2, 0);
//     this.player.castShadow = true;
//     this.scene.add(this.player);
    
//     this.camera.position.set(0, 6, 8);
//     this.camera.lookAt(this.player.position);
//   }

//   setupNPCs() {
//     // Create NPCs with clear positions
//     this.createNPC(-5, 0, -10, 'Professor Py', '🧙‍♂️', gameData.physicsTopics[0]);
//     this.createNPC(30, 0, 0, 'Function Master', '🧝‍♀️', gameData.physicsTopics[1]);
//     this.createNPC(-40, 0, 35, 'Loop Guardian', '🏊‍♂️', gameData.physicsTopics[2]);
    
//     console.log(`Created ${this.npcs.length} NPCs`);
//   }

//   createNPC(x, y, z, name, avatar, concept) {
//     const npcGeometry = new THREE.ConeGeometry(1.5, 4);
//     const npcMaterial = new THREE.MeshLambertMaterial({color: 0xFFD700});
//     const npc = new THREE.Mesh(npcGeometry, npcMaterial);
//     npc.position.set(x, y + 2, z);
//     npc.castShadow = true;
    
//     npc.userData = {
//       name: name,
//       avatar: avatar, 
//       concept: concept,
//       isNPC: true
//     };
    
//     this.npcs.push(npc);
//     this.scene.add(npc);
    
//     console.log(`Created NPC: ${name} at position (${x}, ${y + 2}, ${z})`);
//     return npc;
//   }

//   setupControls() {
//     document.addEventListener('keydown', (event) => {
//       this.keys[event.code] = true;
      
//       if (event.code === 'Tab') {
//         event.preventDefault();
//         this.toggleInventory();
//       }
      
//       if (event.code === 'KeyE') {
//         event.preventDefault();
//         this.checkInteractions();
//       }
//     });
    
//     document.addEventListener('keyup', (event) => {
//       this.keys[event.code] = false;
//     });
    
//     // Mouse controls
//     const canvas = document.getElementById('gameCanvas');
//     let isLocked = false;
    
//     canvas.addEventListener('click', () => {
//       if (!isLocked) {
//         canvas.requestPointerLock();
//       }
//     });
    
//     document.addEventListener('pointerlockchange', () => {
//       isLocked = document.pointerLockElement === canvas;
//     });
    
//     document.addEventListener('mousemove', (event) => {
//       if (isLocked) {
//         this.mouseX += event.movementX * 0.002;
//         this.mouseY += event.movementY * 0.002;
//         this.mouseY = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.mouseY));
//       }
//     });
//   }

//   setupUI() {
//     this.updateUI();
    
//     window.addEventListener('resize', () => {
//       this.camera.aspect = window.innerWidth / window.innerHeight;
//       this.camera.updateProjectionMatrix();
//       this.renderer.setSize(window.innerWidth, window.innerHeight);
//     });
//   }

//   setupCodeEditor() {
//     const codeEditorDiv = document.getElementById('codeEditor');
//     if (codeEditorDiv) {
//       const textarea = document.createElement('textarea');
//       textarea.style.cssText = `
//         width: 100%; height: 100%; border: none; outline: none; resize: none;
//         font-family: monospace; font-size: 14px; padding: 10px;
//         background-color: #1e1e1e; color: #d4d4d4;
//       `;
//       textarea.value = '# Your code here';
      
//       codeEditorDiv.appendChild(textarea);
      
//       this.codeEditor = {
//         getValue: () => textarea.value,
//         setValue: (value) => { textarea.value = value; }
//       };
//     }
//   }

//   updatePlayer() {
//     if (!this.player) return;
    
//     const speed = 0.3;
//     const moveVector = new THREE.Vector3();
    
//     if (this.keys['KeyW']) moveVector.z -= speed;
//     if (this.keys['KeyS']) moveVector.z += speed;
//     if (this.keys['KeyA']) moveVector.x -= speed;
//     if (this.keys['KeyD']) moveVector.x += speed;
    
//     if (moveVector.length() > 0) {
//       moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
//       this.player.position.add(moveVector);
      
//       const cameraOffset = new THREE.Vector3(0, 6, 8);
//       cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mouseX);
//       this.camera.position.copy(this.player.position).add(cameraOffset);
      
//       this.updateCurrentZone();
//       this.updateMinimap();
//     }
    
//     // Always update camera rotation
//     this.camera.rotation.set(this.mouseY, this.mouseX, 0, 'YXZ');
    
//     // Check for nearby NPCs
//     this.checkNearbyNPCs();
//   }

//   checkNearbyNPCs() {
//     if (!this.player) return;
    
//     const playerPos = this.player.position;
//     this.nearbyNPC = null;
    
//     for (const npc of this.npcs) {
//       const distance = playerPos.distanceTo(npc.position);
//       if (distance < 8) {
//         this.nearbyNPC = npc;
//         break;
//       }
//     }
    
//     // Update quest panel to show interaction hint
//     if (this.nearbyNPC && !this.gameState.currentQuest) {
//       const questContent = document.getElementById('questContent');
//       if (questContent) {
//         questContent.innerHTML = `
//           <p>Press <strong>E</strong> to talk to ${this.nearbyNPC.userData.name}</p>
//         `;
//       }
//     }
//   }

//   updateCurrentZone() {
//     const pos = this.player.position;
//     let newZone = 'Variables Village';
    
//     if (pos.x > 15) {
//       newZone = 'Function Forest';
//     } else if (pos.x < -25 && pos.z > 15) {
//       newZone = 'Loop Lake';  
//     }
    
//     if (newZone !== this.gameState.currentZone) {
//       this.gameState.currentZone = newZone;
//       const zoneElement = document.getElementById('currentZone');
//       if (zoneElement) {
//         zoneElement.textContent = newZone;
//       }
//     }
//   }

//   updateMinimap() {
//     const playerDot = document.getElementById('playerDot');
//     if (!playerDot) return;
    
//     const pos = this.player.position;
//     const mapX = ((pos.x + 50) / 100) * 100;
//     const mapZ = ((pos.z + 50) / 100) * 100;
    
//     playerDot.style.left = Math.max(0, Math.min(100, mapX)) + '%';
//     playerDot.style.top = Math.max(0, Math.min(100, mapZ)) + '%';
//   }

//   checkInteractions() {
//     console.log('Checking interactions...');
    
//     if (this.nearbyNPC) {
//       console.log(`Interacting with ${this.nearbyNPC.userData.name}`);
//       this.interactWithNPC(this.nearbyNPC);
//     } else {
//       console.log('No nearby NPC found');
//     }
//   }

//   interactWithNPC(npc) {
//     const npcData = npc.userData;
//     console.log(`Opening dialog with ${npcData.name}`);
    
//     document.getElementById('npcName').textContent = npcData.name;
//     document.getElementById('npcAvatar').textContent = npcData.avatar;
    
//     const quest = npcData.concept.quests[0];
//     const isCompleted = this.gameState.completedQuests.includes(quest.title);
    
//     if (isCompleted) {
//       document.getElementById('npcDialog').textContent = 
//         `Well done! You've completed "${quest.title}" and mastered ${npcData.concept.name}.`;
//       document.getElementById('acceptQuestBtn').style.display = 'none';
//     } else {
//       document.getElementById('npcDialog').textContent = 
//         `Greetings! I have a quest about ${npcData.concept.name}. ${quest.description}`;
//       document.getElementById('acceptQuestBtn').style.display = 'inline-block';
//     }
    
//     document.getElementById('dialogModal').classList.remove('hidden');
//   }

//   acceptQuest(quest) {
//     console.log(`Quest accepted: ${quest.title}`);
//     this.gameState.currentQuest = quest;
//     this.updateQuestDisplay();
//     this.closeDialog();
    
//     setTimeout(() => {
//       this.startCodingChallenge(quest);
//     }, 500);
//   }

//   startCodingChallenge(quest) {
//     console.log(`Starting coding challenge: ${quest.title}`);
//     this.currentChallenge = quest;
    
//     document.getElementById('challengeTitle').textContent = quest.title;
//     document.getElementById('challengeDescription').textContent = quest.description;
    
//     if (this.codeEditor) {
//       this.codeEditor.setValue(quest.code_challenge);
//     }
    
//     document.getElementById('codeOutput').textContent = '';
//     document.getElementById('codeModal').classList.remove('hidden');
//   }

//   updateQuestDisplay() {
//     const questContent = document.getElementById('questContent');
//     if (questContent && this.gameState.currentQuest) {
//       questContent.innerHTML = `
//         <strong>${this.gameState.currentQuest.title}</strong>
//         <span class="quest-status active">Active</span>
//         <p>${this.gameState.currentQuest.description}</p>
//       `;
//     }
//   }

//   updateUI() {
//     document.getElementById('healthValue').textContent = `${this.gameState.health}/100`;
    
//     const xpNeeded = this.gameState.level * 250;
//     const xpPercent = (this.gameState.xp / xpNeeded) * 100;
//     document.getElementById('xpBar').style.width = xpPercent + '%';
//     document.getElementById('xpValue').textContent = `${this.gameState.xp}/${xpNeeded}`;
    
//     this.updateInventory();
//   }

//   updateInventory() {
//     const inventoryGrid = document.getElementById('inventoryGrid');
//     if (!inventoryGrid) return;
    
//     inventoryGrid.innerHTML = '';
    
//     this.gameState.inventory.forEach(item => {
//       const itemDiv = document.createElement('div');
//       itemDiv.className = 'inventory-item';
      
//       let icon = '💎';
//       if (item.includes('Ring')) icon = '💍';
      
//       itemDiv.innerHTML = `
//         <div class="item-icon">${icon}</div>
//         <div class="item-name">${item}</div>
//       `;
      
//       inventoryGrid.appendChild(itemDiv);
//     });
//   }

//   toggleInventory() {
//     const inventory = document.getElementById('inventoryPanel');
//     if (inventory) {
//       inventory.classList.toggle('hidden');
//     }
//   }

//   closeDialog() {
//     document.getElementById('dialogModal').classList.add('hidden');
//   }

//   closeCodeModal() {
//     document.getElementById('codeModal').classList.add('hidden');
//   }

//   completeQuest(quest) {
//     console.log(`Quest completed: ${quest.title}`);
//     this.gameState.completedQuests.push(quest.title);
//     this.gameState.xp += quest.reward_xp;
//     this.gameState.inventory.push(quest.reward_item);
//     this.gameState.currentQuest = null;
    
//     const xpNeeded = this.gameState.level * 250;
//     if (this.gameState.xp >= xpNeeded) {
//       this.gameState.level++;
//       this.showMessage(`Level up! You are now level ${this.gameState.level}`, 'success');
//     }
    
//     this.updateUI();
//     this.updateQuestDisplay();
//     this.showMessage(`Quest completed! +${quest.reward_xp} XP, +${quest.reward_item}`, 'success');
//   }

//   showMessage(text, type) {
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `${type}-message`;
//     messageDiv.textContent = text;
//     messageDiv.style.cssText = `
//       position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
//       z-index: 400; max-width: 400px; text-align: center;
//     `;
    
//     document.body.appendChild(messageDiv);
    
//     setTimeout(() => {
//       messageDiv.remove();
//     }, 3000);
//   }

//   startGameLoop() {
//     const animate = () => {
//       requestAnimationFrame(animate);
//       this.updatePlayer();
//       this.renderer.render(this.scene, this.camera);
//     };
//     animate();
//   }
// }

// // Global UI Functions
// function toggleInventory() {
//   if (window.game) {
//     window.game.toggleInventory();
//   }
// }

// function closeCodeModal() {
//   if (window.game) {
//     window.game.closeCodeModal();
//   }
// }

// function closeDialog() {
//   if (window.game) {
//     window.game.closeDialog();
//   }
// }

// function acceptQuest() {
//   if (window.game && window.game.nearbyNPC) {
//     const quest = window.game.nearbyNPC.userData.concept.quests[0];
//     window.game.acceptQuest(quest);
//   }
// }

// function runCode() {
//   if (!window.game || !window.game.codeEditor) return;
  
//   const code = window.game.codeEditor.getValue();
//   const output = document.getElementById('codeOutput');
  
//   try {
//     const result = simulatePythonExecution(code);
//     output.textContent = result;
//     output.className = 'code-output';
    
//     if (window.game.currentChallenge && isCorrectSolution(code, window.game.currentChallenge)) {
//       output.textContent += '\n\n✅ Correct! Quest completed!';
//       output.className = 'code-output success-message';
      
//       setTimeout(() => {
//         window.game.completeQuest(window.game.currentChallenge);
//         window.game.closeCodeModal();
//       }, 2000);
//     }
    
//   } catch (error) {
//     output.textContent = `Error: ${error.message}`;
//     output.className = 'code-output error-message';
//   }
// }

// function simulatePythonExecution(code) {
//   let output = '';
  
//   if (code.includes('print(')) {
//     const printMatches = code.match(/print\((.*?)\)/g);
//     if (printMatches) {
//       printMatches.forEach(match => {
//         let content = match.slice(6, -1);
        
//         if (content.includes('f\'') || content.includes('f"')) {
//           content = content.replace(/f['"]/, '').replace(/['"]$/, '');
//           content = content.replace(/\{(\w+)\}/g, (match, varName) => {
//             const varMatch = code.match(new RegExp(`${varName}\\s*=\\s*['"]([^'"]*?)['"]`));
//             return varMatch ? varMatch[1] : varName;
//           });
//         } else {
//           content = content.replace(/['\"]/g, '');
//         }
        
//         output += content + '\n';
//       });
//     }
//   }
  
//   return output || 'Code executed successfully!';
// }

// function isCorrectSolution(code, challenge) {
//   const userCode = code.toLowerCase();
  
//   if (challenge.title === 'The Naming Ceremony') {
//     return userCode.includes('villager1 =') && 
//            userCode.includes('villager2 =') && 
//            userCode.includes('villager3 =') &&
//            userCode.includes('print(');
//   } else if (challenge.title === 'The Magic Spell Builder') {
//     return userCode.includes('def cast_spell') && 
//            userCode.includes('return') &&
//            userCode.includes('spell_name');
//   } else if (challenge.title === 'The Endless Echo') {
//     return userCode.includes('for') && 
//            userCode.includes('range(5)') &&
//            userCode.includes('print(');
//   }
  
//   return false;
// }

// function showHint() {
//   const hints = {
//     'The Naming Ceremony': 'Assign string values to variables: variable_name = "value"',
//     'The Magic Spell Builder': 'Use def to create functions and return to return values',
//     'The Endless Echo': 'Use for i in range(5): to repeat code 5 times'
//   };
  
//   const hint = hints[window.game.currentChallenge?.title];
//   if (hint) {
//     alert(hint);
//   }
// }

// function resetCode() {
//   if (window.game && window.game.codeEditor && window.game.currentChallenge) {
//     window.game.codeEditor.setValue(window.game.currentChallenge.code_challenge);
//     document.getElementById('codeOutput').textContent = '';
//   }
// }

// // Initialize game
// window.addEventListener('load', () => {
//   window.game = new PythonQuestGame();
// });

// Physics Quest Game - Complete JavaScript Code

// Game Data
const gameData = {
    "physicsTopics": [
        {
            "id": "motion",
            "name": "Motion & Speed",
            "zone": "Motion Village",
            "description": "Learn about distance, speed, and time",
            "quests": [
                {
                    "title": "The Village Race",
                    "description": "Help calculate how fast the villagers need to run",
                    "question": "A villager needs to travel 100 meters in 20 seconds to win the race. What speed must they maintain?\n\nFormula: Speed = Distance ÷ Time\n\nDistance = 100 m\nTime = 20 s",
                    "answer_type": "calculation",
                    "correct_answer": 5,
                    "unit": "m/s",
                    "solution_steps": [
                        "Speed = Distance ÷ Time",
                        "Speed = 100 m ÷ 20 s",
                        "Speed = 5 m/s"
                    ],
                    "reward_xp": 100,
                    "reward_item": "Speed Crystal"
                },
                {
                    "title": "The Messenger's Journey",
                    "description": "Calculate how long it takes to deliver a message",
                    "question": "A messenger runs at 8 m/s and needs to travel 240 meters. How long will the journey take?\n\nFormula: Time = Distance ÷ Speed\n\nDistance = 240 m\nSpeed = 8 m/s",
                    "answer_type": "calculation",
                    "correct_answer": 30,
                    "unit": "s",
                    "solution_steps": [
                        "Time = Distance ÷ Speed",
                        "Time = 240 m ÷ 8 m/s",
                        "Time = 30 s"
                    ],
                    "reward_xp": 120,
                    "reward_item": "Time Crystal"
                }
            ]
        },
        {
            "id": "forces",
            "name": "Forces & Newton's Laws",
            "zone": "Force Forest",
            "description": "Understand pushes, pulls, and acceleration",
            "quests": [
                {
                    "title": "The Magical Push",
                    "description": "Help the forest wizard understand forces",
                    "question": "A wizard pushes a 10 kg magical stone with a force of 50 N. What is the stone's acceleration?\n\nFormula: Force = Mass × Acceleration (F = ma)\n\nForce = 50 N\nMass = 10 kg",
                    "answer_type": "calculation",
                    "correct_answer": 5,
                    "unit": "m/s²",
                    "solution_steps": [
                        "F = m × a",
                        "50 N = 10 kg × a",
                        "a = 50 N ÷ 10 kg",
                        "a = 5 m/s²"
                    ],
                    "reward_xp": 150,
                    "reward_item": "Force Gem"
                },
                {
                    "title": "The Heavy Lift",
                    "description": "Calculate the force needed to accelerate an object",
                    "question": "How much force is needed to accelerate a 15 kg boulder at 3 m/s²?\n\nFormula: Force = Mass × Acceleration\n\nMass = 15 kg\nAcceleration = 3 m/s²",
                    "answer_type": "calculation",
                    "correct_answer": 45,
                    "unit": "N",
                    "solution_steps": [
                        "F = m × a",
                        "F = 15 kg × 3 m/s²",
                        "F = 45 N"
                    ],
                    "reward_xp": 170,
                    "reward_item": "Power Stone"
                }
            ]
        },
        {
            "id": "energy",
            "name": "Energy & Work",
            "zone": "Energy Lake",
            "description": "Learn about potential and kinetic energy",
            "quests": [
                {
                    "title": "The Diving Competition",
                    "description": "Calculate the potential energy of divers at the lake",
                    "question": "A diver with mass 60 kg stands on a 10 m high diving board. What is their gravitational potential energy?\n\nFormula: PE = m × g × h\nwhere g = 9.8 m/s² (gravity)\n\nMass = 60 kg\nHeight = 10 m\nGravity = 9.8 m/s²",
                    "answer_type": "calculation",
                    "correct_answer": 5880,
                    "unit": "J",
                    "solution_steps": [
                        "PE = m × g × h",
                        "PE = 60 kg × 9.8 m/s² × 10 m",
                        "PE = 5,880 J"
                    ],
                    "reward_xp": 200,
                    "reward_item": "Energy Ring"
                },
                {
                    "title": "The Speeding Boat",
                    "description": "Calculate kinetic energy of moving objects",
                    "question": "A boat with mass 500 kg is moving at 12 m/s. What is its kinetic energy?\n\nFormula: KE = ½ × m × v²\n\nMass = 500 kg\nVelocity = 12 m/s",
                    "answer_type": "calculation",
                    "correct_answer": 36000,
                    "unit": "J",
                    "solution_steps": [
                        "KE = ½ × m × v²",
                        "KE = ½ × 500 kg × (12 m/s)²",
                        "KE = ½ × 500 × 144",
                        "KE = 36,000 J"
                    ],
                    "reward_xp": 220,
                    "reward_item": "Kinetic Crystal"
                }
            ]
        }
    ]
};

// Physics Quest Game Class
class PhysicsQuestGame {
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
            currentZone: 'Motion Village',
            currentQuestIndex: 0
        };
        this.answerInput = null;
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
            this.setupAnswerInput();
            this.startGameLoop();
            
            // Hide loading screen
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
                console.log('Physics Quest Game initialized successfully');
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
        // Motion Village
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
        // Force Forest
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
        // Energy Lake
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
        // Create physics NPCs
        this.createNPC(-5, 0, -10, 'Professor Motion', '🏃‍♂️', gameData.physicsTopics[0]);
        this.createNPC(30, 0, 0, 'Force Master', '💪', gameData.physicsTopics[1]);
        this.createNPC(-40, 0, 35, 'Energy Guardian', '⚡', gameData.physicsTopics[2]);
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

    setupAnswerInput() {
        const answerInputDiv = document.getElementById('answerInput') || this.createAnswerInputDiv();
        
        // Create input field for numerical answers
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        `;

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.step = 'any';
        numberInput.placeholder = 'Enter your answer';
        numberInput.style.cssText = `
            width: 150px;
            padding: 8px;
            font-size: 16px;
            border: 2px solid #ccc;
            border-radius: 4px;
        `;

        const unitSpan = document.createElement('span');
        unitSpan.style.cssText = `
            font-weight: bold;
            font-size: 16px;
        `;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Answer';
        submitBtn.style.cssText = `
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        submitBtn.addEventListener('click', () => this.checkAnswer());
        numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        inputContainer.appendChild(numberInput);
        inputContainer.appendChild(unitSpan);
        inputContainer.appendChild(submitBtn);
        answerInputDiv.appendChild(inputContainer);

        this.answerInput = {
            input: numberInput,
            unit: unitSpan,
            container: answerInputDiv
        };
    }

    createAnswerInputDiv() {
        const div = document.createElement('div');
        div.id = 'answerInput';
        div.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 300px;
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            display: none;
            z-index: 1000;
        `;
        document.body.appendChild(div);
        return div;
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
            this.showInteractionHint();
        }
    }

    showInteractionHint() {
        const questContent = document.getElementById('questContent') || this.createQuestPanel();
        if (questContent) {
            questContent.innerHTML = `
                <h3>🎯 ${this.nearbyNPC.userData.name}</h3>
                <p>Press <strong>E</strong> to learn about ${this.nearbyNPC.userData.concept.name}!</p>
                <p><em>${this.nearbyNPC.userData.concept.description}</em></p>
            `;
        }
    }

    createQuestPanel() {
        const panel = document.createElement('div');
        panel.id = 'questContent';
        panel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            width: 300px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 1000;
        `;
        document.body.appendChild(panel);
        return panel;
    }

    checkInteractions() {
        if (this.nearbyNPC && !this.gameState.currentQuest) {
            this.startQuest(this.nearbyNPC.userData.concept);
        }
    }

    startQuest(concept) {
        const availableQuests = concept.quests.filter(quest => 
            !this.gameState.completedQuests.includes(quest.title)
        );

        if (availableQuests.length > 0) {
            const quest = availableQuests[0];
            this.gameState.currentQuest = quest;
            this.currentChallenge = quest;
            this.showQuestDialog(quest);
        }
    }

    showQuestDialog(quest) {
        const questContent = document.getElementById('questContent');
        if (questContent) {
            questContent.innerHTML = `
                <h3>📚 ${quest.title}</h3>
                <p><strong>${quest.description}</strong></p>
                <div style="background: #f0f0f0; color: black; padding: 15px; margin: 10px 0; border-radius: 5px; white-space: pre-line;">${quest.question}</div>
                <button onclick="game.showAnswerInput()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Start Solving 🧮
                </button>
            `;
        }
    }

    showAnswerInput() {
        if (this.answerInput && this.currentChallenge) {
            this.answerInput.container.style.display = 'block';
            this.answerInput.unit.textContent = this.currentChallenge.unit || '';
            this.answerInput.input.value = '';
            this.answerInput.input.focus();

            // Update answer input with question
            const questionDiv = document.createElement('div');
            questionDiv.style.cssText = `
                background: #f9f9f9;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px;
                color: black;
                white-space: pre-line;
                max-height: 200px;
                overflow-y: auto;
            `;
            questionDiv.textContent = this.currentChallenge.question;

            // Clear and add content
            this.answerInput.container.innerHTML = '';
            this.answerInput.container.appendChild(questionDiv);
            
            // Re-add input controls
            this.setupAnswerInput();
        }
    }

    checkAnswer() {
        const userAnswer = parseFloat(this.answerInput.input.value);
        const correctAnswer = this.currentChallenge.correct_answer;
        const tolerance = Math.abs(correctAnswer * 0.01); // 1% tolerance

        if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
            this.showSuccess();
            this.completeQuest();
        } else {
            this.showIncorrect();
        }
    }

    showSuccess() {
        const quest = this.currentChallenge;
        alert(`🎉 Correct! Great job!\n\nSolution:\n${quest.solution_steps.join('\n')}\n\nYou earned ${quest.reward_xp} XP and received: ${quest.reward_item}!`);
    }

    showIncorrect() {
        alert('❌ That\'s not quite right. Try again!\n\nHint: Check your calculation and make sure you\'re using the correct formula.');
    }

    completeQuest() {
        const quest = this.currentChallenge;
        this.gameState.completedQuests.push(quest.title);
        this.gameState.xp += quest.reward_xp;
        this.gameState.inventory.push(quest.reward_item);
        
        // Check for level up
        const xpNeeded = this.gameState.level * 250;
        if (this.gameState.xp >= xpNeeded) {
            this.gameState.level++;
            alert(`🌟 Level Up! You are now level ${this.gameState.level}!`);
        }

        this.gameState.currentQuest = null;
        this.currentChallenge = null;
        this.answerInput.container.style.display = 'none';
        this.updateUI();

        // Show completion message
        const questContent = document.getElementById('questContent');
        if (questContent) {
            questContent.innerHTML = `
                <h3>✅ Quest Complete!</h3>
                <p>Well done! You've mastered this physics concept.</p>
                <p>Continue exploring to find more challenges!</p>
            `;
        }
    }

    updateCurrentZone() {
        const pos = this.player.position;
        let newZone = 'Motion Village';

        if (pos.x > 15) {
            newZone = 'Force Forest';
        } else if (pos.x < -25 && pos.z > 15) {
            newZone = 'Energy Lake';
        }

        if (newZone !== this.gameState.currentZone) {
            this.gameState.currentZone = newZone;
            this.showZoneMessage(newZone);
        }
    }

    showZoneMessage(zone) {
        const zoneMessages = {
            'Motion Village': '🏃‍♂️ Welcome to Motion Village! Learn about speed, distance, and time.',
            'Force Forest': '💪 You\'ve entered Force Forest! Discover the secrets of forces and acceleration.',
            'Energy Lake': '⚡ You\'re at Energy Lake! Explore potential and kinetic energy.'
        };

        const message = zoneMessages[zone];
        if (message) {
            // Create temporary zone message
            const zoneDiv = document.createElement('div');
            zoneDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-size: 18px;
                text-align: center;
                z-index: 2000;
            `;
            zoneDiv.textContent = message;
            document.body.appendChild(zoneDiv);

            setTimeout(() => {
                document.body.removeChild(zoneDiv);
            }, 3000);
        }
    }

    toggleInventory() {
        const inventoryDiv = document.getElementById('inventory') || this.createInventory();
        inventoryDiv.style.display = inventoryDiv.style.display === 'none' ? 'block' : 'none';
        this.updateInventory();
    }

    createInventory() {
        const div = document.createElement('div');
        div.id = 'inventory';
        div.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 300px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #333;
            border-radius: 10px;
            padding: 20px;
            display: none;
            z-index: 1500;
            overflow-y: auto;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '🎒 Inventory';
        title.style.margin = '0 0 15px 0';
        
        const grid = document.createElement('div');
        grid.id = 'inventoryGrid';
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        closeBtn.onclick = () => this.toggleInventory();
        
        div.appendChild(title);
        div.appendChild(grid);
        div.appendChild(closeBtn);
        document.body.appendChild(div);
        return div;
    }

    updateUI() {
        // Update health bar
        const healthValue = document.getElementById('healthValue') || this.createHealthBar();
        healthValue.textContent = `${this.gameState.health}/100`;

        // Update XP bar
        const xpNeeded = this.gameState.level * 250;
        const xpPercent = (this.gameState.xp / xpNeeded) * 100;
        const xpBar = document.getElementById('xpBar') || this.createXPBar();
        xpBar.style.width = xpPercent + '%';
        
        const xpValue = document.getElementById('xpValue') || this.createXPValue();
        xpValue.textContent = `Level ${this.gameState.level} - ${this.gameState.xp}/${xpNeeded} XP`;

        this.updateInventory();
    }

    createHealthBar() {
        const healthDiv = document.createElement('div');
        healthDiv.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        const healthLabel = document.createElement('div');
        healthLabel.textContent = '❤️ Health: ';
        
        const healthValue = document.createElement('span');
        healthValue.id = 'healthValue';
        
        healthLabel.appendChild(healthValue);
        healthDiv.appendChild(healthLabel);
        document.body.appendChild(healthDiv);
        return healthValue;
    }

    createXPBar() {
        const xpContainer = document.createElement('div');
        xpContainer.style.cssText = `
            position: absolute;
            top: 50px;
            left: 10px;
            width: 200px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
        `;
        
        const xpLabel = document.createElement('div');
        xpLabel.id = 'xpValue';
        xpLabel.style.color = 'white';
        xpLabel.style.marginBottom = '5px';
        
        const xpBarContainer = document.createElement('div');
        xpBarContainer.style.cssText = `
            width: 100%;
            height: 10px;
            background: #333;
            border-radius: 5px;
            overflow: hidden;
        `;
        
        const xpBar = document.createElement('div');
        xpBar.id = 'xpBar';
        xpBar.style.cssText = `
            height: 100%;
            background: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        `;
        
        xpBarContainer.appendChild(xpBar);
        xpContainer.appendChild(xpLabel);
        xpContainer.appendChild(xpBarContainer);
        document.body.appendChild(xpContainer);
        return xpBar;
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
            if (item.includes('Crystal')) icon = '💎';
            if (item.includes('Gem')) icon = '💠';
            if (item.includes('Stone')) icon = '🗿';
            
            itemDiv.innerHTML = `
                <div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px; background: #f9f9f9;">
                    <div style="font-size: 24px;">${icon}</div>
                    <div style="font-size: 12px; margin-top: 5px;">${item}</div>
                </div>
            `;
            
            inventoryGrid.appendChild(itemDiv);
        });
    }

    startGameLoop() {
        const gameLoop = () => {
            this.updatePlayer();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new PhysicsQuestGame();
});

// Add CSS for better styling
const style = document.createElement('style');
style.textContent = `
    body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: Arial, sans-serif;
    }
    
    #gameCanvas {
        display: block;
    }
    
    .inventory-item {
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .inventory-item:hover {
        transform: scale(1.05);
    }
    
    button:hover {
        opacity: 0.8;
    }
    
    #loadingScreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 24px;
    }
`;
document.head.appendChild(style);