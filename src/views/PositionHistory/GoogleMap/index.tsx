/* eslint-disable object-shorthand */
/* eslint-disable react/button-has-type */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, OverlayView, Polyline } from '@react-google-maps/api';
import carIcon from '../../../assets/images/carIcon.png';

interface AnimatedMarkerProps {
    points: { lat: number; lng: number }[];
    onPositionChange: (newPosition: { lat: number; lng: number }) => void;
    isPaused: boolean;
    duration: number;
    animationSpeed: number;
}

const EARTH_RADIUS_KM = 6371;

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({ points, onPositionChange, isPaused, animationSpeed, duration }) => {
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const [position, setPosition] = useState(points[0]);
    const [rotation, setRotation] = useState(0);

    const calculateTravelTime = (start: { lat: number; lng: number }, end: { lat: number; lng: number }): number => {
        const lat1 = start.lat * (Math.PI / 180);
        const lon1 = start.lng * (Math.PI / 180);
        const lat2 = end.lat * (Math.PI / 180);
        const lon2 = end.lng * (Math.PI / 180);

        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;

        const a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = EARTH_RADIUS_KM * c;
        const travelTime = distance / animationSpeed;

        return travelTime;
    };

    useEffect(() => {
        if (points.length === 0) {
            return;
        }

        let animationFrameId: number;

        const animateMarker = (timestamp: number) => {
            const startPosition = points[currentPositionIndex];
            const endPosition = points[(currentPositionIndex + 1) % points.length];
            const travelTime = calculateTravelTime(startPosition, endPosition);
            const startTime = timestamp;

            // Calculate rotation angle based on the direction to the next position
            const angle = Math.atan2(endPosition.lng - startPosition.lng, endPosition.lat - startPosition.lat);
            setRotation((angle * 180) / Math.PI);

            const updatePosition = (currentTime: number) => {
                const progress = currentTime - startTime;
                const progressPercent = Math.min(progress / (travelTime * 1000), 1);

                const newPosition = {
                    lat: startPosition.lat + (endPosition.lat - startPosition.lat) * progressPercent,
                    lng: startPosition.lng + (endPosition.lng - startPosition.lng) * progressPercent
                };

                // Cálculo do ângulo de rotação entre a posição atual e a próxima posição
                const rotationAngle = Math.atan2(endPosition.lng - startPosition.lng, endPosition.lat - startPosition.lat);

                setPosition(newPosition);
                onPositionChange(newPosition);
                setRotation((rotationAngle * 180) / Math.PI); // Define a rotação da imagem

                if (progressPercent < 1) {
                    animationFrameId = requestAnimationFrame(updatePosition);
                } else {
                    setCurrentPositionIndex((prevIndex) => (prevIndex + 1) % points.length);
                }
            };

            animationFrameId = requestAnimationFrame(updatePosition);
        };

        if (!isPaused) {
            animationFrameId = requestAnimationFrame(animateMarker);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [points, currentPositionIndex, isPaused, onPositionChange]);

    if (!points || points.length === 0) {
        return null; // Return null if there are no points to animate
    }
    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height / 2 })}
        >
            <div
                style={{
                    width: '47px',
                    height: '27px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${rotation + 90}deg)` // Aplica a rotação à imagem
                }}
            >
                <img src={carIcon} alt="Car Icon" style={{ width: '100%', height: '100%' }} />
            </div>
        </OverlayView>
    );
};

interface GoogleMapComponentProps {
    children?: React.ReactNode;
    defaultCenter: { lat: number; lng: number };
    apiKey: string | undefined;
    points: any[];
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ defaultCenter, apiKey = 'null', points, children }) => {
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [isPaused, setIsPaused] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(0.2);

    // const markerIcon = trackPoint.velocity > 62 ? mapIconWarning : mapIconCheck;
    // const markerTitle = trackPoint.velocity > 62 ? 'Aviso de velocidade excedida' : 'Ponto Normal';
    // const accStatus = trackPoint.acc_status == 1 ? 'Ligado' : 'Desligado';

    const handleIncreaseSpeed = () => {
        setAnimationSpeed(animationSpeed + 0.1);
    };

    const handleDecreaseSpeed = () => {
        setAnimationSpeed(Math.max(animationSpeed - 0.1, 0.1));
    };

    const handleTogglePause = () => {
        setIsPaused(!isPaused);
    };

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap mapContainerStyle={{ width: '100%', height: '600px' }} center={mapCenter} zoom={15}>
                {children}
                {points && (
                    <AnimatedMarker
                        points={points}
                        duration={2000}
                        onPositionChange={setMapCenter}
                        isPaused={isPaused}
                        animationSpeed={animationSpeed}
                    />
                )}
                <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
                    <button onClick={handleIncreaseSpeed}>Increase Speed</button>
                    <button onClick={handleDecreaseSpeed}>Decrease Speed</button>
                    <button onClick={handleTogglePause}>{isPaused ? 'Play' : 'Pause'}</button>
                </div>
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;
