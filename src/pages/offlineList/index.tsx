import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';
import { devices } from '../../data/mockData';

const OfflineListPage: React.FC = () => {
  const { offlineInspections, removeOfflineInspection, addInspectionRecord, inspectionRecords, version } = useAppState();
  const [isOnline, setIsOnline] = useState(true);
  const [networkType, setNetworkType] = useState('');

  useEffect(() => {
    const checkNetwork = () => {
      const networkTypeRes = Taro.getNetworkType();
      setNetworkType(networkTypeRes);
      setIsOnline(networkTypeRes !== 'none');
    };

    checkNetwork();

    Taro.onNetworkStatusChange((res) => {
      setIsOnline(res.isConnected);
      if (res.isConnected) {
        setNetworkType(res.networkType || 'unknown');
      } else {
        setNetworkType('none');
      }
    });
  }, []);

  const getDeviceInfo = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    return device || { name: '未知设备', code: '--', location: '--' };
  };

  const getTodayFormalRecords = (deviceId: string) => {
    const today = new Date().toDateString();
    return inspectionRecords.filter(r => {
      const recordDate = new Date(r.inspectionTime).toDateString();
      return r.deviceId === deviceId && recordDate === today && r.status !== 'draft';
    });
  };

  const handleContinueSubmit = (inspection: any) => {
    if (!isOnline) {
      Taro.showToast({
        title: '当前无网络连接',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '确认提交',
      content: '确认提交此巡检记录？提交后将进入待复核状态。',
      confirmText: '确认提交',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });

          setTimeout(() => {
            const deviceInfo = getDeviceInfo(inspection.deviceId);

            const newRecord = {
              id: `ir${Date.now()}`,
              deviceId: inspection.deviceId,
              deviceCode: deviceInfo.code,
              deviceName: deviceInfo.name,
              inspector: '李师傅',
              inspectionTime: new Date().toLocaleString('zh-CN'),
              waterPressure: parseFloat(inspection.waterPressure) || 0,
              filterStatus: inspection.filterStatus === 'normal' ? '正常' : '需更换',
              disinfectionTime: inspection.disinfectionTime || new Date().toISOString().split('T')[0],
              photos: inspection.photos || [],
              videos: inspection.videos || [],
              notes: inspection.notes || '',
              status: 'submitted',
              taskId: inspection.taskId
            };

            addInspectionRecord(newRecord);
            removeOfflineInspection(inspection.id);

            Taro.hideLoading();
            Taro.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            });
          }, 1500);
        }
      }
    });
  };

  const handleEdit = (inspection: any) => {
    Taro.navigateTo({
      url: `/pages/inspectionEdit/index?offlineId=${inspection.id}&isOffline=true`
    });
  };

  const handleDelete = (inspection: any) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除此暂存记录吗？',
      success: (res) => {
        if (res.confirm) {
          removeOfflineInspection(inspection.id);
          Taro.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getNetworkIcon = () => {
    if (!isOnline) return '📵';
    switch (networkType) {
      case 'wifi': return '📶';
      case '4g': return '📱';
      case '5g': return '📱';
      default: return '🌐';
    }
  };

  const getNetworkText = () => {
    if (!isOnline) return '当前离线，暂存数据将在联网后提交';
    switch (networkType) {
      case 'wifi': return '网络已连接（WiFi），可以提交';
      case '4g': return '网络已连接（4G），可以提交';
      case '5g': return '网络已连接（5G），可以提交';
      default: return '网络已连接，可以提交';
    }
  };

  return (
    <View className={styles.container}>
      <View className={`${styles.networkStatus} ${!isOnline ? styles.offline : styles.online}`}>
        <Text className={styles.statusText}>
          <Text className={styles.statusIcon}>{getNetworkIcon()}</Text>
          {getNetworkText()}
        </Text>
      </View>

      <View className={styles.tipsCard}>
        <Text className={styles.tipsTitle}>
          <Text className={styles.tipsIcon}>💡</Text>
          离线暂存说明
        </Text>
        <Text className={styles.tipsContent}>
          当设备巡检过程中遇到网络不稳定或中断时，巡检数据会自动暂存到这里。
          恢复网络后，您可以继续提交这些暂存的记录。
          暂存记录会与正式提交的记录分开显示，不会混淆。
          如果同一设备当天已有正式巡检记录，列表中会清晰标注。
        </Text>
      </View>

      <ScrollView className={styles.offlineList} scrollY>
        {offlineInspections.length > 0 ? (
          offlineInspections.map((inspection) => {
            const deviceInfo = getDeviceInfo(inspection.deviceId);
            const formalRecords = getTodayFormalRecords(inspection.deviceId);
            const hasFormalRecord = formalRecords.length > 0;
            
            return (
              <View key={inspection.id} className={styles.offlineCard}>
                <View className={styles.cardHeader}>
                  <View className={styles.deviceInfo}>
                    <View className={styles.deviceNameRow}>
                      <Text className={styles.deviceName}>{deviceInfo.name}</Text>
                      <View className={styles.offlineTag}>
                        <Text className={styles.offlineTagText}>暂存</Text>
                      </View>
                    </View>
                    {hasFormalRecord && (
                      <View className={styles.warningTag}>
                        <Text className={styles.warningTagText}>⚠️ 同设备已有正式记录</Text>
                      </View>
                    )}
                    <Text className={styles.deviceCode}>{deviceInfo.code}</Text>
                    <Text className={styles.saveTime}>
                      暂存时间：{formatTime(inspection.savedAt)}
                    </Text>
                  </View>
                </View>

                <View className={styles.offlineData}>
                  <View className={styles.dataItem}>
                    <Text className={styles.dataLabel}>水压</Text>
                    <Text className={styles.dataValue}>{inspection.waterPressure || '--'} MPa</Text>
                  </View>
                  <View className={styles.dataItem}>
                    <Text className={styles.dataLabel}>滤芯</Text>
                    <Text className={styles.dataValue}>
                      {inspection.filterStatus === 'normal' ? '正常' : '需更换'}
                    </Text>
                  </View>
                  <View className={styles.dataItem}>
                    <Text className={styles.dataLabel}>消毒</Text>
                    <Text className={styles.dataValue}>{inspection.disinfectionTime || '--'}</Text>
                  </View>
                </View>

                <View className={styles.offlineMedia}>
                  <Text className={styles.mediaInfo}>附件：</Text>
                  <View className={styles.mediaCount}>
                    <Text className={styles.countItem}>
                      <Text className={styles.countIcon}>📷</Text>
                      {inspection.photos?.length || 0}张照片
                    </Text>
                    <Text className={styles.countItem}>
                      <Text className={styles.countIcon}>🎬</Text>
                      {inspection.videos?.length || 0}个视频
                    </Text>
                  </View>
                </View>

                <View className={styles.actionBtns}>
                  <View
                    className={`${styles.btn} ${styles.edit}`}
                    onClick={() => handleEdit(inspection)}
                  >
                    继续编辑
                  </View>
                  <View
                    className={`${styles.btn} ${styles.delete}`}
                    onClick={() => handleDelete(inspection)}
                  >
                    删除
                  </View>
                  <View
                    className={`${styles.btn} ${isOnline ? styles.submit : styles.disabled}`}
                    onClick={() => handleContinueSubmit(inspection)}
                  >
                    {isOnline ? '提交' : '等待联网'}
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📦</Text>
            <Text className={styles.emptyText}>暂无暂存记录</Text>
            <Text className={styles.emptyHint}>在无网络环境下巡检将自动暂存</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OfflineListPage;
