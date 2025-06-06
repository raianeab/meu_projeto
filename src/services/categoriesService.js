const categoriesRepository = require('../repositories/categoriesRepository');

class CategoriesService {
    async findAll() {
        try {
            return categoriesRepository.findAll();
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            throw new Error('Erro ao buscar categorias');
        }
    }

    async create(categoriesData) { 
        try {
            const { nome_categoria, descricao } = categoriesData;
            return await categoriesRepository.create({ nome_categoria, descricao });
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw new Error('Erro ao criar categoria');
        }
    }
}

module.exports = new CategoriesService();
