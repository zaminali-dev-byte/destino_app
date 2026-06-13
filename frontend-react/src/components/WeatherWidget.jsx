import React, { useState, useEffect } from 'react';

const WeatherWidget = ({ location }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Weather API Generator
        // Generates realistic weather based on a hash of the location string
        const generateMockWeather = (loc) => {
            const temps = [22, 28, 32, 15, 10, 5, 25, 30];
            const conditions = [
                { text: 'Sunny', icon: 'fa-sun', color: '#f59e0b' },
                { text: 'Partly Cloudy', icon: 'fa-cloud-sun', color: '#64748b' },
                { text: 'Light Rain', icon: 'fa-cloud-rain', color: '#3b82f6' },
                { text: 'Clear', icon: 'fa-moon', color: '#1e293b' }
            ];
            
            // simple hash to make it deterministic per location
            let hash = 0;
            for (let i = 0; i < loc.length; i++) hash += loc.charCodeAt(i);
            
            const baseTemp = temps[hash % temps.length];
            const currentCond = conditions[hash % conditions.length];
            
            return {
                current: { temp: baseTemp, condition: currentCond.text, icon: currentCond.icon, color: currentCond.color, humidity: 45 + (hash % 40) },
                forecast: [
                    { day: 'Tomorrow', temp: baseTemp + 2, icon: conditions[(hash+1) % conditions.length].icon },
                    { day: 'Day 3', temp: baseTemp - 1, icon: conditions[(hash+2) % conditions.length].icon },
                    { day: 'Day 4', temp: baseTemp + 1, icon: conditions[(hash+3) % conditions.length].icon }
                ]
            };
        };

        setLoading(true);
        setTimeout(() => {
            setWeather(generateMockWeather(location || 'Global'));
            setLoading(false);
        }, 800); // simulate network delay
    }, [location]);

    if (loading) return (
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #eee' }}>
            <i className="fas fa-spinner fa-spin text-primary"></i> Fetching Live Weather...
        </div>
    );

    if (!weather) return null;

    return (
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginTop: '30px' }}>
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Live Weather: {location || 'Destination'}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'normal' }}>Updated just now</span>
            </h4>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <i className={`fas ${weather.current.icon}`} style={{ fontSize: '48px', color: weather.current.color }}></i>
                    <div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1' }}>{weather.current.temp}°C</div>
                        <div style={{ fontSize: '14px', color: '#cbd5e1' }}>{weather.current.condition}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '13px', color: '#94a3b8' }}>
                    <div>Humidity: {weather.current.humidity}%</div>
                    <div>Wind: {Math.floor(weather.current.temp / 2)} km/h</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {weather.forecast.map((f, i) => (
                    <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '5px' }}>{f.day}</div>
                        <i className={`fas ${f.icon}`} style={{ fontSize: '20px', color: '#fcd34d', marginBottom: '5px' }}></i>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{f.temp}°C</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherWidget;
