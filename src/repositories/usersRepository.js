const { withTenantContext } = require('../config/db');

class UsersRepository {
  async findAll(session) {
    return withTenantContext(session, async (client) => {
      const { rows } = await client.query(
        'SELECT id, nome_completo, email, telefone, tipo_usuario, created_at FROM usuarios ORDER BY nome_completo ASC'
      );
      return rows;
    });
  }

  async findById(session, id) {
    return withTenantContext(session, async (client) => {
      const { rows } = await client.query(
        'SELECT id, nome_completo, email, telefone, tipo_usuario, created_at FROM usuarios WHERE id = $1',
        [id]
      );
      return rows[0] || null;
    });
  }

  async emailExists(session, email, excludeId = null) {
    return withTenantContext(session, async (client) => {
      const sql = excludeId
        ? 'SELECT id FROM usuarios WHERE email = $1 AND id <> $2'
        : 'SELECT id FROM usuarios WHERE email = $1';
      const { rows } = await client.query(sql, excludeId ? [email, excludeId] : [email]);
      return rows.length > 0;
    });
  }

  async create(session, data) {
    return withTenantContext(session, async (client) => {
      const { nome_completo, email, telefone, tipo_usuario, senha } = data;
      const { rows } = await client.query(
        `INSERT INTO usuarios (nome_completo, email, telefone, tipo_usuario, senha)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, nome_completo, email, telefone, tipo_usuario, created_at`,
        [nome_completo, email || null, telefone || null, tipo_usuario, senha]
      );
      return rows[0];
    });
  }

  async update(session, id, data) {
    return withTenantContext(session, async (client) => {
      const { nome_completo, email, telefone, tipo_usuario, senha } = data;
      const { rows } = await client.query(
        `UPDATE usuarios
         SET nome_completo = $1, email = $2, telefone = $3, tipo_usuario = $4,
             senha = COALESCE($5, senha)
         WHERE id = $6
         RETURNING id, nome_completo, email, telefone, tipo_usuario, created_at`,
        [nome_completo, email || null, telefone || null, tipo_usuario, senha || null, id]
      );
      return rows[0] || null;
    });
  }

  async delete(session, id) {
    return withTenantContext(session, async (client) => {
      const { rows } = await client.query(
        'DELETE FROM usuarios WHERE id = $1 RETURNING id',
        [id]
      );
      return rows[0] || null;
    });
  }
}

module.exports = new UsersRepository();
