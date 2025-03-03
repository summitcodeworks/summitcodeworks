# Cyberpunk City - Next.js 3D Scene

A 3D dystopian cityscape inspired by cyberpunk aesthetics, built with Next.js and Three.js.

## Required Assets

For this application to work properly, you need to create the following directories and add the required assets:

### 1. Fonts

Create a directory at `/public/fonts/` and add the following font:
- `Orbitron_Bold.json` - You can generate this using [facetype.js](https://gero3.github.io/facetype.js/) from the Orbitron Bold font.

### 2. Textures

Create a directory at `/public/textures/` and add the following texture:
- `cyberpunk-street.jpg` - A dark, gritty street texture with neon reflections.

### 3. Sounds (Optional)

Create a directory at `/public/sounds/` and add the following audio file:
- `cyberpunk-ambient.mp3` - Ambient cyberpunk background music.

## Features

- Dark, gritty urban environment with towering skyscrapers
- Glowing neon lights in vibrant colors (pink, blue, purple)
- Atmospheric effects including fog and rain
- Animated vehicles (ground cars and flying vehicles)
- Interactive camera controls for exploring the city
- UI controls for adjusting scene parameters
- Responsive design

## Controls

- Mouse Drag: Rotate Camera
- Mouse Wheel: Zoom In/Out
- Right Click + Drag: Pan Camera
- Settings Panel: Adjust neon intensity, vehicle speed, fog density, and rain intensity

## Technologies Used

- Next.js
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Tailwind CSS 