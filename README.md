# Safe-Circle
Imagine having a personal safety companion in your pocket, always ready to help at a moment’s notice. Our cutting-edge safety app allows you to send your live location and safety status instantly, ensuring your loved ones know where you are and how you’re doing. In an emergency, you can send quick, pre-set texts with just a tap, saving precious time when it matters most. Whether you're walking home late at night or traveling in an unfamiliar area, our app provides peace of mind and enhances your safety with real-time connectivity. Stay safe, stay connected, with our safety app.

* Venus Hacks May 24-26, 2024
* Members
    * Grace Zhen @G-Zhen
    * Jamie Phan @phanjamie
    * Hannah Huynh @hannahnh
    * Farahnaz Hoque @farahnazhoque

# Dev notes
### env
Firebase web project configurations. 
```
    FIREBASE_API_KEY = ...
    FIREBASE_AUTH_DOMAIN = ...
    FIREBASE_PROJECT_ID = ...
    FIREBASE_STORAGE_BUCKET = ...
    FIREBASE_MESSAGING_SENDER_ID = ...
    FIREBASE_WEB_APP_ID = ...
    FIREBASE_MEASUREMENT_ID = ...
```
Google Maps API
```
    EXPO_PUBLIC_GOOGLE_API_KEY = ...
```
#### ios folder
* Create an ios project on Firebase and download GoogleService-Info.plist. Add to ios directory. 
### run
To run your project, navigate to the directory and run one of the following yarn commands. Download Expo Go app on mobile and scan the QR code to see on phone. 

```
cd safecircle
yarn install
yarn web
```

#### if there are issues running yarn web 
```
rm -rf node_modules
yarn install
npm i
yarn web
```