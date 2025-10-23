import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Volunteers.css'

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    loadVolunteers()
  }, [])

  const loadVolunteers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('voluntarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVolunteers(data || [])
    } catch (error) {
      console.error('Erro ao carregar voluntários:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Aprova um voluntário
   * @param {number} volunteerId - ID do voluntário
   */
  const approveVolunteer = async (volunteerId) => {
    try {
      setProcessingId(volunteerId)
      
      const { error } = await supabase
        .from('voluntarios')
        .update({ 
          status: 'aprovado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: 'admin' // TODO: Pegar do contexto de autenticação
        })
        .eq('id', volunteerId)

      if (error) throw error

      // Atualizar a lista local
      setVolunteers(prev => 
        prev.map(volunteer => 
          volunteer.id === volunteerId 
            ? { ...volunteer, status: 'aprovado', data_aprovacao: new Date().toISOString() }
            : volunteer
        )
      )

      alert('Voluntário aprovado com sucesso!')
    } catch (error) {
      console.error('Erro ao aprovar voluntário:', error)
      alert('Erro ao aprovar voluntário. Tente novamente.')
    } finally {
      setProcessingId(null)
    }
  }

  /**
   * Rejeita um voluntário
   * @param {number} volunteerId - ID do voluntário
   */
  const rejectVolunteer = async (volunteerId) => {
    try {
      setProcessingId(volunteerId)
      
      const { error } = await supabase
        .from('voluntarios')
        .update({ 
          status: 'rejeitado',
          data_aprovacao: new Date().toISOString(),
          aprovado_por: 'admin' // TODO: Pegar do contexto de autenticação
        })
        .eq('id', volunteerId)

      if (error) throw error

      // Atualizar a lista local
      setVolunteers(prev => 
        prev.map(volunteer => 
          volunteer.id === volunteerId 
            ? { ...volunteer, status: 'rejeitado', data_aprovacao: new Date().toISOString() }
            : volunteer
        )
      )

      alert('Voluntário rejeitado.')
    } catch (error) {
      console.error('Erro ao rejeitar voluntário:', error)
      alert('Erro ao rejeitar voluntário. Tente novamente.')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAreaIcon = (area) => {
    const icons = {
      atendimento: '👨‍👩‍👧‍👦',
      criancas: '👶',
      logistica: '📦',
      comunicacao: '📢',
      administrativo: '📋',
      outros: '🤝'
    }
    return icons[area] || '🤝'
  }

  const getAreaLabel = (area) => {
    const labels = {
      atendimento: 'Atendimento às Famílias',
      criancas: 'Atividades com Crianças',
      logistica: 'Logística e Organização',
      comunicacao: 'Comunicação e Marketing',
      administrativo: 'Administrativo',
      outros: 'Outros'
    }
    return labels[area] || area
  }

  const getAvailabilityLabel = (availability) => {
    const labels = {
      'finais-semana': 'Finais de Semana',
      'feriados': 'Feriados',
      'manha': 'Manhãs',
      'tarde': 'Tardes',
      'noite': 'Noites',
      'flexivel': 'Flexível'
    }
    return labels[availability] || availability
  }

  /**
   * Obtém o status do voluntário com cor e ícone
   * @param {string} status - Status do voluntário
   * @returns {object} Objeto com label, class e icon
   */
  const getVolunteerStatus = (status) => {
    switch (status) {
      case 'aprovado':
        return { label: 'Aprovado', class: 'approved', icon: '✅' }
      case 'rejeitado':
        return { label: 'Rejeitado', class: 'rejected', icon: '❌' }
      case 'pendente':
      default:
        return { label: 'Pendente', class: 'pending', icon: '⏳' }
    }
  }

  const filteredVolunteers = volunteers.filter(volunteer => {
    let matchesFilter = true
    
    if (filter === 'all') {
      matchesFilter = true
    } else if (['pendente', 'aprovado', 'rejeitado'].includes(filter)) {
      // Filtro por status
      const volunteerStatus = volunteer.status || 'pendente'
      matchesFilter = volunteerStatus === filter
    } else {
      // Filtro por área de interesse
      matchesFilter = volunteer.area_interesse === filter
    }
    
    const matchesSearch = volunteer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getAgeGroup = (age) => {
    if (age < 18) return 'Menor de 18'
    if (age < 25) return '18-24 anos'
    if (age < 35) return '25-34 anos'
    if (age < 50) return '35-49 anos'
    return '50+ anos'
  }

  if (loading) {
    return (
      <div className="volunteers">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando voluntários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="volunteers">
      <div className="page-header">
        <h1>Gerenciar Voluntários</h1>
        <p>Visualize e gerencie todos os voluntários cadastrados</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-number">{volunteers.length}</div>
          <div className="stat-label">Total de Voluntários</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {volunteers.filter(v => v.status === 'aprovado').length}
          </div>
          <div className="stat-label">Aprovados</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {volunteers.filter(v => v.status === 'pendente' || !v.status).length}
          </div>
          <div className="stat-label">Pendentes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {volunteers.filter(v => v.area_interesse === 'criancas').length}
          </div>
          <div className="stat-label">Atividades com Crianças</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filter === 'pendente' ? 'active' : ''}`}
            onClick={() => setFilter('pendente')}
          >
            ⏳ Pendentes
          </button>
          <button
            className={`filter-btn ${filter === 'aprovado' ? 'active' : ''}`}
            onClick={() => setFilter('aprovado')}
          >
            ✅ Aprovados
          </button>
          <button
            className={`filter-btn ${filter === 'rejeitado' ? 'active' : ''}`}
            onClick={() => setFilter('rejeitado')}
          >
            ❌ Rejeitados
          </button>
          <button
            className={`filter-btn ${filter === 'criancas' ? 'active' : ''}`}
            onClick={() => setFilter('criancas')}
          >
            👶 Crianças
          </button>
          <button
            className={`filter-btn ${filter === 'atendimento' ? 'active' : ''}`}
            onClick={() => setFilter('atendimento')}
          >
            👨‍👩‍👧‍👦 Atendimento
          </button>
        </div>
      </div>

      {/* Lista de Voluntários */}
      <div className="volunteers-list">
        {filteredVolunteers.length > 0 ? (
          <div className="volunteers-grid">
            {filteredVolunteers.map((volunteer) => {
              const volunteerStatus = getVolunteerStatus(volunteer.status || 'pendente')
              
              return (
                <div key={volunteer.id} className="volunteer-card">
                  <div className="volunteer-header">
                    <div className="volunteer-avatar">
                      {volunteer.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="volunteer-info">
                      <div className="volunteer-name-row">
                        <h3 className="volunteer-name">{volunteer.nome}</h3>
                        <span className={`status-badge ${volunteerStatus.class}`}>
                          {volunteerStatus.icon} {volunteerStatus.label}
                        </span>
                      </div>
                      <p className="volunteer-email">{volunteer.email}</p>
                      <p className="volunteer-age">{volunteer.idade} anos - {getAgeGroup(volunteer.idade)}</p>
                    </div>
                  </div>

                <div className="volunteer-details">
                  <div className="detail-item">
                    <span className="detail-label">📱 Telefone:</span>
                    <span className="detail-value">{volunteer.telefone}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🎯 Área de Interesse:</span>
                    <span className="detail-value">
                      {getAreaIcon(volunteer.area_interesse)} {getAreaLabel(volunteer.area_interesse)}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">⏰ Disponibilidade:</span>
                    <span className="detail-value">{getAvailabilityLabel(volunteer.disponibilidade)}</span>
                  </div>
                </div>

                {volunteer.experiencia && (
                  <div className="volunteer-experience">
                    <p><strong>Experiência:</strong></p>
                    <p>{volunteer.experiencia}</p>
                  </div>
                )}

                <div className="volunteer-motivation">
                  <p><strong>Motivação:</strong></p>
                  <p>{volunteer.motivacao}</p>
                </div>

                <div className="volunteer-meta">
                  <span className="volunteer-date">
                    Cadastrado em: {formatDate(volunteer.created_at)}
                  </span>
                </div>

                <div className="volunteer-actions">
                  <button className="btn btn-primary">Ver Perfil</button>
                  <button className="btn btn-secondary">Contatar</button>
                  
                  {/* Botões de aprovação baseados no status */}
                  {volunteerStatus.class === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success"
                        onClick={() => approveVolunteer(volunteer.id)}
                        disabled={processingId === volunteer.id}
                      >
                        {processingId === volunteer.id ? 'Processando...' : 'Aprovar'}
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => rejectVolunteer(volunteer.id)}
                        disabled={processingId === volunteer.id}
                      >
                        {processingId === volunteer.id ? 'Processando...' : 'Rejeitar'}
                      </button>
                    </>
                  )}
                  
                  {volunteerStatus.class === 'approved' && (
                    <span className="status-message">✅ Aprovado em {volunteer.data_aprovacao ? formatDate(volunteer.data_aprovacao) : 'Data não disponível'}</span>
                  )}
                  
                  {volunteerStatus.class === 'rejected' && (
                    <span className="status-message">❌ Rejeitado em {volunteer.data_aprovacao ? formatDate(volunteer.data_aprovacao) : 'Data não disponível'}</span>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🤝</div>
            <h3>Nenhum voluntário encontrado</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Ainda não há voluntários cadastrados no sistema.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Volunteers