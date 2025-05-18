import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import LoginScreen from './src/screens/Login';
import HomeScreen from './src/screens/Home';

// Définition des types pour la navigation
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

auth().signOut().then(() => {
  console.log('User signed out!');
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Observer pour les changements d'état d'authentification
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe; // nettoyage à la désinstallation du composant
  }, [initializing]);

  if (initializing){
    return null;
  } // ou écran de chargement

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Routes non authentifiées
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // Routes authentifiées
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
