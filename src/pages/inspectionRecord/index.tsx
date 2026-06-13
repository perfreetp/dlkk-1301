import React from 'react';
import { View, Text, ScrollView, Image, Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';

const InspectionRecordPage: React.FC = () => {
  const { inspectionRecords, version } = useAppState();

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

  const handleRecordClick = (recordId: string) => {
    Taro.navigateTo({
      url: `/pages/inspectionDetail/index?recordId=${recordId}`
    });
  };

  const handleQuickEdit = (recordId: string, e: any) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/inspectionEdit/index?recordId=${recordId}`
    });
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffHours < 48) return '昨天';
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
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
                <View className={styles.statusWrapper}>
                  <Text className={`${styles.statusBadge} ${styles[getStatusClass(record.status)]}`}>
                    {getStatusText(record.status)}
                  </Text>
                  {record.status === 'rejected' && (
                    <View
                      className={styles.quickEditBtn}
                      onClick={(e) => handleQuickEdit(record.id, e)}
                    >
                      重新编辑
                    </View>
                  )}
                </View>
              </View>

              {record.status === 'rejected' && record.reviewComment && (
                <View className={styles.rejectBanner}>
                  <Text className={styles.rejectIcon}>⚠️</Text>
                  <View className={styles.rejectContent}>
                    <Text className={styles.rejectLabel}>被驳回原因：</Text>
                    <Text className={styles.rejectText}>{record.reviewComment}</Text>
                  </View>
                </View>
              )}

              {record.status === 'reviewed' && (
                <View className={styles.approvedBanner}>
                  <Text className={styles.approvedIcon}>✅</Text>
                  <Text className={styles.approvedText}>
                    已通过复核 {record.reviewTime ? `@ ${formatTime(record.reviewTime)}` : ''}
                  </Text>
                </View>
              )}

              {record.status === 'submitted' && (
                <View className={styles.pendingBanner}>
                  <Text className={styles.pendingIcon}>⏳</Text>
                  <Text className={styles.pendingText}>
                    等待主管复核中 {record.reviewHistory && record.reviewHistory.length > 0 ? `(第${record.reviewHistory.length + 1}次提交)` : '(首次提交)'}
                  </Text>
                </View>
              )}

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
                <View className={styles.actionBtn}>
                  {record.status === 'rejected' ? '编辑并重提 ›' : '查看详情 ›'}
                </View>
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
