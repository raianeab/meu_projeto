const supabase = require('../config/db');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const inviteService = require('../services/inviteService');

const authController = {
    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const { data: user, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !user) {
                return res.render('pages/login', {
                    error: 'Email ou senha inválidos'
                });
            }

            if (user.status !== 'active') {
                return res.render('pages/login', {
                    error: 'Usuário desativado'
                });
            }

            const senhaValida = await bcrypt.compare(senha, user.senha);
            if (!senhaValida) {
                return res.render('pages/login', {
                    error: 'Email ou senha inválidos'
                });
            }

            const { senha: _, ...userWithoutPassword } = user;
            req.session.user = userWithoutPassword;
            
            return res.redirect('/dashboard');

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.render('pages/login', {
                error: 'Erro interno do servidor'
            });
        }
    },

    async register(req, res) {
        try {
            const {
                nome_completo,
                email,
                senha,
                confirmar_senha,
                tipo_usuario,
                company_id
            } = req.body;

            if (senha !== confirmar_senha) {
                return res.render('pages/register', {
                    error: 'As senhas não coincidem'
                });
            }

            const { data: existingUser } = await supabase
                .from('usuarios')
                .select('id')
                .eq('email', email)
                .single();

            if (existingUser) {
                return res.render('pages/register', {
                    error: 'Este email já está em uso'
                });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const { data: newUser, error } = await supabase
                .from('usuarios')
                .insert([{
                    nome_completo,
                    email,
                    senha: hashedPassword,
                    role: tipo_usuario,
                    company_id,
                    status: 'active'
                }])
                .select()
                .single();

            if (error) {
                console.error(error);
                return res.render('pages/register', {
                    error: 'Erro ao criar usuário'
                });
            }

            const { senha: _, ...userWithoutPassword } = newUser;
            req.session.user = userWithoutPassword;

            return res.redirect('/dashboard');

        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return res.render('pages/register', {
                error: 'Erro interno do servidor'
            });
        }
    },

    async logout(req, res) {
        try {
            req.session.destroy(() => {
                res.redirect('/auth/login');
            });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            res.status(500).send('Erro interno');
        }
    },

    async checkAuth(req, res) {
        if (req.session.user) {
            return res.json(req.session.user);
        }
        return res.status(401).json({ error: 'Não autenticado' });
    },

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            const user = await userService.getUserByEmail(email);

            if (user) {
                const token = await inviteService.createInvite(
                    user.email,
                    user.company_id,
                    'reset_password'
                );

                await inviteService.sendResetPasswordEmail(
                    user.email,
                    token
                );
            }

            return res.render('pages/reset-requested');

        } catch (err) {
            console.error(err);
            return res.status(500).send('Erro ao solicitar reset');
        }
    }
};

module.exports = authController;
