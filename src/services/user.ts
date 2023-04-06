import { UserProfile } from 'types/user-profile';
import { fireStore } from './firebase';
import { toast } from 'react-toastify';

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

    toast.success('Dados atualizados com sucesso!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
    });

    return docRef;
}
