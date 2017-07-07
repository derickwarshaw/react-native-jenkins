import React from 'react';
import { Provider } from 'react-redux';
import { AppRegistry, /* AsyncStorage*/ } from 'react-native';

// import { persistStore /* , purgeStoredState */ } from 'redux-persist';


import makeStore from './redux/create';
import RestClient from './redux/middleware/RestClient';
import Startup from './startup';

// https://github.com/facebook/react-native/issues/9599
if (typeof global.self === 'undefined') {
  global.self = global;
}

console.disableYellowBox = true;

const restClient = new RestClient();
const store = makeStore(restClient);

// uncomment the following command to clear local storage during dev
// purgeStoredState({ storage: AsyncStorage });

// persistStore(store, { storage: AsyncStorage, blacklist: ['user'] });

export const Jenkins = () => (
  <Provider store={store} key="provider">
    <Startup />
  </Provider>
);

export default function createPlatform() {
  AppRegistry.registerComponent('jenkins', () => Jenkins);
}
