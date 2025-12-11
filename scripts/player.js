/**
 * Player-Modul - Spieler-Steuerung und -Verwaltung
 */

const Player = {
    x: 400,
    y: 300,
    width: 30,
    height: 30,
    speed: 3,
    maxSpeed: 3,
    
    // Bewegungs-Input
    keys: {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false
    },
    
    projectiles: [], // Kugeln des Players
    
    /**
     * Initialisiert den Player
     */
    init() {
        // Spawne Player im Start-Room
        this.x = ROOM_WIDTH / 2;
        this.y = ROOM_HEIGHT / 2;
        
        // Event Listeners für WASD
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        console.log("🎮 Player initialisiert!");
    },
    
    /**
     * Key Down Event
     */
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        if (key === 'w') this.keys.w = true;
        if (key === 'a') this.keys.a = true;
        if (key === 's') this.keys.s = true;
        if (key === 'd') this.keys.d = true;
        if (key === ' ') {
            this.keys.space = true;
            e.preventDefault();
            this.shoot();
        }
    },
    
    /**
     * Key Up Event
     */
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        if (key === 'w') this.keys.w = false;
        if (key === 'a') this.keys.a = false;
        if (key === 's') this.keys.s = false;
        if (key === 'd') this.keys.d = false;
        if (key === ' ') this.keys.space = false;
    },
    
    /**
     * Schießt eine Kugel
     */
    shoot() {
        if (gameState.ammo <= 0) return;
        
        gameState.ammo--;
        
        // Berechne Schuss-Richtung (zu Mouse oder zuletzt bewegte Richtung)
        const bullet = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2,
            width: 8,
            height: 8,
            vx: 5, // Rechts als Standard
            vy: 0,
            lifetime: 600 // 10 Sekunden
        };
        
        // Richtung: Wenn Enemy im Raum, schieße in seine Richtung
        const enemies = RoomSystem.currentRoom.enemies || [];
        if (enemies.length > 0) {
            const enemy = enemies[0];
            const dx = enemy.x - bullet.x;
            const dy = enemy.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                bullet.vx = (dx / distance) * 5;
                bullet.vy = (dy / distance) * 5;
            }
        }
        
        // Boss check
        const room = RoomSystem.currentRoom;
        if (room.boss) {
            const dx = room.boss.x - bullet.x;
            const dy = room.boss.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                bullet.vx = (dx / distance) * 5;
                bullet.vy = (dy / distance) * 5;
            }
        }
        
        this.projectiles.push(bullet);
    },
    
    /**
     * Update Logik (wird in jedem Frame aufgerufen)
     */
    update() {
        let velX = 0;
        let velY = 0;
        
        // Berechne Velocity aus Input
        if (this.keys.w) velY -= this.maxSpeed;
        if (this.keys.s) velY += this.maxSpeed;
        if (this.keys.a) velX -= this.maxSpeed;
        if (this.keys.d) velX += this.maxSpeed;
        
        // Neue Position berechnen
        const newX = this.x + velX;
        const newY = this.y + velY;
        
        // Kollisionen mit Wänden prüfen
        const playerRect = { x: newX, y: newY, width: this.width, height: this.height };
        
        let canMoveX = true;
        let canMoveY = true;
        
        for (const wall of RoomSystem.currentRoom.walls) {
            if (Collision.rectangles(playerRect, wall)) {
                canMoveX = false;
                canMoveY = false;
            }
        }
        
        // Position updaten
        if (canMoveX) this.x = newX;
        if (canMoveY) this.y = newY;
        
        // Projektile updaten
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            proj.x += proj.vx;
            proj.y += proj.vy;
            proj.lifetime--;
            
            // Projektil außerhalb oder Zeit abgelaufen
            if (proj.x < 0 || proj.x > ROOM_WIDTH || 
                proj.y < 0 || proj.y > ROOM_HEIGHT || 
                proj.lifetime <= 0) {
                this.projectiles.splice(i, 1);
                continue;
            }
            
            // Gegner treffen
            const enemies = RoomSystem.currentRoom.enemies || [];
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (Collision.rectangles(proj, enemy)) {
                    enemy.hp -= 10;
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
            
            // Boss treffen
            const room = RoomSystem.currentRoom;
            if (room.boss && Collision.rectangles(proj, room.boss)) {
                room.boss.hp -= 15;
                this.projectiles.splice(i, 1);
            }
        }
        
        // Room-Türen checken
        this.checkDoors();
        
        // Items aufsammeln
        this.checkItemPickup();
    },
    
    /**
     * Prüft ob Player durch eine Tür geht
     */
    checkDoors() {
        const doors = RoomSystem.getDoorsForRoom(RoomSystem.currentRoom);
        const playerRect = { x: this.x, y: this.y, width: this.width, height: this.height };
        
        for (const door of doors) {
            if (Collision.rectangles(playerRect, door)) {
                const nextRoom = door.nextRoom;
                if (RoomSystem.enterRoom(nextRoom.x, nextRoom.y)) {
                    // Room gewechselt - Position anpassen
                    if (door.side === "top") {
                        this.y = ROOM_HEIGHT - 50;
                    } else if (door.side === "bottom") {
                        this.y = 50;
                    } else if (door.side === "left") {
                        this.x = ROOM_WIDTH - 50;
                    } else if (door.side === "right") {
                        this.x = 50;
                    }
                }
            }
        }
    },
    
    /**
     * Prüft ob Player Items aufsammelt
     */
    checkItemPickup() {
        const playerRect = { x: this.x, y: this.y, width: this.width, height: this.height };
        
        for (let i = RoomSystem.currentRoom.items.length - 1; i >= 0; i--) {
            const item = RoomSystem.currentRoom.items[i];
            
            if (Collision.rectangles(playerRect, item)) {
                if (item.type === "key") {
                    gameState.collectKey();
                    UI.addMessage("🔑 KEY GEFUNDEN!");
                    RoomSystem.currentRoom.items.splice(i, 1);
                }
            }
        }
    },
    
    /**
     * Zeichnet den Player
     */
    draw(ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Optional: Border für Sichtbarkeit
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Projektile zeichnen
        ctx.fillStyle = "#00FF00";
        for (const proj of this.projectiles) {
            ctx.fillRect(proj.x - proj.width / 2, proj.y - proj.height / 2, proj.width, proj.height);
        }
    }
};

window.Player = Player;
