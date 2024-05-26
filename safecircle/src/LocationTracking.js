import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native';
import MapView, { AnimatedRegion, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TabBar from '../screens/TabBar';

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const { width, height } = Dimensions.get('window');

class LocationTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: { latitude: LATITUDE, longitude: LONGITUDE },
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      destination: null,
      destinationName: '',
      safetyRating: '',
      slideAnimation: new Animated.Value(-200),
      showStartButton: false,
    };
  }

  componentDidMount() {
    this.requestLocationPermission();
  }

  componentWillUnmount() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
    }
  }

  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        this.startTracking();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  }

  startTracking = async () => {
    try {
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (position) => {
          const { coordinate, routeCoordinates, distanceTravelled } = this.state;
          const { latitude, longitude } = position.coords;

          const newCoordinate = { latitude, longitude };

          if (Platform.OS === 'android') {
            if (this.marker) {
              this.marker.animateMarkerToCoordinate(newCoordinate, 500);
            }
          } else {
            coordinate.timing(newCoordinate).start();
          }

          this.setState({
            latitude,
            longitude,
            routeCoordinates: routeCoordinates.concat([newCoordinate]),
            prevLatLng: newCoordinate,
          });

          if (this.state.destination) {
            this.getRouteDirections();
          }
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };


  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  getRouteDirections = async () => {
    const { latitude, longitude, destination } = this.state;
    if (!destination) return;

    const { lat, lng } = destination;
    const mode = 'walking'; // or 'driving', 'bicycling', 'transit'

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${lat},${lng}&mode=${mode}&key=AIzaSyCV2lwVnGqfVudXiwNOf-mSjhEkCcU_4AY`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes.length) {
        const route = data.routes[0].overview_polyline.points;
        const points = this.decodePolyline(route);
        this.setState({ routeCoordinates: points });
      }
    } catch (error) {
      console.error('Error getting route directions:', error);
    }
  };

  decodePolyline = (t) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  fetchSafetyRating = async (location) => {
    const apiKey = 'YOUR_SAFETY_RATING_API_KEY';
    const url = `https://api.example.com/safetyRating?location=${location}&key=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data && data.rating) {
        this.setState({ safetyRating: data.rating });
      } else {
        console.log('No rating data available');
      }
    } 
    catch (error) {
      console.error('Error fetching safety rating:', error);
    }
  };

  onPlaceSelected = (data, details) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      const locationName = details.name;
      this.mapView.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.setState({
        destination: { lat, lng },
        destinationName: locationName,
        showStartButton: true,
      }, () => {
        this.getRouteDirections();
        this.fetchSafetyRating(locationName);
        this.slideUp();
      });
    } else {
      console.log('Details not available for selected place.');
    }
  };

  slideUp = () => {
    Animated.timing(this.state.slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  handleStartPress = () => {
    Alert.alert('Start button pressed');
    // Additional logic to handle the start of tracking or other actions can be added here.
  };

  render() {
    const { distanceTravelled, destinationName, safetyRating, showStartButton } = this.state;

    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={this.onPlaceSelected}
          fetchDetails={true}
          query={{
            key: 'AIzaSyCV2lwVnGqfVudXiwNOf-mSjhEkCcU_4AY',
            language: 'en',
          }}
          styles={{
            container: {
              position: 'absolute',
              width: '100%',
              top: 60, // Move it down a bit from the top
              zIndex: 1,
            },
            textInputContainer: {
              flexDirection: 'row',
              backgroundColor: 'white',
              marginHorizontal: 10,
              borderRadius: 5,
              borderColor: '#ccc',
              borderWidth: 1,
            },
            textInput: {
              backgroundColor: 'white',
              height: 44,
              borderRadius: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
              fontSize: 18,
              flex: 1,
            },
            listView: {
              backgroundColor: 'white',
              marginHorizontal: 10,
              borderRadius: 5,
              borderColor: '#ccc',
              borderWidth: 1,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
        <MapView
          ref={(map) => {
            this.mapView = map;
          }}
          style={styles.map}
          showsUserLocation
          followUserLocation
          loadingEnabled
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <Marker.Animated
            ref={(marker) => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          />
        </MapView>
        <View style={styles.infoContainer}>
          <View style={styles.buttonContainer}>

          </View>
          <Animated.View style={[styles.slideCard, { transform: [{ translateY: this.state.slideAnimation }] }]}>
            <Text style={styles.locationName}>{destinationName}</Text>
            <Text style={styles.distance}>Distance: {parseFloat(distanceTravelled).toFixed(2)} km</Text>
            <Text style={styles.safetyRating}>Safety Rating: {safetyRating}</Text>
          </Animated.View>
          {showStartButton && (
            <View style={styles.startButtonContainer}>
              <TouchableOpacity style={styles.startButton} onPress={this.handleStartPress}>
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          )}
          <TabBar />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: 'transparent',
    bottom:90, 
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bottomBarContent: {
    fontSize: 16,
    color: 'black',
  },
  slideCard: {
    position: 'absolute',
    bottom: -200,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  safetyRating: {
    fontSize: 16,
  },
  startButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  startButton: {
    backgroundColor: '#1faadb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    bottom:90,
  },
  startButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default LocationTracking;