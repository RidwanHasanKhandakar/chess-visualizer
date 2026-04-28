<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Chess Visualizer Sandbox</title>

    <link rel="stylesheet" href="assets/libs/chessboard.min.css">

    <style>
        body {
            font-family: Arial;
            background: #f5f5f5;
        }
        #board {
            width: 500px;
            margin: 20px auto;
        }
    </style>
</head>

<body>

<h2 style="text-align:center;">Chess Visualizer Sandbox</h2>

<div id="board"></div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="assets/libs/chessboard.min.js"></script>
<script src="assets/libs/chess.min.js"></script>

<script src="assets/js/logic.js"></script>
<script src="assets/js/arrows.js"></script>
<script src="assets/js/board.js"></script>
<script src="assets/js/main.js"></script>
<footer style="background:#000; color:#ccc; text-align:center; font-size:12px; padding:12px 0; margin-top:20px;">
    <p style="margin:0;">♟ Chess Visualizer Sandbox • Built by Rahin</p>
</footer>
</body>
</html>