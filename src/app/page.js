"use client"
import { useEffect } from "react";
import AboutModal from '../components/AboutModal';
import MapComponent from '../components/MapComponent';

export default function HomePage() {
    useEffect(() => {
        document.title = "Conexão hospitalar";
    }, []);
    return (
        <>
            <MapComponent />
            <AboutModal />
        </>
    );
}
