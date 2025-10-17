import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading"></div>
        <p>Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className="events">
      <div className="events-header">
        <h1>Eventos</h1>
        <p>Gerencie todos os eventos</p>
      </div>

      <div className="card">
        {events.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{new Date(event.date).toLocaleDateString('pt-BR')}</td>
                    <td>{event.location}</td>
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
            <span className="material-icons-round">event</span>
            <p>Nenhum evento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
