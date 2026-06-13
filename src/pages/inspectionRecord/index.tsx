import React from 'react';
import { View, Text, ScrollView, Image, Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';

const InspectionRecordPage: React.FC = () => {
  const { inspectionRecords } = useAppState();

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

  const handleRecordClick = (recordId: string) => {
    Taro.navigateTo({
      url: `/pages/inspectionDetail/index?recordId=${recordId}`
    });
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.recordList} scrollY>
        {inspectionRecords.length > 0 ? (
          inspectionRecords.map((record) => (
            <View 
              key={record.id} 
              className={styles.recordCard}
              onClick={() => handleRecordClick(record.id)}
            >
              <View className={styles.recordHeader}>
                <View className={styles.deviceInfo}>
                  <Text className={styles.deviceName}>{record.deviceName}</Text>
                  <Text className={styles.deviceCode}>{record.deviceCode}</Text>
                </View>
                <Text className={`${styles.statusBadge} ${styles[getStatusClass(record.status)]}`}>
                  {getStatusText(record.status)}
                </Text>
              </View>

              <View className={styles.recordData}>
                <View className={styles.dataItem}>
                  <Text className={styles.dataLabel}>水压</Text>
                  <Text className={styles.dataValue}>{record.waterPressure} MPa</Text>
                </View>
                <View className={styles.dataItem}>
                  <Text className={styles.dataLabel}>滤芯</Text>
                  <Text className={styles.dataValue}>{record.filterStatus}</Text>
                </View>
                <View className={styles.dataItem}>
                  <Text className={styles.dataLabel}>消毒</Text>
                  <Text className={styles.dataValue}>{record.disinfectionTime}</Text>
                </View>
              </View>

              {(record.photos && record.photos.length > 0) && (
                <View className={styles.mediaSection}>
                  <Text className={styles.mediaLabel}>现场照片：</Text>
                  <ScrollView className={styles.mediaScroll} scrollX>
                    {record.photos.map((photo, idx) => (
                      <Image
                        key={idx}
                        src={photo}
                        className={styles.mediaItem}
                        mode="aspectFill"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {(record.videos && record.videos.length > 0) && (
                <View className={styles.mediaSection}>
                  <Text className={styles.mediaLabel}>现场视频：</Text>
                  <ScrollView className={styles.mediaScroll} scrollX>
                    {record.videos.map((video, idx) => (
                      <View key={idx} className={styles.videoItem}>
                        <Video
                          src={video}
                          className={styles.videoPlayer}
                          showCenterPlayBtn
                          showFullscreenBtn
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {record.notes && (
                <View className={styles.notesSection}>
                  <Text className={styles.notesLabel}>备注：</Text>
                  <Text className={styles.notesContent}>{record.notes}</Text>
                </View>
              )}

              <View className={styles.recordFooter}>
                <Text className={styles.meta}>
                  巡检员：{record.inspector} | {record.inspectionTime}
                </Text>
                <View className={styles.actionBtn}>查看详情 ›</View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📝</Text>
            <Text className={styles.emptyText}>暂无巡检记录</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InspectionRecordPage;
