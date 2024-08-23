import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { requestBooking, fetchBookings, updateBookingStatus } from '../src/features/bookings/bookingsSlice';

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
    <View style={styles.bookingItem} key={item.id}>
      <Text style={styles.bookingText}>{item._id}: {item.id}</Text>
      <Text style={styles.bookingText}>Destination: {JSON.stringify(item.destination)}</Text>
      <Text style={styles.bookingText}>PickupLocation: {JSON.stringify(item.pickupLocation)}</Text>
      <Text style={[styles.bookingText, { marginTop: 8}]}>User id: {item.userId}</Text>
      <Text style={styles.bookingText}>Driver id: {item.driverId}</Text>
      <Text style={styles.bookingText}>Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        {[
          {label: 'Pending', statusName: 'pending'},
          {label: 'Accepted', statusName: 'accepted'},
          {label: 'Declined', statusName: 'declined'},
          {label: 'Started', statusName: 'started'},
          {label: 'Started', statusName: 'started'},
          {label: 'Picked-up', statusName: 'picked-up'},
          {label: 'Dropped-off', statusName: 'dropped-off'},
        ].map((status, i) => {
          const highlightedButton = item.status == status.statusName ? { backgroundColor: '#000' } : {};
          return (<TouchableOpacity key={'status-'+i} style={[styles.button, highlightedButton ]} onPress={() => handleUpdateStatus(item.id, status.statusName)}>
            <Text style={styles.buttonText}>{status.label}</Text>
          </TouchableOpacity>);
        })}

      </View>
    </View>
  );

  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 10
  },
  button: {
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 5,
    marginBottom: 2,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#f2f2f2',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  bookingText: {
    fontSize: 11
  }
});
