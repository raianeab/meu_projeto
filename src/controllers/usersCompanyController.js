const userService = require('../services/userService');
const inviteService = require('../services/inviteService');

const usersCompanyController = {

    async index(req, res) {
        try {
            const companyId = req.session.user.company_id;
    
            const users = await userService.listUsersByCompany(companyId);
            const userLimit = await userService.getCompanyUserLimit(companyId); // 👈 ESTAVA FALTANDO
            const adminCount = await userService.countAdmins(companyId);
    
            res.render('pages/users-company', {
                users,
                userLimit,
                adminCount,
                currentUser: req.session.user,
                error: null
            });
    
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao carregar usuários');
        }
    },
    

    // Convida usuário (gera token + envia email)
    async invite(req, res) {
        try {
            const { email } = req.body;
            const companyId = req.session.user.company_id;

            const activeCount = await userService.countActiveUsers(companyId);
            const limit = await userService.getCompanyUserLimit(companyId);

            if (activeCount >= limit) {
                const users = await userService.listUsersByCompany(companyId);
                const adminCount = await userService.countAdmins(companyId);

                return res.render('pages/users-company', {
                    users,
                    userLimit: limit,  
                    adminCount,
                    currentUser: req.session.user,
                    error: 'Limite de usuários atingido'
                });
            }

            const token = await inviteService.createInvite(email, companyId);
            await inviteService.sendInviteEmail(email, token);

            return res.redirect('/usuarios');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao convidar usuário');
        }
    },

    // Desativa usuário
    async deactivate(req, res) {
        try {
            const { id } = req.params;
            const companyId = req.session.user.company_id;
            const currentUserId = req.session.user.id;

            const user = await userService.getUserById(id);

            // Não permitir desativar a si mesmo
            if (id === currentUserId) {
                const users = await userService.listUsersByCompany(companyId);
                const adminCount = await userService.countAdmins(companyId);

                return res.render('pages/users-company', {
                    users,
                    adminCount,
                    currentUser: req.session.user,
                    error: 'Você não pode desativar a si mesmo'
                });
            }

            // Não permitir desativar o último admin
            if (user.role === 'admin') {
                const adminCount = await userService.countAdmins(companyId);

                if (adminCount <= 1) {
                    const users = await userService.listUsersByCompany(companyId);

                    return res.render('pages/users-company', {
                        users,
                        adminCount,
                        currentUser: req.session.user,
                        error: 'A empresa precisa ter pelo menos um administrador ativo'
                    });
                }
            }

            await userService.updateUserStatus(id, 'inactive');
            res.redirect('/usuarios');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao desativar usuário');
        }
    },

    async activate(req, res) {
        try {
            const { id } = req.params;
            const companyId = req.session.user.company_id;
    
            const user = await userService.getUserById(id);
    
            if (!user || user.company_id !== companyId) {
                return res.status(403).send('Acesso negado');
            }
    
            await userService.updateUserStatus(id, 'active');
    
            res.redirect('/usuarios');
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao ativar usuário');
        }
    }
    


};

module.exports = usersCompanyController;
