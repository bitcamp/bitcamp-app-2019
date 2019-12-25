import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { registerRootComponent, AppLoading } from 'expo';
import App from './src/App';
import { colors } from './src/components/Colors';
import StatusBar from './src/components/StatusBar';
import EventManager from './src/events/EventsManager';
import { loadAssets } from './src/utils/loadAssets';

const eventManager = new EventManager();

const Main = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  return appIsReady
    ? (<PaperProvider>
        {Platform.OS === 'ios' ? null : (
          <StatusBar
            backgroundColor='#000000'
            barStyle='light-content'
          />
        )}
        <App eventManager={eventManager}/>
      </PaperProvider>
    ) : (
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => setAppIsReady(true)}
        onError={console.warn}
      />
    );
}

registerRootComponent(Main);