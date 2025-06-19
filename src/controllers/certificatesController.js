const supabase = require('../config/db');
const Certificates = require('../models/certificatesModel');

const certificatesController = {
    async create(req, res) {
        try {
            const { error, value } = Certificates.schema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id_inscricao, caminho_arquivo, data_emissao } = value;
            const { data, error: supabaseError } = await supabase
                .from('certificados')
                .insert([{
                    id_inscricao,
                    caminho_arquivo,
                    data_emissao,
                    status: 'pendente'
                }])
                .select();

            if (supabaseError) throw supabaseError;
            res.status(201).json(data[0]);
        } catch (error) {
            console.error('Erro ao criar certificado:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async findAll(req, res) {
        try {
            const { data, error } = await supabase
                .from('certificados')
                .select('*')
                .order('data_emissao', { ascending: false });

            if (error) throw error;
            res.json(data);
        } catch (error) {
            console.error('Erro ao buscar certificados:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async findById(req, res) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from('certificados')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Certificado não encontrado' });
            }
            
            res.json(data);
        } catch (error) {
            console.error('Erro ao buscar certificado:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async update(req, res) {
        try {
            const { error, value } = Certificates.schema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id } = req.params;
            const { id_inscricao, caminho_arquivo, data_emissao, status } = value;
            
            const { data, error: supabaseError } = await supabase
                .from('certificados')
                .update({ id_inscricao, caminho_arquivo, data_emissao, status })
                .eq('id', id)
                .select()
                .single();
            
            if (supabaseError) throw supabaseError;
            if (!data) {
                return res.status(404).json({ error: 'Certificado não encontrado' });
            }
            
            res.json(data);
        } catch (error) {
            console.error('Erro ao atualizar certificado:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const { data, error } = await supabase
                .from('certificados')
                .delete()
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            if (!data) {
                return res.status(404).json({ error: 'Certificado não encontrado' });
            }
            
            res.json({ message: 'Certificado removido com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar certificado:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    },

    async list(req, res) {
        try {
            console.log('Iniciando busca de certificados...');
            
            if (!supabase) {
                throw new Error('Cliente Supabase não inicializado');
            }

            const { data: certificates, error } = await supabase
                .from('certificados')
                .select('*')
                .order('data_emissao', { ascending: false });

            if (error) {
                console.error('Erro ao buscar certificados no Supabase:', error);
                throw error;
            }

            console.log(`Certificados encontrados: ${certificates?.length || 0}`);

            const { data: inscricoes, error: inscricoesError } = await supabase
                .from('inscricoes')
                .select('*');

            if (inscricoesError) {
                console.error('Erro ao buscar inscrições:', inscricoesError);
            }

            const { data: eventos, error: eventosError } = await supabase
                .from('eventos')
                .select('*');

            if (eventosError) {
                console.error('Erro ao buscar eventos:', eventosError);
            }

            const { data: usuarios, error: usuariosError } = await supabase
                .from('usuarios')
                .select('*');

            if (usuariosError) {
                console.error('Erro ao buscar usuários:', usuariosError);
            }

            const formattedCertificates = certificates?.map(cert => {
                const inscricao = inscricoes?.find(i => i.id === cert.id_inscricao);
                
                const evento = eventos?.find(e => e.id === inscricao?.id_evento);
                const usuario = usuarios?.find(u => u.id === inscricao?.id_usuario);

                return {
                    id: cert.id,
                    evento_nome: evento?.titulo || 'Evento não encontrado',
                    participante_nome: usuario?.nome_completo || 'Participante não encontrado',
                    data_emissao: cert.data_emissao,
                    status: cert.status || 'pendente',
                    caminho_arquivo: cert.caminho_arquivo
                };
            }) || [];

            const { data: eventosSelect } = await supabase
                .from('eventos')
                .select('id, titulo')
                .order('titulo');

            const { data: participantesSelect } = await supabase
                .from('usuarios')
                .select('id, nome_completo')
                .order('nome_completo');

            return res.render('pages/certificates', {
                certificates: formattedCertificates,
                eventos: eventosSelect || [],
                participantes: participantesSelect || [],
                user: req.session?.user || null
            });

        } catch (error) {
            console.error('Erro detalhado ao listar certificados:', error);
            return res.render('pages/certificates', {
                certificates: [],
                eventos: [],
                participantes: [],
                error: 'Erro ao carregar certificados. Por favor, tente novamente mais tarde.'
            });
        }
    }
};

module.exports = certificatesController;
