import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import TopicDetailScreen from './src/screens/TopicDetailScreen';
import StoryScreen from './src/screens/StoryScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import ResultScreen from './src/screens/ResultScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TopicDetail" component={TopicDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Story" component={StoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Exercise" component={ExerciseScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Vocabulary" component={VocabularyScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
