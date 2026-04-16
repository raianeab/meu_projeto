const supabase = require('../config/db');

async function getDashboardByCompany(companyId) {
    const { data, error } = await supabase
        .from('companies')
        .select(`
            id,
            name,
            power_bi_workspace_id,
            power_bi_report_id
        `)
        .eq('id', companyId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
  company_id: data.id,
  name: data.name,
  power_bi_workspace_id: data.power_bi_workspace_id,
  power_bi_report_id: data.power_bi_report_id
};


}

module.exports = { getDashboardByCompany };
