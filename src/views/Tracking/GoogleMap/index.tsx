import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import SuperClusterAlgorithm from './utils/superClusterAlgorithm';
import trees from './data/trees';

export default function Index() {
    const [mapContainer, setMapContainer] = useState<null | HTMLDivElement>(null);
    const onLoadd = useCallback((map) => addMarkers(map), []);

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY ? process.env.REACT_APP_GOOGLE_MAPS_KEY : 'null'}
            libraries={['places', 'geometry']}
        >
            <GoogleMap
                center={{ lat: 43.68, lng: -79.43 }}
                zoom={11}
                onLoad={(map: any) => {
                    addMarkers(map);
                }}
            >
                <div ref={(node) => setMapContainer(node)} style={{ height: '100vh' }} />
            </GoogleMap>
        </LoadScript>
    );
}

function addMarkers(map: any) {
    const infoWindow = new google.maps.InfoWindow();

    console.log(trees);
    const markers = trees.map(([name, lat, lng]) => {
        // Certifique-se de converter lat e lng em números
        const latitude = Number(lat);
        const longitude = Number(lng);

        // Verifique se a conversão foi bem-sucedida
        if (!isNaN(latitude) && !isNaN(longitude)) {
            const marker = new google.maps.Marker({ position: { lat: latitude, lng: longitude } });

            marker.addListener('click', () => {
                infoWindow.setPosition({ lat: latitude, lng: longitude });
                infoWindow.setContent(`
                    <div class="info-window">
                    <h2>${name}</h2>
                    </div>
                `);
                infoWindow.open({ map });
            });

            return marker;
        }

        return null; // Ou trate como um erro se a conversão falhar
    });

    // Remova marcadores nulos (caso a conversão tenha falhado)
    const validMarkers = markers.filter((marker) => marker !== null);

    // eslint-disable-next-line no-new
    new MarkerClusterer({
        markers: validMarkers,
        map,
        algorithm: new SuperClusterAlgorithm({ radius: 200 })
    });
}

// import React, { useEffect, useState } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import { DefaultRenderer, MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
// import carIcon from '../../../assets/images/carIcon.png';

// interface Props {
//     children?: React.ReactNode;
//     defaultCenter: { lat: number; lng: number };
//     apiKey: string | undefined;
// }

// const GoogleMapComponent = ({ apiKey = 'null', defaultCenter, children }: Props) => {
//     const [map, setMap] = useState<any>(null);
//     const [markers, setMarkers] = useState<any>([]);
//     const [reRender, setReRender] = useState(false);

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
//         script.async = true;
//         script.defer = true;
//         script.onload = initializeMap;
//         document.head.appendChild(script);

//         return () => {
//             document.head.removeChild(script);
//         };
//     }, [apiKey]);

//     useEffect(() => {
//         if (markers) {
//             console.log('veio');
//             setReRender(!reRender);
//         }
//     }, [markers]);

//     const initializeMap = () => {
//         // @ts-ignore
//         const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//             center: defaultCenter,
//             zoom: 4
//         });

//         const initialMarkers = [
//             { id: 1, position: { lat: -3.7402, lng: -38.4997 } },
//             { id: 2, position: { lat: -3.741, lng: -38.498 } },
//             { id: 3, position: { lat: -3.742, lng: -38.497 } },
//             { id: 4, position: { lat: -23.5505, lng: -46.6333 } },
//             { id: 5, position: { lat: -7.1219, lng: -34.8829 } },
//             { id: 6, position: { lat: -7.2268, lng: -35.8828 } }
//         ];

//         const markerObjects = initialMarkers.map(
//             (marker: any) =>
//                 new window.google.maps.Marker({
//                     position: marker.position,
//                     map: mapInstance
//                 })
//         );

//         setMap(mapInstance);
//         setMarkers(markerObjects);

//         // Cria o cluster de marcadores
//         const renderer = {
//             // @ts-ignore
//             render({ count, position }, stats: any) {
//                 const svg = window.btoa(`
//                 <svg width="100" height="100" >
//                 <defs>
//                   <pattern id="image-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" >
//                     <image href="https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb" x="0" y="0" width="100" height="120" />
//                   </pattern>
//                 </defs>
//                 <circle cx="50" cy="50" r="40" stroke="orange" stroke-width="4" fill="url(#image-pattern)" />
//               </svg>`);
//                 return new google.maps.Marker({
//                     position,
//                     icon: {
//                         url: svg,
//                         scaledSize: new google.maps.Size(45, 45)
//                     },
//                     title: `Cluster of ${count} markers`,
//                     zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
//                 });
//             }
//         };

//         const markerCluster = new MarkerClusterer({
//             map: mapInstance,
//             markers: markerObjects,
//             algorithm: new SuperClusterAlgorithm({ radius: 80 })
//         });

//         setReRender(!reRender);
//     };

//     return (
//         <LoadScript googleMapsApiKey={apiKey}>
//             <GoogleMap id="map" mapContainerStyle={{ width: '100%', height: '400px' }} center={defaultCenter} zoom={4}>
//                 {reRender && <></>}
//                 {children}
//             </GoogleMap>
//         </LoadScript>
//     );
// };

// export default GoogleMapComponent;
