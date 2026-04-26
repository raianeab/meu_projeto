const { withTenantContext } = require('../config/db');

async function getDashboardByCompany(session) {
    return withTenantContext(session, async (client) => {
        const { rows } = await client.query(`
            SELECT id, name, power_bi_workspace_id, power_bi_report_id
            FROM companies
            LIMIT 1
        `);

        if (!rows.length) return null;

        const data = rows[0];
        return {
            company_id: data.id,
            name: data.name,
            power_bi_workspace_id: data.power_bi_workspace_id,
            power_bi_report_id: data.power_bi_report_id
        };
    });
}

module.exports = { getDashboardByCompany };
