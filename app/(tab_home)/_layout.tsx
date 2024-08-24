import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
      name="Home"
       options={{
        title: 'Trang chủ',
        tabBarLabel: ({ focused }) => (
       <Text style={{ fontSize: 11, color: focused ? "#ff6400" : "black" }}>Trang chủ</Text>
       ),
        tabBarIcon: ({ focused }) => (
      <Ionicons name={focused ? 'home' : 'home-outline'} size={25} color={"#ff6400"} />
    ),
    }}
    />

    <Tabs.Screen
        name="Jobs"
        options={{
          title: 'Công việc',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#ff6400" : "black" }}>Công việc</Text>
            ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bag' : 'bag-outline'} size={25} color={"#ff6400"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Messenger"
        options={{
          title: 'Chat',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#ff6400" : "black" }}>Chat</Text>
            ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbox' : 'chatbox-outline'} size={25} color={"#ff6400"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Hồ sơ',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: 11, color: focused ? "#ff6400" : "black" }}>Hồ sơ</Text>
            ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={25} color={"#ff6400"} />
          ),
        }}
      />
    
    </Tabs>
  );
}
