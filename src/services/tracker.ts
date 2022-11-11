import { fireStore } from './firebase';

// eslint-disable-next-line import/prefer-default-export
export async function getTrackerStateByDoc(tracker_imei: string) {
    const vehicles = await fireStore.collection('tracker_state').doc(tracker_imei).get();
    return vehicles;
}
