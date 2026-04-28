# ♟️ Chess Visualizer Lab

A real-time interactive chess analysis sandbox designed for beginners to understand chess positions visually.  
This is not a traditional chess game — it is a **freestyle learning and analysis board**.

---

## 🚀 Project Overview

Chess Visualizer Lab allows users to:

- Move any piece freely without turn restrictions
- Add or remove pieces dynamically
- View all possible moves for every piece at all times
- Analyze threats and defensive structures instantly
- Understand board positions in real-time

The goal is to help beginners **learn chess visually and intuitively**, rather than playing strict rule-based matches.

---

## 🧠 Core Concept

Unlike traditional chess engines:

- ❌ No enforced turn system  
- ❌ No game-over conditions  
- ❌ No strict move validation rules  

Instead, this system behaves like a:

> 🧩 “Chess laboratory for experimentation and learning”

---

## ✨ Features

### ♟️ Free Board Control
- Drag and move any piece anywhere
- Place or remove pieces instantly

### 👀 Full Move Visualization
- Shows all possible moves for all pieces
- Works for both White and Black simultaneously

### ⚔️ Threat Detection
- Highlights attacked pieces
- Displays unsafe squares
- Identifies attacking relationships

### 🛡️ Defense Awareness
- Shows which pieces are protected
- Displays backup/defender chains
- Helps visualize defensive structures

### 🔄 Real-Time Analysis
- Updates instantly after every change
- No need for turns or game progression

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- chess.js (for move logic)
- chessboard.js (for board rendering)
- jQuery (dependency for chessboard.js)

---

## 📁 Project Structure













## FLOW
main.js
   ↓
creates Chess()
   ↓
creates Chessboard()
   ↓
board.js handles moves
   ↓
logic.js analyzes FEN
   ↓
arrows.js renders visuals

---

## ⚙️ How It Works

1. Chessboard is rendered using `chessboard.js`
2. Game state is managed using `chess.js`
3. On every piece movement:
   - Board state is updated
   - Analysis engine runs
   - Moves, threats, and defenses are recalculated
4. UI updates instantly

---

## 🎯 Purpose

This project is designed for:

- Chess beginners
- Visual learners
- Students studying board strategy
- Experimenting with positions freely

---

## 📌 Important Note

This is **not a competitive chess game**.

It is intentionally designed to:
- ignore strict rules
- allow free manipulation
- focus on understanding positions

---

## 🚧 Future Improvements

- Heatmap for board control
- Move arrows visualization
- Engine-based suggestions
- Save/load positions (FEN editor)
- Threat intensity scoring
- Step-by-step position explanations

---

## 👨‍💻 Author

Built as a learning-focused chess visualization system for experimenting with board states and improving strategic understanding.

---