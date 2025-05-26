const db = require('../config/db');
const certificatesModel = require('../models/certificatesModel');

class CertificatesRepository {
  async findAll() {
    try {
      const result = await db.query('SELECT * FROM certificados');
      return result.rows.map(row => new certificatesModel(row));
    } catch (error) {
      console.error('Erro ao buscar certificados no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  async create(certificatesData) {
    try {
      const result = await certificatesModel.create(certificatesData);
      return result;
    } catch (error) {
      console.error('Erro ao criar certificado no repository:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }
}

module.exports = new CertificatesRepository();
