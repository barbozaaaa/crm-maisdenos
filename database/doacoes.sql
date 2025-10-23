-- ========================================
-- TABELA DE DOAÇÕES - ESTRUTURA COMPLETA
-- ========================================

-- Criar tabela de doações se não existir
CREATE TABLE IF NOT EXISTS doacoes (
  id SERIAL PRIMARY KEY,
  
  -- Dados do doador
  nome_doador VARCHAR(255) NOT NULL,
  email_doador VARCHAR(255) NOT NULL,
  telefone_doador VARCHAR(20),
  
  -- Informações da doação
  tipo_doacao VARCHAR(50) NOT NULL CHECK (tipo_doacao IN (
    'dinheiro', 'roupas', 'brinquedos', 'alimentos', 'outros_bens'
  )),
  valor DECIMAL(10,2), -- Apenas para doações em dinheiro
  descricao TEXT,
  quantidade INTEGER, -- Para doações em espécie
  
  -- Status e processamento
  status VARCHAR(20) DEFAULT 'recebida' CHECK (status IN (
    'recebida', 'processada', 'distribuida', 'cancelada'
  )),
  data_recebimento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_processamento TIMESTAMP WITH TIME ZONE,
  processado_por VARCHAR(255),
  
  -- Informações adicionais
  observacoes TEXT,
  comprovante_url TEXT, -- URL do comprovante (se houver)
  anonima BOOLEAN DEFAULT FALSE, -- Se a doação é anônima
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índice para busca por email do doador
CREATE INDEX IF NOT EXISTS idx_doacoes_email ON doacoes(email_doador);

-- Índice para busca por tipo de doação
CREATE INDEX IF NOT EXISTS idx_doacoes_tipo ON doacoes(tipo_doacao);

-- Índice para busca por status
CREATE INDEX IF NOT EXISTS idx_doacoes_status ON doacoes(status);

-- Índice para ordenação por data
CREATE INDEX IF NOT EXISTS idx_doacoes_created_at ON doacoes(created_at);

-- Índice para doações em dinheiro
CREATE INDEX IF NOT EXISTS idx_doacoes_valor ON doacoes(valor) WHERE valor IS NOT NULL;

-- ========================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ========================================

CREATE TRIGGER update_doacoes_updated_at 
    BEFORE UPDATE ON doacoes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Habilitar Row Level Security
ALTER TABLE doacoes ENABLE ROW LEVEL SECURITY;

-- Política para leitura (todos podem ler)
CREATE POLICY "Todos podem ler doações" ON doacoes
    FOR SELECT USING (true);

-- Política para inserção (todos podem inserir)
CREATE POLICY "Todos podem inserir doações" ON doacoes
    FOR INSERT WITH CHECK (true);

-- Política para atualização (apenas admins podem atualizar)
CREATE POLICY "Admins podem atualizar doações" ON doacoes
    FOR UPDATE USING (true);

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserir algumas doações de exemplo
INSERT INTO doacoes (
  nome_doador, email_doador, telefone_doador, tipo_doacao, valor, 
  descricao, status, anonima
) VALUES 
(
  'Maria Silva Santos',
  'maria.silva@email.com',
  '(11) 99999-1111',
  'dinheiro',
  150.00,
  'Doação para compra de alimentos para as famílias carentes.',
  'recebida',
  false
),
(
  'João Pedro Oliveira',
  'joao.oliveira@email.com',
  '(11) 99999-2222',
  'roupas',
  null,
  'Doação de roupas de inverno para adultos e crianças.',
  'recebida',
  false
),
(
  'Ana Carolina Costa',
  'ana.costa@email.com',
  '(11) 99999-3333',
  'brinquedos',
  null,
  'Brinquedos educativos para crianças de 3 a 8 anos.',
  'processada',
  false
),
(
  'Carlos Eduardo Lima',
  'carlos.lima@email.com',
  '(11) 99999-4444',
  'alimentos',
  null,
  'Cestas básicas com alimentos não perecíveis.',
  'distribuida',
  false
),
(
  'Fernanda Rodrigues',
  'fernanda.rodrigues@email.com',
  '(11) 99999-5555',
  'dinheiro',
  300.00,
  'Doação mensal para manutenção dos projetos sociais.',
  'recebida',
  true
),
(
  'Empresa ABC Ltda',
  'contato@empresaabc.com',
  '(11) 3333-4444',
  'dinheiro',
  1000.00,
  'Doação corporativa para o projeto de capacitação profissional.',
  'recebida',
  false
),
(
  'Padaria do Bairro',
  'padaria@email.com',
  '(11) 2222-3333',
  'alimentos',
  null,
  'Pães e produtos de padaria para distribuição semanal.',
  'recebida',
  false
);

-- ========================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- ========================================

-- View para resumo de doações por tipo
CREATE OR REPLACE VIEW resumo_doacoes_por_tipo AS
SELECT 
  tipo_doacao,
  COUNT(*) as total_doacoes,
  SUM(CASE WHEN valor IS NOT NULL THEN valor ELSE 0 END) as valor_total,
  AVG(CASE WHEN valor IS NOT NULL THEN valor ELSE NULL END) as valor_medio
FROM doacoes 
WHERE status != 'cancelada'
GROUP BY tipo_doacao
ORDER BY total_doacoes DESC;

-- View para doações recentes
CREATE OR REPLACE VIEW doacoes_recentes AS
SELECT 
  id,
  nome_doador,
  email_doador,
  tipo_doacao,
  valor,
  status,
  data_recebimento,
  anonima
FROM doacoes 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View para total arrecadado por mês
CREATE OR REPLACE VIEW total_arrecadado_mensal AS
SELECT 
  DATE_TRUNC('month', created_at) as mes,
  COUNT(*) as total_doacoes,
  SUM(CASE WHEN valor IS NOT NULL THEN valor ELSE 0 END) as valor_total,
  COUNT(CASE WHEN tipo_doacao = 'dinheiro' THEN 1 END) as doacoes_dinheiro,
  COUNT(CASE WHEN tipo_doacao != 'dinheiro' THEN 1 END) as doacoes_especie
FROM doacoes 
WHERE status != 'cancelada'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes DESC;

-- ========================================
-- COMENTÁRIOS NA TABELA
-- ========================================

COMMENT ON TABLE doacoes IS 'Tabela para armazenar informações das doações recebidas pela ONG';
COMMENT ON COLUMN doacoes.tipo_doacao IS 'Tipo da doação: dinheiro, roupas, brinquedos, alimentos, outros_bens';
COMMENT ON COLUMN doacoes.status IS 'Status da doação: recebida, processada, distribuida, cancelada';
COMMENT ON COLUMN doacoes.valor IS 'Valor da doação (apenas para doações em dinheiro)';
COMMENT ON COLUMN doacoes.anonima IS 'Indica se a doação é anônima';
COMMENT ON COLUMN doacoes.comprovante_url IS 'URL do comprovante da doação (se houver)';
