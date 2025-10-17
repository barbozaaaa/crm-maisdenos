import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Users.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // Buscar usuários da tabela auth.users através do Supabase Admin API
      // Como não temos acesso direto ao admin API, vamos simular com dados das outras tabelas
      const [donations, volunteers, registrations] = await Promise.all([
        supabase.from('doacoes').select('nome_doador, email_doador, telefone_doador, created_at'),
        supabase.from('voluntarios').select('nome, email, telefone, created_at'),
        supabase.from('inscricoes_eventos').select('nome, email, telefone, created_at')
      ])

      // Combinar todos os usuários únicos
      const allUsers = new Map()

      // Adicionar doadores
      donations.data?.forEach(donation => {
        const key = donation.email_doador.toLowerCase()
        if (!allUsers.has(key)) {
          allUsers.set(key, {
            id: `donation-${donation.email_doador}`,
            name: donation.nome_doador,
            email: donation.email_doador,
            phone: donation.telefone_doador,
            type: 'Doador',
            createdAt: donation.created_at,
            lastActivity: donation.created_at
          })
        }
      })

      // Adicionar voluntários
      volunteers.data?.forEach(volunteer => {
        const key = volunteer.email.toLowerCase()
        if (!allUsers.has(key)) {
          allUsers.set(key, {
            id: `volunteer-${volunteer.email}`,
            name: volunteer.nome,
            email: volunteer.email,
            phone: volunteer.telefone,
            type: 'Voluntário',
            createdAt: volunteer.created_at,
            lastActivity: volunteer.created_at
          })
        } else {
          // Se já existe, atualizar o tipo
          const existing = allUsers.get(key)
          existing.type = existing.type === 'Doador' ? 'Doador/Voluntário' : 'Voluntário'
        }
      })

      // Adicionar inscritos em eventos
      registrations.data?.forEach(registration => {
        const key = registration.email.toLowerCase()
        if (!allUsers.has(key)) {
          allUsers.set(key, {
            id: `registration-${registration.email}`,
            name: registration.nome,
            email: registration.email,
            phone: registration.telefone,
            type: 'Participante de Evento',
            createdAt: registration.created_at,
            lastActivity: registration.created_at
          })
        } else {
          // Se já existe, atualizar o tipo
          const existing = allUsers.get(key)
          if (existing.type === 'Doador') {
            existing.type = 'Doador/Participante'
          } else if (existing.type === 'Voluntário') {
            existing.type = 'Voluntário/Participante'
          } else if (existing.type === 'Doador/Voluntário') {
            existing.type = 'Doador/Voluntário/Participante'
          }
        }
      })

      setUsers(Array.from(allUsers.values()).sort((a, b) => 
        new Date(b.lastActivity) - new Date(a.lastActivity)
      ))
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
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

  const getTypeIcon = (type) => {
    if (type.includes('Doador') && type.includes('Voluntário') && type.includes('Participante')) {
      return '🌟'
    } else if (type.includes('Doador') && type.includes('Voluntário')) {
      return '💝'
    } else if (type.includes('Doador') && type.includes('Participante')) {
      return '🎁'
    } else if (type.includes('Voluntário') && type.includes('Participante')) {
      return '🤝'
    } else if (type.includes('Doador')) {
      return '💰'
    } else if (type.includes('Voluntário')) {
      return '🤝'
    } else if (type.includes('Participante')) {
      return '📅'
    }
    return '👤'
  }

  const getTypeColor = (type) => {
    if (type.includes('Doador') && type.includes('Voluntário') && type.includes('Participante')) {
      return '#9c27b0' // Roxo
    } else if (type.includes('Doador') && type.includes('Voluntário')) {
      return '#ff9800' // Laranja
    } else if (type.includes('Doador') && type.includes('Participante')) {
      return '#4caf50' // Verde
    } else if (type.includes('Voluntário') && type.includes('Participante')) {
      return '#2196f3' // Azul
    } else if (type.includes('Doador')) {
      return '#4caf50' // Verde
    } else if (type.includes('Voluntário')) {
      return '#2196f3' // Azul
    } else if (type.includes('Participante')) {
      return '#ff9800' // Laranja
    }
    return '#757575' // Cinza
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || 
      (filter === 'donors' && user.type.includes('Doador')) ||
      (filter === 'volunteers' && user.type.includes('Voluntário')) ||
      (filter === 'participants' && user.type.includes('Participante'))
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const totalUsers = users.length
  const donors = users.filter(u => u.type.includes('Doador')).length
  const volunteers = users.filter(u => u.type.includes('Voluntário')).length
  const participants = users.filter(u => u.type.includes('Participante')).length

  if (loading) {
    return (
      <div className="users">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="users">
      <div className="page-header">
        <h1>Gerenciar Usuários</h1>
        <p>Visualize e gerencie todos os usuários do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-number">{totalUsers}</div>
          <div className="stat-label">Total de Usuários</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{donors}</div>
          <div className="stat-label">Doadores</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{volunteers}</div>
          <div className="stat-label">Voluntários</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{participants}</div>
          <div className="stat-label">Participantes</div>
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
            className={`filter-btn ${filter === 'donors' ? 'active' : ''}`}
            onClick={() => setFilter('donors')}
          >
            💰 Doadores
          </button>
          <button
            className={`filter-btn ${filter === 'volunteers' ? 'active' : ''}`}
            onClick={() => setFilter('volunteers')}
          >
            🤝 Voluntários
          </button>
          <button
            className={`filter-btn ${filter === 'participants' ? 'active' : ''}`}
            onClick={() => setFilter('participants')}
          >
            📅 Participantes
          </button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="users-list">
        {filteredUsers.length > 0 ? (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <div 
                      className="user-type"
                      style={{ color: getTypeColor(user.type) }}
                    >
                      <span className="type-icon">{getTypeIcon(user.type)}</span>
                      <span className="type-label">{user.type}</span>
                    </div>
                  </div>
                </div>

                <div className="user-details">
                  {user.phone && (
                    <div className="detail-item">
                      <span className="detail-label">📱 Telefone:</span>
                      <span className="detail-value">{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <span className="detail-label">📅 Cadastrado em:</span>
                    <span className="detail-value">{formatDate(user.createdAt)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">🕐 Última atividade:</span>
                    <span className="detail-value">{formatDate(user.lastActivity)}</span>
                  </div>
                </div>

                <div className="user-actions">
                  <button className="btn btn-primary">Ver Perfil</button>
                  <button className="btn btn-secondary">Contatar</button>
                  <button className="btn btn-success">Ativar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>Nenhum usuário encontrado</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Ainda não há usuários cadastrados no sistema.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users