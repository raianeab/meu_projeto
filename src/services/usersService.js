const usersRepository = require('../repositories/usersRepository');

class UsersService {
    async findAll() {
        try {
            console.log('Buscando usuários no service antes de buscar no repository');
            return usersRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar usuários');
        }
    }

    async create(usersData) { 
        try {
            console.log('Criando usuário no service com os dados:', usersData);
            return await usersRepository.create(usersData);
        } catch (error) {
            console.error('Erro no service ao criar usuário:', error);
            throw new Error('Erro ao criar usuário');
        }
    }

    async findById(id) {
        try {
            console.log('Buscando usuário por ID no service:', id);
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            console.error('Erro no service ao buscar usuário por ID:', error);
            throw error;
        }
    }

    async update(id, usersData) {
        try {
            console.log('Atualizando usuário no service:', { id, usersData });
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return await usersRepository.update(id, usersData);
        } catch (error) {
            console.error('Erro no service ao atualizar usuário:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            console.log('Deletando usuário no service:', id);
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return await usersRepository.delete(id);
        } catch (error) {
            console.error('Erro no service ao deletar usuário:', error);
            throw error;
        }
    }
}

module.exports = new UsersService();
