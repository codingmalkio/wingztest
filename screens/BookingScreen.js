import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { requestBooking, updateBookingStatus, fetchBookings } from '../src/features/bookings/bookingsSlice';

export function BookingsScreen({ navigation }) {
  const { bookings, status, error } = useSelector(state => state.bookings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  const handleUpdateStatus = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ bookingId, status: newStatus }));
  };

  const renderBooking = ({ item }) => (
    <View style={styles.bookingItem}>
      <Text>{item?._id} - Coordinate: {JSON.stringify(item.destination)}</Text>
      <Text>{item.userId} - {item.timestamp} - Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateStatus(item.id, 'confirmed')}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleUpdateStatus(item.id, 'cancelled')}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }
  console.log(bookings);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking System</Text>
      {/* <TouchableOpacity style={styles.requestButton} onPress={handleRequestBooking}>
        <Text style={styles.buttonText}>Request New Booking</Text>
      </TouchableOpacity> */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={item => item.id}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  bookingItem: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 5,
    borderRadius: 5,
    width: '48%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
