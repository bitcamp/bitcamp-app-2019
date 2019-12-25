import * as Font from 'expo-font';

export async function loadAssets() {
    try {
        await Font.loadAsync({
            'Aleo-Bold': require('../../assets/fonts/Aleo-Bold.otf'),
        });
    } catch (e) {
        console.warn(
            'There was an error loading assets, perhaps due to a ' +
            'network timeout. Reload the app to try again.'
        );
        console.log(e.message);
    }
}