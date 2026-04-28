console.log("BOARD JS LOADED");

window.board = null;
window.boardState = {};
window.analysisColor = "w";
window.viewMode = "stripe"; // "stripe" or "heatmap"

// ================================
// PIECE TYPE COLORS
// ================================
const PIECE_COLORS = {
    P: "rgba(100,160,255,0.7)",
    N: "rgba(80,200,120,0.7)",
    B: "rgba(180,100,255,0.7)",
    R: "rgba(255,140,60,0.7)",
    Q: "rgba(255,210,50,0.7)",
    K: "rgba(255,80,80,0.7)",
};

const PIECE_NAMES = {
    P: "Pawn",
    N: "Knight",
    B: "Bishop",
    R: "Rook",
    Q: "Queen",
    K: "King",
};


document.addEventListener('DOMContentLoaded', function () {
    initBoardState();
    initBoardUI();
    createTopControls();
    createLegend();
    initArrows();
    runAnalysis();
});


// ================================
// TOP CONTROLS (color selector + mode toggle)
// ================================
function createTopControls() {

    let container = document.createElement("div");
    container.id = "top-controls";
    container.style.cssText = `
        text-align: center;
        margin: 12px auto;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        font-family: Arial, sans-serif;
    `;

    // color selector
    let colorGroup = document.createElement("div");
    colorGroup.style.cssText = "display:flex; gap:6px; align-items:center;";
    colorGroup.innerHTML = `
        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Analyze:</span>
        <button onclick="setColor('w')" id="btn-white" style="${btnStyle('#4a90e8')}">White</button>
        <button onclick="setColor('b')" id="btn-black" style="${btnStyle('#999')}">Black</button>
    `;

    // mode toggle
    let modeGroup = document.createElement("div");
    modeGroup.style.cssText = "display:flex; gap:6px; align-items:center;";
    modeGroup.innerHTML = `
        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">View:</span>
        <button onclick="setMode('stripe')" id="btn-stripe" style="${btnStyle('#a855f7')}">♟ Piece Control</button>
        <button onclick="setMode('heatmap')" id="btn-heatmap" style="${btnStyle('#999')}">🌡 Heatmap</button>
    `;

    container.appendChild(colorGroup);
    container.appendChild(modeGroup);
    document.body.insertBefore(container, document.body.firstChild);
}

function btnStyle(activeColor) {
    return `
        padding: 5px 14px;
        border-radius: 99px;
        border: 1px solid #ddd;
        background: white;
        color: #555;
        font-family: Arial, sans-serif;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    `;
}

function updateButtonStates() {

    // color buttons
    let wb = document.getElementById("btn-white");
    let bb = document.getElementById("btn-black");
    if (wb && bb) {
        wb.style.cssText = btnStyle() + (window.analysisColor === 'w'
            ? "background:#4a90e8;color:white;border-color:#4a90e8;font-weight:bold;"
            : "");
        bb.style.cssText = btnStyle() + (window.analysisColor === 'b'
            ? "background:#333;color:white;border-color:#333;font-weight:bold;"
            : "");
    }

    // mode buttons
    let sb = document.getElementById("btn-stripe");
    let hb = document.getElementById("btn-heatmap");
    if (sb && hb) {
        sb.style.cssText = btnStyle() + (window.viewMode === 'stripe'
            ? "background:#a855f7;color:white;border-color:#a855f7;font-weight:bold;"
            : "");
        hb.style.cssText = btnStyle() + (window.viewMode === 'heatmap'
            ? "background:#e85555;color:white;border-color:#e85555;font-weight:bold;"
            : "");
    }

    // show/hide legend sections based on mode
    let stripeLegend = document.getElementById("legend-stripe");
    let heatLegend   = document.getElementById("legend-heatmap");
    if (stripeLegend) stripeLegend.style.display = window.viewMode === 'stripe'  ? 'flex' : 'none';
    if (heatLegend)   heatLegend.style.display   = window.viewMode === 'heatmap' ? 'flex' : 'none';
}

window.setColor = function(color) {
    window.analysisColor = color;
    updateButtonStates();
    runAnalysis();
};

window.setMode = function(mode) {
    window.viewMode = mode;
    updateButtonStates();
    runAnalysis();
};


