import React, { useState } from 'react';
import { View, Text, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const SettingsPage: React.FC = () => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [pushNotification, setPushNotification] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleCheckUpdate = () => {
    Taro.showLoading({ title: '检查中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '已是最新版本',
        icon: 'success'
      });
    }, 1000);
  };

  return (
    <View className={styles.container}>
      <View className={styles.settingList}>
        <View className={styles.settingItem}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>离线模式</Text>
            <Text className={styles.settingDesc}>允许在无网络时暂存数据</Text>
          </View>
          <Switch
            checked={offlineMode}
            onChange={() => setOfflineMode(!offlineMode)}
            color="#1890ff"
          />
        </View>

        <View className={styles.settingItem}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>消息推送</Text>
            <Text className={styles.settingDesc}>接收工单派发和提醒通知</Text>
          </View>
          <Switch
            checked={pushNotification}
            onChange={() => setPushNotification(!pushNotification)}
            color="#1890ff"
          />
        </View>

        <View className={styles.settingItem}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>声音提示</Text>
            <Text className={styles.settingDesc}>新消息时播放提示音</Text>
          </View>
          <Switch
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            color="#1890ff"
          />
        </View>

        <View className={styles.settingItem} onClick={handleClearCache}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>清除缓存</Text>
            <Text className={styles.settingDesc}>清理本地暂存的数据</Text>
          </View>
          <Text className={styles.settingValue}>
            <Text className={styles.arrow}>›</Text>
          </Text>
        </View>

        <View className={styles.settingItem} onClick={handleCheckUpdate}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>版本更新</Text>
            <Text className={styles.settingDesc}>检查应用最新版本</Text>
          </View>
          <Text className={styles.settingValue}>
            v1.0.0
            <Text className={styles.arrow}>›</Text>
          </Text>
        </View>

        <View className={styles.settingItem}>
          <View className={styles.settingInfo}>
            <Text className={styles.settingTitle}>关于我们</Text>
            <Text className={styles.settingDesc}>应用信息和使用帮助</Text>
          </View>
          <Text className={styles.settingValue}>
            <Text className={styles.arrow}>›</Text>
          </Text>
        </View>
      </View>

      <Text className={styles.version}>饮水设备巡检 v1.0.0</Text>
    </View>
  );
};

export default SettingsPage;
