const supabase = require('../config/db');

async function listUsersByCompany(companyId) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email, role, status, created_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

async function countActiveUsers(companyId) {
    const { count, error } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('status', 'active');

    if (error) throw error;
    return count;
}

async function getCompanyUserLimit(companyId) {
    const { data, error } = await supabase
        .from('companies')
        .select('user_limit')
        .eq('id', companyId)
        .single();

    if (error) throw error;
    return data.user_limit;
}

async function updateUserStatus(userId, status) {
    const { error } = await supabase
        .from('usuarios')
        .update({ status })
        .eq('id', userId);

    if (error) throw error;
}

async function countAdmins(companyId) {
    const { count } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('role', 'admin')
        .eq('status', 'active');

    return count;
}


async function getUserById(userId) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data;
}

async function getUserByEmail(email) {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

    if (error) return null;
    return data;
}

async function updatePassword(email, passwordHash) {
    const { error } = await supabase
        .from('usuarios')
        .update({ senha: passwordHash })
        .eq('email', email);

    if (error) throw error;
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
