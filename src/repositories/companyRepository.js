const { withTenantContext } = require('../config/db');

async function findCompanyById(session, id) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            'SELECT * FROM companies WHERE id = $1',
            [id]
        );
        return rows[0] || null;
    });
}

async function findCompanyByUserId(session, userId) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            `SELECT c.* FROM companies c
             JOIN usuarios u ON u.company_id = c.id
             WHERE u.id = $1`,
            [userId]
        );
        return rows[0] || null;
    });
}

module.exports = { findCompanyById, findCompanyByUserId };
