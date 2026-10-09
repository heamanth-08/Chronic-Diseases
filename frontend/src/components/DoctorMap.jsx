import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing in React/Vite
// Guard with conditional check to avoid errors if already patched
try {
  if (L.Icon.Default.prototype._getIconUrl) {
    delete L.Icon.Default.prototype._getIconUrl;
  }
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
} catch (e) {
  console.warn('Leaflet icon patch skipped:', e);
}


// Mock doctor data based on specialty
const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', lat: 40.7128, lng: -74.0060, address: '123 Heart Center Ave', distance: '1.2 miles away', rating: '4.9/5' },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Endocrinologist', lat: 40.7150, lng: -74.0110, address: '456 Diabetes Clinic Rd', distance: '2.5 miles away', rating: '4.8/5' },
  { id: 3, name: 'Dr. Emily Patel', specialty: 'General Physician', lat: 40.7200, lng: -73.9900, address: '789 City Medical', distance: '3.0 miles away', rating: '4.7/5' },
  { id: 4, name: 'Dr. Robert Davis', specialty: 'Pulmonologist', lat: 40.7050, lng: -74.0150, address: '101 Lung Care Plaza', distance: '4.1 miles away', rating: '4.9/5' },
  { id: 5, name: 'Dr. Lisa Wong', specialty: 'Nephrologist', lat: 40.7300, lng: -73.9950, address: '202 Kidney Health St', distance: '5.5 miles away', rating: '4.6/5' }
];

export default function DoctorMap({ recommendedSpecialty }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Filter doctors based on the recommended specialty, or show all if none specified
    if (recommendedSpecialty && recommendedSpecialty !== 'General Physician') {
      const filtered = MOCK_DOCTORS.filter(d =>
        d.specialty.toLowerCase().includes(recommendedSpecialty.toLowerCase().replace(' specialist', ''))
      );
      // If we found matches, use them; otherwise, fallback to general + random
      setDoctors(filtered.length > 0 ? filtered : MOCK_DOCTORS.slice(0, 3));
    } else {
      setDoctors(MOCK_DOCTORS.slice(0, 3));
    }
  }, [recommendedSpecialty]);

  // Center on NYC (mock location)
  const position = [40.7128, -74.0060];

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Recommended Specialists Near You</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        Based on your results, we recommend consulting a <strong>{recommendedSpecialty || 'General Physician'}</strong>. Here are highly-rated specialists in your area.
      </p>

      <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {doctors.map(doc => (
            <Marker key={doc.id} position={[doc.lat, doc.lng]}>
              <Popup>
                <div>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.2rem' }}>{doc.name}</strong>
                  <span style={{ display: 'block', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{doc.specialty}</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                    <div>📍 {doc.address} ({doc.distance})</div>
                    <div>⭐ {doc.rating}</div>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: '100%' }}>
                    Book Appointment
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
