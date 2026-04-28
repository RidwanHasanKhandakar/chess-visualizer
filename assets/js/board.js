console.log("BOARD JS LOADED");

window.board = null;
window.boardState = {};
window.analysisColor = "w";
window.viewMode = "stripe";

const PIECE_COLORS = {
    P: "rgba(100,160,255,0.8)",
    N: "rgba(80,200,120,0.8)",
    B: "rgba(180,100,255,0.8)",
    R: "rgba(255,140,60,0.8)",
    Q: "rgba(255,210,50,0.8)",
    K: "rgba(255,80,80,0.8)",
};

document.addEventListener('DOMContentLoaded', function () {
    initBoardState();
    initBoardUI();
    initArrows();
    updateButtonStates();
    runAnalysis();
});


// ================================
// BUTTON STATE SYNC
// ================================
function updateButtonStates() {

    // analyze buttons
    let wb = document.getElementById("btn-white");
    let bb = document.getElementById("btn-black");
    if (wb) wb.className = "ctrl-btn" + (window.analysisColor === "w" ? " active" : "");
    if (bb) bb.className = "ctrl-btn" + (window.analysisColor === "b" ? " active" : "");

    // view buttons
    let sb = document.getElementById("btn-stripe");
    let hb = document.getElementById("btn-heatmap");
    if (sb) sb.className = "ctrl-btn" + (window.viewMode === "stripe"  ? " active" : "");
    if (hb) hb.className = "ctrl-btn" + (window.viewMode === "heatmap" ? " active" : "");

    // legend sections
    let ls = document.getElementById("legend-stripe");
    let lh = document.getElementById("legend-heatmap");
    if (ls) ls.style.display = window.viewMode === "stripe"  ? "flex" : "none";
    if (lh) lh.style.display = window.viewMode === "heatmap" ? "flex" : "none";
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

    let allSquares = new Set([...Object.keys(whiteCount), ...Object.keys(blackCount)]);

    allSquares.forEach(sq => {
        let w = whiteCount[sq] || 0;
        let b = blackCount[sq] || 0;
        paintSquare(sq, heatmapColor(w, b));
    });
}


// ================================
// HEATMAP COLOR
// ================================
function heatmapColor(white, black) {

    if (white === 0 && black === 0) return "";

    const cap = 4;
    let wNorm = Math.min(white, cap) / cap;
    let bNorm = Math.min(black, cap) / cap;

    if (white > 0 && black === 0) {
        let alpha = 0.15 + wNorm * 0.65;
        return `rgba(30, 100, 255, ${alpha.toFixed(2)})`;
    }

    if (black > 0 && white === 0) {
        let alpha = 0.15 + bNorm * 0.65;
        return `rgba(255, 50, 50, ${alpha.toFixed(2)})`;
    }

    let total = white + black;
    let wRatio = white / total;
    let bRatio = black / total;
    let intensity = Math.min(total, cap * 2) / (cap * 2);
    let alpha = 0.2 + intensity * 0.5;

    let r  = Math.round(30  * wRatio + 255 * bRatio);
    let g  = Math.round(100 * wRatio + 50  * bRatio);
    let b2 = Math.round(255 * wRatio + 50  * bRatio);

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
