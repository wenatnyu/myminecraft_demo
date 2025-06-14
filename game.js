// Game constants
const BLOCK_SIZE = 32;
const PLAYER_SIZE = 48;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const ATTACK_COOLDOWN = 500; // milliseconds
const WAVE_COOLDOWN = 2000; // milliseconds
const BULLET_SPEED = 10;

// Game state
let gameState = {
    player: {
        x: 400,
        y: 300,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        character: 'steve',
        inventory: [],
        selectedBlock: 'dirt',
        lastAttackTime: 0,
        lastWaveTime: 0,
        health: 100,
        direction: 1 // 1 for right, -1 for left
    },
    blocks: [],
    keys: {},
    mode: 'survival',
    projectiles: [],
    waves: []
};

// Initialize canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const images = {
    steve: new Image(),
    alex: new Image(),
    dirt: new Image(),
    grass: new Image(),
    stone: new Image(),
    wood: new Image(),
    bullet: new Image(),
    wave: new Image()
};

// Set image sources
images.steve.src = 'assets/steve.png';
images.alex.src = 'assets/alex.png';
images.dirt.src = 'assets/dirt.png';
images.grass.src = 'assets/grass.png';
images.stone.src = 'assets/stone.png';
images.wood.src = 'assets/wood.png';
images.bullet.src = 'assets/bullet.png';
images.wave.src = 'assets/wave.png';

// Generate random terrain
function generateRandomTerrain() {
    // Generate ground with hills
    let height = canvas.height - BLOCK_SIZE;
    let prevHeight = height;
    
    for (let x = 0; x < canvas.width; x += BLOCK_SIZE) {
        // Random height variation
        if (Math.random() < 0.1) {
            height += (Math.random() - 0.5) * 64;
            height = Math.max(canvas.height - 200, Math.min(canvas.height - BLOCK_SIZE, height));
        }
        
        // Generate surface blocks
        gameState.blocks.push({
            type: 'grass',
            x: x,
            y: height
        });
        
        // Generate underground blocks
        for (let y = height + BLOCK_SIZE; y < canvas.height; y += BLOCK_SIZE) {
            const blockType = Math.random() < 0.3 ? 'stone' : 'dirt';
            gameState.blocks.push({
                type: blockType,
                x: x,
                y: y
            });
        }
        
        // Generate trees
        if (Math.random() < 0.05 && height === prevHeight) {
            generateTree(x, height - BLOCK_SIZE);
        }
        
        prevHeight = height;
    }
}

// Generate a tree
function generateTree(x, y) {
    // Tree trunk
    for (let i = 0; i < 4; i++) {
        gameState.blocks.push({
            type: 'wood',
            x: x,
            y: y - (i * BLOCK_SIZE)
        });
    }
    
    // Tree leaves
    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            if (Math.random() < 0.7) {
                gameState.blocks.push({
                    type: 'grass',
                    x: x + (i * BLOCK_SIZE),
                    y: y - (3 * BLOCK_SIZE) + (j * BLOCK_SIZE)
                });
            }
        }
    }
}

// Character selection
function selectCharacter(character) {
    gameState.player.character = character;
    document.getElementById('characterSelect').style.display = 'none';
}

// Attack functions
function regularAttack() {
    const now = Date.now();
    if (now - gameState.player.lastAttackTime < ATTACK_COOLDOWN) return;
    
    gameState.player.lastAttackTime = now;
    
    // Create attack hitbox
    const attackX = gameState.player.x + (gameState.player.direction * PLAYER_SIZE);
    const attackY = gameState.player.y;
    
    // Check for blocks to break
    gameState.blocks = gameState.blocks.filter(block => {
        const distance = Math.sqrt(
            Math.pow(block.x - attackX, 2) + 
            Math.pow(block.y - attackY, 2)
        );
        return distance > BLOCK_SIZE;
    });
}

function releaseWave() {
    const now = Date.now();
    if (now - gameState.player.lastWaveTime < WAVE_COOLDOWN) return;
    
    gameState.player.lastWaveTime = now;
    
    gameState.waves.push({
        x: gameState.player.x,
        y: gameState.player.y,
        direction: gameState.player.direction,
        size: 0,
        maxSize: 100
    });
}

function shootBullet() {
    gameState.projectiles.push({
        x: gameState.player.x + (gameState.player.direction * PLAYER_SIZE),
        y: gameState.player.y + PLAYER_SIZE/2,
        direction: gameState.player.direction,
        speed: BULLET_SPEED
    });
}