// ================================
// LEGEND
// ================================
function createLegend() {

    let legend = document.createElement("div");
    legend.id = "legend";
    legend.style.cssText = `
        max-width: 520px;
        margin: 14px auto;
        padding: 12px 16px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-size: 13px;
    `;

    let title = document.createElement("div");
    title.style.cssText = `
        width: 100%;
        text-align: center;
        font-weight: bold;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #888;
        margin-bottom: 10px;
    `;
    title.textContent = "Square Control Legend";
    legend.appendChild(title);

    // --- STRIPE LEGEND ---
    let stripeLegend = document.createElement("div");
    stripeLegend.id = "legend-stripe";
    stripeLegend.style.cssText = "display:flex; flex-wrap:wrap; gap:10px; justify-content:center;";

    for (let type in PIECE_COLORS) {
        let item = document.createElement("div");
        item.style.cssText = "display:flex; align-items:center; gap:7px;";
        item.innerHTML = `
            <div style="width:20px;height:20px;border-radius:4px;background:${PIECE_COLORS[type]};border:1px solid rgba(0,0,0,0.12);flex-shrink:0;"></div>
            <span style="color:#333;">${PIECE_NAMES[type]}</span>
        `;
        stripeLegend.appendChild(item);
    }

    // stripe example
    let stripeEx = document.createElement("div");
    stripeEx.style.cssText = "width:100%;display:flex;align-items:center;gap:10px;margin-top:8px;padding-top:8px;border-top:1px solid #eee;";
    stripeEx.innerHTML = `
        <div style="width:52px;height:20px;border-radius:4px;border:1px solid rgba(0,0,0,0.12);flex-shrink:0;background:repeating-linear-gradient(45deg,rgba(100,160,255,0.7) 0px,rgba(100,160,255,0.7) 8px,rgba(80,200,120,0.7) 8px,rgba(80,200,120,0.7) 16px);"></div>
        <span style="color:#555;font-size:12px;">Stripes = multiple piece types controlling same square</span>
    `;
    stripeLegend.appendChild(stripeEx);
    legend.appendChild(stripeLegend);

    // --- HEATMAP LEGEND ---
    let heatLegend = document.createElement("div");
    heatLegend.id = "legend-heatmap";
    heatLegend.style.cssText = "display:none; flex-direction:column; gap:10px; align-items:center;";

    // gradient bar
    let gradBar = document.createElement("div");
    gradBar.style.cssText = `
        width: 100%;
        max-width: 400px;
        height: 20px;
        border-radius: 6px;
        border: 1px solid rgba(0,0,0,0.12);
        background: linear-gradient(to right,
            rgba(30,100,255,0.85),
            rgba(30,100,255,0.2),
            rgba(200,200,200,0.15),
            rgba(255,50,50,0.2),
            rgba(255,50,50,0.85)
        );
    `;

    let gradLabels = document.createElement("div");
    gradLabels.style.cssText = "width:100%;max-width:400px;display:flex;justify-content:space-between;font-size:11px;color:#888;";
    gradLabels.innerHTML = `
        <span>⬅ White dominates</span>
        <span>Contested</span>
        <span>Black dominates ➡</span>
    `;

    let heatNote = document.createElement("div");
    heatNote.style.cssText = "font-size:11px;color:#aaa;text-align:center;";
    heatNote.textContent = "Darker = more pieces controlling that square";

    heatLegend.appendChild(gradBar);
    heatLegend.appendChild(gradLabels);
    heatLegend.appendChild(heatNote);
    legend.appendChild(heatLegend);

    let boardEl = document.getElementById("board");
    boardEl.parentNode.insertBefore(legend, boardEl.nextSibling);

    updateButtonStates();
}


// ================================
// BOARD INIT
// ================================
function initBoardUI() {

    window.board = Chessboard('board', {
        draggable: true,
        position: window.boardState,
        pieceTheme: 'assets/img/pieces/{piece}.png',

        onDrop: function (source, target) {
            let piece = window.boardState[source];
            if (!piece) return 'snapback';
            delete window.boardState[source];
            window.boardState[target] = piece;
            runAnalysis();
        }
    });
}


// ================================
// INITIAL POSITION
// ================================
function initBoardState() {

    let back = ["R","N","B","Q","K","B","N","R"];

    for (let i = 0; i < 8; i++) {
        window.boardState[String.fromCharCode(97+i) + "2"] = "wP";
        window.boardState[String.fromCharCode(97+i) + "7"] = "bP";
    }
    for (let i = 0; i < 8; i++) {
        window.boardState[String.fromCharCode(97+i) + "1"] = "w" + back[i];
        window.boardState[String.fromCharCode(97+i) + "8"] = "b" + back[i];
    }
}


