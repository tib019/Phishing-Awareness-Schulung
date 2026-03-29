# Phishing-Awareness-Schulung

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

Interaktives Security-Awareness-Tool zur Sensibilisierung von Mitarbeitenden für Phishing-Angriffe. Entwickelt im Rahmen der Security-Initiative der **Argo Aviation GmbH**.

> Hinweis: Dieses Tool dient ausschliesslich zu Schulungs- und Sensibilisierungszwecken.

---

## Beschreibung

Die Anwendung simuliert realistische Phishing-Szenarien und vermittelt praxisnah, wie man Phishing-Angriffe erkennt und korrekt darauf reagiert. Nach Abschluss der Schulung können Teilnehmende:

- Phishing-E-Mails anhand typischer Merkmale erkennen
- Verdächtige Links und Absenderadressen analysieren
- Richtig auf Phishing-Versuche reagieren (melden, nicht klicken)
- Interne Sicherheitsrichtlinien korrekt anwenden

---

## Features

- Interaktive Szenarien mit realistischen Phishing-Simulationen
- Strukturierte Lernmodule zu verschiedenen Phishing-Typen
- Sofortiges Feedback bei richtigen und falschen Entscheidungen
- E-Mail-Simulation via Nodemailer

---

## Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express |
| E-Mail | Nodemailer (v8+) |
| Laufzeit | Node.js |

---

## Projektstruktur

```
Phishing-Awareness-Schulung/
  index.html      # Hauptseite der Schulung
  server.js       # Express-Backend
  package.json    # Node.js-Abhängigkeiten
  tests/          # Testdateien
```

---

## Installation & Setup

```bash
git clone https://github.com/tib019/Phishing-Awareness-Schulung.git
cd Phishing-Awareness-Schulung

npm install

node server.js
```

Die Schulung ist anschliessend unter `http://localhost:3000` erreichbar.

---

## Tests

```bash
npm test
```

Tests befinden sich im `tests/`-Ordner:
- `server.test.js` - Tests für das Express-Backend
- `server.regression.test.js` - Regressionstests

---

## Lizenz

Dieses Projekt ist für Schulungs- und Demonstrationszwecke erstellt.

---

## Autor

**Tobias Buss**
- GitHub: [@tib019](https://github.com/tib019)
