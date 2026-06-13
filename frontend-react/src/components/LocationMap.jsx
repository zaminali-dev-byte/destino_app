import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const LocationMap = ({ title, lat, lng }) => {
    // Default to a central coordinate if none provided
    const position = [lat || 33.6844, lng || 73.0479]; 

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
            <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                    <Popup>
                        <strong>{title || 'Destination'}</strong><br />
                        Beautiful location waiting for you!
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationMap;
