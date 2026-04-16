const supabase = require('../config/db');

async function findCompanyById(companyId) {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

    if (error) return null;
    return data;
}

async function findCompanyByUserId(userId) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('companies (*)')
        .eq('id', userId)
        .single();

    if (error || !data) return null;
    return data.companies;
}

module.exports = {
    findCompanyById,
    findCompanyByUserId
};
