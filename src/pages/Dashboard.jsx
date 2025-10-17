import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalEvents: 0,
    totalVolunteers: 0,
    recentDonations: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas básicas
      const [usersResult, donationsResult, eventsResult, volunteersResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }),
        supabase.from('donations').select('*', { count: 'exact' }),
        supabase.from('events').select('*', { count: 'exact' }),
        supabase.from('volunteers').select('*', { count: 'exact' })
      ]);

      // Buscar doações recentes
      const { data: recentDonations } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Buscar usuários recentes
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersResult.count || 0,
        totalDonations: donationsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalVolunteers: volunteersResult.count || 0,
        recentDonations: recentDonations || [],
        recentUsers: recentUsers || []
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral do sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons-round">people</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total de Usuários</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons-round">volunteer_activism</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalDonations}</h3>
            <p>Total de Doações</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons-round">event</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalEvents}</h3>
            <p>Total de Eventos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <span className="material-icons-round">group</span>
          </div>
          <div className="stat-content">
            <h3>{stats.totalVolunteers}</h3>
            <p>Total de Voluntários</p>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="dashboard-content">
        {/* Doações recentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Doações Recentes</h2>
            <a href="/donations" className="btn btn-outline">Ver todas</a>
          </div>
          <div className="card">
            {stats.recentDonations.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Valor</th>
                      <th>Data</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td>{donation.name}</td>
                        <td>R$ {donation.amount}</td>
                        <td>{new Date(donation.created_at).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <span className="badge badge-success">Confirmada</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="material-icons-round">volunteer_activism</span>
                <p>Nenhuma doação encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Usuários recentes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Usuários Recentes</h2>
            <a href="/users" className="btn btn-outline">Ver todos</a>
          </div>
          <div className="card">
            {stats.recentUsers.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Data de Cadastro</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name || 'N/A'}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <span className="badge badge-success">Ativo</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="material-icons-round">people</span>
                <p>Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
