const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Erro: SUPABASE_URL e SUPABASE_KEY são necessários no arquivo .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

supabase.from('eventos').select('count').limit(1)
    .then(({ data, error }) => {
        if (error) {
            console.error('Erro ao conectar com o Supabase:', error);
        }
    })
    .catch(error => {
        console.error('Erro ao inicializar o Supabase:', error);
    });

module.exports = supabase;

