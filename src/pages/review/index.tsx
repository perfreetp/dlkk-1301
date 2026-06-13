import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';

const ReviewPage: React.FC = () => {
  const { inspectionRecords, updateRecordStatus } = useAppState();
  const pendingRecords = inspectionRecords.filter(r => r.status === 'submitted');

  const handleApprove = (record: any) => {
    Taro.showModal({
      title: '确认复核',
      content: '确认通过此巡检记录？',
      success: (res) => {
        if (res.confirm) {
          updateRecordStatus(record.id, 'reviewed', '复核通过，数据完整准确');
          Taro.showToast({
            title: '已通过',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleReject = (record: any) => {
    Taro.showModal({
      title: '驳回原因',
      content: '请明确指出需要修改的问题',
      editable: true,
      placeholderText: '请输入驳回原因...',
      success: (res) => {
        if (res.confirm && res.content) {
          updateRecordStatus(record.id, 'rejected', res.content);
          Taro.showToast({
            title: '已驳回',
            icon: 'none'
          });
        }
      }
    });
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.recordList} scrollY>
        {pendingRecords.length > 0 ? (
          pendingRecords.map((record) => (
            <View key={record.id} className={styles.recordCard}>
              <View className={styles.recordHeader}>
                <View className={styles.deviceInfo}>
                  <Text className={styles.deviceName}>{record.deviceName}</Text>
                  <Text className={styles.inspector}>
                    巡检员：{record.inspector} | {record.inspectionTime}
                  </Text>
                </View>
                <Text className={styles.statusBadge}>待复核</Text>
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

              {record.notes && (
                <View className={styles.notesSection}>
                  <Text className={styles.notesLabel}>备注：</Text>
                  <Text className={styles.notesContent}>{record.notes}</Text>
                </View>
              )}

              <View className={styles.actionBtns}>
                <View
                  className={`${styles.btn} ${styles.reject}`}
                  onClick={() => handleReject(record)}
                >
                  驳回
                </View>
                <View
                  className={`${styles.btn} ${styles.approve}`}
                  onClick={() => handleApprove(record)}
                >
                  通过
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>✅</Text>
            <Text className={styles.emptyText}>暂无待复核记录</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewPage;
