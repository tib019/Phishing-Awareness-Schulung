const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Laden der Umgebungsvariablen aus der .env-Datei.
const envPath = path.join(__dirname, '.env');
const dotenvResult = require('dotenv').config({ path: envPath });

if (dotenvResult.error) {
  console.error('❌ Fehler beim Laden der .env-Datei:', dotenvResult.error);
} else {
  console.log('✅ .env-Datei erfolgreich geladen.');
}

const app = express();
const PORT = process.env.PORT || 3000;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SERVICE = process.env.SMTP_SERVICE || 'gmail';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

console.log('=== Phishing-Awareness Server gestartet ===');
console.log('🌐 URL:', `http://localhost:${PORT}`);
console.log('📁 Verzeichnis:', __dirname);

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtmlExists = fs.existsSync(indexHtmlPath);
console.log('🔍 Prüfe index.html bei:', indexHtmlPath);
if (indexHtmlExists) {
  console.log('✅ index.html gefunden');
} else {
  console.error('❌ index.html nicht gefunden!');
}

console.log('📧 SMTP_SERVICE:', SMTP_SERVICE || 'nicht konfiguriert');
console.log('📧 SMTP_USER:', SMTP_USER || 'nicht konfiguriert');
console.log('🔑 SMTP_PASS:', SMTP_PASS ? '******' : 'nicht konfiguriert');
console.log('=====================================');

let transporter;
if (SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
  console.log('✅ SMTP-Konfiguration erfolgreich.');
} else {
  console.warn('⚠️ SMTP-Konfiguration unvollständig. Verwende Mock-Modus für E-Mail-Versand.');
}

