/**
 * Game-Modul - Hauptspiel-Loop und Koordination
 */

const Game = {
    canvas: null,
    ctx: null,
    running: true,
    frameCount: 0,
    fps: 60,
    frameTime: 1000 / 60,
    lastTime: 0,
    
    /**
     * Initialisiert das Spiel
     */
    init() {
        // Canvas Setup
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        
        // Canvas-Größe auf Fenster setzen
        this.canvas.width = ROOM_WIDTH;
        this.canvas.height = ROOM_HEIGHT;
        
        // Alle Module initialisieren
        RoomSystem.init();
        Player.init();
        
        console.log("🎮 Game initialisiert!");
        console.log(`📐 Canvas: ${this.canvas.width}x${this.canvas.height}`);
        
        // Game Loop starten
        this.lastTime = Date.now();
        this.gameLoop();
    },
    
    /**
     * Hauptspiel-Loop
     */
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;
        
        if (this.running) {
            this.update();
            this.draw();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    },
    
    /**
     * Update-Phase
     */
    update() {
        // State Updates
        if (gameState.gameStatus === "playing") {
            // Player updaten
            Player.update();
            
            // Gegner updaten
            EnemySystem.update();
            
            // Boss updaten (falls vorhanden)
            const room = RoomSystem.currentRoom;
            if (room.boss && room.boss.hp > 0) {
                this.updateBoss(room.boss);
            } else if (room.boss && room.boss.hp <= 0 && room.type === "boss") {
                // Boss besiegt
                gameState.completeRun();
            }
            
            // UI updaten
            UI.update();
            
            this.frameCount++;
        } else if (gameState.gameStatus === "run_complete") {
            // Run completed
            if (this.frameCount % 60 === 0) {
                console.log("🎉 Run completed!");
            }
        }
    },
    
    /**
     * Aktualisiert Boss-Gegner
     */
    updateBoss(boss) {
        if (!boss || boss.hp <= 0) return;
        
        // Boss läuft auf Player zu (wie normale Gegner)
        const dx = Player.x - boss.x;
        const dy = Player.y - boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            boss.x += (dx / distance) * boss.speed;
            boss.y += (dy / distance) * boss.speed;
        }
        
        // Kollisionen mit Wänden
        const bossRect = { x: boss.x, y: boss.y, width: boss.width, height: boss.height };
        for (const wall of RoomSystem.currentRoom.walls) {
            if (Collision.rectangles(bossRect, wall)) {
                boss.x -= (dx / distance) * boss.speed * 2;
                boss.y -= (dy / distance) * boss.speed * 2;
            }
        }
        
        // Kollision mit Player
        const playerRect = { x: Player.x, y: Player.y, width: Player.width, height: Player.height };
        if (Collision.rectangles(bossRect, playerRect)) {
            gameState.takeDamage(10); // Boss macht mehr Schaden
        }
    },
    
    /**
     * Draw-Phase
     */
    draw() {
        // Canvas löschen
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // TextAlign zurücksetzen
        this.ctx.textAlign = "left";
        
        if (gameState.gameStatus === "playing") {
            // Raum zeichnen
            this.drawRoom();
            
            // Player zeichnen
            Player.draw(this.ctx);
            
            // Items zeichnen
            ItemSystem.draw(this.ctx);
            
            // Gegner zeichnen
            EnemySystem.draw(this.ctx);
            
            // Boss zeichnen (falls vorhanden)
            const room = RoomSystem.currentRoom;
            if (room.boss && room.boss.hp > 0) {
                this.drawBoss(room.boss);
            }
            
            // UI zeichnen
            UI.draw(this.ctx);
        } else if (gameState.gameStatus === "run_complete") {
            // Run Completed Screen
            this.drawRunCompleted();
        } else if (gameState.gameStatus === "game_over") {
            // Game Over Screen
            this.drawGameOver();
        }
    },
    
    /**
     * Zeichnet den aktuellen Raum
     */
    drawRoom() {
        const room = RoomSystem.currentRoom;
        
        // Raum-Wände
        this.ctx.fillStyle = "#333333";
        for (const wall of room.walls) {
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }
        
        // Raum-Typ anzeigen
        const roomTypeText = room.type === "start" ? "START" : 
                           room.type === "key" ? "KEY ROOM" :
                           room.type === "boss" ? "BOSS ROOM" : "NORMAL";
        
        let color = "#FFFFFF";
        if (room.type === "key") color = "#FFD700";
        if (room.type === "boss") color = "#FF0000";
        
        this.ctx.fillStyle = color;
        this.ctx.font = "14px Arial";
        this.ctx.fillText(roomTypeText, 20, ROOM_HEIGHT - 20);
        
        // Türen zeichnen
        const doors = RoomSystem.getDoorsForRoom(room);
        this.ctx.fillStyle = "#FFD700";
        for (const door of doors) {
            this.ctx.fillRect(door.x, door.y, door.width, door.height);
        }
    },
    
    /**
     * Zeichnet den Boss
     */
    drawBoss(boss) {
        if (boss.hp <= 0) return;
        
        // Boss-Körper (größer und in dunkelrot)
        this.ctx.fillStyle = "#8B0000";
        this.ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        
        // Boss-Border
        this.ctx.strokeStyle = "#FF0000";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(boss.x, boss.y, boss.width, boss.height);
        
        // Boss-HP-Bar
        const barWidth = boss.width;
        const barHeight = 8;
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(boss.x, boss.y - 15, barWidth, barHeight);
        
        this.ctx.fillStyle = "#FF0000";
        const hpPercent = boss.hp / boss.maxHp;
        this.ctx.fillRect(boss.x, boss.y - 15, barWidth * hpPercent, barHeight);
    },
    
    /**
     * Zeichnet den Run Completed Screen
     */
    drawRunCompleted() {
        // Schwarzer Hintergrund mit Alpha
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Text
        this.ctx.fillStyle = "#FFD700";
        this.ctx.font = "bold 60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("✨ RUN COMPLETED! ✨", this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.font = "28px Arial";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText("Boss wurde besiegt!", this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = "#AAAAAA";
        this.ctx.fillText("Gratuliere zum Sieg!", this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        this.ctx.fillText("F5 zum Neustarten", this.canvas.width / 2, this.canvas.height / 2 + 100);
        
        this.ctx.textAlign = "left";
    },
    
    /**
     * Zeichnet den Game Over Screen
     */
    drawGameOver() {
        // Schwarzer Hintergrund mit Alpha
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Text
        this.ctx.fillStyle = "#FF0000";
        this.ctx.font = "bold 60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("💀 GAME OVER 💀", this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.font = "28px Arial";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText("Du wurdest besiegt!", this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = "#AAAAAA";
        this.ctx.fillText("HP erreichte 0", this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        this.ctx.fillText("F5 zum Neustarten", this.canvas.width / 2, this.canvas.height / 2 + 100);
        
        this.ctx.textAlign = "left";
    }
};

// Spiel starten wenn DOM fertig ist
window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
