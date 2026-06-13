import React, { useState, useEffect } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { devices } from '../../data/mockData';
import { Device } from '../../types';

const EmergencyPage: React.FC = () => {
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const { deviceId } = router.params;
    if (deviceId) {
      const foundDevice = devices.find(d => d.id === deviceId);
      if (foundDevice) {
        setDevice(foundDevice);
      }
    }
  }, [router.params]);

  const handleEmergencyStop = () => {
    if (!reason) {
      Taro.showToast({
        title: '请填写停机原因',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '确认紧急停机',
      content: '此操作将立即停止设备运行，确定要执行吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '处理中...' });

          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({
              title: '停机指令已发送',
              icon: 'success',
              duration: 3000
            });

            setTimeout(() => {
              Taro.navigateBack();
            }, 2000);
          }, 1500);
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.warningCard}>
        <Text className={styles.warningIcon}>⚠️</Text>
        <Text className={styles.warningTitle}>紧急停机操作</Text>
        <Text className={styles.warningDesc}>
          紧急停机将立即切断设备电源，停止供水。请确认是否需要执行此操作。
        </Text>
      </View>

      {device && (
        <View className={styles.deviceCard}>
          <Text className={styles.deviceName}>{device.name}</Text>
          <Text className={styles.deviceCode}>{device.code}</Text>
          <Text className={styles.deviceLocation}>{device.location}</Text>
        </View>
      )}

      <View className={styles.formSection}>
        <Text className={styles.formTitle}>停机原因 <Text style={{ color: '#f53f3f' }}>*</Text></Text>
        <Textarea
          placeholder="请详细描述停机原因..."
          value={reason}
          onInput={(e) => setReason(e.detail.value)}
        />
      </View>

      <View className={styles.confirmBtn}>
        <View className={styles.btn} onClick={handleEmergencyStop}>
          确认紧急停机
        </View>
      </View>
    </View>
  );
};

export default EmergencyPage;
