import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface AlertComponentProps {
  message: string;
  visible: boolean;
  duration?: number;
  color?:string; // Thời gian hiển thị cảnh báo (mặc định là 3 giây)
  onClose?: () => void; // Hàm được gọi khi cảnh báo được đóng
}

const AlertComponent = ({ message, visible, color, duration = 1500, onClose }: AlertComponentProps) => {


  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (visible) {
      timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, duration);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <View style={styles.alertContainer}>
      <ThemedView style={[styles.alertBox, {backgroundColor: color}]}>
        <ThemedText style={styles.alertMessage}>{message}</ThemedText>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  alertBox: {
    backgroundColor: '#FF4F4F',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMessage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertComponent;