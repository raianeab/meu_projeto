require('dotenv').config();
const supabase = require('../config/db');
const bcrypt = require('bcrypt');

async function updatePassword(email, newPassword) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { data, error } = await supabase
            .from('usuarios')
            .update({ senha: hashedPassword })
            .eq('email', email);

        if (error) {
            console.error('Erro ao atualizar senha:', error);
            return;
        }

        console.log('Senha atualizada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
    }
}

updatePassword('seu-email@exemplo.com', 'nova-senha'); 