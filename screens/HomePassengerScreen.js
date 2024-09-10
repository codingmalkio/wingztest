import { StyleSheet, Text, View, Button, TouchableOpacity, Platform } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBooking, fetchBookings, updateBookingStatus, calculateRoute, clearPreviewRoute } from '../src/features/bookings/bookingsSlice';
import Toast, { DURATION } from 'react-native-easy-toast'
import { randomUUID } from 'expo-crypto';
import { CustomBottomSheetModal } from '../ui/CustomBottomSheetModal';
import Constants from 'expo-constants';
import PreviewSelectedThumbnail from '../ui/PreviewSelectedThumbnail';

const CenterPoint = () => {
  return (<View style={styles.pointCenter}>
    <View style={styles.innerpointCenter}></View>
  </View>);
}

export function HomePassengerScreen({ navigation }) {
  const dispatch = useDispatch();
  const { bookings, status, error, previewRoute } = useSelector(state => state.bookings);
  const [regionPoint, setRegionPoint] = useState(Constants.expoConfig.extra.DEFAULT_REGION);

  const [sheetVisible, setSheetVisible] = useState(0);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isCreateToggled, setIsCreateToggled] = useState(false);
  const [selected, setSelected] = useState(null);
  const bottomSheetModalRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
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

  useEffect(() => {
    if(!bookings.length && status != 'idle'){
      this.toast.show('No bookings found', 2000, () => { });
    }
  }, [bookings]);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    setSheetVisible(1);
    setIsCreateToggled(true)
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    setSheetVisible(index)
  }, []);

  const handleUpdateStatus = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ bookingId, status: newStatus }));
  };

  const handleCreateBooking = () => {
    const newBooking = {
      userId: randomUUID(),
      pickupLocation: { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
      destination: { latitude: destination.latitude, longitude: destination.longitude },
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
      bottomSheetModalRef.current?.close()
      setSheetVisible(-1);
      return;
    }
    setSheetVisible(1);
    bottomSheetModalRef.current?.present();
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
        <Button disabled={!(pickupLocation && destination)} title="SAVE BOOKING" onPress={handleCreateBooking} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <CenterPoint />
        <MapView
          initialRegion={Constants.expoConfig.extra.DEFAULT_REGION}
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
              key={"destination_" + marker.id}
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


      <Toast ref={(toast) => this.toast = toast} position='top' />

      {sheetVisible == 1 ? null : (<TouchableOpacity
        onPress={handlePresentModalPress}
        style={{ position: 'absolute', bottom: '15%', right: '10%', zIndex: 9999 }}
      >
        <View style={styles.actionButton}>
          <Text style={{ fontSize: 24 }}>+</Text>
        </View>
      </TouchableOpacity>)}

      <CustomBottomSheetModal
        ref={bottomSheetModalRef}
        handleSheetChanges={handleSheetChanges}>
        {isCreateToggled ? addBookingForm() : null}
        {selected != null ? <PreviewSelectedThumbnail selected={selected} handleUpdateStatus={handleUpdateStatus} showButtons={false} /> : null}
      </CustomBottomSheetModal>

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
    marginTop: -17,
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});