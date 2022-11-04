import { UserProfile } from 'types/user-profile';
import { fireStore } from './firebase';

// eslint-disable-next-line import/prefer-default-export
export async function myProfile(id: string): Promise<firebase.default.firestore.DocumentData | undefined | UserProfile> {
    const docRef = (await fireStore.collection('users').doc(id).get()).data();

    return docRef;
}

export async function updateMyProfile(data: UserProfile): Promise<void> {
    const docRef = await fireStore.collection('users').doc(data.id).update({
        name: data.name,
        email: data.email,
        address: data.address,
        cnpj: data.cnpj,
        cpf: data.cpf,
        phone: data.phone,
        rg: data.rg
    });

    return docRef;
}
