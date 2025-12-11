# Dennis Roguelike Prototyp

Ein Browser-basiertes Roguelike-Spiel, entwickelt mit reinem HTML5, CSS3 und JavaScript.

## 🎮 Wie man spielt

### Steuerung
- **WASD**: Bewegung (oben, links, unten, rechts)
- **LEERTASTE**: Schießen
- **Türen**: Gehen Sie auf goldene Türen zu um Räume zu wechseln

### Spielziel
1. Erkunden Sie die 4×4 Raum-Grid
2. Finden Sie den **Key-Room** und sammeln Sie den Schlüssel auf
3. Navigieren Sie zum **Boss-Room** (nur erreichbar mit Schlüssel!)
4. Besiegen Sie den Boss und gewinnen Sie!

## 📂 Projektstruktur

```
Dennis-Roguelike-Prototyp/
├── index.html           # Hauptdatei
├── style.css            # Styling
├── scripts/
│   ├── state.js         # Globaler Game-State
│   ├── collision.js     # Kollisions-Erkennung
│   ├── rooms.js         # Raum-System (4×4 Grid)
│   ├── player.js        # Spieler-Steuerung
│   ├── enemy.js         # Gegner-KI
│   ├── items.js         # Item-System
│   ├── ui.js            # Benutzeroberfläche
│   └── game.js          # Hauptspiel-Loop
├── assets/              # Für zukünftige Assets
└── README.md            # Diese Datei
```

## 🎮 Game Features

### Raumsystem
- **4×4 Raum-Grid** mit zufälligen Special-Räumen
- **Start-Room**: Beginnend (oben links)
- **Key-Room**: Enthält einen wichtigen Schlüssel
- **Boss-Room**: Der Boss ist verschlossen, bis man den Key hat

### Spielmechaniken
- **Bewegung**: WASD oder Pfeiltasten (WASD)
- **Schießen**: Leertaste - schießt auf nähere Gegner/Boss
- **Gegner**: Laufen auf den Spieler zu (einfaches Pathfinding)
- **Boss**: Stärker und mehr HP als normale Gegner
- **Items**: Key zum Entsperren des Boss-Raums
- **HP-System**: Gegner machen Schaden, Boss macht mehr Schaden

### UI-Elemente
- **HP-Bar** (oben links): Zeigt Spieler-Gesundheit
- **Key-Status** (oben rechts): Zeigt ob Key gesammelt wurde
- **Ammo-Anzeige** (unten rechts): Munition für Schießen
- **Room-Info** (oben Mitte): Aktuelle Raum-Koordinaten
- **Popup-Meldungen**: Wichtige Events ("Key gefunden!", "Boss-Raum geöffnet!")

## 🚀 Server starten

Der Server läuft bereits auf `http://localhost:8000`

Zum manuellen Starten (falls nötig):
```bash
# Mit Python
python -m http.server 8000

# Oder mit Node.js
npx http-server
```

Dann öffne: `http://localhost:8000`

## 💻 Technologie

- **HTML5 Canvas**: Für 2D-Rendering
- **Vanilla JavaScript**: Keine externen Libraries
- **Modular Design**: Jedes System ist ein separates Modul
- **Event-basiert**: Keyboard-Eingaben via Event-Listener

## 🔧 Code-Architektur

Das Spiel folgt einem modularen Design mit folgenden Komponenten:

1. **state.js** - Verwaltung des globalen Spielzustands
2. **collision.js** - AABB-Kollisions-Erkennung
3. **rooms.js** - Raum-Management und Dungeon-Grid
4. **player.js** - Spieler-Objekt und -Steuerung
5. **enemy.js** - Gegner-Update und -Rendering
6. **items.js** - Item-System
7. **ui.js** - HUD und Popup-Meldungen
8. **game.js** - Hauptspiel-Loop (update + draw)

## 📊 Game Loop

```
1. update() - Logik aktualisieren
   - Player Input verarbeiten
   - Gegner bewegen
   - Projektile bewegen
   - Kollisionen prüfen
   
2. draw() - Alles rendern
   - Canvas löschen
   - Raum zeichnen
   - Objekte zeichnen
   - UI zeichnen
```

## 🎯 Spielablauf

1. Spiel startet im **Start-Room (0,0)**
2. Player erkundet Räume via WASD + Türen-Navigation
3. Ein zufälliger Raum ist der **Key-Room** (markiert)
4. Ein anderer zufälliger Raum ist der **Boss-Room** (rot)
5. **Boss-Room ist gesperrt** bis Key vorhanden
6. Nach Key-Aufnahme → Nachricht "🔑 KEY GEFUNDEN!"
7. Betreten von Boss-Room → Nachricht "⚔️ BOSSRAUM GEÖFFNET!"
8. Boss besiegen (schießen mit Leertaste)
9. Screen: "✨ RUN COMPLETED! ✨"

## 🔮 Mögliche Erweiterungen

- Verschiedene Enemy-Typen
- Power-ups und Waffen
- Besseres Gegner-Pathfinding (A*)
- Sound-Effekte
- Verschiedene Levels/Schwierigkeitsgrade
- Inventar-System
- Story/Dialogue-Elemente

## 📝 Lizenz

Dieses Projekt ist offen für Erweiterung und Modifikation.

---

**Viel Spaß beim Spielen!** 🎮✨
