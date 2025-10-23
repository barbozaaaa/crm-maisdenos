import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalVolunteers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalDonationValue: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Buscar estatísticas das doações
      const { data: donations, error: donationsError } = await supabase
        .from('doacoes')
        .select('*')

      if (donationsError) throw donationsError

      // Buscar estatísticas dos voluntários
      const { data: volunteers, error: volunteersError } = await supabase
        .from('voluntarios')
        .select('*')

      if (volunteersError) throw volunteersError

      // Buscar estatísticas dos eventos
      const { data: events, error: eventsError } = await supabase
        .from('eventos')
        .select('*')

      if (eventsError) throw eventsError

      // Buscar estatísticas das inscrições
      const { data: registrations, error: registrationsError } = await supabase
        .from('inscricoes_eventos')
        .select('*')

      if (registrationsError) throw registrationsError

      // Calcular total de doações em dinheiro
      const totalDonationValue = donations
        ?.filter(d => d.valor && d.tipo_doacao === 'dinheiro')
        ?.reduce((sum, d) => sum + (d.valor || 0), 0) || 0

      setStats({
        totalDonations: donations?.length || 0,
        totalVolunteers: volunteers?.length || 0,
        totalEvents: events?.length || 0,
        totalRegistrations: registrations?.length || 0,
        totalDonationValue: totalDonationValue
      })

      // Criar atividades recentes
      const activities = []
      
      // Adicionar doações recentes
      const recentDonations = donations?.slice(0, 3) || []
      recentDonations.forEach(donation => {
        activities.push({
          id: `donation-${donation.id}`,
          type: 'donation',
          icon: '💰',
          title: `Nova doação de ${donation.nome_doador}`,
          description: `${donation.tipo_doacao}${donation.valor ? ` - R$ ${donation.valor.toFixed(2)}` : ''}`,
          time: new Date(donation.created_at).toLocaleString('pt-BR')
        })
      })

      // Adicionar voluntários recentes
      const recentVolunteers = volunteers?.slice(0, 2) || []
      recentVolunteers.forEach(volunteer => {
        activities.push({
          id: `volunteer-${volunteer.id}`,
          type: 'volunteer',
          icon: '🤝',
          title: `Novo voluntário: ${volunteer.nome}`,
          description: `Área: ${volunteer.area_interesse}`,
          time: new Date(volunteer.created_at).toLocaleString('pt-BR')
        })
      })

      // Ordenar por data e pegar os 5 mais recentes
      setRecentActivities(activities.slice(0, 5))

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - Mais de Nós</h1>
        <p>Bem-vindo ao painel administrativo, {user?.email}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.totalDonations}</h3>
            <p>Total de Doações</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalDonationValue)}</h3>
            <p>Valor Total Arrecadado</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <h3>{stats.totalVolunteers}</h3>
            <p>Total de Voluntários</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.totalEvents}</h3>
            <p>Total de Eventos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalRegistrations}</h3>
            <p>Inscrições em Eventos</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h2>Atividades Recentes</h2>
        {recentActivities.length > 0 ? (
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p><strong>{activity.title}</strong></p>
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-activities">
            <p>Nenhuma atividade recente encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard