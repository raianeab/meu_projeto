const supabase = require('../config/db');

const leadsRepository = {

  async create({ nome, nome_empresa, email }) {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nome, nome_empresa, email }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

};

module.exports = leadsRepository;
