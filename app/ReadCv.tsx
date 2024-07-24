import React, { useState } from 'react';
import { View, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const ReadCv = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileUri = 'http://beejobs.io.vn:14307/uploads/1721060095302-Phi-Dinh-Long-TopCV.vn-040724.233955.pdf'; 

  const openPdfInBrowser = async () => {
    setLoading(true);
    setError(null);

    try {
      await WebBrowser.openBrowserAsync(fileUri); // Mở PDF trong trình duyệt ngay lập tức
    } catch (err) {
      setError('Error opening file');
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {error && <Text style={styles.error}>{error}</Text>}
          <Button title="Open PDF in Browser" onPress={openPdfInBrowser} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
});

export default ReadCv;
