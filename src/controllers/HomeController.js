const supabase = require('../config/db');

const HomeController = {
    async index(req, res) {
        try {
            const { data: eventos, error: eventosError } = await supabase
                .from('eventos')
                .select('*')
                .order('data_inicio', { ascending: false });
            if (eventosError) throw eventosError;

            const { data: usuarios, error: usuariosError } = await supabase
                .from('usuarios')
                .select('id, nome_completo');
            if (usuariosError) throw usuariosError;

            const eventosComOrganizador = (eventos || []).map(ev => ({
                ...ev,
                nome_organizador: (usuarios || []).find(u => u.id === ev.id_organizador)?.nome_completo || 'Não definido'
            }));

            const eventoDestaque = eventosComOrganizador.length > 0 ? [eventosComOrganizador[0]] : [];
            const demaisEventos = eventosComOrganizador.length > 1 ? eventosComOrganizador.slice(1) : [];

            res.render('pages/home', {
                eventoDestaque,
                demaisEventos,
                user: req.session?.user || null,
                error: null
            });
        } catch (error) {
            console.error('Erro ao carregar página inicial:', error);
            res.render('pages/home', {
                eventoDestaque: [],
                demaisEventos: [],
                user: req.session?.user || null,
                error: 'Erro ao carregar eventos. Por favor, tente novamente mais tarde.'
            });
        }
    }
};

module.exports = HomeController;