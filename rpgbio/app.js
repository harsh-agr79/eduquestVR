// Game Data 

// Python Quest
const gameData = { 
    "pythonConcepts": [ 
        { 
            "id": "variables", 
            "name": "Cell Biology", 
            "zone": "Variables Village", 
            "description": "Learn about the building blocks of life", 
            "quests": [ 
                { 
                    "title": "The Cell Powerhouse Mystery",
                    "description": "Help identify cellular organelles and their functions",
                    "question": "Which organelle is known as the 'powerhouse of the cell' because it produces energy (ATP)?\n\nA) Nucleus\nB) Mitochondria\nC) Ribosomes\nD) Golgi Apparatus",
                    "answer_type": "multiple_choice",
                    "correct_answer": "B",
                    "options": ["Nucleus", "Mitochondria", "Ribosomes", "Golgi Apparatus"],
                    "explanation": "Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.",
                    "reward_xp": 100,
                    "reward_item": "Variable Crystal"
                },
                { 
                    "title": "The DNA Location Quest",
                    "description": "Discover where genetic material is stored",
                    "question": "A typical human cell has 46 chromosomes. During mitosis, how many chromosomes will each daughter cell receive?\n\nFormula: Each daughter cell receives the same number as the parent cell\n\nParent cell chromosomes = 46",
                    "answer_type": "calculation",
                    "correct_answer": 46,
                    "unit": "chromosomes",
                    "solution_steps": [
                        "Mitosis produces identical daughter cells",
                        "Each daughter cell gets the same number as parent",
                        "Parent cell = 46 chromosomes",
                        "Each daughter cell = 46 chromosomes"
                    ],
                    "reward_xp": 120,
                    "reward_item": "DNA Crystal"
                }
            ] 
        }, 
        { 
            "id": "functions", 
            "name": "Genetics & Heredity", 
            "zone": "Function Forest", 
            "description": "Discover how traits are inherited", 
            "quests": [ 
                { 
                    "title": "The Dominant Trait Challenge",
                    "description": "Solve genetics problems using Punnett squares",
                    "question": "If brown eyes (B) are dominant over blue eyes (b), what percentage of offspring will have brown eyes from parents Bb × Bb?\n\nPunnett Square:\n  B  b\nB BB Bb\nb Bb bb\n\nCount brown-eyed offspring (BB, Bb) out of total:",
                    "answer_type": "calculation",
                    "correct_answer": 75,
                    "unit": "%",
                    "solution_steps": [
                        "Cross: Bb × Bb",
                        "Results: BB, Bb, Bb, bb",
                        "Brown eyes (BB, Bb): 3 out of 4",
                        "Percentage: 3/4 × 100% = 75%"
                    ],
                    "reward_xp": 150,
                    "reward_item": "Function Gem"
                },
                { 
                    "title": "The Blood Type Mystery",
                    "description": "Determine genetic inheritance patterns",
                    "question": "In ABO blood typing, which genotype will produce Type O blood?\n\nA) AA\nB) AO\nC) BB\nD) OO",
                    "answer_type": "multiple_choice",
                    "correct_answer": "D",
                    "options": ["AA", "AO", "BB", "OO"],
                    "explanation": "Type O blood requires two recessive O alleles (OO genotype). A and B are dominant over O.",
                    "reward_xp": 170,
                    "reward_item": "Genetics Scroll"
                }
            ] 
        }, 
        { 
            "id": "loops", 
            "name": "Human Body Systems", 
            "zone": "Loop Lake", 
            "description": "Learn how body systems work together", 
            "quests": [ 
                { 
                    "title": "The Breathing Rate Calculator",
                    "description": "Calculate respiratory system efficiency",
                    "question": "A person breathes 15 times per minute, and each breath moves 500 mL of air. How many liters of air do they breathe in one hour?\n\nGiven:\n- Breathing rate: 15 breaths/minute\n- Tidal volume: 500 mL/breath\n- Time: 60 minutes\n\nCalculate total liters:",
                    "answer_type": "calculation",
                    "correct_answer": 450,
                    "unit": "L",
                    "solution_steps": [
                        "Air per minute = 15 × 500 = 7,500 mL/min",
                        "Air per hour = 7,500 × 60 = 450,000 mL/hour", 
                        "Convert to liters = 450,000 ÷ 1,000 = 450 L"
                    ],
                    "reward_xp": 200,
                    "reward_item": "Loop Ring"
                },
                {
                    "title": "The Heart Rate Challenge", 
                    "description": "Analyze cardiovascular system performance",
                    "question": "Which chamber of the heart pumps oxygen-rich blood to the entire body?\n\nA) Right Atrium\nB) Right Ventricle\nC) Left Atrium\nD) Left Ventricle",
                    "answer_type": "multiple_choice",
                    "correct_answer": "D", 
                    "options": ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
                    "explanation": "The left ventricle is the strongest chamber and pumps oxygenated blood through the aorta to the body.",
                    "reward_xp": 220,
                    "reward_item": "Heart Crystal"
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
        this.answerInput = null;
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
            this.setupAnswerInput();
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
        this.createNPC(-5, 0, -10, 'Bio Master', '🧙♂️', gameData.pythonConcepts[0]);
        this.createNPC(30, 0, 0, 'Doctor', '🧝♀️', gameData.pythonConcepts[1]);
        this.createNPC(-40, 0, 35, 'Surgeon', '🏊♂️', gameData.pythonConcepts[2]);
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
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                resize: none;
                font-family: monospace;
                font-size: 14px;
                padding: 10px;
                background-color: #1e1e1e;
                color: #d4d4d4;
            `;
            textarea.value = '# Your answer here';
            codeEditorDiv.appendChild(textarea);
            
            this.codeEditor = {
                getValue: () => textarea.value,
                setValue: (value) => {
                    textarea.value = value;
                }
            };
        }
    }

    setupAnswerInput() {
        const answerInputDiv = document.getElementById('answerInput') || this.createAnswerInputDiv();
        answerInputDiv.innerHTML = '';
        
        this.answerInput = {
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
            width: 350px;
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            display: none;
            z-index: 1000;
            max-height: 500px;
            overflow-y: auto;
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
            const questContent = document.getElementById('questContent') || this.createQuestPanel();
            if (questContent) {
                questContent.innerHTML = `
                    <h3>🔬 ${this.nearbyNPC.userData.name}</h3>
                    <p>Press <strong>E</strong> to learn about ${this.nearbyNPC.userData.concept.name}!</p>
                    <p><em>${this.nearbyNPC.userData.concept.description}</em></p>
                `;
            }
        }
    }

    createQuestPanel() {
        const panel = document.createElement('div');
        panel.id = 'questContent';
        panel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            width: 350px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 1000;
        `;
        document.body.appendChild(panel);
        return panel;
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
            console.log(`Entered ${newZone}`);
        }
    }

    updateMinimap() {
        // Minimap update logic would go here
    }

    updateUI() {
        const healthValue = document.getElementById('healthValue') || this.createHealthElement('healthValue');
        healthValue.textContent = `${this.gameState.health}/100`;

        const xpNeeded = this.gameState.level * 250;
        const xpPercent = (this.gameState.xp / xpNeeded) * 100;
        
        const xpBar = document.getElementById('xpBar') || this.createHealthElement('xpBar');
        xpBar.style.width = xpPercent + '%';
        
        const xpValue = document.getElementById('xpValue') || this.createHealthElement('xpValue');
        xpValue.textContent = `${this.gameState.xp}/${xpNeeded}`;

        this.updateInventory();
    }

    createHealthElement(id) {
        const element = document.createElement('div');
        element.id = id;
        document.body.appendChild(element);
        return element;
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
            if (item.includes('Scroll')) icon = '📜';
            
            itemDiv.innerHTML = `
                <div style="text-align: center; padding: 10px; border: 1px solid #ccc; border-radius: 5px; background: #f9f9f9;">
                    <div style="font-size: 24px;">${icon}</div>
                    <div style="font-size: 12px; margin-top: 5px;">${item}</div>
                </div>
            `;
            
            inventoryGrid.appendChild(itemDiv);
        });
    }

    toggleInventory() {
        const inventoryDiv = document.getElementById('inventory');
        if (inventoryDiv) {
            inventoryDiv.style.display = inventoryDiv.style.display === 'none' ? 'block' : 'none';
            this.updateInventory();
        }
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
                <h3>🧬 ${quest.title}</h3>
                <p><strong>${quest.description}</strong></p>
                <div style="background: #f0f0f0; color: black; padding: 15px; margin: 10px 0; border-radius: 5px; white-space: pre-line; max-height: 200px; overflow-y: auto;">${quest.question}</div>
                <button onclick="game.showAnswerInput()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Answer Question 🧪
                </button>
            `;
        }
    }

    showAnswerInput() {
        if (this.answerInput && this.currentChallenge) {
            this.answerInput.container.style.display = 'block';
            this.answerInput.container.innerHTML = '';

            // Question display
            const questionDiv = document.createElement('div');
            questionDiv.style.cssText = `
                background: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin-bottom: 15px;
                color: black;
                white-space: pre-line;
                max-height: 250px;
                overflow-y: auto;
            `;
            questionDiv.textContent = this.currentChallenge.question;
            this.answerInput.container.appendChild(questionDiv);

            if (this.currentChallenge.answer_type === 'multiple_choice') {
                this.createMultipleChoiceInput();
            } else if (this.currentChallenge.answer_type === 'calculation') {
                this.createCalculationInput();
            }
        }
    }

    createMultipleChoiceInput() {
        const optionsDiv = document.createElement('div');
        optionsDiv.style.marginBottom = '15px';

        this.currentChallenge.options.forEach((option, index) => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: block;
                margin: 8px 0;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 5px;
                cursor: pointer;
                border: 2px solid transparent;
            `;
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'answer';
            radio.value = String.fromCharCode(65 + index); // A, B, C, D
            radio.style.marginRight = '10px';
            
            label.appendChild(radio);
            label.appendChild(document.createTextNode(`${String.fromCharCode(65 + index)}) ${option}`));
            
            label.addEventListener('click', () => {
                // Remove previous selection styling
                optionsDiv.querySelectorAll('label').forEach(l => {
                    l.style.borderColor = 'transparent';
                    l.style.backgroundColor = '#f5f5f5';
                });
                // Highlight selected option
                label.style.borderColor = '#4CAF50';
                label.style.backgroundColor = '#e8f5e8';
            });
            
            optionsDiv.appendChild(label);
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Answer';
        submitBtn.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        `;
        submitBtn.addEventListener('click', () => this.checkMultipleChoiceAnswer());

        this.answerInput.container.appendChild(optionsDiv);
        this.answerInput.container.appendChild(submitBtn);
    }

    createCalculationInput() {
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
            flex: 1;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #ccc;
            border-radius: 5px;
        `;

        const unitSpan = document.createElement('span');
        unitSpan.textContent = this.currentChallenge.unit || '';
        unitSpan.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            color: #333;
        `;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit';
        submitBtn.style.cssText = `
            padding: 12px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        `;

        submitBtn.addEventListener('click', () => this.checkCalculationAnswer(numberInput.value));
        numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkCalculationAnswer(numberInput.value);
        });

        inputContainer.appendChild(numberInput);
        inputContainer.appendChild(unitSpan);
        this.answerInput.container.appendChild(inputContainer);
        this.answerInput.container.appendChild(submitBtn);
        
        numberInput.focus();
    }

    checkMultipleChoiceAnswer() {
        const selectedRadio = this.answerInput.container.querySelector('input[name="answer"]:checked');
        if (!selectedRadio) {
            alert('Please select an answer!');
            return;
        }

        const userAnswer = selectedRadio.value;
        const correctAnswer = this.currentChallenge.correct_answer;

        if (userAnswer === correctAnswer) {
            this.showSuccess();
            this.completeQuest();
        } else {
            this.showIncorrect();
        }
    }

    checkCalculationAnswer(value) {
        const userAnswer = parseFloat(value);
        const correctAnswer = this.currentChallenge.correct_answer;
        const tolerance = Math.abs(correctAnswer * 0.02); // 2% tolerance

        if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
            this.showSuccess();
            this.completeQuest();
        } else {
            this.showIncorrect();
        }
    }

    showSuccess() {
        const quest = this.currentChallenge;
        let message = `🎉 Correct! Excellent work!\n\n`;
        
        if (quest.explanation) {
            message += `Explanation:\n${quest.explanation}\n\n`;
        }
        
        if (quest.solution_steps) {
            message += `Solution:\n${quest.solution_steps.join('\n')}\n\n`;
        }
        
        message += `You earned ${quest.reward_xp} XP and received: ${quest.reward_item}!`;
        alert(message);
    }

    showIncorrect() {
        alert('❌ That\'s not quite right. Try again!\n\nTake your time and think through the biology concepts carefully.');
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
            alert(`🌟 Level Up! You are now level ${this.gameState.level}! Your biological knowledge is growing!`);
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
                <p>Outstanding! You've mastered this biology concept.</p>
                <p>Continue exploring to discover more life sciences!</p>
            `;
        }
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
    game = new PythonQuestGame();
});