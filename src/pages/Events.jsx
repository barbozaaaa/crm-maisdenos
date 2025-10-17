import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadEvents()
    loadRegistrations()
  }, [])

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('data_evento', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    }
  }

  const loadRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('inscricoes_eventos')
        .select('*')

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const getEventStatus = (event) => {
    const now = new Date()
    const eventDate = new Date(event.data_evento)
    
    if (event.status === 'cancelado') return { label: 'Cancelado', class: 'cancelled' }
    if (event.status === 'finalizado') return { label: 'Finalizado', class: 'finished' }
    if (eventDate < now) return { label: 'Passado', class: 'past' }
    if (event.vagas_preenchidas >= event.vagas_totais) return { label: 'Lotado', class: 'full' }
    return { label: 'Ativo', class: 'active' }
  }

  const getRegistrationsForEvent = (eventId) => {
    return registrations.filter(reg => reg.evento_id === eventId)
  }

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || getEventStatus(event).class === filter
    const matchesSearch = event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.local.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalRegistrations = registrations.length
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.data_evento)
    const now = new Date()
    return eventDate > now && event.status === 'aberto'
  }).length

  if (loading) {
    return (
      <div className="events">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando eventos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="events">
      <div className="page-header">
        <h1>Gerenciar Eventos</h1>
        <p>Visualize e gerencie todos os eventos e inscrições</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">Total de Eventos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{upcomingEvents}</div>
          <div className="stat-label">Próximos Eventos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{totalRegistrations}</div>
          <div className="stat-label">Total de Inscrições</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {events.filter(e => e.vagas_preenchidas >= e.vagas_totais).length}
          </div>
          <div className="stat-label">Eventos Lotados</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por título, descrição ou local..."
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
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            🟢 Ativos
          </button>
          <button
            className={`filter-btn ${filter === 'full' ? 'active' : ''}`}
            onClick={() => setFilter('full')}
          >
            🔴 Lotados
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            ⏰ Passados
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            ❌ Cancelados
          </button>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="events-list">
        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event)
              const eventRegistrations = getRegistrationsForEvent(event.id)
              
              return (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <div className="event-image">
                      {event.imagem_url ? (
                        <img src={event.imagem_url} alt={event.titulo} />
                      ) : (
                        <div className="event-placeholder">
                          <span className="placeholder-icon">📅</span>
                        </div>
                      )}
                    </div>
                    <div className="event-status">
                      <span className={`status-badge ${status.class}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="event-content">
                    <h3 className="event-title">{event.titulo}</h3>
                    <p className="event-description">{event.descricao}</p>

                    <div className="event-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">{formatDate(event.data_evento)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>
                        <span className="detail-text">{formatTime(event.hora_evento)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{event.local}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">👥</span>
                        <span className="detail-text">
                          {event.vagas_preenchidas}/{event.vagas_totais} vagas
                        </span>
                      </div>
                    </div>

                    <div className="event-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${(event.vagas_preenchidas / event.vagas_totais) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round((event.vagas_preenchidas / event.vagas_totais) * 100)}% preenchido
                      </span>
                    </div>

                    <div className="event-registrations">
                      <h4>Inscrições ({eventRegistrations.length})</h4>
                      {eventRegistrations.length > 0 ? (
                        <div className="registrations-list">
                          {eventRegistrations.slice(0, 3).map((registration) => (
                            <div key={registration.id} className="registration-item">
                              <span className="registration-name">{registration.nome}</span>
                              <span className="registration-email">{registration.email}</span>
                            </div>
                          ))}
                          {eventRegistrations.length > 3 && (
                            <div className="more-registrations">
                              +{eventRegistrations.length - 3} mais...
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="no-registrations">Nenhuma inscrição ainda</p>
                      )}
                    </div>
                  </div>

                  <div className="event-actions">
                    <button className="btn btn-primary">Ver Detalhes</button>
                    <button className="btn btn-secondary">Editar</button>
                    <button className="btn btn-success">Gerenciar Inscrições</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>Nenhum evento encontrado</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Ainda não há eventos cadastrados no sistema.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events