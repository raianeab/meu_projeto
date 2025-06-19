const supabase = require('../config/db');
const bcrypt = require('bcrypt');

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
                return res.render('pages/login', { error: 'Email ou senha inválidos' });
            }

            const senhaValida = await bcrypt.compare(senha, user.senha);
            if (!senhaValida) {
                return res.render('pages/login', { error: 'Email ou senha inválidos' });
            }

            const { senha: _, ...userWithoutPassword } = user;

            req.session.user = userWithoutPassword;

            res.redirect('/home');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.render('pages/login', { error: 'Erro interno do servidor' });
        }
    },

    async register(req, res) {
        try {
            const { nome_completo, email, senha, confirmar_senha, tipo_usuario } = req.body;

            if (senha !== confirmar_senha) {
                return res.render('pages/register', { error: 'As senhas não coincidem' });
            }

            const { data: existingUser } = await supabase
                .from('usuarios')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUser) {
                return res.render('pages/register', { error: 'Este email já está em uso' });
            }

            const hashedPassword = await bcrypt.hash(senha, 10);

            const { data: newUser, error } = await supabase
                .from('usuarios')
                .insert([
                    {
                        nome_completo,
                        email,
                        senha: hashedPassword,
                        tipo_usuario
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar usuário:', error);
                return res.render('pages/register', { error: 'Erro ao criar usuário' });
            }

            const { senha: _, ...userWithoutPassword } = newUser;

            req.session.user = userWithoutPassword;

            res.redirect('/home');
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.render('pages/register', { error: 'Erro interno do servidor' });
        }
    },

    async logout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async checkAuth(req, res) {
        try {
            if (req.session.user) {
                res.json(req.session.user);
            } else {
                res.status(401).json({ error: 'Não autenticado' });
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = authController; 