<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Chess Visualizer Lab</title>
    <link rel="stylesheet" href="assets/libs/chessboard.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="app">

    <!-- HEADER -->
    <header class="app-header">
        <div class="logo">♟ Chess Visualizer made by rrhin <span>Lab</span></div>
        <p class="tagline">Visual analysis sandbox for chess learners</p>
    </header>

    <!-- CONTROLS BAR -->
    <div class="controls-bar">
        <div class="control-group">
            <span class="control-label">Analyze</span>
            <button class="ctrl-btn active" id="btn-white" onclick="setColor('w')">White</button>
            <button class="ctrl-btn" id="btn-black" onclick="setColor('b')">Black</button>
        </div>
        <div class="divider"></div>
        <div class="control-group">
            <span class="control-label">View</span>
            <button class="ctrl-btn active" id="btn-stripe" onclick="setMode('stripe')">♟ Piece Control</button>
            <button class="ctrl-btn" id="btn-heatmap" onclick="setMode('heatmap')">🌡 Heatmap</button>
        </div>
    </div>

    <!-- BOARD -->
    <div class="board-wrap">
        <div id="board"></div>
    </div>

    <!-- LEGEND -->
    <div class="legend" id="legend">
        <div class="legend-title">Square Control Legend</div>

        <div class="legend-stripe" id="legend-stripe">
            <div class="legend-item"><div class="swatch" style="background:rgba(100,160,255,0.8)"></div><span>Pawn</span></div>
            <div class="legend-item"><div class="swatch" style="background:rgba(80,200,120,0.8)"></div><span>Knight</span></div>
            <div class="legend-item"><div class="swatch" style="background:rgba(180,100,255,0.8)"></div><span>Bishop</span></div>
            <div class="legend-item"><div class="swatch" style="background:rgba(255,140,60,0.8)"></div><span>Rook</span></div>
            <div class="legend-item"><div class="swatch" style="background:rgba(255,210,50,0.8)"></div><span>Queen</span></div>
            <div class="legend-item"><div class="swatch" style="background:rgba(255,80,80,0.8)"></div><span>King</span></div>
            <div class="legend-stripe-note">
                <div class="swatch stripe-swatch"></div>
                <span>Stripes = multiple piece types controlling same square</span>
            </div>
        </div>

        <div class="legend-heatmap" id="legend-heatmap" style="display:none">
            <div class="heat-bar"></div>
            <div class="heat-labels">
                <span>⬅ White dominates</span>
                <span>Contested</span>
                <span>Black dominates ➡</span>
            </div>
            <div class="heat-note">Darker = more pieces controlling that square</div>
        </div>
    </div>

    <footer class="app-footer">Chess Visualizer Lab · Drag pieces freely · Hover to see arrows</footer>

</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="assets/libs/chessboard.min.js"></script>
<script src="assets/libs/chess.min.js"></script>
<script src="assets/js/logic.js"></script>
<script src="assets/js/arrows.js"></script>
<script src="assets/js/board.js"></script>
<script src="assets/js/main.js"></script>

</body>
</html>