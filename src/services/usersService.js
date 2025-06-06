const usersRepository = require('../repositories/usersRepository');

class UsersService {
    async findAll() {
        try {
            return usersRepository.findAll();
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw new Error('Erro ao buscar usuários');
        }
    }

    async create(usersData) { 
        try {
            return await usersRepository.create(usersData);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error('Erro ao criar usuário');
        }
    }

    async findById(id) {
        try {
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return user;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }
    }

    async update(id, usersData) {
        try {
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return await usersRepository.update(id, usersData);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const user = await usersRepository.findById(id);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            return await usersRepository.delete(id);
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            throw error;
        }
    }
}

module.exports = new UsersService();
