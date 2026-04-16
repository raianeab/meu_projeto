const { createClient } = require('@supabase/supabase-js');

let _client;
function getClient() {
  if (!_client) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada');
    _client = createClient(process.env.SUPABASE_URL, key);
  }
  return _client;
}

const leadsRepository = {

  async create({ nome, nome_empresa, email }) {
    const { data, error } = await getClient()
      .from('leads')
      .insert([{ nome, nome_empresa, email }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await getClient()
      .from('leads')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await getClient()
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

};

module.exports = leadsRepository;
