import GoogleMapComponent from './GoogleMap';

const Tracking = () => {
    const defaultCenter = {
        lat: -3.7402,
        lng: -38.4997
    };

    return (
        <>
            {/* <GoogleMapComponent apiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY} defaultCenter={defaultCenter} /> */}
            <GoogleMapComponent />
        </>
    );
};

export default Tracking;
