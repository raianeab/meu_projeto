const axios = require('axios');
const leadsService = require('../services/leadsService');
const Lead = require('../models/leadsModel');

async function verifyTurnstile(token, ip) {
  const { data } = await axios.post(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    new URLSearchParams({
      secret:   process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data.success === true;
}

const leadsController = {

  async create(req, res) {
    const { error, value } = Lead.schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { nome, nome_empresa, email, turnstileToken } = value;

    let turnstileOk = false;
    try {
      turnstileOk = await verifyTurnstile(turnstileToken, req.ip);
    } catch {
      return res.status(502).json({ error: 'Falha ao verificar captcha. Tente novamente.' });
    }

    if (!turnstileOk) {
      return res.status(400).json({ error: 'Verificação de segurança inválida. Recarregue a página.' });
    }

    try {
      await leadsService.register({ nome, nome_empresa, email });
      return res.status(201).json({ ok: true });
    } catch (err) {
      console.error('[leadsController.create]', err.message);
      return res.status(500).json({ error: 'Erro interno. Tente novamente mais tarde.' });
    }
  },

};

module.exports = leadsController;
