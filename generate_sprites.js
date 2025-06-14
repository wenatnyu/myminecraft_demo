const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a function to generate and save a sprite
function generateSprite(name, width, height, drawFunction) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw the sprite
    drawFunction(ctx, width, height);
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`assets/${name}.png`, buffer);
}

// Create assets directory if it doesn't exist
if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
}

// Generate Steve sprite
generateSprite('steve', 48, 48, (ctx, width, height) => {
    // Body
    ctx.fillStyle = '#3B6EA5'; // Blue shirt
    ctx.fillRect(8, 16, 32, 32);
    
    // Head
    ctx.fillStyle = '#E0C9A6'; // Skin tone
    ctx.fillRect(12, 4, 24, 24);
    
    // Arms
    ctx.fillStyle = '#3B6EA5';
    ctx.fillRect(4, 16, 8, 24);
    ctx.fillRect(36, 16, 8, 24);
    
    // Legs
    ctx.fillStyle = '#1B1B1B'; // Dark pants
    ctx.fillRect(12, 40, 8, 8);
    ctx.fillRect(28, 40, 8, 8);
});

// Generate Alex sprite
generateSprite('alex', 48, 48, (ctx, width, height) => {
    // Body
    ctx.fillStyle = '#3B6EA5'; // Blue shirt
    ctx.fillRect(8, 16, 32, 32);
    
    // Head
    ctx.fillStyle = '#E0C9A6'; // Skin tone
    ctx.fillRect(12, 4, 24, 24);
    
    // Hair
    ctx.fillStyle = '#A0522D'; // Brown hair
    ctx.fillRect(12, 4, 24, 8);
    
    // Arms
    ctx.fillStyle = '#3B6EA5';
    ctx.fillRect(4, 16, 8, 24);
    ctx.fillRect(36, 16, 8, 24);
    
    // Legs
    ctx.fillStyle = '#1B1B1B'; // Dark pants
    ctx.fillRect(12, 40, 8, 8);
    ctx.fillRect(28, 40, 8, 8);
});

// Generate Dirt block
generateSprite('dirt', 32, 32, (ctx, width, height) => {
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, 0, width, height);
    
    // Add some texture
    for (let i = 0; i < 10; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 4 + 2;
        ctx.fillStyle = '#6B3410';
        ctx.fillRect(x, y, size, size);
    }
});

// Generate Grass block
generateSprite('grass', 32, 32, (ctx, width, height) => {
    // Dirt base
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, width, height);
    
    // Grass top
    ctx.fillStyle = '#567D46';
    ctx.fillRect(0, 0, width, 8);
    
    // Add some texture
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * 8;
        const size = Math.random() * 3 + 1;
        ctx.fillStyle = '#4A6B3A';
        ctx.fillRect(x, y, size, size);
    }
});

// Generate Stone block
generateSprite('stone', 32, 32, (ctx, width, height) => {
    ctx.fillStyle = '#808080'; // Gray
    ctx.fillRect(0, 0, width, height);
    
    // Add some texture
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3 + 1;
        ctx.fillStyle = '#606060';
        ctx.fillRect(x, y, size, size);
    }
});

// Generate Wood block
generateSprite('wood', 32, 32, (ctx, width, height) => {
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, 0, width, height);
    
    // Add wood grain
    for (let i = 0; i < 4; i++) {
        const y = i * 8;
        ctx.fillStyle = '#6B3410';
        ctx.fillRect(0, y, width, 2);
    }
}); 