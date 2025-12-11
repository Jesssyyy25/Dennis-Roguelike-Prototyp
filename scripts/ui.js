/**
 * UI-Modul - Benutzeroberfläche und HUD
 */

const UI = {
    messages: [], // Popup-Meldungen
    messageLifetime: 180, // Frames
    
    /**
     * Registriert eine neue Nachricht
     */
    addMessage(text) {
        this.messages.push({
            text,
            timer: this.messageLifetime
        });
        console.log(`📢 ${text}`);
    },
    
    /**
     * Updated UI-Elemente
     */
    update() {
        // Meldungs-Timer updaten
        for (let i = this.messages.length - 1; i >= 0; i--) {
            this.messages[i].timer--;
            if (this.messages[i].timer <= 0) {
                this.messages.splice(i, 1);
            }
        }
    },
    
    /**
     * Zeichnet alle UI-Elemente
     */
    draw(ctx) {
        const padding = 20;
        const fontSize = 16;
        
        // HP-Bar (oben links)
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`HP: ${gameState.playerHP}/${gameState.maxHP}`, padding, padding + fontSize);
        
        // HP-Bar Grafik
        const barWidth = 200;
        const barHeight = 20;
        ctx.fillStyle = "#333333";
        ctx.fillRect(padding, padding + fontSize + 10, barWidth, barHeight);
        
        ctx.fillStyle = gameState.playerHP > 50 ? "#00FF00" : gameState.playerHP > 25 ? "#FFFF00" : "#FF0000";
        const hpPercent = gameState.playerHP / gameState.maxHP;
        ctx.fillRect(padding, padding + fontSize + 10, barWidth * hpPercent, barHeight);
        
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.strokeRect(padding, padding + fontSize + 10, barWidth, barHeight);
        
        // Key-Status (oben rechts)
        const keyText = gameState.hasKey ? "🔑 KEY COLLECTED" : "🔑 No Key";
        const keyColor = gameState.hasKey ? "#FFD700" : "#666666";
        ctx.fillStyle = keyColor;
        const keyWidth = ctx.measureText(keyText).width;
        ctx.fillText(keyText, ROOM_WIDTH - keyWidth - padding, padding + fontSize);
        
        // Ammo-Anzeige (unten rechts)
        const ammoText = `Ammo: ${gameState.ammo}`;
        ctx.fillStyle = "#FFFFFF";
        const ammoWidth = ctx.measureText(ammoText).width;
        ctx.fillText(ammoText, ROOM_WIDTH - ammoWidth - padding, ROOM_HEIGHT - padding);
        
        // Room-Info (oben Mitte)
        const roomText = `Room: (${gameState.currentRoom.x}, ${gameState.currentRoom.y})`;
        ctx.fillStyle = "#AAAAAA";
        const roomWidth = ctx.measureText(roomText).width;
        ctx.fillText(roomText, ROOM_WIDTH / 2 - roomWidth / 2, padding + fontSize);
        
        // Kontrol-Tipps (unten links)
        ctx.font = "12px Arial";
        ctx.fillStyle = "#AAAAAA";
        ctx.fillText("WASD: Move  SPACE: Shoot", padding, ROOM_HEIGHT - padding);
        
        // Popup-Meldungen (Mitte)
        this.drawMessages(ctx);
    },
    
    /**
     * Zeichnet Popup-Meldungen
     */
    drawMessages(ctx) {
        const startY = 150;
        const lineHeight = 40;
        const padding = 10;
        const fontSize = 18;
        
        ctx.font = `bold ${fontSize}px Arial`;
        
        for (let i = 0; i < this.messages.length; i++) {
            const msg = this.messages[i];
            const alpha = Math.min(1, msg.timer / 60); // Fade-out
            
            // Hintergrund
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
            const textWidth = ctx.measureText(msg.text).width;
            ctx.fillRect(
                ROOM_WIDTH / 2 - textWidth / 2 - padding,
                startY + i * lineHeight - fontSize / 2,
                textWidth + padding * 2,
                fontSize + padding
            );
            
            // Text
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.fillText(msg.text, ROOM_WIDTH / 2 - textWidth / 2, startY + i * lineHeight);
        }
    }
};

window.UI = UI;
