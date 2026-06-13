import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Video } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';
import { devices } from '../../data/mockData';

const InspectionDetailPage: React.FC = () => {
  const router = useRouter();
  const { inspectionRecords } = useAppState();
  const [record, setRecord] = useState<any>(null);
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    const { recordId } = router.params;
    if (recordId) {
      const foundRecord = inspectionRecords.find(r => r.id === recordId);
      if (foundRecord) {
        setRecord(foundRecord);
        const foundDevice = devices.find(d => d.id === foundRecord.deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
        }
      }
    }
  }, [router.params, inspectionRecords]);

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      draft: '草稿',
      submitted: '待复核',
      reviewed: '已复核',
      rejected: '已驳回'
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      draft: 'draft',
      submitted: 'submitted',
      reviewed: 'reviewed',
      rejected: 'rejected'
    };
    return map[status] || status;
  };

  if (!record) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>未找到巡检记录</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.statusCard}>
        <View className={styles.statusRow}>
          <Text className={`${styles.statusBadge} ${styles[getStatusClass(record.status)]}`}>
            {getStatusText(record.status)}
          </Text>
          <Text className={styles.submitTime}>
            提交时间：{record.inspectionTime}
          </Text>
        </View>
      </View>

      <View className={styles.deviceCard}>
        <Text className={styles.cardTitle}>
          <Text className={styles.titleIcon}>📍</Text>
          设备信息
        </Text>
        <Text className={styles.deviceName}>{record.deviceName}</Text>
        <Text className={styles.deviceCode}>{record.deviceCode}</Text>
        <Text className={styles.location}>
          <Text className={styles.locationIcon}>🏠</Text>
          {device?.location || record.location}
        </Text>
      </View>

      <View className={styles.dataCard}>
        <Text className={styles.cardTitle}>
          <Text className={styles.titleIcon}>📊</Text>
          巡检数据
        </Text>
        <View className={styles.dataGrid}>
          <View className={styles.dataItem}>
            <Text className={styles.dataLabel}>水压</Text>
            <Text className={`${styles.dataValue} ${
              record.waterPressure < 0.3 ? styles.warning : styles.success
            }`}>
              {record.waterPressure} MPa
            </Text>
          </View>
          <View className={styles.dataItem}>
            <Text className={styles.dataLabel}>滤芯状态</Text>
            <Text className={`${styles.dataValue} ${
              record.filterStatus === '需更换' ? styles.error : styles.success
            }`}>
              {record.filterStatus}
            </Text>
          </View>
          <View className={styles.dataItem}>
            <Text className={styles.dataLabel}>消毒时间</Text>
            <Text className={styles.dataValue}>{record.disinfectionTime}</Text>
          </View>
        </View>
      </View>

      {(record.photos && record.photos.length > 0) && (
        <View className={styles.mediaCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.titleIcon}>📷</Text>
            现场照片（{record.photos.length}张）
          </Text>
          <View className={styles.mediaSection}>
            <View className={styles.photoGrid}>
              {record.photos.map((photo: string, idx: number) => (
                <Image
                  key={idx}
                  src={photo}
                  mode="aspectFill"
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {(record.videos && record.videos.length > 0) && (
        <View className={styles.mediaCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.titleIcon}>🎬</Text>
            现场视频（{record.videos.length}个）
          </Text>
          <View className={styles.mediaSection}>
            <View className={styles.videoGrid}>
              {record.videos.map((video: string, idx: number) => (
                <Video
                  key={idx}
                  src={video}
                  showCenterPlayBtn
                  showFullscreenBtn
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {record.notes && (
        <View className={styles.notesCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            备注说明
          </Text>
          <Text className={styles.notesContent}>{record.notes}</Text>
        </View>
      )}

      {(record.status === 'reviewed' || record.status === 'rejected') && (
        <View className={`${styles.reviewCard} ${styles[record.status === 'reviewed' ? 'approved' : 'rejected']}`}>
          <Text className={styles.cardTitle}>
            <Text className={styles.titleIcon}>✅</Text>
            复核结果
          </Text>
          <View className={styles.reviewStatus}>
            <Text className={`${styles.statusBadge} ${styles[record.status === 'reviewed' ? 'approved' : 'rejected']}`}>
              {record.status === 'reviewed' ? '已通过' : '已驳回'}
            </Text>
            <Text className={styles.reviewerInfo}>
              复核人：主管 | {record.reviewTime || '2024-01-22 14:30'}
            </Text>
          </View>
          {record.reviewComment && (
            <View className={styles.reviewComment}>
              <Text className={styles.commentLabel}>复核意见：</Text>
              <Text className={styles.commentContent}>{record.reviewComment}</Text>
            </View>
          )}
        </View>
      )}

      {record.status === 'rejected' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View style={{
            background: 'rgba(255, 125, 0, 0.1)',
            borderRadius: '12rpx',
            padding: '24rpx',
            borderLeft: '6rpx solid #ff7d00'
          }}>
            <Text style={{ fontSize: '28rpx', color: '#ff7d00', fontWeight: 'bold', display: 'block', marginBottom: '12rpx' }}>
              💡 请根据复核意见修改后重新提交
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#666', lineHeight: '1.6' }}>
              被驳回的记录可以点击"编辑重新提交"按钮进行修改
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default InspectionDetailPage;
