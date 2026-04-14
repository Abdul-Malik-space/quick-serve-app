import React, { useState, useEffect } from 'react'; // useEffect شامل کیا
import { io } from 'socket.io-client';

// ساکٹ کنکشن (بیکنڈ پورٹ 5000 کے ساتھ)
const socket = io('http://localhost:5000');

const ProviderDashboard = () => {
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState(null);

  // ساکٹ لاجک: جب 'provider' ڈیٹا سیٹ ہو جائے
  useEffect(() => {
    if (provider && provider._id) {
      // بیکنڈ کو بتاؤ کہ یہ مخصوص پلمبر آن لائن آ گیا ہے
      socket.emit('markOnline', provider._id);

      // جب پلمبر لاگ آؤٹ کرے یا پیج چھوڑ کر جائے
      return () => {
        socket.disconnect(); 
      };
    }
  }, [provider]);

  // لاگ ان فنکشن
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/providers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      if (response.ok) {
        setProvider(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // مینوئل بٹن (اگر ساکٹ کے علاوہ خود بھی بدلنا چاہیں)
  const toggleStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/providers/toggle-status/${provider._id}`, {
        method: 'PATCH',
      });
      const updatedData = await response.json();
      setProvider(updatedData);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!provider) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Service Provider Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="tel" 
            placeholder="Enter your Phone Number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
            style={{ padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <br /><br />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Login to Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h1>Welcome, {provider.name}!</h1>
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        width: '300px', 
        margin: '0 auto', 
        borderRadius: '15px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ position: 'relative', width: '100px', margin: '0 auto' }}>
            <img 
              src={`http://localhost:5000/${provider.image?.replace(/\\/g, '/')}`} 
              alt="Profile" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: provider.isOnline ? '4px solid #10b981' : '4px solid #ddd' }}
            />
            {provider.isOnline && <span style={{ position: 'absolute', bottom: '5px', right: '5px', width: '15px', height: '15px', backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid white' }}></span>}
        </div>

        <h3>Status: <span style={{ color: provider.isOnline ? '#10b981' : '#ef4444' }}>
          {provider.isOnline ? 'Online' : 'Offline'}
        </span></h3>
        
        <p style={{ fontSize: '14px', color: '#666' }}>آپ ابھی لاگ ان ہیں، یوزرز آپ کو آن لائن دیکھ سکتے ہیں۔</p>

        <button 
          onClick={toggleStatus}
          style={{
            backgroundColor: provider.isOnline ? '#ef4444' : '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          {provider.isOnline ? 'Go Offline 🔴' : 'Go Online 🟢'}
        </button>
      </div>
      <br />
      <button onClick={() => setProvider(null)} style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
    </div>
  );
};

export default ProviderDashboard;