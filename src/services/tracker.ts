import { fireStore } from './firebase';

// eslint-disable-next-line import/prefer-default-export
export async function getTrackerStateByDoc(tracker_imei: string) {
    const vehicles = await fireStore.collection('tracker_state').doc(tracker_imei).get();
    return vehicles;
}

export async function getTrackingPoints(tracker_imei: string, startTimestamp: number, endTimestamp: number) {
    const trackerPoints = await fireStore
        .collection('tracking')
        .doc(tracker_imei)
        .collection('points')
        .orderBy('timestamp', 'asc')
        .where('timestamp', '>=', startTimestamp)
        .where('timestamp', '<=', endTimestamp)
        .get();

    return trackerPoints;
}
