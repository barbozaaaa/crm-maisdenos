import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading"></div>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="users">
      <div className="users-header">
        <h1>Usuários</h1>
        <p>Gerencie todos os usuários do sistema</p>
      </div>

      <div className="users-actions">
        <div className="search-box">
          <span className="material-icons-round">search</span>
          <input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={fetchUsers}>
          <span className="material-icons-round">refresh</span>
          Atualizar
        </button>
      </div>

      <div className="card">
        {filteredUsers.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Cadastro</th>
                  <th>Último Login</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          <span className="material-icons-round">person</span>
                        </div>
                        <span>{user.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </td>
                    <td>
                      <span className="badge badge-success">Ativo</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-outline btn-sm">
                          <span className="material-icons-round">visibility</span>
                        </button>
                        <button className="btn btn-outline btn-sm">
                          <span className="material-icons-round">edit</span>
                        </button>
                        <button className="btn btn-outline btn-sm btn-danger">
                          <span className="material-icons-round">delete</span>
                        </button>
                      </div>
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
  );
};

export default Users;
