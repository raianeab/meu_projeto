import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_KEY não definido no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const runSQLScript = async () => {
  const filePath = path.join(__dirname, 'init.sql');
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log('Executando script SQL...');
    console.log('Conteúdo do arquivo:', sql.substring(0, 200) + '...');
    
    // Para Supabase, você pode usar a função rpc para executar SQL
    // Primeiro, você precisa criar uma função no Supabase
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sql
    });

    if (error) {
      throw error;
    }

    console.log('✅ Script SQL executado com sucesso!');
    console.log('Resultado:', data);
    
  } catch (err) {
    console.error('❌ Erro ao executar o script SQL:', err);
    
    // Se a função rpc não existir, vamos tentar executar comando por comando
    if (err.message?.includes('exec_sql')) {
      console.log('🔄 Tentando executar comandos individuais...');
      await runSQLCommandsIndividually();
    }
  }
};

const runSQLCommandsIndividually = async () => {
  const filePath = path.join(__dirname, 'init.sql');
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Divide o SQL em comandos individuais
  const commands = sql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0);
  
  console.log(`Executando ${commands.length} comandos SQL individuais...`);
  
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    console.log(`Executando comando ${i + 1}/${commands.length}...`);
    
    try {
      // Para comandos DDL (CREATE TABLE, etc.), usar query
      const { data, error } = await supabase
        .from('_temp') // tabela temporária - não importa o nome
        .select('*')
        .limit(0); // apenas para testar conexão
      
      // Como não podemos executar DDL diretamente via cliente JS,
      // você precisará executar os comandos SQL no painel do Supabase
      // ou usar a API REST diretamente
      
      console.log(`⚠️  Comando ${i + 1} precisa ser executado manualmente no painel do Supabase:`);
      console.log(command);
      console.log('---');
      
    } catch (error) {
      console.error(`❌ Erro no comando ${i + 1}:`, error);
    }
  }
  
  console.log(`
    📝 IMPORTANTE: 
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