import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { StyleSheet, View, Text, Image } from 'react-native';
import Button from '../ui/Button';
const PreviewSelectedThumbnail = (props) => {

  const whereIn = (status, statuses = []) => {
    if(statuses.length === 0 || !status) return false;
    if(statuses.includes(status)) return true;
  }

  return (
    <View style={{ backgroundColor: '#fff', marginBottom: 10, marginHorizontal: 10, borderRadius: 10, height: 160, position: 'relative', flex: 1, flexDirection: 'column' }}>
      <View style={{ position: 'absolute', right: 12, top: 10, zIndex: 99, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, backgroundColor: 'gray', }}>
        <Text style={{ fontSize: 10, color: '#fff' }}>{props.selected?.status}</Text>
      </View>
      <Text style={{ position: 'absolute', right: 12, top: 80, zIndex: 99 }}>0 KM</Text>
      <Text
        ellipsizeMode='tail'
        numberOfLines={1}
        style={{ position: 'absolute', left: 12, top: 80, zIndex: 99, width: 180 }}>ID: {props.selected?.id}</Text>
      <Image src={'https://place-hold.it/400x200?text='} style={styles.image} resizeMode={'cover'} />
      {props?.showButtons && props.showButtons == true && <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'ghostwhite' }}>
        {/* Display Accept when status is pending */}
        {whereIn(props.selected?.status, ['pending']) && <Button onPress={() => props.handleUpdateStatus(props.selected.id, 'accepted')} title={'Accept'} backgroundColor={'green'} />}
        {/* Display Decline when status is pending */}
        {whereIn(props.selected?.status, ['pending']) && <Button onPress={() => props.handleUpdateStatus(props.selected.id, 'declined')} title={'Decline'} backgroundColor={'orangered'} />}
        {/* Display drop button only when status is accepted, picked-up or started */}
        {whereIn(props.selected?.status, ['accepted', 'picked-up', 'started']) && <Button onPress={() => props.handleUpdateStatus(props.selected.id, 'dropped-off')} title={'Drop off'} backgroundColor={'green'} />}

        {/* Display message when status is already closed, dropped-off or declined */}
        {whereIn(props.selected?.status, ['dropped-off', 'declined']) && <Text style={{ fontSize: 12, color: 'gray' }}>The current status is {props.selected?.status}. Booking is already closed</Text>}
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    borderRadius: 8,
    marginVertical: 4,
    paddingLeft: 30,
    marginHorizontal: 0
  },
  image: {
    height: 100,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }
});

export default PreviewSelectedThumbnail;