// Input handling
window.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;
    
    // Toggle game mode
    if (e.key === 'c') {
        gameState.mode = gameState.mode === 'survival' ? 'creative' : 'survival';
    }
    
    // Block selection
    if (e.key >= '1' && e.key <= '5') {
        const blocks = ['dirt', 'grass', 'stone', 'wood'];
        gameState.player.selectedBlock = blocks[parseInt(e.key) - 1];
    }
    
    // Attacks
    if (e.key === 'j') regularAttack();
    if (e.key === 'k') releaseWave();
    if (e.key === 'l') shootBullet();
});

window.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

// Mouse handling
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert to grid coordinates
    const gridX = Math.floor(mouseX / BLOCK_SIZE) * BLOCK_SIZE;
    const gridY = Math.floor(mouseY / BLOCK_SIZE) * BLOCK_SIZE;
    
    if (gameState.mode === 'creative') {
        // Place block
        gameState.blocks.push({
            type: gameState.player.selectedBlock,
            x: gridX,
            y: gridY
        });
    } else {
        // Break block
        const blockIndex = gameState.blocks.findIndex(block => 
            block.x === gridX && block.y === gridY
        );
        if (blockIndex !== -1) {
            gameState.blocks.splice(blockIndex, 1);
        }
    }
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update player position
    if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
        gameState.player.velocityX = -MOVE_SPEED;
        gameState.player.direction = -1;
    } else if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
        gameState.player.velocityX = MOVE_SPEED;
        gameState.player.direction = 1;
    } else {
        gameState.player.velocityX = 0;
    }
    
    // Jumping
    if ((gameState.keys['ArrowUp'] || gameState.keys['w'] || gameState.keys[' ']) && !gameState.player.isJumping) {
        gameState.player.velocityY = JUMP_FORCE;
        gameState.player.isJumping = true;
    }
    
    // Apply gravity
    gameState.player.velocityY += GRAVITY;
    
    // Update position
    gameState.player.x += gameState.player.velocityX;
    gameState.player.y += gameState.player.velocityY;
    
    // Update projectiles
    gameState.projectiles = gameState.projectiles.filter(proj => {
        proj.x += proj.direction * proj.speed;
        
        // Check for collisions with blocks
        const hitBlock = gameState.blocks.find(block => 
            Math.abs(proj.x - block.x) < BLOCK_SIZE &&
            Math.abs(proj.y - block.y) < BLOCK_SIZE
        );
        
        if (hitBlock) {
            gameState.blocks = gameState.blocks.filter(b => b !== hitBlock);
            return false;
        }
        
        return proj.x > 0 && proj.x < canvas.width;
    });
    
    // Update waves
    gameState.waves = gameState.waves.filter(wave => {
        wave.size += 5;
        
        // Check for collisions with blocks
        gameState.blocks = gameState.blocks.filter(block => {
            const distance = Math.sqrt(
                Math.pow(block.x - wave.x, 2) + 
                Math.pow(block.y - wave.y, 2)
            );
            return distance > wave.size;
        });
        
        return wave.size < wave.maxSize;
    });
    
    // Collision detection
    gameState.blocks.forEach(block => {
        if (gameState.player.x < block.x + BLOCK_SIZE &&
            gameState.player.x + PLAYER_SIZE > block.x &&
            gameState.player.y < block.y + BLOCK_SIZE &&
            gameState.player.y + PLAYER_SIZE > block.y) {
            
            // Collision from above
            if (gameState.player.velocityY > 0) {
                gameState.player.y = block.y - PLAYER_SIZE;
                gameState.player.velocityY = 0;
                gameState.player.isJumping = false;
            }
            // Collision from below
            else if (gameState.player.velocityY < 0) {
                gameState.player.y = block.y + BLOCK_SIZE;
                gameState.player.velocityY = 0;
            }
        }
    });
    
    // Draw blocks
    gameState.blocks.forEach(block => {
        ctx.drawImage(images[block.type], block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);
    });
    
    // Draw projectiles
    gameState.projectiles.forEach(proj => {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw waves
    gameState.waves.forEach(wave => {
        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.size, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    // Draw player
    ctx.save();
    if (gameState.player.direction === -1) {
        ctx.scale(-1, 1);
        ctx.drawImage(
            images[gameState.player.character],
            -gameState.player.x - PLAYER_SIZE,
            gameState.player.y,
            PLAYER_SIZE,
            PLAYER_SIZE
        );
    } else {
        ctx.drawImage(
            images[gameState.player.character],
            gameState.player.x,
            gameState.player.y,
            PLAYER_SIZE,
            PLAYER_SIZE
        );
    }
    ctx.restore();
    
    // Draw UI
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Mode: ${gameState.mode}`, 10, 30);
    ctx.fillText(`Selected: ${gameState.player.selectedBlock}`, 10, 60);
    ctx.fillText(`Health: ${gameState.player.health}`, 10, 90);
    
    requestAnimationFrame(gameLoop);
}

// Start the game
generateRandomTerrain();
gameLoop(); 