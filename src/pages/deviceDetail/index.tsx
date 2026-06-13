import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { devices } from '../../data/mockData';
import { Device } from '../../types';

const DeviceDetailPage: React.FC = () => {
  const router = useRouter();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const { deviceId } = router.params;
    if (deviceId) {
      const foundDevice = devices.find(d => d.id === deviceId);
      if (foundDevice) {
        setDevice(foundDevice);
      }
    }
  }, [router.params]);

  const handleNavigation = () => {
    if (device?.latitude && device?.longitude) {
      Taro.openLocation({
        latitude: device.latitude,
        longitude: device.longitude,
        name: device.name,
        address: device.location
      });
    }
  };

  const handleInspection = () => {
    Taro.navigateTo({
      url: `/pages/inspection/index?deviceId=${device?.id}`
    });
  };

  const handleEmergency = () => {
    Taro.navigateTo({
      url: `/pages/emergency/index?deviceId=${device?.id}`
    });
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      normal: '正常',
      warning: '预警',
      error: '故障',
      offline: '离线'
    };
    return map[status] || status;
  };

  if (!device) {
    return (
      <View className={styles.container}>
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '32rpx', color: '#86909c' }}>未找到设备信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.deviceHeader}>
        <Text className={styles.deviceName}>{device.name}</Text>
        <Text className={styles.deviceCode}>{device.code}</Text>
        <View className={styles.statusRow}>
          <Text className={styles.statusBadge}>
            {getStatusText(device.status)}
          </Text>
          <Text className={styles.lastInspection}>
            上次巡检：{device.lastInspectionTime}
          </Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>设备编号</Text>
            <Text className={styles.infoValue}>{device.code}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>设备名称</Text>
            <Text className={styles.infoValue}>{device.name}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>所在小区</Text>
            <Text className={styles.infoValue}>{device.community}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>楼栋单元</Text>
            <Text className={styles.infoValue}>{device.building} {device.unit}</Text>
          </View>
          <View className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
            <Text className={styles.infoLabel}>安装位置</Text>
            <Text className={styles.infoValue}>{device.location}</Text>
          </View>
        </View>
      </View>

      <View className={styles.statusCard}>
        <Text className={styles.cardTitle}>运行状态</Text>
        <View className={styles.statusList}>
          <View className={styles.statusItem}>
            <Text className={styles.statusLabel}>水压</Text>
            <Text className={`${styles.statusValue} ${
              (device.waterPressure || 0) < 0.3 ? styles.warning : styles.success
            }`}>
              {device.waterPressure || '--'} MPa
            </Text>
          </View>
          <View className={styles.statusItem}>
            <Text className={styles.statusLabel}>滤芯状态</Text>
            <Text className={`${styles.statusValue} ${
              device.filterStatus === 'replace' ? styles.error : styles.success
            }`}>
              {device.filterStatus === 'normal' ? '正常' : '需更换'}
            </Text>
          </View>
          <View className={styles.statusItem}>
            <Text className={styles.statusLabel}>上次消毒</Text>
            <Text className={styles.statusValue}>
              {device.disinfectionTime || '--'}
            </Text>
          </View>
          <View className={styles.statusItem}>
            <Text className={styles.statusLabel}>下次巡检</Text>
            <Text className={styles.statusValue}>{device.nextInspectionTime}</Text>
          </View>
        </View>
      </View>

      <View className={styles.actionBtns}>
        <View className={`${styles.btn} ${styles.default}`} onClick={handleNavigation}>
          导航到设备
        </View>
        <View className={`${styles.btn} ${styles.danger}`} onClick={handleEmergency}>
          紧急停机
        </View>
        <View className={`${styles.btn} ${styles.primary}`} onClick={handleInspection}>
          巡检
        </View>
      </View>
    </View>
  );
};

export default DeviceDetailPage;
