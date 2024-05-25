# Safe-Circle
Venus Hacks 2024

## App design (for devs)
* safecircle/AppNavigator.js -- add routes

## Add safecircle/env
Firebase config info
```
FIREBASE_API_KEY = ...
FIREBASE_AUTH_DOMAIN = ...
FIREBASE_PROJECT_ID = ...
FIREBASE_STORAGE_BUCKET = ...
FIREBASE_MESSAGING_SENDER_ID = ...
FIREBASE_WEB_APP_ID = ...
FIREBASE_MEASUREMENT_ID = ...
```
## Run app
To run your project, navigate to the directory and run one of the following yarn commands.
```
cd safecircle
yarn install

# choose run type
yarn android
yarn ios
yarn web
```
### If there are issues running yarn web 
```
rm -rf node_modules
yarn install
npm i
yarn web
```

### for chakra 
```
yarn add native-base
yarn add @react-native-async-storage/async-storage
yarn add @react-native-community/netinfo
yarn add react-native-safe-area-context


yarn add @react-native-community/masked-view
yarn add @react-native-svg
yarn add react-native-safe-area-context
yarn add react-native-screens

```
