import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Volunteers.css';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVolunteers(data || []);
    } catch (error) {
      console.error('Erro ao buscar voluntários:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="volunteers-loading">
        <div className="loading"></div>
        <p>Carregando voluntários...</p>
      </div>
    );
  }

  return (
    <div className="volunteers">
      <div className="volunteers-header">
        <h1>Voluntários</h1>
        <p>Gerencie todos os voluntários</p>
      </div>

      <div className="card">
        {volunteers.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Data de Cadastro</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.email}</td>
                    <td>{volunteer.phone}</td>
                    <td>{new Date(volunteer.created_at).toLocaleDateString('pt-BR')}</td>
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-icons-round">group</span>
            <p>Nenhum voluntário encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Volunteers;
