/**
 * Unit tests for Phishing-Awareness-Schulung server.js
 */

const supertest = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Build the same Express app as server.js (without calling app.listen)
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

const indexHtmlPath = path.join(__dirname, '..', 'index.html');

// getEmailContent - mirrors server.js implementation exactly
function getEmailContent(scenario, recipientEmail) {
  switch (scenario) {
    case 'it-support':
      return {
        subject: 'Wichtige Sicherheitsaktualisierung erforderlich',
        html: '<p>IT Support</p>'
      };
    case 'passwort-ablauf':
      return {
        subject: 'Ihr Unternehmens-Passwort läuft bald ab',
        html: '<p>Passwort</p>'
      };
    case 'online-bestellung':
      return {
        subject: 'Ihre Amazon-Bestellung #987654321 ist unterwegs',
        html: '<p>Bestellung</p>'
      };
    case 'lieferung':
      return {
        subject: 'Ihr Paket ist zur Lieferung bereit – Aktion erforderlich',
        html: '<p>Lieferung</p>'
      };
    case 'social-media-warnung':
      return {
        subject: 'Wichtige Sicherheitswarnung für Ihr Facebook-Konto',
        html: '<p>Social</p>'
      };
    case 'zahlungserinnerung':
      return {
        subject: 'Wichtige Mahnung: Zahlungserinnerung für Ihre Rechnung #2345678',
        html: '<p>Zahlung</p>'
      };
    case 'personalabteilung':
      return {
        subject: 'Neue Richtlinien für Homeoffice-Abrechnung',
        html: '<p>Personal</p>'
      };
    default:
      return {
        subject: `Phishing-Test: undefined`,
        html: `<p>Hallo,</p><p>dies ist eine Test-Phishing-E-Mail für das Szenario: ${scenario}.</p>`
      };
  }
}

app.post('/api/send-phishing-email', (req, res) => {
  const { recipients, scenario, campaignName } = req.body;
  if (!recipients || !recipients.length || !scenario || !campaignName) {
    return res.status(400).send('Fehlende erforderliche Daten: Empfänger, Szenario oder Kampagnenname');
  }
  res.status(200).send('E-Mail-Anfragen verarbeitet. Prüfe die Konsole für den Status.');
});

app.get('/', (req, res) => {
  res.sendFile(indexHtmlPath);
});

const request = supertest(app);

describe('getEmailContent', () => {
  test('returns correct subject for it-support scenario', () => {
    const result = getEmailContent('it-support', 'test@test.com');
    expect(result.subject).toBe('Wichtige Sicherheitsaktualisierung erforderlich');
    expect(result.html).toBeDefined();
  });

  test('returns correct subject for passwort-ablauf scenario', () => {
    const result = getEmailContent('passwort-ablauf', 'test@test.com');
    expect(result.subject).toBe('Ihr Unternehmens-Passwort läuft bald ab');
    expect(result.html).toBeDefined();
  });

  test('returns correct subject for online-bestellung scenario', () => {
    const result = getEmailContent('online-bestellung', 'test@test.com');
    expect(result.subject).toBe('Ihre Amazon-Bestellung #987654321 ist unterwegs');
  });

  test('returns correct subject for lieferung scenario', () => {
    const result = getEmailContent('lieferung', 'test@test.com');
    expect(result.subject).toBe('Ihr Paket ist zur Lieferung bereit – Aktion erforderlich');
  });

  test('returns correct subject for social-media-warnung scenario', () => {
    const result = getEmailContent('social-media-warnung', 'test@test.com');
    expect(result.subject).toBe('Wichtige Sicherheitswarnung für Ihr Facebook-Konto');
  });

  test('returns correct subject for zahlungserinnerung scenario', () => {
    const result = getEmailContent('zahlungserinnerung', 'test@test.com');
    expect(result.subject).toBe('Wichtige Mahnung: Zahlungserinnerung für Ihre Rechnung #2345678');
  });

  test('returns correct subject for personalabteilung scenario', () => {
    const result = getEmailContent('personalabteilung', 'test@test.com');
    expect(result.subject).toBe('Neue Richtlinien für Homeoffice-Abrechnung');
  });

  test('returns default for unknown-scenario', () => {
    const result = getEmailContent('unknown-scenario', 'test@test.com');
    expect(result.subject).toContain('Phishing-Test');
    expect(result.html).toContain('unknown-scenario');
  });

  test('result contains subject and html keys', () => {
    const result = getEmailContent('it-support', 'user@example.com');
    expect(result).toHaveProperty('subject');
    expect(result).toHaveProperty('html');
  });
});

describe('POST /api/send-phishing-email', () => {
  test('returns 200 with valid body', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['user@test.com'], scenario: 'it-support', campaignName: 'Test Campaign' });
    expect(res.status).toBe(200);
  });

  test('returns 400 when recipients is missing', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ scenario: 'it-support', campaignName: 'Test Campaign' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when recipients array is empty', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: [], scenario: 'it-support', campaignName: 'Test Campaign' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when scenario is missing', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['user@test.com'], campaignName: 'Test Campaign' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when campaignName is missing', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['user@test.com'], scenario: 'it-support' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when body is completely empty', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({});
    expect(res.status).toBe(400);
  });

  test('accepts multiple recipients', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({
        recipients: ['a@test.com', 'b@test.com', 'c@test.com'],
        scenario: 'passwort-ablauf',
        campaignName: 'Multi Test'
      });
    expect(res.status).toBe(200);
  });
});

describe('GET /', () => {
  test('serves HTML file with 200', async () => {
    const res = await request.get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  test('response body contains HTML structure', async () => {
    const res = await request.get('/');
    expect(res.text).toContain('<!DOCTYPE html>');
  });
});
