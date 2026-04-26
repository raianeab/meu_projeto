const crypto = require('crypto');
const { supabase } = require('../config/db');

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Cria um convite (usuário ainda NÃO existe)
 */
async function createInvite(email, companyId, type = 'invite') {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

    const { error } = await supabase
        .from('user_invites')
        .insert([{
            email,
            company_id: companyId,
            token,
            expires_at: expiresAt,
            type
        }]);

    if (error) throw error;

    return token;
}


/**
 * Valida convite (token válido, não usado e não expirado)
 */
async function getInviteByToken(token) {
    const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (error) return null;
    return data;
}

/**
 * Marca convite como usado (NÃO deletar, auditoria)
 */
async function markInviteAsUsed(token) {
    const { error } = await supabase
        .from('user_invites')
        .update({ used: true })
        .eq('token', token);

    if (error) throw error;
}

/**
 * Cria usuário a partir do convite
 */
async function createUserFromInvite({ email, companyId, nomeCompleto, passwordHash }) {
    const { error } = await supabase
        .from('usuarios')
        .insert({
            email,
            company_id: companyId,
            nome_completo: nomeCompleto,
            senha: passwordHash,
            role: 'user',
            status: 'active'
        });

    if (error) throw error;
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
    const { data, error } = await supabase
        .from('user_invites')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (error || !data) return null;
    return data;
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


module.exports = {
    createInvite,
    getInviteByToken,
    markInviteAsUsed,
    createUserFromInvite,
    sendInviteEmail,
    validateInvite,
    sendResetPasswordEmail
};
