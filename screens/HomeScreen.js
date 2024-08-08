import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export function HomeScreen ({ navigation }) {
  const defaultRegion = {
    latitude: 7.086313,
    latitudeDelta: 0.122311,
    longitude: 125.612855,
    longitudeDelta: 0.066947
  }

  const markers = [
    { id: 1, coordinate: { latitude: 7.086313, longitude: 125.612855 }, title: 'Davao City', description: 'City of Royalties' },
    { id: 2, coordinate: { latitude: 7.0667509868259515, longitude: 125.59637573846157 }, title: 'Davao City', description: 'City of Royalties' },
    { id: 3, coordinate: { latitude: 7.065347826608068, longitude: 125.60200927325728 }, title: 'Davao City', description: 'City of Royalties' },
  ]

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