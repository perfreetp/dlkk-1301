import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { inspectionRecords } from '../../data/mockData';
import { InspectionRecord } from '../../types';

const ReviewPage: React.FC = () => {
  const [records, setRecords] = useState<InspectionRecord[]>(
    inspectionRecords.filter(r => r.status === 'submitted')
  );

  const handleApprove = (record: InspectionRecord) => {
    Taro.showModal({
      title: '确认复核',
      content: '确认通过此巡检记录？',
      success: (res) => {
        if (res.confirm) {
          setRecords(records.filter(r => r.id !== record.id));
          Taro.showToast({
            title: '已通过',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleReject = (record: InspectionRecord) => {
    Taro.showModal({
      title: '驳回确认',
      content: '确认驳回此巡检记录？',
      success: (res) => {
        if (res.confirm) {
          setRecords(records.filter(r => r.id !== record.id));
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
        {records.length > 0 ? (
          records.map((record) => (
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
