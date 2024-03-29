import { fireStore, auth } from './firebase';
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

export async function getVehicleByUserId() {
    const userId = await auth.currentUser?.uid;
    const vehicles = await fireStore.collection('vehicles').where('id_user', '==', userId).get();

    const vehiclesSnapshotArray: any = [];
    vehicles.forEach((vehicle: any) => {
        vehiclesSnapshotArray.push(vehicle.data());
    });
    return vehiclesSnapshotArray;
}

export async function getVehicleByImei(imei: string) {
    const vehicle = await fireStore.collection('vehicles').where('tracker_imei', '==', imei).get();
    let data;
    // eslint-disable-next-line @typescript-eslint/no-shadow, arrow-body-style
    vehicle.forEach((vehicle: any) => {
        data = vehicle.data();
    });
    return data;
}
