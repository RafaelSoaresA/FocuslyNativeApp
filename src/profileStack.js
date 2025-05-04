import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importação das telas
import ProfileScreen from './screens/profile';
import EditProfileScreen from './screens/EditProfile';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
