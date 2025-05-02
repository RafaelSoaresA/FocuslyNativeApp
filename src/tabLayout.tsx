import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Image, View } from 'react-native';

import HomeScreen from './screens/home';
import InfoScreen from './screens/info';
import FocuslyAppsScreen from './screens/focuslyapps';
import ProfileScreen from './screens/profile';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, routeName }: { focused: boolean; routeName: string }) => {
  let icon;
  let size = { width: 44, height: 44 };

  if (routeName === 'Home') {
    icon = require('../src/assets/home.png');
    size = { width: 44, height: 32 }; // Ajuste para não extrapolar
  } else if (routeName === 'Info') {
    icon = require('../src/assets/informacoes.png');
    size = { width: 30, height: 30 };
  } else if (routeName === 'FocuslyApps') {
    icon = require('../src/assets/focusly.png');
    size = { width: 40, height: 34 };
  } else if (routeName === 'Profile') {
    icon = require('../src/assets/cara.png');
    size = { width: 40, height: 40 };
  }

  return (
    <View
      style={{
        borderColor: focused ? '#1D3C34' : 'transparent',
        borderWidth: focused ? 2 : 0,
        borderRadius: 16,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={icon}
        style={{
          width: size.width,
          height: size.height,
          opacity: focused ? 1 : 0.6,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default function TabLayout() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} routeName={route.name} />,
          tabBarStyle: {
            backgroundColor: '#9DBDCC',
            height: 60,
            borderTopWidth: 0,
            paddingBottom: 5,
            paddingTop: 5,
          },
          tabBarShowLabel: false,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Info" component={InfoScreen} />
        <Tab.Screen name="FocuslyApps" component={FocuslyAppsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
