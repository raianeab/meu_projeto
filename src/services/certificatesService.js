const certificatesRepository = require('../repositories/certificatesRepository');

class CertificatesService {
    async findAll() {
        try {
            console.log('Buscando certificados no service antes de buscar no repository');
            return certificatesRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar certificados');
        }
    }

    async create(certificatesData) { 
        try {
            console.log('Criando certificado no service com os dados:', certificatesData);
            return await certificatesRepository.create(certificatesData);
        } catch (error) {
            console.error('Erro no service ao criar certificado:', error);
            throw new Error('Erro ao criar certificado');
        }
    }
}

module.exports = new CertificatesService();
