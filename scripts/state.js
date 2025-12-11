/**
 * State-Modul - Verwaltung des globalen Spielzustands
 */

const gameState = {
    hasKey: false,
    playerHP: 100,
    maxHP: 100,
    ammo: 30,
    currentRoom: { x: 0, y: 0 },
    gameStatus: "playing", // "playing", "run_complete", "game_over"
    
    // Methoden für State-Verwaltung
    collectKey() {
        this.hasKey = true;
        console.log("🔑 Key aufgesammelt!");
    },
    
    takeDamage(amount) {
        this.playerHP = Math.max(0, this.playerHP - amount);
        if (this.playerHP <= 0) {
            this.gameStatus = "game_over";
            console.log("💀 Spiel vorbei!");
        }
    },
    
    heal(amount) {
        this.playerHP = Math.min(this.maxHP, this.playerHP + amount);
    },
    
    completeRun() {
        this.gameStatus = "run_complete";
        console.log("✨ Run abgeschlossen!");
    },
    
    moveToRoom(x, y) {
        this.currentRoom = { x, y };
    }
};

// State für spätere Module verfügbar machen
window.gameState = gameState;
