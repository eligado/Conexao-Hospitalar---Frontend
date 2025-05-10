import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import { Box, TextField } from '@mui/material';

const containerStyle = {
    width: '100vw',
    height: '100vh',
};

const defaultCenter = {
    lat: -3.119028,
    lng: -60.021731,
};

export default function MapComponent() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDYy0bWIoQF8NLmjVMcuYwBXGNtGK76dUw',
        libraries: ['places'],
    });

    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [currentLocation, setCurrentLocation] = useState(null);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (isLoaded && inputRef.current && !autocompleteRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    const location = place.geometry.location;
                    const newPosition = {
                        lat: location.lat(),
                        lng: location.lng(),
                    };
                    setMarkerPosition(newPosition);
                    map.panTo(newPosition);
                }
            });
            autocompleteRef.current = autocomplete;
        }
    }, [isLoaded, map]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = {
                        lat: latitude,
                        lng: longitude,
                    };
                    setCurrentLocation(newPosition);
                    setMarkerPosition(newPosition);
                    if (map) {
                        map.panTo(newPosition);
                    }
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                }
            );
        } else {
            console.error('Geolocalização não é suportada por este navegador.');
        }
    }, [map]);

    if (loadError) return <div>Erro ao carregar o mapa</div>;
    if (!isLoaded) return <div>Carregando mapa...</div>;

    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 5,
                    width: '300px',
                }}
            >
                <TextField
                    inputRef={inputRef}
                    label="Pesquisar local"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                />
            </Box>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={markerPosition}
                zoom={15}
                onLoad={(mapInstance) => setMap(mapInstance)}
                options={{
                    fullscreenControl: false,
                }}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </>
    );
}
