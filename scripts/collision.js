/**
 * Collision-Modul - Behandlung von Kollisionen
 */

const Collision = {
    /**
     * Rechteck-Kollisions-Check (AABB - Axis-Aligned Bounding Box)
     * @param {Object} rect1 - Objekt mit x, y, width, height
     * @param {Object} rect2 - Objekt mit x, y, width, height
     * @returns {boolean}
     */
    rectangles(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    /**
     * Punkt-in-Rechteck Check
     * @param {number} px - Punkt X
     * @param {number} py - Punkt Y
     * @param {Object} rect - Objekt mit x, y, width, height
     * @returns {boolean}
     */
    pointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.width &&
               py >= rect.y && py <= rect.y + rect.height;
    },
    
    /**
     * Distanz zwischen zwei Punkten
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number}
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
};

window.Collision = Collision;
