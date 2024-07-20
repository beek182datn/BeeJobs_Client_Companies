import React, { useState } from 'react';
import { View, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';

const OpenPdf = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const fileUri = 'http://beejobs.io.vn:14307/uploads/1721060095302-Phi-Dinh-Long-TopCV.vn-040724.233955.pdf'; 
  const localFileUri = FileSystem.documentDirectory + 'cv.pdf';

  const downloadAndOpenPdf = async () => {
    setLoading(true);
    setError(null);

    try {
      const { uri } = await FileSystem.downloadAsync(fileUri, localFileUri);
      setLocalUri(uri);
      console.log('File downloaded to:', uri);

      await WebBrowser.openBrowserAsync(uri); // Mở PDF trong trình duyệt
    } catch (err) {
      setError('Error downloading or opening file');
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
          {localUri ? (
            <Button title="Open PDF" onPress={() => WebBrowser.openBrowserAsync(localUri)} />
          ) : (
            <Button title="Download and Open PDF" onPress={downloadAndOpenPdf} />
          )}
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

export default OpenPdf;
