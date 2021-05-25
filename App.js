import React from 'react';
import { StyleSheet,Text, View } from 'react-native';
import ReactForm from './Form';

import store from "./store";
import { Provider } from "react-redux";
export default function App() {

  return (
    <Provider store={store}>

      <View style={styles.container}>
        <Text>hello</Text>
        <ReactForm />
        {/* <DatePickerV2/> */}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777',
    color: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
  }
});


