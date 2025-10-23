-- ========================================
-- TABELA DE EVENTOS - ESTRUTURA COMPLETA
-- ========================================

-- Criar tabela de eventos se não existir
CREATE TABLE IF NOT EXISTS eventos (
  id SERIAL PRIMARY KEY,
  
  -- Informações básicas do evento
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  data_evento DATE NOT NULL,
  hora_evento TIME NOT NULL,
  local VARCHAR(255) NOT NULL,
  
  -- Capacidade e vagas
  vagas_totais INTEGER NOT NULL CHECK (vagas_totais > 0),
  vagas_preenchidas INTEGER DEFAULT 0 CHECK (vagas_preenchidas >= 0),
  
  -- Status e tipo
  status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado', 'cancelado', 'finalizado')),
  tipo_evento VARCHAR(50) DEFAULT 'acao_social' CHECK (tipo_evento IN ('acao_social', 'workshop', 'palestra', 'evento_beneficente', 'outros')),
  
  -- Imagem e recursos
  imagem_url TEXT,
  recursos_necessarios TEXT,
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- ========================================
-- TABELA DE INSCRIÇÕES EM EVENTOS
-- ========================================

-- Criar tabela de inscrições se não existir
CREATE TABLE IF NOT EXISTS inscricoes_eventos (
  id SERIAL PRIMARY KEY,
  
  -- Relacionamento com evento
  evento_id INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  
  -- Dados do participante
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  
  -- Status da inscrição
  status VARCHAR(20) DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'presente', 'ausente')),
  
  -- Informações adicionais
  observacoes TEXT,
  como_ficou_sabendo VARCHAR(255),
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_data ON eventos(data_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_status ON eventos(status);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON eventos(tipo_evento);

-- Índices para inscrições
CREATE INDEX IF NOT EXISTS idx_inscricoes_evento_id ON inscricoes_eventos(evento_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_email ON inscricoes_eventos(email);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes_eventos(status);

-- ========================================
-- TRIGGERS PARA ATUALIZAR updated_at
-- ========================================

-- Trigger para eventos
CREATE TRIGGER update_eventos_updated_at 
    BEFORE UPDATE ON eventos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para inscrições
CREATE TRIGGER update_inscricoes_updated_at 
    BEFORE UPDATE ON inscricoes_eventos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- TRIGGER PARA ATUALIZAR VAGAS PREENCHIDAS
-- ========================================

-- Função para atualizar vagas preenchidas
CREATE OR REPLACE FUNCTION update_vagas_preenchidas()
RETURNS TRIGGER AS $$
BEGIN
    -- Se é uma nova inscrição confirmada
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmada' THEN
        UPDATE eventos 
        SET vagas_preenchidas = vagas_preenchidas + 1 
        WHERE id = NEW.evento_id;
    END IF;
    
    -- Se uma inscrição foi cancelada
    IF TG_OP = 'UPDATE' AND OLD.status = 'confirmada' AND NEW.status = 'cancelada' THEN
        UPDATE eventos 
        SET vagas_preenchidas = vagas_preenchidas - 1 
        WHERE id = NEW.evento_id;
    END IF;
    
    -- Se uma inscrição foi deletada e estava confirmada
    IF TG_OP = 'DELETE' AND OLD.status = 'confirmada' THEN
        UPDATE eventos 
        SET vagas_preenchidas = vagas_preenchidas - 1 
        WHERE id = OLD.evento_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Aplicar trigger nas inscrições
CREATE TRIGGER trigger_update_vagas_preenchidas
    AFTER INSERT OR UPDATE OR DELETE ON inscricoes_eventos
    FOR EACH ROW
    EXECUTE FUNCTION update_vagas_preenchidas();

-- ========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Habilitar Row Level Security
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes_eventos ENABLE ROW LEVEL SECURITY;

-- Políticas para eventos
CREATE POLICY "Todos podem ler eventos" ON eventos
    FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir eventos" ON eventos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem atualizar eventos" ON eventos
    FOR UPDATE USING (true);

-- Políticas para inscrições
CREATE POLICY "Todos podem ler inscrições" ON inscricoes_eventos
    FOR SELECT USING (true);

CREATE POLICY "Todos podem inserir inscrições" ON inscricoes_eventos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem atualizar inscrições" ON inscricoes_eventos
    FOR UPDATE USING (true);

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserir alguns eventos de exemplo
INSERT INTO eventos (
  titulo, descricao, data_evento, hora_evento, local, 
  vagas_totais, vagas_preenchidas, status, tipo_evento
) VALUES 
(
  'Ação Social +1 Mais de Nós',
  'Evento de distribuição de alimentos e roupas para famílias em situação de vulnerabilidade social.',
  '2024-02-15',
  '10:00:00',
  'Quadra do Nelson Ramos',
  50,
  0,
  'aberto',
  'acao_social'
),
(
  'Workshop de Capacitação Profissional',
  'Workshop gratuito para capacitação profissional em áreas como informática básica e atendimento ao cliente.',
  '2024-02-20',
  '14:00:00',
  'Centro Comunitário São José',
  30,
  0,
  'aberto',
  'workshop'
),
(
  'Palestra sobre Saúde Mental',
  'Palestra sobre a importância da saúde mental e como buscar ajuda profissional.',
  '2024-02-25',
  '19:00:00',
  'Auditório da Igreja Matriz',
  100,
  0,
  'aberto',
  'palestra'
),
(
  'Evento de Natal 2023',
  'Distribuição de brinquedos e alimentos para crianças e famílias carentes.',
  '2023-12-20',
  '09:00:00',
  'Praça Central',
  200,
  180,
  'finalizado',
  'evento_beneficente'
);

-- Inserir algumas inscrições de exemplo
INSERT INTO inscricoes_eventos (
  evento_id, nome, email, telefone, status, como_ficou_sabendo
) VALUES 
(1, 'Maria Silva Santos', 'maria.silva@email.com', '(11) 99999-1111', 'confirmada', 'Redes sociais'),
(1, 'João Pedro Oliveira', 'joao.oliveira@email.com', '(11) 99999-2222', 'confirmada', 'Indicação de amigo'),
(2, 'Ana Carolina Costa', 'ana.costa@email.com', '(11) 99999-3333', 'confirmada', 'Site da ONG'),
(2, 'Carlos Eduardo Lima', 'carlos.lima@email.com', '(11) 99999-4444', 'confirmada', 'Redes sociais'),
(3, 'Fernanda Rodrigues', 'fernanda.rodrigues@email.com', '(11) 99999-5555', 'confirmada', 'Panfleto');

-- ========================================
-- COMENTÁRIOS NAS TABELAS
-- ========================================

COMMENT ON TABLE eventos IS 'Tabela para armazenar informações dos eventos da ONG';
COMMENT ON TABLE inscricoes_eventos IS 'Tabela para armazenar inscrições dos participantes nos eventos';

COMMENT ON COLUMN eventos.status IS 'Status do evento: aberto, fechado, cancelado, finalizado';
COMMENT ON COLUMN eventos.tipo_evento IS 'Tipo do evento: acao_social, workshop, palestra, evento_beneficente, outros';
COMMENT ON COLUMN inscricoes_eventos.status IS 'Status da inscrição: confirmada, cancelada, presente, ausente';
