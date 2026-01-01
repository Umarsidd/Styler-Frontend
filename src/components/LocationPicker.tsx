import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import L from 'leaflet';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Fix Leaflet default marker icon issue with Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationSelect: (lat: number, lng: number) => void;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
    latitude,
    longitude,
    onLocationSelect,
}) => {
    // Default to center of India if no coordinates
    const [position, setPosition] = useState<[number, number]>([
        latitude || 20.5937,
        longitude || 78.9629,
    ]);
    const [hasLocation, setHasLocation] = useState<boolean>(!!latitude && !!longitude);

    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
            setHasLocation(true);
        }
    }, [latitude, longitude]);

    const handleLocationSelect = useCallback((lat: number, lng: number) => {
        setPosition([lat, lng]);
        setHasLocation(true);
        onLocationSelect(lat, lng);
    }, [onLocationSelect]);

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    handleLocationSelect(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your current location. Please ensure location permissions are enabled.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    return (
        <Box>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Click on the map to select your salon's location
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<MyLocationIcon />}
                        onClick={handleGetCurrentLocation}
                    >
                        Use Current Location
                    </Button>
                </Box>

                <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                    <MapContainer
                        center={position}
                        zoom={13}
                        style={{ height: '400px', width: '100%' }}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickHandler onLocationSelect={handleLocationSelect} />
                        {hasLocation && (
                            <Marker
                                position={position}
                                draggable={true}
                                eventHandlers={{
                                    dragend: (e) => {
                                        const marker = e.target;
                                        const position = marker.getLatLng();
                                        handleLocationSelect(position.lat, position.lng);
                                    },
                                }}
                            />
                        )}
                    </MapContainer>
                </Paper>

                {hasLocation && latitude && longitude && (
                    <Paper sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Selected Coordinates:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Latitude: <strong>{latitude.toFixed(6)}</strong>
                        </Typography>
                        <Typography variant="body2">
                            Longitude: <strong>{longitude.toFixed(6)}</strong>
                        </Typography>
                    </Paper>
                )}
            </Stack>
        </Box>
    );
};

export default LocationPicker;
