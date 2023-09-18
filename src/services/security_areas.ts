/* eslint-disable import/prefer-default-export */
import { fireStore, auth } from './firebase';
import { toast } from 'react-toastify';

// Create zone
// eslint-disable-next-line consistent-return
export async function createSecurityArea(zoneModel: any) {
    try {
        const docRef = await fireStore.collection('security_areas').add({
            user_id: auth.currentUser?.uid,
            user_email: auth.currentUser?.email,
            aditional_emails: [],
            areaType: 'polygon',
            polygonPaths: zoneModel.polygonPaths,
            name: zoneModel.zoneName,
            address: zoneModel.zoneAddress,
            assigned_trackers: zoneModel.assignedTrackers
        });
        return docRef;
    } catch (e) {
        toast.error('Erro ao criar zona!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        });
    }
}

// eslint-disable-next-line consistent-return
export async function editSecurityArea(zoneModel: any, id: string) {
    try {
        const docRef = await fireStore.collection('security_areas').doc(id).update({
            polygonPaths: zoneModel.polygonPaths,
            name: zoneModel.zoneName,
            address: zoneModel.zoneAddress
        });
        return docRef;
    } catch (e) {
        console.log(e);
        toast.error('Erro ao editar zona!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        });
    }
}

// eslint-disable-next-line consistent-return
export async function editSecurityAreaVehicles(vehicles: string[], id: string) {
    try {
        const docRef = await fireStore.collection('security_areas').doc(id).update({
            assigned_trackers: vehicles
        });
        return docRef;
    } catch (e) {
        console.log(e);
        toast.error('Erro ao editar zona!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
        });
    }
}

// eslint-disable-next-line consistent-return
export async function getAllSecurityAreas() {
    try {
        const securityAreas = await fireStore.collection('security_areas').where('user_id', '==', auth.currentUser?.uid).get();
        const securityAreasFormated: any = [];

        securityAreas.docs.map((securityArea) => {
            securityAreasFormated.push({ id: securityArea.id, ...securityArea.data() });
        });
        return securityAreasFormated;
    } catch (e) {
        console.log(e);
    }
}
