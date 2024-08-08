import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

export function HomeScreen ({ navigation }) {
  const [markers, setMarkers] = useState([])

  const defaultRegion = {
    latitude: 7.086313,
    latitudeDelta: 0.122311,
    longitude: 125.612855,
    longitudeDelta: 0.066947
  }
  // fetch json from localhost:3000/
  useEffect(() => {
    fetch('http://192.168.13:3000/')
      .then(response => response.json())
      .then(data => {
        console.log('new markers',data)
        setMarkers(data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={defaultRegion}
        onRegionChange={(region) => {
          console.log(region)
        }}
        provider={"google"}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        style={styles.map}
      >
        {markers.map((marker, i) => <Marker key={marker.id} coordinate={marker.coordinate} />)}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});