// ================================
// ANALYSIS PIPELINE
// ================================
function runAnalysis() {

    // always analyze both colors for heatmap
    let whiteResult = analyzePosition(window.boardState, "w");
    let blackResult = analyzePosition(window.boardState, "b");

    clearHighlights();

    if (window.viewMode === "stripe") {
        let focusResult = window.analysisColor === "w" ? whiteResult : blackResult;
        renderStripes(focusResult);
    } else {
        renderHeatmap(whiteResult, blackResult);
    }
}


// ================================
// STRIPE RENDERING
// ================================
function renderStripes(result) {

    let squareControllers = {};

    for (let from in result.pieceControls) {
        let piece = window.boardState[from];
        if (!piece) continue;
        let color = PIECE_COLORS[piece[1]];
        result.pieceControls[from].forEach(sq => {
            if (!squareControllers[sq]) squareControllers[sq] = [];
            if (!squareControllers[sq].includes(color)) squareControllers[sq].push(color);
        });
    }

    for (let sq in squareControllers) {
        paintSquare(sq, buildStripeGradient(squareControllers[sq]));
    }

    result.hangingPieces.forEach(p => {
        paintSquare(p.square, "rgba(255,0,0,0.55)");
    });
}


// ================================
// HEATMAP RENDERING
// ================================
function renderHeatmap(whiteResult, blackResult) {

    // count white and black control per square
    let whiteCount = {};
    let blackCount = {};

    for (let from in whiteResult.pieceControls) {
        whiteResult.pieceControls[from].forEach(sq => {
            whiteCount[sq] = (whiteCount[sq] || 0) + 1;
        });
    }

    for (let from in blackResult.pieceControls) {
        blackResult.pieceControls[from].forEach(sq => {
            blackCount[sq] = (blackCount[sq] || 0) + 1;
        });
    }

    // collect all squares that have any control
    let allSquares = new Set([...Object.keys(whiteCount), ...Object.keys(blackCount)]);

    allSquares.forEach(sq => {
        let w = whiteCount[sq] || 0;
        let b = blackCount[sq] || 0;
        let color = heatmapColor(w, b);
        paintSquare(sq, color);
    });
}


// ================================
// HEATMAP COLOR FUNCTION
// ================================
function heatmapColor(white, black) {

    if (white === 0 && black === 0) return "";

    // max intensity caps at 4 attackers for full saturation
    const cap = 4;
    let wNorm = Math.min(white, cap) / cap;
    let bNorm = Math.min(black, cap) / cap;

    if (white > 0 && black === 0) {
        // pure white control — blue, intensity by count
        let alpha = 0.15 + wNorm * 0.65;
        return `rgba(30, 100, 255, ${alpha.toFixed(2)})`;
    }

    if (black > 0 && white === 0) {
        // pure black control — red, intensity by count
        let alpha = 0.15 + bNorm * 0.65;
        return `rgba(255, 50, 50, ${alpha.toFixed(2)})`;
    }

    // contested — blend based on ratio, intensity by total
    let total = white + black;
    let wRatio = white / total;
    let bRatio = black / total;
    let intensity = Math.min(total, cap * 2) / (cap * 2);
    let alpha = 0.2 + intensity * 0.5;

    // mix blue and red channels by ratio
    let r = Math.round(30  * wRatio + 255 * bRatio);
    let g = Math.round(100 * wRatio + 50  * bRatio);
    let b2= Math.round(255 * wRatio + 50  * bRatio);

    return `rgba(${r}, ${g}, ${b2}, ${alpha.toFixed(2)})`;
}


// ================================
// STRIPE GRADIENT
// ================================
function buildStripeGradient(colors) {

    if (colors.length === 1) return colors[0];

    const stripeWidth = 8;
    let stops = [];
    let pos = 0;

    const pattern = [...colors, ...colors];
    pattern.forEach(color => {
        stops.push(`${color} ${pos}px`);
        pos += stripeWidth;
        stops.push(`${color} ${pos}px`);
    });

    return `repeating-linear-gradient(45deg, ${stops.join(", ")})`;
}


// ================================
// PAINT / CLEAR
// ================================
function paintSquare(square, gradient) {
    let el = document.querySelector(`[data-square="${square}"]`);
    if (el) el.style.background = gradient;
}

function clearHighlights() {
    document.querySelectorAll(".square-55d63").forEach(el => {
        el.style.background = "";
    });
}