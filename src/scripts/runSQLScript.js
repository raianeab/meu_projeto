const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL ou SUPABASE_KEY não definido no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const runSQLScript = async () => {
  const filePath = path.join(__dirname, 'init.sql');
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sql
    });

    if (error) {
      throw error;
    }

    console.log('Script SQL executado com sucesso!');
    
  } catch (err) {
    console.error('Erro ao executar o script SQL:', err);
    
    if (err.message?.includes('exec_sql')) {
      await runSQLCommandsIndividually();
    }
  }
};

const runSQLCommandsIndividually = async () => {
  const filePath = path.join(__dirname, 'init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  
  const commands = sql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0);
  
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    
    try {
      const { data, error } = await supabase
        .from('_temp')
        .select('*')
        .limit(0);
      
      console.log(`Comando ${i + 1} precisa ser executado manualmente no painel do Supabase:`);
      console.log(command);
      console.log('---');
      
    } catch (error) {
      console.error(`Erro no comando ${i + 1}:`, error);
    }
  }
  
  console.log(`
    INSTRUÇÕES: 
    Para executar comandos DDL (CREATE TABLE, etc.) no Supabase, você precisa:
    
    1. Acessar o painel do Supabase (https://app.supabase.com)
    2. Ir para a aba "SQL Editor"
    3. Colar e executar cada comando SQL
    
    OU
    
    Criar uma função RPC no Supabase para executar SQL:
    
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
      RETURN 'SQL executed successfully';
    END;
    $$;
  `);
};

runSQLScript();