import { StyleSheet, Text, View, Button, TouchableOpacity, Platform } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBooking, fetchBookings, requestBooking, calculateRoute, clearPreviewRoute } from '../src/features/bookings/bookingsSlice';
import Toast, {DURATION} from 'react-native-easy-toast'
import { randomUUID } from 'expo-crypto';

const defaultRegion = {
  latitude: 7.086313,
  latitudeDelta: 0.122311,
  longitude: 125.612855,
  longitudeDelta: 0.066947
}

export function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { bookings, status, error, previewRoute } = useSelector(state => state.bookings);
  const [regionPoint, setRegionPoint] = useState(defaultRegion);

  const [pickupLocation, setPickupLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isCreateToggled, setIsCreateToggled] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      console.log('fetching bookings')
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const getPoints = async () => {
      dispatch(calculateRoute({
        start: pickupLocation, //{ latitude: 7.086861908514962, longitude: 125.61319595953091 },
        end: destination, //{ latitude: 7.075519378124341, longitude: 125.61033495558632 }
      }));
    };

    if (pickupLocation && destination) {
      getPoints();
    }
  }, [pickupLocation, destination]);

  const handleSaveBooking = () => {
    const newBooking = {
      userId: randomUUID(),
      pickupLocation: { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude},
      destination: { latitude: destination.latitude, longitude: destination.longitude},
      previewRoute: previewRoute,
    };

    this.toast.show('Booking successfully added!', 1000, () => { });
    setPickupLocation(null);
    setDestination(null);
    dispatch(clearPreviewRoute());
    dispatch(addBooking(newBooking));
  };

  const handleOnMapPress = (marker) => {
    if (!marker) { // handleDeselect
      setIsCreateToggled(true);
      setSelected(null);
      return;
    }
    console.log(marker);
    setIsCreateToggled(false);
    setSelected(marker);
  };

  const addBookingForm = () => {
    const _pickupLocation = pickupLocation ? (pickupLocation.latitude + "," + pickupLocation.longitude) : "";
    const _destination = destination ? (destination.latitude + "," + destination.longitude) : "";
    return (
      <View>
        <TouchableOpacity onPress={() => { setPickupLocation(regionPoint) }} >
          <Text style={[styles.smallText]}>SET PICKUP: {_pickupLocation}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setDestination(regionPoint) }}>
          <Text style={[styles.smallText]}>SET DROPOFF: {_destination}</Text>
        </TouchableOpacity>
        <Button disabled={!(pickupLocation && destination)} title="SAVE BOOKING" onPress={handleSaveBooking} />
      </View>
    )
  }

  const previewSelected = (
    <View>
      <Text>Preview</Text>
      <Text>{
          (selected&&selected.pickupLocation ? JSON.stringify(selected.pickupLocation) : "") +
          (selected&&selected.destination ? JSON.stringify(selected.destination) : "")
      }</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.pointCenter}>
          <View style={styles.innerpointCenter}></View>
        </View>
        <MapView
          initialRegion={defaultRegion}
          onRegionChange={(region) => {
            setRegionPoint(region);
          }}
          //provider={"google"}
          showsUserLocation={true}
          onMarkerDeselect={() => handleOnMapPress(null)}
          followsUserLocation={true}
          zoomEnabled={true}
          showsMyLocationButton={true}
          style={styles.map}
        >
          {bookings.map((marker, i) => (<><Marker
            key={marker.id}
            onPress={() => handleOnMapPress(marker)}
            coordinate={marker.pickupLocation}
          />
            {marker.previewRoute && <Polyline strokeColor={'red'} coordinates={marker.previewRoute} />}
          <Marker
            key={"destination_"+marker.id}
            onPress={() => handleOnMapPress(marker)}
            coordinate={marker.destination}
          />
          </>))}

          {pickupLocation && <Marker
            title={'START'}
            coordinate={pickupLocation}
            pinColor={'green'}
          />}
          {destination && <Marker
            title={'START'}
            coordinate={destination}
            pinColor={'green'}
          />}
          {previewRoute && <Polyline strokeColor={'green'} coordinates={previewRoute} />}
        </MapView>
      </View>

      <View style={styles.bottomContainer}>
        {!isCreateToggled ? <Button onPress={() => setIsCreateToggled(true)} title={"ADD BOOKING"}></Button> : null}
        {isCreateToggled ? addBookingForm() : null}
        {selected != null ? previewSelected : null}
      </View>
      <Toast ref={(toast) => this.toast = toast} position='top' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  smallText: {
    fontSize: 13,
    paddingVertical: 8
  },
  bottomContainer: {
    height: 200,
    backgroundColor: '#fff',
    paddingBottom: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointCenter: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    height: 16,
    width: 16,
    marginLeft: -8,
    marginTop: -8,
    backgroundColor: 'red',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerpointCenter: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4
  },
  map: {
    width: '100%',
    height: '100%',
  },
});