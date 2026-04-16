const axios = require('axios');

let cachedToken = null;
let tokenExpiresAt = null;

async function getAzureAccessToken() {
  if (cachedToken && tokenExpiresAt > Date.now()) {
    return cachedToken;
  }

  const url = `${process.env.POWER_BI_AUTH_URL}/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.AZURE_CLIENT_ID);
  params.append('client_secret', process.env.AZURE_CLIENT_SECRET);
  params.append('scope', process.env.POWER_BI_SCOPE);

  const response = await axios.post(url, params);

  cachedToken = response.data.access_token;
  tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;

  return cachedToken;
}

async function generateEmbedToken({ workspaceId, reportId }) {
  const accessToken = await getAzureAccessToken();

  const url = `${process.env.POWER_BI_API_URL}/groups/${workspaceId}/reports/${reportId}/GenerateToken`;

  const response = await axios.post(
    url,
    {
      accessLevel: 'View'
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.token;
}

async function getEmbedUrl({ workspaceId, reportId }) {
  const accessToken = await getAzureAccessToken();

  const url = `${process.env.POWER_BI_API_URL}/groups/${workspaceId}/reports/${reportId}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.data.embedUrl;
}

module.exports = { generateEmbedToken, getEmbedUrl };
