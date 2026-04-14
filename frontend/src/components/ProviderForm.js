import React, { useState } from 'react';

const ProviderForm = ({ serviceName, onClose }) => {
  // 1. پرانی اسٹیٹ کے ساتھ فائل والی اسٹیٹ یہاں رکھی ہے
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    phone: '',
    hourlyRate: ''
  });

  // 2. نیا handleSubmit جو اب FormData استعمال کر رہا ہے
  const handleSubmit = async (e) => {
    e.preventDefault();

    // فائل اور ڈیٹا بھیجنے کے لیے FormData کا ابجیکٹ بنانا لازمی ہے
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    data.append('hourlyRate', formData.hourlyRate);
    data.append('location', formData.area); // ماڈل کے مطابق location
    data.append('skill', serviceName);      // ماڈل کے مطابق skill
    data.append('image', file);             // تصویر یہاں ایڈ ہوگی

    try {
      // نوٹ: جب ہم FormData بھیجتے ہیں تو headers میں 'Content-Type' دینے کی ضرورت نہیں ہوتی، براؤزر خود کر لیتا ہے
      const response = await fetch('http://localhost:5000/api/providers/add', {
        method: 'POST',
        body: data, // یہاں اب JSON.stringify نہیں ہے، بلکہ سیدھا 'data' ہے
      });

      if (response.ok) {
        alert("تصویر کے ساتھ رجسٹریشن کامیاب ہو گئی ہے!");
        onClose(); 
      } else {
        const errorData = await response.json();
        alert(`رجسٹریشن میں مسئلہ: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("سرور سے رابطہ نہیں ہو رہا۔ اپنا بیکنڈ چیک کریں!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register as a {serviceName}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Your Full Name" 
            required 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          
          <input 
            type="text" 
            placeholder="Area Name (e.g. Gulshan, Saddar)" 
            required 
            onChange={(e) => setFormData({...formData, area: e.target.value})} 
          />
          
          <input 
            type="tel" 
            placeholder="Phone Number" 
            required 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
          
          <input 
            type="number" 
            placeholder="Hourly Rate (PKR)" 
            required 
            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} 
          />

          {/* 3. تصویر اپلوڈ کرنے کے لیے نیا ان پٹ فیلڈ یہاں ایڈ کیا ہے */}
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Profile Picture:</label>
            <input 
              type="file" 
              accept="image/*" 
              required 
              onChange={(e) => setFile(e.target.files[0])} 
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Register Now</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderForm;