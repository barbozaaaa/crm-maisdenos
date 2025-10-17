import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Donations.css'

const Donations = () => {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadDonations()
  }, [])

  const loadDonations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('doacoes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error) {
      console.error('Erro ao carregar doações:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
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

  const getDonationTypeIcon = (type) => {
    const icons = {
      dinheiro: '💰',
      roupas: '👕',
      brinquedos: '🧸',
      alimentos: '🍎',
      outros_bens: '📦'
    }
    return icons[type] || '📦'
  }

  const getDonationTypeLabel = (type) => {
    const labels = {
      dinheiro: 'Dinheiro',
      roupas: 'Roupas',
      brinquedos: 'Brinquedos',
      alimentos: 'Alimentos',
      outros_bens: 'Outros Bens'
    }
    return labels[type] || type
  }

  const filteredDonations = donations.filter(donation => {
    const matchesFilter = filter === 'all' || donation.tipo_doacao === filter
    const matchesSearch = donation.nome_doador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.email_doador.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalValue = donations
    .filter(d => d.valor && d.tipo_doacao === 'dinheiro')
    .reduce((sum, d) => sum + (d.valor || 0), 0)

  if (loading) {
    return (
      <div className="donations">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando doações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="donations">
      <div className="page-header">
        <h1>Gerenciar Doações</h1>
        <p>Visualize e gerencie todas as doações recebidas</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-number">{donations.length}</div>
          <div className="stat-label">Total de Doações</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{formatCurrency(totalValue)}</div>
          <div className="stat-label">Valor Total Arrecadado</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {donations.filter(d => d.tipo_doacao === 'dinheiro').length}
          </div>
          <div className="stat-label">Doações em Dinheiro</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {donations.filter(d => d.tipo_doacao !== 'dinheiro').length}
          </div>
          <div className="stat-label">Doações em Espécie</div>
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
            Todas
          </button>
          <button
            className={`filter-btn ${filter === 'dinheiro' ? 'active' : ''}`}
            onClick={() => setFilter('dinheiro')}
          >
            💰 Dinheiro
          </button>
          <button
            className={`filter-btn ${filter === 'roupas' ? 'active' : ''}`}
            onClick={() => setFilter('roupas')}
          >
            👕 Roupas
          </button>
          <button
            className={`filter-btn ${filter === 'brinquedos' ? 'active' : ''}`}
            onClick={() => setFilter('brinquedos')}
          >
            🧸 Brinquedos
          </button>
          <button
            className={`filter-btn ${filter === 'alimentos' ? 'active' : ''}`}
            onClick={() => setFilter('alimentos')}
          >
            🍎 Alimentos
          </button>
          <button
            className={`filter-btn ${filter === 'outros_bens' ? 'active' : ''}`}
            onClick={() => setFilter('outros_bens')}
          >
            📦 Outros
          </button>
        </div>
      </div>

      {/* Lista de Doações */}
      <div className="donations-list">
        {filteredDonations.length > 0 ? (
          <div className="donations-grid">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="donation-card">
                <div className="donation-header">
                  <div className="donation-type">
                    <span className="type-icon">{getDonationTypeIcon(donation.tipo_doacao)}</span>
                    <span className="type-label">{getDonationTypeLabel(donation.tipo_doacao)}</span>
                  </div>
                  <div className="donation-date">
                    {formatDate(donation.created_at)}
                  </div>
                </div>

                <div className="donation-info">
                  <h3 className="donor-name">{donation.nome_doador}</h3>
                  <p className="donor-email">{donation.email_doador}</p>
                  {donation.telefone_doador && (
                    <p className="donor-phone">{donation.telefone_doador}</p>
                  )}
                </div>

                {donation.valor && (
                  <div className="donation-value">
                    <span className="value-label">Valor:</span>
                    <span className="value-amount">{formatCurrency(donation.valor)}</span>
                  </div>
                )}

                {donation.descricao && (
                  <div className="donation-description">
                    <p><strong>Descrição:</strong></p>
                    <p>{donation.descricao}</p>
                  </div>
                )}

                <div className="donation-actions">
                  <button className="btn btn-primary">Ver Detalhes</button>
                  <button className="btn btn-secondary">Contatar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Nenhuma doação encontrada</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Ainda não há doações registradas no sistema.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Donations