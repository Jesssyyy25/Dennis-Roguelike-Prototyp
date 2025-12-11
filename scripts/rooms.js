/**
 * Rooms-Modul - Verwaltung des Raum-Systems (4x4 Grid)
 */

const ROOM_WIDTH = 800;
const ROOM_HEIGHT = 600;
const GRID_SIZE = 4;
const TILE_WIDTH = ROOM_WIDTH / 4;
const TILE_HEIGHT = ROOM_HEIGHT / 4;

const RoomSystem = {
    rooms: {},
    currentRoom: null,
    
    /**
     * Initialisiert das 4x4 Grid Raum-System
     */
    init() {
        this.rooms = {};
        
        // Erstelle 4x4 Grid und wähle zufällig special rooms
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const key = `${x},${y}`;
                this.rooms[key] = {
                    x, y,
                    type: "normal", // normal, start, key, boss
                    visited: false,
                    enemies: [],
                    items: [],
                    walls: this.generateWalls(x, y)
                };
            }
        }
        
        // Start-Room (oben links)
        this.rooms["0,0"].type = "start";
        this.rooms["0,0"].visited = true;
        
        // Key-Room (zufällig, nicht am Start)
        let keyX, keyY;
        do {
            keyX = Math.floor(Math.random() * GRID_SIZE);
            keyY = Math.floor(Math.random() * GRID_SIZE);
        } while (keyX === 0 && keyY === 0);
        this.rooms[`${keyX},${keyY}`].type = "key";
        
        // Boss-Room (zufällig, nicht Start oder Key)
        let bossX, bossY;
        do {
            bossX = Math.floor(Math.random() * GRID_SIZE);
            bossY = Math.floor(Math.random() * GRID_SIZE);
        } while ((bossX === 0 && bossY === 0) || (bossX === keyX && bossY === keyY));
        this.rooms[`${bossX},${bossY}`].type = "boss";
        
        // Spawne Gegner und Items
        this.spawnEnemiesAndItems();
        
        // Setze aktuelle Room
        this.currentRoom = this.rooms["0,0"];
        
        console.log("🏰 Room-System initialisiert!");
        console.log("📍 Start Room: (0,0)");
        console.log(`🔑 Key Room: (${keyX},${keyY})`);
        console.log(`👹 Boss Room: (${bossX},${bossY})`);
    },
    
    /**
     * Generiert Wände basierend auf Nachbarn
     */
    generateWalls(x, y) {
        const walls = [];
        const WALL_THICKNESS = 20;
        
        // Oben
        if (y === 0) {
            walls.push({ x: 0, y: 0, width: ROOM_WIDTH, height: WALL_THICKNESS });
        }
        // Unten
        if (y === GRID_SIZE - 1) {
            walls.push({ x: 0, y: ROOM_HEIGHT - WALL_THICKNESS, width: ROOM_WIDTH, height: WALL_THICKNESS });
        }
        // Links
        if (x === 0) {
            walls.push({ x: 0, y: 0, width: WALL_THICKNESS, height: ROOM_HEIGHT });
        }
        // Rechts
        if (x === GRID_SIZE - 1) {
            walls.push({ x: ROOM_WIDTH - WALL_THICKNESS, y: 0, width: WALL_THICKNESS, height: ROOM_HEIGHT });
        }
        
        return walls;
    },
    
    /**
     * Spawnt Gegner und Items in Räumen
     */
    spawnEnemiesAndItems() {
        for (const key in this.rooms) {
            const room = this.rooms[key];
            
            // Items spawnen
            if (room.type === "key") {
                room.items.push({
                    x: 400,
                    y: 300,
                    width: 20,
                    height: 20,
                    type: "key"
                });
            }
            
            // Gegner spawnen
            if (room.type === "normal") {
                const enemyCount = Math.floor(Math.random() * 3) + 1; // 1-3 Gegner
                for (let i = 0; i < enemyCount; i++) {
                    room.enemies.push({
                        x: Math.random() * (ROOM_WIDTH - 100) + 50,
                        y: Math.random() * (ROOM_HEIGHT - 100) + 50,
                        width: 30,
                        height: 30,
                        hp: 20,
                        maxHp: 20,
                        speed: 1.5
                    });
                }
            } else if (room.type === "boss") {
                // Boss spawnen
                room.boss = {
                    x: ROOM_WIDTH / 2 - 25,
                    y: ROOM_HEIGHT / 2 - 25,
                    width: 50,
                    height: 50,
                    hp: 100,
                    maxHp: 100,
                    speed: 2
                };
            }
        }
    },
    
    /**
     * Player betritt einen neuen Raum
     */
    enterRoom(x, y) {
        const key = `${x},${y}`;
        if (!this.rooms[key]) return false;
        
        const room = this.rooms[key];
        
        // Bossraum ohne Key blockiert
        if (room.type === "boss" && !gameState.hasKey) {
            console.log("🚪 Bossraum ist verschlossen! Du brauchst den Key.");
            UI.addMessage("🚪 Bossraum ist verschlossen!");
            return false;
        }
        
        // Nachricht wenn Bossraum betreten wird
        if (room.type === "boss" && gameState.hasKey && !room.visited) {
            UI.addMessage("⚔️ BOSSRAUM GEÖFFNET!");
        }
        
        this.currentRoom = room;
        room.visited = true;
        gameState.moveToRoom(x, y);
        
        return true;
    },
    
    /**
     * Gibt alle Türen des aktuellen Raums zurück
     */
    getDoorsForRoom(room) {
        const doors = [];
        
        // Oben
        if (room.y > 0) {
            doors.push({
                side: "top",
                x: ROOM_WIDTH / 2 - 30,
                y: 0,
                width: 60,
                height: 20,
                nextRoom: { x: room.x, y: room.y - 1 }
            });
        }
        
        // Unten
        if (room.y < GRID_SIZE - 1) {
            doors.push({
                side: "bottom",
                x: ROOM_WIDTH / 2 - 30,
                y: ROOM_HEIGHT - 20,
                width: 60,
                height: 20,
                nextRoom: { x: room.x, y: room.y + 1 }
            });
        }
        
        // Links
        if (room.x > 0) {
            doors.push({
                side: "left",
                x: 0,
                y: ROOM_HEIGHT / 2 - 30,
                width: 20,
                height: 60,
                nextRoom: { x: room.x - 1, y: room.y }
            });
        }
        
        // Rechts
        if (room.x < GRID_SIZE - 1) {
            doors.push({
                side: "right",
                x: ROOM_WIDTH - 20,
                y: ROOM_HEIGHT / 2 - 30,
                width: 20,
                height: 60,
                nextRoom: { x: room.x + 1, y: room.y }
            });
        }
        
        return doors;
    }
};

window.RoomSystem = RoomSystem;
window.ROOM_WIDTH = ROOM_WIDTH;
window.ROOM_HEIGHT = ROOM_HEIGHT;
