import { fireStore } from './firebase';

// eslint-disable-next-line import/prefer-default-export
export async function myProfile() {
    const isPlate = fireStore.collection('users').onSnapshot((querySnapshot) => {
        const linh = querySnapshot.forEach((row) => console.log(row.data()));
    });

    return isPlate;
}
