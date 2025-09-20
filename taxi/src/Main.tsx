import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';

import Main_Map from './Main_Map.tsx';
import Main_List from './Main_List.tsx';
import Main_Setting from './Main_Setting.tsx';

const BottomTab = createBottomTabNavigator();

function Main() {
  console.log('-- Main()');

  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Main_Map"
        component={Main_Map}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Main_List"
        component={Main_List}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="phone" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Main_Setting"
        component={Main_Setting}
        options={{
          headerShown: true,
          title: '환경설정',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  textBlack: {
    fontSize: 18,
    color: 'black',
  },
  textBlue: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Main;
