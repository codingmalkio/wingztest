import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';


const CustomBottomSheetModal = React.forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['25%', '30%'], []);

  const renderHeaderHandle = useCallback((props) => (
    <BottomSheetHandle {...props}
      style={styles.bottomSheetHandle} />
  ), []);

  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={ref}
          index={1}
          snapPoints={snapPoints}
          onChange={props.handleSheetChanges || null}
          handleComponent={renderHeaderHandle}
        >
          <BottomSheetView style={styles.contentContainer}>
            {props.children}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
})
module.exports = { CustomBottomSheetModal };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  smallText: {
    fontSize: 13,
    paddingVertical: 8
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#404171'
  },
  bottomSheetHandle: {
    backgroundColor: '#404171',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 4,
    borderColor: '#00F9B9'
  }
});