import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ----------------- Three.js Scene -----------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias:true, canvas:document.getElementById('c') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcccccc);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(0, 5, 5);
scene.add(dir);

camera.position.set(0,1,2);

let mixer, talkAction;
const loader = new GLTFLoader();
loader.load('your-model.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  const talkingClip = gltf.animations.find(c => c.name.toLowerCase().includes("talk"));
  if (talkingClip) {
    talkAction = mixer.clipAction(talkingClip);
    talkAction.setLoop(THREE.LoopRepeat, Infinity);
    talkAction.play();
    talkAction.paused = true;
  }
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----------------- Gemini + TTS -----------------
const input = document.getElementById("prompt-input");
const button = document.getElementById("speak-button");

// ⚠️ This should be on server-side in production!
const GEMINI_API_KEY = "AIzaSyDJFhCJorNolssTmsdlwjKvzhRFqrmZNbI";

button.addEventListener("click", async () => {
  const userPrompt = input.value.trim();
  if (!userPrompt) return;

  button.disabled = true;
  if (talkAction) talkAction.paused = false;

  try {
    // Engineered prompt wrapper
    const engineeredPrompt = `'
DONT RETURN MD simple text only,
if its general talk then talk generally else,
You are an expert reviewer and problem-solver. 
The user will provide a solution or idea. 
Your task is:
1. Analyze their solution in detail: what works, what might be improved.
2. Provide an alternate approach or solution to the same problem.
3. Keep your response clear and concise.

User’s solution:
"${userPrompt}"
    `;

    // 1. Call Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: engineeredPrompt }]
            }
          ]
        })
      }
    );

    if (!response.ok) throw new Error("Gemini request failed");
    const data = await response.json();

    // Extract text from Gemini response
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text 
                 || "I couldn’t generate a response.";

    console.log("Gemini Response:", aiText);

    // 2. Speak response with Web Speech API
    const utterance = new SpeechSynthesisUtterance(aiText);
    utterance.onend = () => {
      if (talkAction) talkAction.paused = true;
      button.disabled = false;
    };
    speechSynthesis.speak(utterance);

  } catch (err) {
    console.error("Error:", err);
    if (talkAction) talkAction.paused = true;
    button.disabled = false;
  }
});
