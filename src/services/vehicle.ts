import { fireStore } from './firebase';
import { getTrackerStateByDoc } from 'services/tracker';

// eslint-disable-next-line import/prefer-default-export
export async function getAllVehicles() {
    const vehicles = await fireStore.collection('vehicles').get();

    const vehiclesSnapshotArray: any = [];
    vehicles.forEach((vehicle: any) => {
        vehiclesSnapshotArray.push(vehicle);
    });

    const vehiclesData: any = [];
    vehiclesSnapshotArray.forEach(async (vehicle: any) => {
        vehiclesData.push({
            placa: vehicle.data().plate,
            marca: vehicle.data().brand,
            cor: vehicle.data().color,
            ano: vehicle.data().year,
            tipo: vehicle.data().type,
            km: vehicle.data().km,
            tracker_imei: vehicle.data().tracker_imei
        });
    });

    vehiclesData.map(async (vehicle: any) => {
        (async () => {
            const trackerState = await getTrackerStateByDoc(vehicle.tracker_imei);
            vehicle.ancoragem = trackerState?.data()?.is_anchored ? 'ativo' : 'inativo';
        })();
    });
    return vehiclesData;
}
