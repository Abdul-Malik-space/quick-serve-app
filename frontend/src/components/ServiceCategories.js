import React, { useState } from 'react';
import { Pipette as Plumber, Zap, Home, Paintbrush, Search, UserPlus } from 'lucide-react';
import ProviderForm from './ProviderForm';
import ProviderList from './ProviderList';

const ServiceCategories = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [viewType, setViewType] = useState(null); // 'find' یا 'register' کے لیے

  const categories = [
    { id: 1, name: 'Plumber', icon: <Plumber size={40} /> },
    { id: 2, name: 'Electronics', icon: <Zap size={40} /> },
    { id: 3, name: 'Cleaning', icon: <Home size={40} /> },
    { id: 4, name: 'Painting', icon: <Paintbrush size={40} /> },
  ];

  const handleClose = () => {
    setSelectedService(null);
    setViewType(null);
  };

  return (
    <div id="services-section" style={{ padding: '50px 5%', textAlign: 'center' }}>
      <h2>What service do you need?</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="service-card" 
            onClick={() => setSelectedService(cat.name)}
            style={{ width: '150px', padding: '20px', border: '1px solid #ddd', borderRadius: '15px', cursor: 'pointer', background: 'white' }}
          >
            <div style={{ color: '#2563eb' }}>{cat.icon}</div>
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>

      {/* انتخاب کا پاپ اپ (Choice Modal) */}
      {selectedService && !viewType && (
        <div className="modal-overlay">
          <div className="modal-content choice-modal">
            <h3>{selectedService} Services</h3>
            <p>What would you like to do?</p>
            <div className="choice-buttons">
              <button className="btn-find" onClick={() => setViewType('find')}>
                <Search size={20} /> Find a {selectedService}
              </button>
              <button className="btn-register" onClick={() => setViewType('register')}>
                <UserPlus size={20} /> Register as a {selectedService}
              </button>
            </div>
            <button className="btn-close" onClick={handleClose}>Cancel</button>
          </div>
        </div>
      )}

      {/* لسٹ یا فارم دکھانا */}
      {viewType === 'find' && <ProviderList skill={selectedService} onClose={handleClose} />}
      {viewType === 'register' && <ProviderForm serviceName={selectedService} onClose={handleClose} />}
    </div>
  );
};

export default ServiceCategories;