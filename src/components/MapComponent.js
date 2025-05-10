import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Box, TextField } from '@mui/material';

const containerStyle = {
    width: '100vw',
    height: '100vh',
};

const center = {
    lat: -3.119028,
    lng: -60.021731,
};

export default function MapComponent() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDYy0bWIoQF8NLmjVMcuYwBXGNtGK76dUw',
        libraries: ['places'],
    });

    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(center);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (isLoaded && inputRef.current && !autocompleteRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    const location = place.geometry.location;
                    setMarkerPosition({
                        lat: location.lat(),
                        lng: location.lng(),
                    });
                    map.panTo(location);
                }
            });
            autocompleteRef.current = autocomplete;
        }
    }, [isLoaded, map]);

    if (loadError) return <div>Erro ao carregar o mapa</div>;
    if (!isLoaded) return <div></div>;

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
                zoom={13}
                onLoad={(mapInstance) => setMap(mapInstance)}
                options={{
                    fullscreenControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </>
    );
}
