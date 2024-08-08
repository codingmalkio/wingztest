import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './ui/DrawerItem';
import { HomeScreen } from './screens/HomeScreen';
import { BookingsScreen } from './screens/BookingScreen';
import { StatusBar } from "expo-status-bar";

const Drawer = createDrawerNavigator();
const headerStyle = {
  headerTintColor: '#25F8BB',
  drawerItemStyle: { paddingLeft: 20 },
  headerStyle: { backgroundColor: '#323268' }
};
export default function App() {

  return (<GestureHandlerRootView style={{ flex: 1 }}>
    <StatusBar style="light" />
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#323268',
          },
          drawerActiveTintColor: "#323268",
          drawerInactiveTintColor: "#25F8BB",
          drawerActiveBackgroundColor: '#25F8BB'
        }}>
        <Drawer.Screen name="Home" component={HomeScreen} options={headerStyle} />
        <Drawer.Screen name="Bookings" component={BookingsScreen} options={headerStyle} />
      </Drawer.Navigator>
    </NavigationContainer>
  </GestureHandlerRootView>)
}
