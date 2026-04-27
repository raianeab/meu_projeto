const bcrypt = require('bcrypt');
const inviteService = require('../services/inviteService');
const userService = require('../services/userService');
const { pool } = require('../config/db');

const inviteController = {

    async showInvites(req, res) {
        try {
            const invites = await inviteService.listInvitesByCompany(req.session.user);
            res.render('pages/invites', { invites });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao carregar convites');
        }
    },

    async showAcceptInvite(req, res) {
        const { token } = req.params;

        const client = await pool.connect();
        let invite;
        try {
            await client.query('BEGIN');
            await client.query(`SELECT set_config('app.login_mode', 'true', true)`);
            const { rows } = await client.query(
                `SELECT * FROM user_invites WHERE token = $1 AND used = false AND expires_at > NOW() LIMIT 1`,
                [token]
            );
            invite = rows[0] ?? null;
            await client.query('COMMIT');
        } catch(err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

        if (!invite) {
            return res.status(400).render('pages/error', {
                message: 'Convite inválido ou expirado',
                error: { status: 400 }
            });
        }

        res.render('pages/accept-invite', {
            token,
            type: invite.type,
            error: null
        });
    },

    async acceptInvite(req, res) {
        try {
            const { token, nome_completo, password, confirmPassword } = req.body;

            // validações básicas
            if (password !== confirmPassword) {
                return res.render('pages/accept-invite', {
                    token,
                    error: 'As senhas não coincidem'
                });
            }

            if (password.length < 8) {
                return res.render('pages/accept-invite', {
                    token,
                    error: 'A senha deve ter no mínimo 8 caracteres'
                });
            }

            const client2 = await pool.connect();
            let invite;
            try {
                await client2.query('BEGIN');
                await client2.query(`SELECT set_config('app.login_mode', 'true', true)`);
                const { rows } = await client2.query(
                    `SELECT * FROM user_invites WHERE token = $1 AND used = false AND expires_at > NOW() LIMIT 1`,
                    [token]
                );
                invite = rows[0] ?? null;
                await client2.query('COMMIT');
            } catch(err) {
                await client2.query('ROLLBACK');
                throw err;
            } finally {
                client2.release();
            }

            if (!invite) {
                return res.status(400).render('pages/error', {
                    message: 'Convite inválido ou expirado',
                    error: { status: 400 }
                });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            if (invite.type === 'reset_password') {

                await userService.updatePassword(invite.email, passwordHash);

            } else {
                // invite normal (criação de usuário)
                if (!nome_completo || nome_completo.trim().length < 3) {
                    return res.render('pages/accept-invite', {
                        token,
                        error: 'Informe seu nome completo'
                    });
                }

                await inviteService.createUserFromInvite({
                    email: invite.email,
                    companyId: invite.company_id,
                    nomeCompleto: nome_completo,
                    passwordHash
                });
            }

            await inviteService.markInviteAsUsed(token);

            res.redirect('/auth/login');

        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao processar convite');
        }
    }
};

module.exports = inviteController;
