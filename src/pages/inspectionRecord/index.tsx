import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { inspectionRecords } from '../../data/mockData';
import { InspectionRecord } from '../../types';

const InspectionRecordPage: React.FC = () => {
  const [records] = useState<InspectionRecord[]>(inspectionRecords);

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      draft: '草稿',
      submitted: '已提交',
      reviewed: '已复核',
      rejected: '已驳回'
    };
    return map[status] || status;
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
                  <Text className={styles.deviceCode}>{record.deviceCode}</Text>
                </View>
                <Text className={`${styles.statusBadge} ${styles[record.status]}`}>
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

              <View className={styles.recordFooter}>
                <Text className={styles.meta}>
                  巡检员：{record.inspector} | {record.inspectionTime}
                </Text>
                <View className={styles.actionBtn}>查看详情</View>
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
