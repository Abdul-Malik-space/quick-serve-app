import React, { useEffect, useState } from 'react';

const ProviderList = ({ skill }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/providers/all');
        const data = await response.json();
        
        const filtered = data.filter(p => p.skill === skill);
        setProviders(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchProviders();
  }, [skill]);

  if (loading) return <p style={{textAlign: 'center', marginTop: '20px'}}>Loading experts...</p>;

  return (
    <div className="provider-list" style={{ padding: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Available {skill}s near you:</h3>
      
      {providers.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No {skill}s found in your area yet.</p>
      ) : (
        <div className="provider-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {providers.map((p) => (
            <div key={p._id} className="p-card" style={{ 
              border: '1px solid #ddd', 
              borderRadius: '15px', 
              padding: '20px', 
              width: '250px', 
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              position: 'relative' // ڈاٹ کو سیٹ کرنے کے لیے ضروری ہے
            }}>
              
              {/* --- یہاں نیا امیج اور آن لائن ڈاٹ والا کوڈ شروع ہو رہا ہے --- */}
              <div className="profile-img-container" style={{ position: 'relative', width: '80px', margin: '0 auto 15px auto' }}>
                
                {p.image ? (
                  <img 
                    src={`http://localhost:5000/uploads/${p.image.split('\\').pop().split('/').pop()}`} 
                    alt={p.name} 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                      border: p.isOnline ? '3px solid #10b981' : '3px solid #ddd', // آن لائن پر سبز بارڈر
                      display: 'block'
                    }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} 
                  />
                ) : (
                  <div className="avatar-placeholder" style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: '#3b82f6', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', fontWeight: 'bold'
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* سبز ڈاٹ (Messenger style) */}
                {p.isOnline && (
                  <span style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    width: '15px',
                    height: '15px',
                    backgroundColor: '#10b981',
                    border: '2px solid white',
                    borderRadius: '50%',
                    display: 'block'
                  }}></span>
                )}
              </div>
              {/* --- امیج لاجک ختم --- */}

              <h4 style={{ margin: '10px 0' }}>{p.name}</h4>
              
              {/* آن لائن سٹیٹس ٹیکسٹ (اختیاری) */}
              <p style={{ fontSize: '12px', color: p.isOnline ? '#10b981' : '#666', fontWeight: 'bold', marginBottom: '10px' }}>
                {p.isOnline ? '● Online Now' : '○ Offline'}
              </p>

              <p style={{ color: '#666', fontSize: '14px' }}>📍 {p.location}</p>
              <p style={{ fontWeight: 'bold', color: '#2563eb' }}>💰 PKR {p.hourlyRate}/hr</p>
              <p style={{ fontSize: '14px' }}>📞 {p.phone}</p>
              
              <button className="btn-contact" style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold'
              }}>
                Contact Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderList;