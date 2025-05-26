const categoriesRepository = require('../repositories/categoriesRepository');

class CategoriesService {
    async findAll() {
        try {
            console.log('Buscando categorias no service antes de buscar no repository');
            return categoriesRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar categorias');
        }
    }

    async create(categoriesData) { 
        try {
            console.log('Criando categoria no service com os dados:', categoriesData);
            const { nome_categoria, descricao } = categoriesData;
            return await categoriesRepository.create({ nome_categoria, descricao });
        } catch (error) {
            console.error('Erro no service ao criar categoria:', error);
            throw new Error('Erro ao criar categoria');
        }
    }
}

module.exports = new CategoriesService();
