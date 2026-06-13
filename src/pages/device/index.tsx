import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { devices, communities } from '../../data/mockData';
import { Device } from '../../types';

const DevicePage: React.FC = () => {
  const [deviceList] = useState<Device[]>(devices);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');

  const filteredDevices = deviceList.filter(device => {
    const matchSearch = searchKeyword === '' ||
      device.name.includes(searchKeyword) ||
      device.code.includes(searchKeyword) ||
      device.location.includes(searchKeyword);

    const matchCommunity = selectedCommunity === '' ||
      device.community === selectedCommunity;

    const matchBuilding = selectedBuilding === '' ||
      device.building === selectedBuilding;

    return matchSearch && matchCommunity && matchBuilding;
  });

  const handleScan = () => {
    Taro.scanCode({
      success: (res) => {
        Taro.navigateTo({
          url: `/pages/inspection/index?code=${res.result}`
        });
      },
      fail: () => {
        Taro.showToast({
          title: '扫码失败',
          icon: 'none'
        });
      }
    });
  };

  const handleDeviceClick = (device: Device) => {
    Taro.navigateTo({
      url: `/pages/deviceDetail/index?deviceId=${device.id}`
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

  return (
    <View className={styles.container}>
      <View className={styles.filterBar}>
        <View className={styles.searchRow}>
          <View className={styles.searchInput}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              placeholder="搜索设备名称、编号、位置"
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.detail.value)}
            />
          </View>
          <Button className={styles.scanBtn} onClick={handleScan}>📷</Button>
        </View>

        <ScrollView className={styles.filterTags} scrollX enableFlex>
          <Button
            className={`${styles.filterTag} ${selectedCommunity === '' ? styles.active : ''}`}
            onClick={() => {
              setSelectedCommunity('');
              setSelectedBuilding('');
            }}
          >
            全部小区
          </Button>
          {communities.map((community) => (
            <Button
              key={community.id}
              className={`${styles.filterTag} ${selectedCommunity === community.name ? styles.active : ''}`}
              onClick={() => {
                setSelectedCommunity(community.name);
                setSelectedBuilding('');
              }}
            >
              {community.name}
            </Button>
          ))}
        </ScrollView>

        {selectedCommunity && (
          <ScrollView className={styles.filterTags} scrollX enableFlex style={{ marginTop: '16rpx' }}>
            <Button
              className={`${styles.filterTag} ${selectedBuilding === '' ? styles.active : ''}`}
              onClick={() => setSelectedBuilding('')}
            >
              全部楼栋
            </Button>
            {communities
              .find(c => c.name === selectedCommunity)
              ?.buildings.map((building) => (
                <Button
                  key={building.id}
                  className={`${styles.filterTag} ${selectedBuilding === building.name ? styles.active : ''}`}
                  onClick={() => setSelectedBuilding(building.name)}
                >
                  {building.name}
                </Button>
              ))}
          </ScrollView>
        )}
      </View>

      <ScrollView className={styles.deviceList} scrollY>
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <View
              key={device.id}
              className={styles.deviceCard}
              onClick={() => handleDeviceClick(device)}
            >
              <View className={styles.deviceHeader}>
                <View className={styles.deviceInfo}>
                  <Text className={styles.deviceName}>{device.name}</Text>
                  <Text className={styles.deviceCode}>{device.code}</Text>
                </View>
                <View className={`${styles.statusIndicator} ${styles[device.status]}`}>
                  <View className={styles.dot} />
                  <Text>{getStatusText(device.status)}</Text>
                </View>
              </View>

              <View className={styles.deviceInfo}>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>安装位置：</Text>
                  <Text className={styles.infoValue}>{device.location}</Text>
                </View>
                {device.waterPressure !== undefined && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>水压：</Text>
                    <Text className={styles.infoValue}>
                      {device.waterPressure} MPa
                      <Text style={{ color: device.waterPressure < 0.3 ? '#ff7d00' : '#00b42a' }}>
                        {device.waterPressure < 0.3 ? ' ⚠️ 低' : ' ✓'}
                      </Text>
                    </Text>
                  </View>
                )}
                {device.filterStatus && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>滤芯状态：</Text>
                    <Text className={styles.infoValue}>
                      {device.filterStatus === 'normal' ? '正常' : '需更换'}
                    </Text>
                  </View>
                )}
              </View>

              <View className={styles.deviceFooter}>
                <Text className={styles.lastInspection}>
                  上次巡检：{device.lastInspectionTime}
                </Text>
                <View className={styles.actionBtns}>
                  <View
                    className={styles.actionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (device.latitude && device.longitude) {
                        Taro.openLocation({
                          latitude: device.latitude,
                          longitude: device.longitude,
                          name: device.name,
                          address: device.location
                        });
                      }
                    }}
                  >
                    导航
                  </View>
                  <View
                    className={`${styles.actionBtn} ${styles.primary}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      Taro.navigateTo({
                        url: `/pages/inspection/index?deviceId=${device.id}`
                      });
                    }}
                  >
                    巡检
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无设备</Text>
            <Text className={styles.emptyHint}>尝试调整筛选条件</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DevicePage;
