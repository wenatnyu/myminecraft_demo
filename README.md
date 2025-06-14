# 2D Minecraft Clone

A simple 2D Minecraft-inspired game built with HTML5 Canvas and JavaScript.

## How to Play

1. Open `index.html` in a modern web browser
2. Select your character (Steve or Alex)
3. Use the controls below to play the game

## Controls

- **Movement**:
  - Left Arrow / A: Move left
  - Right Arrow / D: Move right
  - Up Arrow / W / Space: Jump

- **Game Modes**:
  - Press 'C' to toggle between Creative and Survival modes

- **Block Selection**:
  - 1: Dirt
  - 2: Grass
  - 3: Stone
  - 4: Wood

- **Actions**:
  - Left Click: Place block (Creative mode) / Break block (Survival mode)
  - J: Regular attack (breaks blocks in front of you)
  - K: Release wave attack (expanding circle that breaks blocks)
  - L: Shoot bullet (destroys blocks in its path)

## Features

- Character selection (Steve/Alex)
- Basic physics (gravity, jumping)
- Block placement and breaking
- Creative and Survival modes
- Random terrain generation with hills and trees
- Multiple attack types:
  - Regular attack (melee)
  - Wave attack (area effect)
  - Bullet attack (projectile)
- Player health system
- Character direction (facing left/right)

## Setup

1. Make sure all files are in the correct directory structure:
   ```
   /
   ├── index.html
   ├── game.js
   ├── README.md
   └── assets/
       ├── steve.png
       ├── alex.png
       ├── dirt.png
       ├── grass.png
       ├── stone.png
       └── wood.png
   ```

2. Add your own sprite images to the `assets` folder or use the placeholder images provided.

## Requirements

- Modern web browser with JavaScript enabled
- No additional dependencies required 