const crypto = require('crypto');
const { pool, withTenantContext } = require('../config/db');

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Cria um convite (usuário ainda NÃO existe)
 */
async function createInvite(session, email, companyId, type = 'invite') {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await withTenantContext(session, async (client) => {
        await client.query(
            `INSERT INTO user_invites (email, company_id, token, expires_at, type)
             VALUES ($1, $2, $3, $4, $5)`,
            [email, companyId, token, expiresAt, type]
        );
    });

    return token;
}


/**
 * Valida convite (token válido, não usado e não expirado)
 */
async function getInviteByToken(token) {
    const { rows } = await pool.query(
        `SELECT * FROM user_invites
         WHERE token = $1 AND used = false AND expires_at > NOW()
         LIMIT 1`,
        [token]
    );
    return rows[0] ?? null;
}

/**
 * Marca convite como usado (NÃO deletar, auditoria)
 */
async function markInviteAsUsed(token) {
    await pool.query(
        `UPDATE user_invites SET used = true WHERE token = $1`,
        [token]
    );
}

/**
 * Cria usuário a partir do convite
 */
async function createUserFromInvite({ email, companyId, nomeCompleto, passwordHash }) {
    await pool.query(
        `INSERT INTO usuarios (email, company_id, nome_completo, senha, role, status)
         VALUES ($1, $2, $3, $4, 'user', 'active')`,
        [email, companyId, nomeCompleto, passwordHash]
    );
}


const emailService = require('./emailService');

async function sendInviteEmail(email, token) {
    const link = `${process.env.APP_URL}/convite/${token}`;

    await emailService.sendEmail({
        to: email,
        subject: 'Convite para acessar o sistema',
        html: `
            <p>Você foi convidado para acessar o sistema.</p>
            <p>Clique no link abaixo para definir sua senha:</p>
            <a href="${link}">${link}</a>
        `
    });
}

async function validateInvite(token) {
    const { rows } = await pool.query(
        `SELECT * FROM user_invites
         WHERE token = $1 AND used = false AND expires_at > NOW()
         LIMIT 1`,
        [token]
    );
    return rows[0] ?? null;
}


async function sendResetPasswordEmail(email, token) {
    const link = `${process.env.APP_URL}/convite/${token}`;
    await emailService.sendEmail({
        to: email,
        subject: 'Redefinição de senha',
        html: `
            <p>Você solicitou a redefinição da sua senha.</p>
            <p>Clique no link abaixo para definir uma nova senha (válido por 1 hora):</p>
            <a href="${link}">${link}</a>
        `
    });
}


async function listInvitesByCompany(session) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            `SELECT id, email, type, used, expires_at, created_at
             FROM user_invites
             WHERE type = 'invite'
             ORDER BY created_at DESC`
        );
        return rows;
    });
}

module.exports = {
    createInvite,
    getInviteByToken,
    markInviteAsUsed,
    createUserFromInvite,
    sendInviteEmail,
    validateInvite,
    sendResetPasswordEmail,
    listInvitesByCompany
};
