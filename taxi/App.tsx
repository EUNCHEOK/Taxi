import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import Login from './src/Login.tsx';
import Main from './src/Main.tsx';
import Register from './src/Register.tsx';
import MainSettingNickName from './src/Main_Setting_NickName.tsx';

const Stack = createStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
      let title = '';
      let body = '';

      if (remoteMessage.notification && remoteMessage.notification.title) {
        title = remoteMessage.notification.title;
      }
      if (remoteMessage.notification && remoteMessage.notification.body) {
        body = remoteMessage.notification.body;
      }

      if (remoteMessage) {
        Alert.alert(title, body, [{ text: '확인', style: 'cancel' }]);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          setInitialRoute('Main');
        } else {
          setInitialRoute('Login');
        }
      } catch (e) {
        console.error('Failed to load user ID from storage', e);
        setInitialRoute('Login'); // Default to Login on error
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    // Show a loading screen while we're checking the login status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false, // Hide headers for all screens by default
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: true, // Show header only for Register screen
              title: '회원가입',
            }}
          />
          <Stack.Screen
            name="Main_Setting_NickName"
            component={MainSettingNickName}
            options={{
              headerShown: true,
              title: '닉네임 설정',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;