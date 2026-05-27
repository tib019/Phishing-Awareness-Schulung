# ADR-001: Single-Page HTML-Anwendung für die Schulung

**Status:** Accepted  
**Datum:** 2025

## Kontext
Die Phishing-Awareness-Schulung soll einfach zu verteilen und ohne Installation ausführbar sein.

## Entscheidung
Single-Page HTML-Anwendung (`index.html`) mit eingebettetem CSS und JavaScript, serviert über Node.js Express-Server (`server.js`).

## Abgewogene Alternativen
- **React SPA:** Überdimensioniert für Schulungsinhalte, höherer Build-Aufwand
- **PDF-Schulungsunterlagen:** Kein interaktives Quiz möglich
- **E-Learning-Plattform (Moodle etc.):** Zu viel Infrastruktur

## Konsequenzen
**Positiv:**
- Minimal Dependencies, sofort im Browser lauffähig
- Einfache Verteilung (einzelne HTML-Datei + Server)
- Interaktive Quiz-Elemente möglich

**Negativ:**
- Keine Nutzer-Persistenz (kein Login, kein Fortschrittstracking über Sessions)
- Wartung von großem monolithischem HTML kann schwierig werden
