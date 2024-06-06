import React from 'react';
import { View } from 'react-native';
import ProfileView from '../components/profile';
import { UploadImage } from '../components/uploadimg';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileView />
      <UploadImage />
    </View>
  );
}
