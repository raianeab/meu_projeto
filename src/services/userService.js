const { pool, withTenantContext } = require('../config/db');

async function listUsersByCompany(session) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            'SELECT id, nome_completo, email, role, status, created_at FROM usuarios ORDER BY created_at ASC'
        );
        return rows;
    });
}

async function countActiveUsers(session) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            "SELECT COUNT(*)::int AS count FROM usuarios WHERE status = 'active'"
        );
        return rows[0].count;
    });
}

async function getCompanyUserLimit(session) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            'SELECT user_limit FROM companies WHERE id = $1',
            [session.company_id]
        );
        return rows[0].user_limit;
    });
}

async function updateUserStatus(session, userId, status) {
    return withTenantContext(session, async (client) => {
        await client.query(
            'UPDATE usuarios SET status = $1 WHERE id = $2',
            [status, userId]
        );
    });
}

async function countAdmins(session) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            "SELECT COUNT(*)::int AS count FROM usuarios WHERE role = 'admin' AND status = 'active'"
        );
        return rows[0].count;
    });
}

async function getUserById(session, userId) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(
            'SELECT * FROM usuarios WHERE id = $1',
            [userId]
        );
        return rows[0] || null;
    });
}

async function getUserByEmail(email) {
    const { rows } = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
    );
    return rows[0] || null;
}

async function updatePassword(email, passwordHash) {
    await pool.query(
        'UPDATE usuarios SET senha = $1 WHERE email = $2',
        [passwordHash, email]
    );
}

module.exports = {
    listUsersByCompany,
    countActiveUsers,
    getCompanyUserLimit,
    updateUserStatus,
    countAdmins,
    getUserById,
    getUserByEmail,
    updatePassword
};
