import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';

const CustomDrawerContent = (props) => {
  return (
      <DrawerContentScrollView {...props}>
        <View style={{ height: 40 }}></View>
        <DrawerItemList
          {...props}
          activeTintColor="#333333"
          activeBackgroundColor="#e6e6e6"
          style={styles.drawerItem}
        />
      </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    borderRadius: 8,
    marginVertical: 4,
    paddingLeft: 30,
    marginHorizontal: 0
  },
});

export default CustomDrawerContent;