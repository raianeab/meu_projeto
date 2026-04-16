const bcrypt = require('bcrypt');
const inviteService = require('../services/inviteService');
const userService = require('../services/userService');

const inviteController = {

    async showAcceptInvite(req, res) {
        const { token } = req.params;

        const invite = await inviteService.validateInvite(token);

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

            const invite = await inviteService.validateInvite(token);

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
