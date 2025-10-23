-- ========================================
-- TABELA DE VOLUNTÁRIOS - ESTRUTURA COMPLETA
-- ========================================

-- Criar tabela de voluntários se não existir
CREATE TABLE IF NOT EXISTS voluntarios (
  id SERIAL PRIMARY KEY,
  
  -- Dados pessoais
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  idade INTEGER NOT NULL CHECK (idade >= 16),
  
  -- Informações de voluntariado
  area_interesse VARCHAR(50) NOT NULL CHECK (area_interesse IN (
    'atendimento', 'criancas', 'logistica', 'comunicacao', 'administrativo', 'outros'
  )),
  disponibilidade VARCHAR(50) NOT NULL CHECK (disponibilidade IN (
    'finais-semana', 'feriados', 'manha', 'tarde', 'noite', 'flexivel'
  )),
  experiencia TEXT,
  motivacao TEXT NOT NULL,
  
  -- Status de aprovação
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  aprovado_por VARCHAR(255),
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS idx_voluntarios_email ON voluntarios(email);

-- Índice para busca por status
CREATE INDEX IF NOT EXISTS idx_voluntarios_status ON voluntarios(status);

-- Índice para busca por área de interesse
CREATE INDEX IF NOT EXISTS idx_voluntarios_area ON voluntarios(area_interesse);

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_voluntarios_created_at ON voluntarios(created_at);

-- ========================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voluntarios_updated_at 
    BEFORE UPDATE ON voluntarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Habilitar Row Level Security
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;

-- Política para leitura (todos podem ler)
CREATE POLICY "Todos podem ler voluntários" ON voluntarios
    FOR SELECT USING (true);

-- Política para inserção (todos podem inserir)
CREATE POLICY "Todos podem inserir voluntários" ON voluntarios
    FOR INSERT WITH CHECK (true);

-- Política para atualização (apenas admins podem atualizar)
-- NOTA: Você precisará ajustar esta política baseado no seu sistema de autenticação
CREATE POLICY "Admins podem atualizar voluntários" ON voluntarios
    FOR UPDATE USING (true);

-- ========================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ========================================

-- Inserir alguns voluntários de exemplo para teste
INSERT INTO voluntarios (
  nome, email, telefone, idade, area_interesse, disponibilidade, 
  experiencia, motivacao, status
) VALUES 
(
  'Maria Silva Santos',
  'maria.silva@email.com',
  '(11) 99999-1111',
  28,
  'criancas',
  'finais-semana',
  'Trabalho como professora de educação infantil há 5 anos.',
  'Quero contribuir com a educação e desenvolvimento das crianças da comunidade.',
  'pendente'
),
(
  'João Pedro Oliveira',
  'joao.oliveira@email.com',
  '(11) 99999-2222',
  35,
  'logistica',
  'flexivel',
  'Experiência em organização de eventos e gestão de estoque.',
  'Acredito que posso ajudar na organização e logística dos eventos.',
  'pendente'
),
(
  'Ana Carolina Costa',
  'ana.costa@email.com',
  '(11) 99999-3333',
  24,
  'comunicacao',
  'manha',
  'Formada em Marketing Digital, experiência com redes sociais.',
  'Quero usar minhas habilidades de comunicação para divulgar o trabalho da ONG.',
  'aprovado'
),
(
  'Carlos Eduardo Lima',
  'carlos.lima@email.com',
  '(11) 99999-4444',
  42,
  'atendimento',
  'tarde',
  'Trabalho na área social há 10 anos, experiência com famílias em vulnerabilidade.',
  'Tenho experiência em atendimento social e quero continuar ajudando famílias.',
  'aprovado'
),
(
  'Fernanda Rodrigues',
  'fernanda.rodrigues@email.com',
  '(11) 99999-5555',
  19,
  'criancas',
  'finais-semana',
  'Estudante de Pedagogia, experiência com recreação infantil.',
  'Como estudante de pedagogia, quero aplicar meus conhecimentos ajudando crianças.',
  'rejeitado'
);

-- ========================================
-- COMENTÁRIOS NA TABELA
-- ========================================

COMMENT ON TABLE voluntarios IS 'Tabela para armazenar informações dos voluntários da ONG';
COMMENT ON COLUMN voluntarios.area_interesse IS 'Área de interesse do voluntário: atendimento, criancas, logistica, comunicacao, administrativo, outros';
COMMENT ON COLUMN voluntarios.disponibilidade IS 'Disponibilidade do voluntário: finais-semana, feriados, manha, tarde, noite, flexivel';
COMMENT ON COLUMN voluntarios.status IS 'Status de aprovação: pendente, aprovado, rejeitado';
COMMENT ON COLUMN voluntarios.data_aprovacao IS 'Data e hora da aprovação/rejeição do voluntário';
COMMENT ON COLUMN voluntarios.aprovado_por IS 'Usuário que aprovou/rejeitou o voluntário';
