import { Grid } from '@mui/material';
import { Autocomplete, GoogleMap, LoadScript, Polygon, useJsApiLoader } from '@react-google-maps/api';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';
import { RefObject, useEffect, useState } from 'react';
import { getAddressByLatLng } from 'utils/axios';

interface Props {
    children?: React.ReactNode;
    apiKey: string | undefined;
    map: any;
    setMap: any;
    setPaths: (value: any[]) => void;
    paths: any[];
    zoneModel: any;
    setZoneModel: (value: any) => void;
    setPolygon: (value: any) => void;
}

const containerStyle = {
    width: '100%',
    height: '100%'
};

const googleMapsLibraries: Libraries = ['places', 'geometry'];

const GoogleMapComponent = ({ children, map, setMap, setPaths, paths, setZoneModel, zoneModel, setPolygon, apiKey = 'null' }: Props) => {
    const min480 = useMediaQuery('(min-width:600px)');
    const [searchResult, setSearchResult] = useState();
    const [newCenter, setNewCenter] = useState<any>({
        lat: -3.7402,
        lng: -38.4997
    });
    const defaultCenter = {
        lat: -3.7402,
        lng: -38.4997
    };
    const newPolygonOptions = {
        fillOpacity: 0.1,
        strokeColor: '#5A35B4',
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: true,
        geodesic: false,
        zIndex: 1
    };
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: googleMapsLibraries
    });

    // Autocomplete React-Google-Maps Functions
    const onPlaceChanged = async () => {
        setPaths([]);
        if (searchResult != null && map) {
            let place: any = searchResult;
            place = place.getPlace();
            map.setZoom(18);
            setNewCenter({
                lat: parseFloat(place.geometry.location.lat()),
                lng: parseFloat(place.geometry.location.lng())
            });
            const { data } = await getAddressByLatLng(parseFloat(place.geometry.location.lat()), parseFloat(place.geometry.location.lng()));
            const addressFormated = data.results[0].formatted_address;
            setZoneModel({ ...zoneModel, zoneAddress: addressFormated });

            const corner1 = { lat: place.geometry.location.lat() - 0.001, lng: place.geometry.location.lng() - 0.001 };
            const corner2 = { lat: place.geometry.location.lat() - 0.001, lng: place.geometry.location.lng() + 0.001 };
            const corner3 = { lat: place.geometry.location.lat() + 0.001, lng: place.geometry.location.lng() + 0.001 };
            const corner4 = { lat: place.geometry.location.lat() + 0.001, lng: place.geometry.location.lng() - 0.001 };
            setPaths([corner1, corner2, corner3, corner4]);
        } else {
            alert('Maps não foi inicializado corretamente!');
        }
    };
    const onLoadSearch = (autocomplete: any) => {
        setSearchResult(autocomplete);
    };

    const renderMap = () => (
        <Grid container style={{ position: 'relative', width: '100%', height: '90%' }}>
            <Grid container sx={{ position: 'absolute', zIndex: 1, width: '100%', marginTop: min480 ? 1.5 : 8 }}>
                <Grid item sx={{ width: min480 ? '200px' : '0' }}>
                    <></>
                </Grid>
                <Grid
                    item
                    sx={{ width: min480 ? '100%' : '60%', marginLeft: min480 ? '220px' : '10px', marginRight: min480 ? '80px' : '0' }}
                >
                    <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoadSearch}>
                        <input
                            type="text"
                            placeholder="Pesquise o endereço da nova zona"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: '100%',
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`
                            }}
                        />
                    </Autocomplete>
                </Grid>
                <Grid item sx={{ width: min480 ? '50px' : '0' }}>
                    <></>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ width: '100%', height: '100%', position: 'absolute' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={newCenter}
                    zoom={11}
                    onLoad={(mapInstance: any) => {
                        setMap(mapInstance);
                    }}
                >
                    <Polygon onLoad={(element) => setPolygon(element)} paths={paths} options={newPolygonOptions} />
                    {children}
                </GoogleMap>
            </Grid>
        </Grid>
    );
    return isLoaded ? renderMap() : <p>Loading...</p>;
};
export default GoogleMapComponent;
