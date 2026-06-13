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
      reviewed: '已通过',
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

  const handleEdit = () => {
    if (record && record.status === 'rejected') {
      Taro.navigateTo({
        url: `/pages/inspectionEdit/index?recordId=${record.id}`
      });
    }
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

      {record.reviewHistory && record.reviewHistory.length > 0 && (
        <View className={styles.historyCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.titleIcon}>📜</Text>
            复核历史
          </Text>
          {record.reviewHistory.map((item: any, index: number) => (
            <View key={index} className={styles.historyItem}>
              <View className={styles.historyHeader}>
                <Text className={styles.historyTime}>{item.time}</Text>
                <Text className={`${styles.historyStatus} ${
                  item.status === 'reviewed' ? styles.approved : styles.rejected
                }`}>
                  {item.status === 'reviewed' ? '通过' : '驳回'}
                </Text>
              </View>
              <Text className={styles.historyComment}>{item.comment}</Text>
            </View>
          ))}
        </View>
      )}

      {(record.status === 'reviewed' || record.status === 'rejected') && (
        <View className={styles.reviewCard}>
          <Text className={styles.cardTitle}>
            <Text className={styles.titleIcon}>✅</Text>
            最新复核结果
          </Text>
          <View className={styles.reviewStatus}>
            <Text className={`${styles.statusBadge} ${styles[record.status === 'reviewed' ? 'reviewed' : 'rejected']}`}>
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
          <View 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 125, 0, 0.1) 0%, rgba(255, 125, 0, 0.05) 100%)',
              borderRadius: '12rpx',
              padding: '24rpx',
              border: '1rpx solid rgba(255, 125, 0, 0.2)'
            }}
          >
            <Text style={{ fontSize: '28rpx', color: '#ff7d00', fontWeight: 'bold', display: 'block', marginBottom: '12rpx' }}>
              💡 根据复核意见修改后重新提交
            </Text>
            <Text style={{ fontSize: '24rpx', color: '#666', lineHeight: '1.6', display: 'block', marginBottom: '16rpx' }}>
              上方已显示驳回原因，请点击下方按钮修改巡检数据后重新提交
            </Text>
            <View 
              onClick={handleEdit}
              style={{
                background: '#ff7d00',
                color: '#fff',
                padding: '20rpx',
                borderRadius: '48rpx',
                textAlign: 'center',
                fontSize: '28rpx',
                fontWeight: 'bold'
              }}
            >
              编辑并重新提交
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default InspectionDetailPage;
