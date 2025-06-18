require('dotenv').config();
const supabase = require('../config/db');
const bcrypt = require('bcrypt');

async function updatePassword(email, newPassword) {
    try {
        // Criptografa a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza a senha no banco de dados
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

// Exemplo de uso:
// Substitua 'seu-email@exemplo.com' pelo email do usuário
// e 'nova-senha' pela senha desejada
updatePassword('seu-email@exemplo.com', 'nova-senha'); 