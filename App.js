import React, {useState, useCallback} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import SwipeableCard from './SwipeableCard';

const App = () => {
  const [array, updateArray] = useState([1, 2, 3, 4]);
  const popItem = useCallback(
    () =>
      updateArray((pa) => {
        pa.pop();
        if (pa.length <= 0) {
          // Added Math.random form Manitaning uniqe key values, other wise refs are not refreshed
          setTimeout(
            () =>
              updateArray([
                1 + parseInt(Math.random() * 100, 10),
                2 + parseInt(Math.random() * 100, 10),
                3 + parseInt(Math.random() * 100, 10),
                4 + parseInt(Math.random() * 100, 10),
              ]),
            2000,
          );
        }
        return pa;
      }),
    [],
  );
  return (
    <SafeAreaView style={styles.root}>
      {array.map((i) => (
        <SwipeableCard action={popItem} key={i} />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ff0000a0',
    padding: 20,
  },
});

export default App;
