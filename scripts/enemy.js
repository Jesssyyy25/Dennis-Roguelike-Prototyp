/**
 * Enemy-Modul - Gegner-KI und Verwaltung
 */

const EnemySystem = {
    enemies: [],
    
    /**
     * Updated alle Gegner im aktuellen Raum
     */
    update() {
        const enemies = RoomSystem.currentRoom.enemies || [];
        
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.hp > 0) {
                this.updateEnemy(enemy);
            } else {
                // Gegner ist tot - entfernen
                enemies.splice(i, 1);
            }
        }
    },
    
    /**
     * Updated einen einzelnen Gegner
     */
    updateEnemy(enemy) {
        if (enemy.hp <= 0) return; // Gegner ist tot
        
        // Berechne Richtung zum Player
        const dx = Player.x - enemy.x;
        const dy = Player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Normalisieren und mit Speed multiplizieren
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }
        
        // Kollisionsprüfung mit Wänden
        const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height };
        for (const wall of RoomSystem.currentRoom.walls) {
            if (Collision.rectangles(enemyRect, wall)) {
                // Einfache Collision-Response: Zurück pushen
                enemy.x -= (dx / distance) * enemy.speed * 2;
                enemy.y -= (dy / distance) * enemy.speed * 2;
            }
        }
        
        // Kollision mit Player prüfen
        const playerRect = { x: Player.x, y: Player.y, width: Player.width, height: Player.height };
        if (Collision.rectangles(enemyRect, playerRect)) {
            gameState.takeDamage(5); // Player nimmt Schaden
        }
    },
    
    /**
     * Zeichnet alle Gegner
     */
    draw(ctx) {
        const enemies = RoomSystem.currentRoom.enemies || [];
        
        for (const enemy of enemies) {
            if (enemy.hp > 0) {
                // Gegner-Körper
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // HP-Bar
                const barWidth = enemy.width;
                const barHeight = 5;
                ctx.fillStyle = "#333333";
                ctx.fillRect(enemy.x, enemy.y - 10, barWidth, barHeight);
                
                ctx.fillStyle = "#00FF00";
                const hpPercent = enemy.hp / enemy.maxHp;
                ctx.fillRect(enemy.x, enemy.y - 10, barWidth * hpPercent, barHeight);
            }
        }
    }
};

window.EnemySystem = EnemySystem;
