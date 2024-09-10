import { StyleSheet, Text, View, TouchableOpacity, Platform, Scrollview, Image } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast';
import { CustomBottomSheetModal } from '../ui/CustomBottomSheetModal';
import Constants from 'expo-constants';

import { fetchBookings, updateBookingStatus } from '../src/features/bookings/bookingsSlice';
import PreviewSelectedThumbnail from '../ui/PreviewSelectedThumbnail';

export function HomeDriverScreen({ navigation }) {
  const dispatch = useDispatch();
  const { bookings, status, } = useSelector(state => state.bookings);

  const [selected, setSelected] = useState(null);
  const bottomSheetModalRef = useRef(null);

  const handleUpdateStatus = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ bookingId, status: newStatus }));
  };
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  useEffect(() => {
    console.log('bookings was updated')
    if (selected != null) {
      setSelected(bookings.find(booking => booking.id === selected.id))
    }
  }, [bookings]);


  useEffect(() => {
    if(!bookings.length && status != 'idle'){
      this.toast.show('No bookings found', 2000, () => { });
    }
  }, [bookings]);


  const handleOnMapPress = (marker) => {
    if (!marker) { // handleDeselect
      setSelected(null);
      bottomSheetModalRef.current?.close()
      return;
    }
    bottomSheetModalRef.current?.present();
    setSelected(marker);
  };

  const renderMarkerAndPath = (marker, i) => {
    const isSelected = selected && selected.id === marker.id;
    const markerColor = isSelected ? 'red' : 'green';
    return (<>
      <Marker
        key={marker.id}
        onPress={() => handleOnMapPress(marker)}
        coordinate={marker.pickupLocation}
        pinColor={markerColor}
      />
      {marker.previewRoute && <Polyline strokeColor={markerColor} strokeWidth={isSelected ? 4 : 1} coordinates={marker.previewRoute} />}
      <Marker
        key={"destination_" + marker.id}
        onPress={() => handleOnMapPress(marker)}
        coordinate={marker.destination}
        pinColor={markerColor}
      />
    </>);
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={Constants.expoConfig.extra.DEFAULT_REGION}
          onRegionChange={(region) => {
          }}
          //provider={"google"}
          showsUserLocation={true}
          onMarkerDeselect={() => handleOnMapPress(null)}
          followsUserLocation={true}
          zoomEnabled={true}
          showsMyLocationButton={true}
          style={styles.map}
        >
          {bookings.map(renderMarkerAndPath)}
        </MapView>
      </View>

      <Toast ref={(toast) => this.toast = toast} position='top' />
      <CustomBottomSheetModal ref={bottomSheetModalRef}>
          {selected != null ? <PreviewSelectedThumbnail selected={selected} handleUpdateStatus={handleUpdateStatus} showButtons={true} /> : null}
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