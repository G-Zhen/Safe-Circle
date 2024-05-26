import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, Animated, Alert, Image } from 'react-native';
import MapView, { AnimatedRegion, Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TabBar from '../screens/TabBar';
import RenderHtml from 'react-native-render-html';

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
      isRouteStarted: false,
      directions: [],
      stepIndex: 0,
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
            distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
            prevLatLng: newCoordinate,
          }, () => {
            this.mapView.animateToRegion(this.getMapRegion(), 1000);
          });

          if (this.state.destination && this.state.isRouteStarted) {
            this.checkIfOnRoute(newCoordinate);
            this.updateDirections();
          }
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  stopTracking = () => {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
    }
    this.setState({ isRouteStarted: false, stepIndex: 0, routeCoordinates: [], directions: [] });
    Alert.alert("Route Stopped", "You have stopped following the route.");
  };

  calcDistance = (newLatLng) => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
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
        const steps = data.routes[0].legs[0].steps;
        this.setState({ routeCoordinates: points, directions: steps });
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

  /*fetchSafetyRating = async (location) => {
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
  };*/

  onPlaceSelected = (data, details) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      const locationName = details.name;
      this.mapView.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA,
      });
      this.setState({
        destination: { lat, lng },
        destinationName: locationName,
      }, () => {
        this.getRouteDirections();
        /*this.fetchSafetyRating(locationName);*/
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

  startRoute = () => {
    this.setState({ isRouteStarted: true });
    Alert.alert("Route Started", "Follow the highlighted path to your destination.");
  };

  checkIfOnRoute = (currentLocation) => {
    const { routeCoordinates } = this.state;
    const tolerance = 0.001; // Adjust tolerance as needed

    const isOnRoute = routeCoordinates.some(point => {
      const distance = haversine(currentLocation, point, { unit: 'meter' });
      return distance < tolerance;
    });

    if (!isOnRoute) {
      Alert.alert("Route Deviation", "You are deviating from the route. Please get back on track.");
    }
  };

  updateDirections = () => {
    const { directions, stepIndex, latitude, longitude } = this.state;

    if (stepIndex < directions.length) {
      const currentStep = directions[stepIndex];
      const { end_location } = currentStep;

      const distanceToNextStep = haversine(
        { latitude, longitude },
        { latitude: end_location.lat, longitude: end_location.lng },
        { unit: 'meter' }
      );

      if (distanceToNextStep < 20) { // 20 meters tolerance
        this.setState({ stepIndex: stepIndex + 1 });
      }
    } else {
      Alert.alert("Route Completed", "You have arrived at your destination.");
      this.setState({ isRouteStarted: false });
    }
  };

  recenterMap = () => {
    this.mapView.animateToRegion(this.getMapRegion(), 1000);
  };

  render() {
    const { distanceTravelled, destinationName, safetyRating, routeCoordinates, isRouteStarted, directions, stepIndex } = this.state;
    const currentStep = directions[stepIndex] || {};
    const htmlDirections = { html: currentStep.html_instructions || '' };

    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          placeholderTextColor="#888888" // Use a more visible placeholder text color
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
              backgroundColor: 'black',
              marginHorizontal: 10,
              borderRadius: 20,
              borderColor: 'black',
              borderWidth: 2,
            },
            textInput: {
              backgroundColor: 'white',
              height: 50,
              borderRadius: 20,
              paddingVertical: 5,
              paddingHorizontal: 10,
              fontSize: 18,
              flex: 1,
            },
            listView: {
              backgroundColor: 'white',
              marginHorizontal: 10,
              borderRadius: 10,
              borderColor: '#black',
              borderWidth: 2,
            },
            predefinedPlacesDescription: {
              color: '#black',
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
          <Polyline coordinates={routeCoordinates} strokeWidth={5} />
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
          {this.state.destination && !isRouteStarted && (
            <View style={styles.startRouteContainer}>
              <TouchableOpacity style={styles.startRouteButton} onPress={this.startRoute}>
                <Text style={styles.startRouteButtonText}>Start Route</Text>
              </TouchableOpacity>
            </View>
          )}
          {isRouteStarted && (
            <View style={styles.routeControlContainer}>
              <TouchableOpacity style={styles.stopRouteButton} onPress={this.stopTracking}>
                <Text style={styles.stopRouteButtonText}>Stop Route</Text>
              </TouchableOpacity>
            </View>
          )}
          {isRouteStarted && (
            <View style={styles.directionsContainer}>
              <RenderHtml contentWidth={width} source={htmlDirections} />
            </View>
          )}
          <Animated.View style={[styles.slideCard, { transform: [{ translateY: this.state.slideAnimation }] }]}>
            <Text style={styles.locationName}>{destinationName}</Text>
            <Text style={styles.distance}>Distance: {parseFloat(distanceTravelled).toFixed(2)} km</Text>
            <Text style={styles.safetyRating}>Safety Rating: {safetyRating}</Text>
          </Animated.View>
          <View style={styles.recenterButtonContainer}>
            <TouchableOpacity style={styles.recenterButton} onPress={this.recenterMap}>
              <Image source={require('../public/assets/Recenter.png')} style={styles.recenterButtonIcon} />
            </TouchableOpacity>
          </View>
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
    bottom: 90,
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
  startRouteContainer: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    alignItems: 'center',
  },
  startRouteButton: {
    backgroundColor: '#F6F7B0',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 3,
  },
  startRouteButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeControlContainer: {
    position: 'absolute',
    bottom: 160,
    width: '100%',
    alignItems: 'center',
  },
  stopRouteButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 3,
  },
  stopRouteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#F6F7B0',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 20,
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
  distance: {
    fontSize: 16,
    marginBottom: 10,
  },
  safetyRating: {
    fontSize: 16,
  },
  recenterButtonContainer: {
    position: 'absolute',
    bottom: 150,
    right: 10,
    alignItems: 'center',
  },
  recenterButton: {
    backgroundColor: '#B7BBDB',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 40,
    borderWidth: 2,
    marginBottom: 8,
  },
  recenterButtonIcon: {
    width: 20,
    height: 20,
  },
  compassIcon: {
    width: 50,
    height: 50,
  },
});

export default LocationTracking;
