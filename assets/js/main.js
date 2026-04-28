console.log("MAIN JS LOADED");

document.addEventListener('DOMContentLoaded', function () {
    console.log("APP STARTING...");

    // GLOBAL GAME STATE (single source of truth)
    window.game = new Chess();

    // board.js handles board creation and first analysis automatically
});
