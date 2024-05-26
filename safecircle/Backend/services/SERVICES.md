# Backend for App Features

## dependencies downloaded to test for features
### contacts
```
npm install react-native-contacts
cd ios
npx pod-install

# if pod install issues
cd ios
    #add line to Podfile: pod 'GoogleUtilities', :modular_headers => true
pod install --repo-update        
```
### get location
```
npm install react-native-geolocation-service
cd ios
npx pod-install
```
### share location
```
npm install @transistorsoft/react-native-background-geolocation
cd ios
npx pod-install
```