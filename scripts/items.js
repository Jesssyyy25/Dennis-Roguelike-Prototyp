/**
 * Items-Modul - Verwaltung von Items im Spiel
 */

const ItemSystem = {
    /**
     * Zeichnet alle Items im aktuellen Raum
     */
    draw(ctx) {
        const items = RoomSystem.currentRoom.items || [];
        
        for (const item of items) {
            if (item.type === "key") {
                // Key als goldenes Quadrat
                ctx.fillStyle = "#FFD700";
                ctx.fillRect(item.x, item.y, item.width, item.height);
                
                // Border
                ctx.strokeStyle = "#FFA500";
                ctx.lineWidth = 2;
                ctx.strokeRect(item.x, item.y, item.width, item.height);
            }
        }
    },
    
    /**
     * Prüft ob Player ein Item aufgesammelt hat
     * (Diese Logik ist im Player.js implementiert)
     */
    checkCollisions() {
        // Wird vom Player-Modul aufgerufen
    }
};

window.ItemSystem = ItemSystem;
