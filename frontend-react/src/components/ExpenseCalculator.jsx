import React, { useState } from 'react';

const ExpenseCalculator = () => {
    const [guests, setGuests] = useState(1);
    const [duration, setDuration] = useState(1);
    const [tourClass, setTourClass] = useState('standard');
    const [vehicle, setVehicle] = useState('bus');

    const calculateCost = () => {
        let basePerDay = 50; // standard per day cost
        
        if (tourClass === 'premium') basePerDay += 50;
        if (tourClass === 'luxury') basePerDay += 150;

        let vehicleCost = 0;
        if (vehicle === 'car') vehicleCost = 40;
        if (vehicle === 'suv') vehicleCost = 80;
        if (vehicle === 'van') vehicleCost = 120;
        if (vehicle === 'bus') vehicleCost = 200;

        // Formula: (Base * guests * duration) + (vehicle * duration)
        return (basePerDay * guests * duration) + (vehicleCost * duration);
    };

    return (
        <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderTop: '4px solid #0071c2', margin: '40px 0' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '24px', textAlign: 'center', color: '#333' }}>
                <i className="fas fa-calculator" style={{ color: '#0071c2', marginRight: '10px' }}></i>
                Trip Expense Calculator
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Number of Guests</label>
                    <input type="range" min="1" max="20" value={guests} onChange={e => setGuests(parseInt(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#0071c2' }}>{guests} {guests === 1 ? 'Person' : 'People'}</div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Duration (Days)</label>
                    <input type="range" min="1" max="30" value={duration} onChange={e => setDuration(parseInt(e.target.value))} style={{ width: '100%' }} />
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#0071c2' }}>{duration} {duration === 1 ? 'Day' : 'Days'}</div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Accommodation Class</label>
                    <select value={tourClass} onChange={e => setTourClass(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <option value="standard">Standard (3-Star)</option>
                        <option value="premium">Premium (4-Star)</option>
                        <option value="luxury">Luxury (5-Star)</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Transport By</label>
                    <select value={vehicle} onChange={e => setVehicle(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <option value="car">Private Car (1-3 pax)</option>
                        <option value="suv">Private SUV (4-6 pax)</option>
                        <option value="van">Hiace Van (7-12 pax)</option>
                        <option value="bus">Saloon Coaster (13+ pax)</option>
                    </select>
                </div>
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px dashed #ccc' }}>
                <span style={{ fontSize: '16px', color: '#666', display: 'block', marginBottom: '5px' }}>Estimated Total Cost</span>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>${calculateCost()}</span>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>*Note: This is an estimated price. Actual costs vary by destination.</p>
            </div>
        </div>
    );
};

export default ExpenseCalculator;
