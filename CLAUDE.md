# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone HTML5 canvas-based racing game — no build system, no package manager, no bundler. It runs directly in the browser by opening `index.html`.

## Running the Game

Open `index.html` in a browser. No server required for most assets, but if audio/image loading is blocked by browser security policies, serve from a local HTTP server:

```sh
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

Everything is a single `app.js` file (~2200 lines). It is structured in several logical sections:

**Game state machine** — a `gameState` string drives all logic. States: `"splash"`, `"start"`, `"credits"`, `"map"`, `"game"`, `"levelComplete"`, `"upgrade"`. Each state has a paired `init*()` and `update*Event()` function that drives a `requestAnimFrame` loop.

**`Utils` namespace** (declared inline via IIFEs starting around line 1221):
- `Utils.AssetLoader` — loads and caches images/sprites
- `Utils.UserInput` — manages hit areas (rect and image-based), keyboard keys, and multi-touch
- `Utils.SaveDataHandler` — localStorage-based persistence for level progress, scores, and power-up upgrades

**`Elements` namespace** (IIFEs starting around line 1583):
- `Elements.Background` — scrolling background rendering
- `Elements.Road` — pseudo-3D road rendering with curves and hills; fires a `roadCallback` when race milestones are reached
- `Elements.UserCar` / `Elements.EnemyCar` — sprite-based car rendering and positioning
- `Elements.Hud` — in-game HUD (speed, position, nitro)
- `Elements.Panel` — UI panel/overlay renderer used across multiple screens

**Third-party libraries** (all vendored, not from npm):
- `TweenMax.min.js` — GSAP TweenMax for all animations and timed transitions
- `howler.js` — audio playback
- `viewporter.js` — mobile viewport/orientation handling

**Global game variables** are declared at the bottom of `app.js` (~line 2151–2230) and include canvas references, input handler, all game state variables (speed, steer, curve, etc.), level config, and save data.

## Key Patterns

- **Hit areas** are registered/removed on `userInput` as the game transitions between states. Always call `userInput.removeHitArea(id)` before calling an `init*()` transition to avoid duplicate handlers.
- **Tweens** (`TweenLite`/`TweenMax`) are used for both visual animation and game logic timing (curve changes, hill changes, nitro, music volume).
- **Asset IDs** are strings like `"userCar"`, `"desertRoad"`, `"uiButs"` — all loaded in `loadAssets()` (line 678) and retrieved via `assetLib.getData(id)`.
- **Level themes** are `"forest"`, `"city"`, or `"desert"` and gate which background/road/fog images are used.
- **Save data** is stored in localStorage as a flat array (`aLevelStore`) indexed by level number × 3 plus offsets for power-up and currency state.
