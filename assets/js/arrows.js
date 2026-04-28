console.log("ARROWS JS LOADED");

let arrowSVG = null;

// ================================
// INIT — create SVG overlay
// ================================
function initArrows() {

    let boardEl = document.getElementById("board");
    boardEl.style.position = "relative";

    arrowSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrowSVG.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 10;
        overflow: visible;
    `;

    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    arrowSVG.appendChild(defs);
    boardEl.appendChild(arrowSVG);

    registerHoverEvents();
    console.log("ARROWS INIT DONE", arrowSVG);
}


// ================================
// ENSURE ARROWHEAD MARKER EXISTS
// ================================
function ensureMarker(id, color) {

    if (arrowSVG.querySelector(`#${id}`)) return;

    let defs = arrowSVG.querySelector("defs");
    let marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", id);
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("refX", "5");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M0,0 L0,6 L6,3 Z");
    path.setAttribute("fill", color);
    marker.appendChild(path);
    defs.appendChild(marker);
}


// ================================
// GET SQUARE CENTER IN PIXELS
// ================================
function getSquareCenter(square) {

    let el = document.querySelector(`[data-square="${square}"]`);
    let boardEl = document.getElementById("board");
    if (!el || !boardEl) return null;

    let boardRect = boardEl.getBoundingClientRect();
    let sqRect    = el.getBoundingClientRect();

    return {
        x: sqRect.left - boardRect.left + sqRect.width  / 2,
        y: sqRect.top  - boardRect.top  + sqRect.height / 2,
    };
}


// ================================
// DRAW ONE ARROW
// ================================
function drawArrow(fromSq, toSq, color, markerId) {

    let from = getSquareCenter(fromSq);
    let to   = getSquareCenter(toSq);
    if (!from || !to) return;

    ensureMarker(markerId, color);

    let dx  = to.x - from.x;
    let dy  = to.y - from.y;
    let len = Math.sqrt(dx*dx + dy*dy);
    if (len === 0) return;

    let shorten = 18;
    let ex = to.x - (dx / len) * shorten;
    let ey = to.y - (dy / len) * shorten;

    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", ex);
    line.setAttribute("y2", ey);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "3.5");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("opacity", "0.9");
    line.setAttribute("marker-end", `url(#${markerId})`);
    arrowSVG.appendChild(line);
}


// ================================
// SOLID COLORS PER PIECE TYPE
// ================================
const ARROW_COLORS = {
    P: "#4a90e8",
    N: "#3dbd6e",
    B: "#a855f7",
    R: "#f97316",
    Q: "#eab308",
    K: "#ef4444",
};


// ================================
// CLEAR ALL ARROWS
// ================================
function clearArrows() {
    if (!arrowSVG) return;
    arrowSVG.querySelectorAll("line").forEach(el => el.remove());
}


// ================================
// DRAW ARROWS FOR A HOVERED SQUARE
// ================================
function drawArrowsForSquare(square) {

    clearArrows();

    let piece = window.boardState[square];
    if (!piece) return;

    let pieceColor    = piece[0]; // color of the hovered piece
    let opponentColor = pieceColor === "w" ? "b" : "w";

    // --- DEFENSE: find all friendly pieces that control this square ---
    for (let from in window.boardState) {

        if (from === square) continue;

        let defender = window.boardState[from];
        if (!defender || defender[0] !== pieceColor) continue;

        let controlled = generateControlled(from, defender, window.boardState);
        if (!controlled.includes(square)) continue;

        let type     = defender[1];
        let color    = ARROW_COLORS[type] || "#888";
        let markerId = `marker-${type}`;
        drawArrow(from, square, color, markerId);
    }

    // --- ATTACK: find all opponent pieces that control this square ---
    for (let from in window.boardState) {

        let attacker = window.boardState[from];
        if (!attacker || attacker[0] !== opponentColor) continue;

        let controlled = generateControlled(from, attacker, window.boardState);
        if (!controlled.includes(square)) continue;

        drawArrow(from, square, "#111", "marker-attack");
    }
}


// ================================
// HOVER EVENTS
// ================================
function registerHoverEvents() {

    let boardEl = document.getElementById("board");

    boardEl.addEventListener("mouseover", function(e) {

        let sqEl = e.target.closest("[data-square]");
        if (!sqEl) return;

        let square = sqEl.getAttribute("data-square");
        let piece  = window.boardState[square];

        if (!piece) {
            clearArrows();
            return;
        }

        drawArrowsForSquare(square);
    });

    boardEl.addEventListener("mouseleave", function() {
        clearArrows();
    });
}

window.initArrows = initArrows;
window.drawArrowsForSquare = drawArrowsForSquare;
window.clearArrows = clearArrows;