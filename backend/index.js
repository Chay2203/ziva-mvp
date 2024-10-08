const express = require('express');
const { google } = require('googleapis');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.modify']
  });
  res.redirect(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  res.redirect('http://localhost:5173/dashboard');
});

async function fetchEmailBatch(gmail, pageToken, maxResults, searchQuery) {
  let query = 'in:inbox';
  if (searchQuery) {
    const terms = searchQuery.split(' ').map(term => term.includes(':') ? term : `"${term}"`);
    query += ` (${terms.join(' OR ')})`;
  }

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: maxResults,
    q: query,
    pageToken: pageToken,
  });

  const emails = response.data.messages || [];
  const emailDetails = await Promise.all(
    emails.map(async (email) => {
      const emailData = await gmail.users.messages.get({
        userId: 'me',
        id: email.id,
        format: 'metadata',
        metadataHeaders: ['From', 'Subject', 'Date'],
      });
      return emailData.data;
    })
  );

  return {
    emails: emailDetails,
    nextPageToken: response.data.nextPageToken,
  };
}

app.get('/emails', async (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).send('Unauthorized');
  }

  oauth2Client.setCredentials(req.session.tokens);

  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const pageToken = req.query.pageToken || null;
    const maxResults = req.query.maxResults ? parseInt(req.query.maxResults) : 50;
    const searchQuery = req.query.q || '';

    const { emails, nextPageToken } = await fetchEmailBatch(gmail, pageToken, maxResults, searchQuery);

    res.json({
      emails: emails,
      nextPageToken: nextPageToken,
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send('Error fetching emails');
  }
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
