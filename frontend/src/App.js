import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';

function App() {
  // تمام اسٹیٹس (States) فنکشن کے اندر ہونی چاہئیں
  const [providers, setProviders] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', hourlyRate: '', location: '', skill: 'Plumber' });
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/providers/all');
      setProviders(response.data);
    } catch (error) {
      console.error("Data fetch error:", error);
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const filteredProviders = providers.filter((p) => 
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/providers/add', formData);
      setFormData({ name: '', phone: '', hourlyRate: '', location: '', skill: 'Plumber' });
      fetchProviders();
      alert("کامیابی سے شامل کر دیا گیا!");
    } catch (error) { alert("Error adding provider"); }
  };

  const deleteProvider = async (id) => {
    if (window.confirm("کیا آپ واقعی اسے ڈیلیٹ کرنا چاہتے ہیں؟")) {
      try {
        await axios.delete(`http://localhost:5000/api/providers/delete/${id}`);
        fetchProviders();
      } catch (error) { alert("Error deleting"); }
    }
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>QuickServe 🛠️</h1>
        <p>لاہور کی بہترین ہوم سروسز</p>
      </header>

      <div style={mainContent}>
        {/* ایڈمن سیکشن: اگر ٹوکن نہیں ہے تو لاگ ان دکھاؤ، ورنہ فارم دکھاؤ */}
        <section style={formSection}>
          {!token ? (
            <Login setToken={setToken} />
          ) : (
            <>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                <h2 style={{color: '#333', margin: 0}}>نیا ماہر شامل کریں</h2>
                <button onClick={logout} style={{backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>لاگ آؤٹ</button>
              </div>
              <form onSubmit={handleSubmit}>
                <input style={inputStyle} placeholder="مکمل نام" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
                <input style={inputStyle} placeholder="فون نمبر" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} required />
                <input style={inputStyle} type="number" placeholder="فی گھنٹہ ریٹ" value={formData.hourlyRate} onChange={(e)=>setFormData({...formData, hourlyRate: e.target.value})} required />
                <input style={inputStyle} placeholder="علاقہ (مثلاً گلبرگ)" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} required />
                <button type="submit" style={addButtonStyle}>لسٹ میں شامل کریں</button>
              </form>
            </>
          )}
        </section>

        <section style={listSection}>
          <h2 style={{color: '#333'}}>دستیاب ماہرین ({filteredProviders.length})</h2>
          
          <input 
            type="text" 
            placeholder="نام یا علاقہ سرچ کریں..." 
            style={searchBarStyle} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div style={gridStyle}>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((p) => (
                <div key={p._id} style={cardStyle}>
                  <div style={avatarStyle}>{p.name[0]}</div>
                  <h3 style={{margin: '10px 0 5px 0'}}>{p.name}</h3>
                  <p style={locationText}>📍 {p.location}</p>
                  <p style={rateText}>Rs. {p.hourlyRate}</p>
                  
                  <div style={actionButtons}>
                    <a href={`tel:${p.phone}`} style={callButtonStyle}>📞 کال</a>
                    <a 
                      href={`https://wa.me/${p.phone}?text=${encodeURIComponent('سلام، مجھے آپ کی سروس کی ضرورت ہے۔')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={whatsappButtonStyle}
                    >
                      💬 WhatsApp
                    </a>
                    {/* صرف ایڈمن کو ڈیلیٹ بٹن نظر آئے گا */}
                    {token && <button onClick={() => deleteProvider(p._id)} style={deleteButtonStyle}>🗑️</button>}
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', color: '#888'}}>کوئی رزلٹ نہیں ملا!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// اسٹائلز (Styles) - یہ وہی رہیں گے جو آپ کے پاس تھے
const containerStyle = { backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Arial' };
const headerStyle = { backgroundColor: '#1a73e8', color: 'white', textAlign: 'center', padding: '20px', marginBottom: '30px' };
const mainContent = { display: 'flex', flexWrap: 'wrap', gap: '30px', padding: '0 20px', justifyContent: 'center' };
const formSection = { backgroundColor: 'white', padding: '20px', borderRadius: '12px', width: '350px', height: 'fit-content', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const listSection = { flex: '1', minWidth: '350px', maxWidth: '800px' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const addButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const searchBarStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '25px', border: '2px solid #1a73e8', fontSize: '16px', outline: 'none', boxSizing: 'border-box' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' };
const cardStyle = { backgroundColor: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };
const avatarStyle = { width: '50px', height: '50px', backgroundColor: '#e8f0fe', color: '#1a73e8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', margin: '0 auto' };
const locationText = { color: '#666', fontSize: '14px' };
const rateText = { color: '#1a73e8', fontWeight: 'bold', fontSize: '18px' };
const actionButtons = { display: 'flex', gap: '10px', marginTop: '15px' };
const callButtonStyle = { flex: '1', textDecoration: 'none', backgroundColor: '#1a73e8', color: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontSize: '12px' };
const whatsappButtonStyle = { flex: '1', textDecoration: 'none', backgroundColor: '#25D366', color: 'white', padding: '8px', borderRadius: '6px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' };
const deleteButtonStyle = { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' };

export default App;