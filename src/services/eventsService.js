const eventsRepository = require('../repositories/eventsRepository');

class EventsService {
    async findAll() {
        try {
            console.log('Buscando eventos no service antes de buscar no repository');
            return eventsRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar eventos');
        }
    }

    async create(eventsData) { 
        try {
            console.log('Criando evento no service com os dados:', eventsData);
            return await eventsRepository.create(eventsData);
        } catch (error) {
            console.error('Erro no service ao criar evento:', error);
            throw new Error('Erro ao criar evento');
        }
    }
}

module.exports = new EventsService();
