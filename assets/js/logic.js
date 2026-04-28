// ================================
// CONTROLLED SQUARES
// What squares does this piece attack/control?
// For pawns: diagonals only (NOT the forward push square)
// For all others: same as legal moves
// ================================
function generateControlled(square, piece, board) {

    const file  = square.charCodeAt(0);
    const rank  = parseInt(square[1]);
    const color = piece[0];
    const type  = piece[1];

    if (type === "P") {
        let dir = color === "w" ? 1 : -1;
        let controlled = [];
        if (file - 1 >= 97)  controlled.push(String.fromCharCode(file - 1) + (rank + dir));
        if (file + 1 <= 104) controlled.push(String.fromCharCode(file + 1) + (rank + dir));
        return controlled;
    }

    return generateMoves(square, piece, board);
}


// ================================
// MOVE ENGINE
// ================================
function generateMoves(square, piece, board) {

    const file  = square.charCodeAt(0);
    const rank  = parseInt(square[1]);
    const color = piece[0];
    const type  = piece[1];
    let moves   = [];

    // ---------------- PAWN ----------------
    if (type === "P") {

        let dir       = color === "w" ? 1 : -1;
        let startRank = color === "w" ? 2 : 7;

        let fwd = String.fromCharCode(file) + (rank + dir);
        if (!board[fwd]) {
            moves.push(fwd);
            let fwd2 = String.fromCharCode(file) + (rank + dir * 2);
            if (rank === startRank && !board[fwd2]) moves.push(fwd2);
        }

        let dl = String.fromCharCode(file - 1) + (rank + dir);
        let dr = String.fromCharCode(file + 1) + (rank + dir);
        if (board[dl] && board[dl][0] !== color) moves.push(dl);
        if (board[dr] && board[dr][0] !== color) moves.push(dr);
    }

    // ---------------- KNIGHT ----------------
    if (type === "N") {
        for (let [df, dr] of [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]) {
            let f = file + df, r = rank + dr;
            if (f >= 97 && f <= 104 && r >= 1 && r <= 8) {
                let sq = String.fromCharCode(f) + r;
                if (!board[sq] || board[sq][0] !== color) moves.push(sq);
            }
        }
    }

    // ---------------- SLIDING PIECES ----------------
    if (type === "R" || type === "B" || type === "Q") {
        let dirs = [];
        if (type === "R" || type === "Q") dirs.push([1,0],[-1,0],[0,1],[0,-1]);
        if (type === "B" || type === "Q") dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
        for (let [dFile, dRank] of dirs) {
            moves.push(...rayMoves(file, rank, board, dFile, dRank, color));
        }
    }

    // ---------------- KING ----------------
    if (type === "K") {
        for (let df = -1; df <= 1; df++) {
            for (let dr = -1; dr <= 1; dr++) {
                if (df === 0 && dr === 0) continue;
                let f = file + df, r = rank + dr;
                if (f >= 97 && f <= 104 && r >= 1 && r <= 8) {
                    let sq = String.fromCharCode(f) + r;
                    if (!board[sq] || board[sq][0] !== color) moves.push(sq);
                }
            }
        }
    }

    return moves;
}


// ================================
// RAY MOVEMENT (sliding pieces)
// ================================
function rayMoves(startFile, startRank, board, dFile, dRank, color) {

    let moves = [];
    let f = startFile + dFile;
    let r = startRank + dRank;

    while (f >= 97 && f <= 104 && r >= 1 && r <= 8) {
        let sq = String.fromCharCode(f) + r;
        if (board[sq]) {
            if (board[sq][0] !== color) moves.push(sq); // enemy — capture and stop
            break;                                        // blocked — stop either way
        }
        moves.push(sq); // empty — keep going
        f += dFile;
        r += dRank;
    }

    return moves;
}


// ================================
// FULL POSITION ANALYSIS
// ================================
function analyzePosition(boardState, focusColor) {

    let attacks         = [];
    let defenses        = [];
    let pieceThreats    = {};
    let pieceBackups    = {};
    let pieceControls   = {};
    let squareAttackMap = {};
    let hangingPieces   = [];

    let opponentColor = focusColor === "w" ? "b" : "w";

    // --- pass 1: analyze focusColor pieces ---
    for (let from in boardState) {

        let piece = boardState[from];
        if (piece[0] !== focusColor) continue;

        let moves      = generateMoves(from, piece, boardState);
        let controlled = generateControlled(from, piece, boardState);

        pieceThreats[from]  = [];
        pieceBackups[from]  = [];
        pieceControls[from] = controlled;

        controlled.forEach(sq => {
            squareAttackMap[sq] = (squareAttackMap[sq] || 0) + 1;
        });

        moves.forEach(to => {
            let target = boardState[to];
            if (!target) return;
            if (target[0] !== focusColor) {
                attacks.push({ from, to });
                pieceThreats[from].push(to);
            } else {
                defenses.push({ from, to });
                pieceBackups[from].push(to);
            }
        });
    }

    // --- pass 2: find focusColor pieces under attack ---
    for (let from in boardState) {

        let piece = boardState[from];
        if (piece[0] !== focusColor) continue;

        for (let oppFrom in boardState) {

            let oppPiece = boardState[oppFrom];
            if (oppPiece[0] !== opponentColor) continue;

            let oppControlled = generateControlled(oppFrom, oppPiece, boardState);

            if (oppControlled.includes(from)) {
                hangingPieces.push({ square: from, piece });
                break;
            }
        }
    }

    return {
        attacks,
        defenses,
        hangingPieces,
        pieceThreats,
        pieceBackups,
        pieceControls,
        squareAttackMap,
    };
}