// Funktion zum Abrufen des E-Mail-Inhalts basierend auf dem Szenario
function getEmailContent(scenario, recipientEmail) {
    const phishingLink = `http://localhost:3000/phishing-link?email=${recipientEmail}&scenario=${scenario}`;

    switch (scenario) {
        case 'it-support':
            return {
                subject: 'Wichtige Sicherheitsaktualisierung erforderlich',
                html: `
                    <p>Sehr geehrte/r Mitarbeiter/in,</p>
                    <p>Dies ist eine automatische Benachrichtigung von der IT-Abteilung. Wir führen eine dringende Sicherheitsaktualisierung für alle Konten durch. Um sicherzustellen, dass Ihr Zugang nicht gesperrt wird, müssen Sie Ihr Passwort über unser neues Webportal aktualisieren.</p>
                    <p>Klicken Sie hier, um fortzufahren: <a href="platzhalterfürLink">Jetzt aktualisieren</a></p>
                    <p>Wenn Sie dies nicht innerhalb von 24 Stunden tun, kann Ihr Zugang zu internen Systemen beeinträchtigt werden.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    Ihr IT-Support-Team</p>
                `
            };
        case 'passwort-ablauf':
            return {
                subject: 'Ihr Unternehmens-Passwort läuft bald ab',
                html: `
                    <p>Sehr geehrte/r Mitarbeiter/in,</p>
                    <p>Ihr aktuelles Passwort für das Unternehmensnetzwerk läuft am Ende des heutigen Tages ab. Um eine Unterbrechung Ihrer Arbeit zu vermeiden, müssen Sie es jetzt zurücksetzen.</p>
                    <p>Bitte verwenden Sie den folgenden Link, um Ihr Passwort zu ändern: <a href="platzhalterfürLink">Passwort jetzt ändern</a></p>
                    <p>Bitte ignorieren Sie diese Nachricht nicht, da Ihr Konto nach Ablauf des Passworts gesperrt wird.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    Ihre Systemadministration</p>
                `
            };
        case 'online-bestellung':
            return {
                subject: 'Ihre Amazon-Bestellung #987654321 ist unterwegs',
                html: `
                    <p>Sehr geehrte/r Kunde/in,</p>
                    <p>Ihre kürzliche Bestellung wurde versandt und ist unterwegs. Die voraussichtliche Lieferzeit beträgt 2-3 Werktage. Bitte beachten Sie, dass für die Zustellung eine Bestätigung Ihrer Adresse erforderlich ist.</p>
                    <p>Klicken Sie auf diesen Link, um Ihre Lieferadresse zu bestätigen: <a href="platzhalterfürLink">Lieferdetails bestätigen</a></p>
                    <p>Andernfalls kann die Lieferung verzögert oder storniert werden. Vielen Dank für Ihren Einkauf.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    Ihr Amazon-Support-Team</p>
                `
            };
        case 'lieferung':
            return {
                subject: 'Ihr Paket ist zur Lieferung bereit – Aktion erforderlich',
                html: `
                    <p>Guten Tag,</p>
                    <p>Wir haben versucht, Ihr Paket zu liefern, waren aber nicht erfolgreich. Um eine erneute Zustellung zu arrangieren und eventuelle Gebühren zu zahlen, klicken Sie bitte auf den untenstehenden Link.</p>
                    <p>Klicken Sie hier: <a href="platzhalterfürLink">Lieferung planen</a></p>
                    <p>Wenn Sie nicht innerhalb von 24 Stunden reagieren, wird das Paket an den Absender zurückgeschickt.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    DHL-Zustellservice</p>
                `
            };
        case 'social-media-warnung':
            return {
                subject: 'Wichtige Sicherheitswarnung für Ihr Facebook-Konto',
                html: `
                    <p>Hallo,</p>
                    <p>Wir haben ungewöhnliche Anmeldeversuche auf Ihr Facebook-Konto von einem neuen Gerät festgestellt. Um Ihr Konto zu schützen, haben wir den Zugang vorübergehend eingeschränkt.</p>
                    <p>Um diese Einschränkung aufzuheben, müssen Sie Ihre Identität bestätigen. Klicken Sie hier, um Ihr Konto zu verifizieren: <a href="platzhalterfürLink">Jetzt verifizieren</a></p>
                    <p>Bitte tun Sie dies so schnell wie möglich, um den vollständigen Zugang zu Ihrem Konto wiederherzustellen.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    Das Facebook-Sicherheitsteam</p>
                `
            };
        case 'zahlungserinnerung':
            return {
                subject: 'Wichtige Mahnung: Zahlungserinnerung für Ihre Rechnung #2345678',
                html: `
                    <p>Sehr geehrte/r Kunde/in,</p>
                    <p>Wir schreiben Ihnen, um Sie an die ausstehende Zahlung für die Rechnung #2345678 zu erinnern. Der fällige Betrag von 49,99€ ist seit dem 01.08.2025 überfällig.</p>
                    <p>Um zusätzliche Gebühren zu vermeiden, begleichen Sie den Betrag bitte umgehend. Sie können die Zahlung über unser Online-Portal vornehmen:</p>
                    <a href="platzhalterfürLink">Zur Zahlung</a>
                    <p>Ignorieren Sie diese E-Mail, wenn die Zahlung bereits erfolgt ist. Falls nicht, bitten wir um eine schnelle Bearbeitung.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    Ihr Rechnungswesen-Team</p>
                `
            };
        case 'personalabteilung':
            return {
                subject: 'Neue Richtlinien für Homeoffice-Abrechnung',
                html: `
                    <p>Sehr geehrte/r Mitarbeiter/in,</p>
                    <p>Die Personalabteilung hat neue Richtlinien für die Abrechnung von Homeoffice-Tagen und Reisekosten eingeführt. Alle Mitarbeiter müssen das neue Formular ausfüllen, um sicherzustellen, dass die Abrechnungen korrekt sind.</p>
                    <p>Bitte klicken Sie auf den Link, um das Formular herunterzuladen und auszufüllen: <a href="platzhalterfürLink">Formular herunterladen</a></p>
                    <p>Die Frist für die Einreichung ist der 15. August 2025.</p>
                    <p>Mit freundlichen Grüßen,<br>
                    Ihre Personalabteilung</p>
                `
            };
        default:
            return {
                subject: `Phishing-Test: ${campaignName}`,
                html: `<p>Hallo,</p><p>dies ist eine Test-Phishing-E-Mail für das Szenario: ${scenario}.</p>`,
            };
    }
}

// Route für die API zum Senden von E-Mails
app.post('/api/send-phishing-email', async (req, res) => {
  const { recipients, scenario, campaignName } = req.body;
  console.log('API-Anfrage erhalten:', req.body);

  if (!recipients || !recipients.length || !scenario || !campaignName) {
    return res.status(400).send('Fehlende erforderliche Daten: Empfänger, Szenario oder Kampagnenname');
  }

  const sendEmail = (to) => {
    const emailContent = getEmailContent(scenario, to);
    const mailOptions = {
      from: SMTP_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    if (transporter) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`❌ Fehler beim Senden der E-Mail an ${to}:`, error);
        } else {
          console.log(`✅ E-Mail erfolgreich gesendet an ${to}:`, info.response);
        }
      });
    } else {
      console.log(`🧪 Mock-Modus: E-Mail für Szenario '${scenario}' an ${to} gesendet.`);
    }
  };

  recipients.forEach(sendEmail);

  res.status(200).send('E-Mail-Anfragen verarbeitet. Prüfe die Konsole für den Status.');
});

// Route zum Servieren der index.html
app.get('/', (req, res) => {
  res.sendFile(indexHtmlPath);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log('Öffnen Sie http://localhost:3000 im Browser');
});