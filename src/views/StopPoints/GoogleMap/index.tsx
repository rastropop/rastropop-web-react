import { GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

interface Props {
    children?: React.ReactNode;
    defaultCenter: { lat: number; lng: number };
    apiKey: string | undefined;
}

const containerStyle = {
    width: '100%',
    height: '100%'
};

const googleMapsLibraries: Libraries = ['places', 'geometry'];

const GoogleMapComponent = ({ children, defaultCenter, apiKey = 'null' }: Props) => (
    <LoadScript googleMapsApiKey={apiKey} libraries={googleMapsLibraries}>
        <GoogleMap mapContainerStyle={containerStyle} center={{ lat: defaultCenter.lat, lng: defaultCenter.lng }} zoom={11}>
            {children}
        </GoogleMap>
    </LoadScript>
);
export default GoogleMapComponent;
