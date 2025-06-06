const eventsRepository = require('../repositories/eventsRepository');

class EventsService {
    async findAll() {
        try {
            return eventsRepository.findAll();
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            throw new Error('Erro ao buscar eventos');
        }
    }

    async create(eventsData) { 
        try {
            return await eventsRepository.create(eventsData);
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            throw new Error('Erro ao criar evento');
        }
    }
}

module.exports = new EventsService();
