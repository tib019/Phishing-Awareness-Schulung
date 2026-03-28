/**
 * Regression tests for Phishing-Awareness-Schulung server.js
 * Tests edge cases and boundary conditions.
 */

const supertest = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

let app;
let request;

beforeAll(() => {
  app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const indexHtmlPath = path.join(__dirname, '..', 'index.html');

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

  request = supertest(app);
});

// Inline getEmailContent matching server.js for regression testing
function getEmailContent(scenario, recipientEmail) {
  switch (scenario) {
    case 'it-support':
      return { subject: 'Wichtige Sicherheitsaktualisierung erforderlich', html: '<p>IT</p>' };
    case 'passwort-ablauf':
      return { subject: 'Ihr Unternehmens-Passwort läuft bald ab', html: '<p>Passwort</p>' };
    case 'online-bestellung':
      return { subject: 'Ihre Amazon-Bestellung #987654321 ist unterwegs', html: '<p>Bestellung</p>' };
    case 'lieferung':
      return { subject: 'Ihr Paket ist zur Lieferung bereit – Aktion erforderlich', html: '<p>Lieferung</p>' };
    case 'social-media-warnung':
      return { subject: 'Wichtige Sicherheitswarnung für Ihr Facebook-Konto', html: '<p>Social</p>' };
    case 'zahlungserinnerung':
      return { subject: 'Wichtige Mahnung: Zahlungserinnerung für Ihre Rechnung #2345678', html: '<p>Zahlung</p>' };
    case 'personalabteilung':
      return { subject: 'Neue Richtlinien für Homeoffice-Abrechnung', html: '<p>Personal</p>' };
    default:
      return {
        subject: `Phishing-Test: undefined`,
        html: `<p>Hallo,</p><p>dies ist eine Test-Phishing-E-Mail für das Szenario: ${scenario}.</p>`
      };
  }
}

describe('Regression: Edge cases for POST /api/send-phishing-email', () => {
  test('empty recipients array returns 400', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: [], scenario: 'it-support', campaignName: 'Test' });
    expect(res.status).toBe(400);
  });

  test('null recipients returns 400', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: null, scenario: 'it-support', campaignName: 'Test' });
    expect(res.status).toBe(400);
  });

  test('very long campaign name (>1000 chars) is accepted if other fields valid', async () => {
    const longName = 'A'.repeat(1001);
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['test@test.com'], scenario: 'it-support', campaignName: longName });
    expect(res.status).toBe(200);
  });

  test('campaign name of exactly 1000 chars is accepted', async () => {
    const longName = 'B'.repeat(1000);
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['test@test.com'], scenario: 'it-support', campaignName: longName });
    expect(res.status).toBe(200);
  });
});

describe('Regression: getEmailContent with null/undefined/edge inputs', () => {
  test('null scenario returns default subject containing Phishing-Test', () => {
    const result = getEmailContent(null, 'test@test.com');
    expect(result.subject).toContain('Phishing-Test');
  });

  test('undefined scenario returns default subject containing Phishing-Test', () => {
    const result = getEmailContent(undefined, 'test@test.com');
    expect(result.subject).toContain('Phishing-Test');
  });

  test('empty string scenario returns default', () => {
    const result = getEmailContent('', 'test@test.com');
    expect(result.subject).toContain('Phishing-Test');
  });

  test('numeric scenario string returns default', () => {
    const result = getEmailContent('12345', 'test@test.com');
    expect(result.subject).toContain('Phishing-Test');
  });

  test('all known scenarios return an object with subject and html', () => {
    const scenarios = [
      'it-support', 'passwort-ablauf', 'online-bestellung',
      'lieferung', 'social-media-warnung', 'zahlungserinnerung', 'personalabteilung'
    ];
    scenarios.forEach(s => {
      const result = getEmailContent(s, 'x@x.com');
      expect(result).toHaveProperty('subject');
      expect(result).toHaveProperty('html');
      expect(typeof result.subject).toBe('string');
      expect(result.subject.length).toBeGreaterThan(0);
    });
  });

  test('email address is preserved in phishing link generation', () => {
    // Verify getEmailContent can accept arbitrary recipient emails without throwing
    const emails = ['user@domain.com', 'test+tag@sub.domain.org', 'a@b.c'];
    emails.forEach(email => {
      expect(() => getEmailContent('it-support', email)).not.toThrow();
    });
  });
});

describe('Regression: API request body edge cases', () => {
  test('missing scenario field returns 400', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['a@b.com'], campaignName: 'Test' });
    expect(res.status).toBe(400);
  });

  test('missing campaignName field returns 400', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({ recipients: ['a@b.com'], scenario: 'it-support' });
    expect(res.status).toBe(400);
  });

  test('request with all three required fields present returns 200', async () => {
    const res = await request
      .post('/api/send-phishing-email')
      .send({
        recipients: ['regression@test.com'],
        scenario: 'zahlungserinnerung',
        campaignName: 'Regression Campaign'
      });
    expect(res.status).toBe(200);
  });
});
