import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/providers/login', { username, password });
      localStorage.setItem('token', res.data.token); // ٹوکن براؤزر میں سیو کریں
      setToken(res.data.token);
      alert("خوش آمدید! آپ لاگ ان ہو چکے ہیں۔");
    } catch (err) {
      alert("غلط معلومات! دوبارہ کوشش کریں۔");
    }
  };

  return (
    <div style={loginBoxStyle}>
      <h3>ایڈمن لاگ ان</h3>
      <form onSubmit={handleLogin}>
        <input style={inputStyle} type="text" placeholder="یوزر نیم" onChange={(e) => setUsername(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="پاس ورڈ" onChange={(e) => setPassword(e.target.value)} />
        <button style={btnStyle} type="submit">لاگ ان کریں</button>
      </form>
    </div>
  );
};

// سادہ اسٹائلنگ
const loginBoxStyle = { background: '#fff', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const inputStyle = { display: 'block', width: '100%', margin: '10px 0', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { background: '#1a73e8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' };

export default Login;