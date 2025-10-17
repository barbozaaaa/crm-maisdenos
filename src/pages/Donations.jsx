import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Donations.css';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="donations-loading">
        <div className="loading"></div>
        <p>Carregando doações...</p>
      </div>
    );
  }

  return (
    <div className="donations">
      <div className="donations-header">
        <h1>Doações</h1>
        <p>Gerencie todas as doações recebidas</p>
      </div>

      <div className="card">
        {donations.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.name}</td>
                    <td>{donation.email}</td>
                    <td>R$ {donation.amount}</td>
                    <td>{new Date(donation.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className="badge badge-success">Confirmada</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-outline btn-sm">
                          <span className="material-icons-round">visibility</span>
                        </button>
                        <button className="btn btn-outline btn-sm">
                          <span className="material-icons-round">download</span>
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
            <span className="material-icons-round">volunteer_activism</span>
            <p>Nenhuma doação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
