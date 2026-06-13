import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import { statistics } from '../../data/mockData';

const StatisticsPage: React.FC = () => {
  const [stats] = useState(statistics);

  const weekData = [
    { label: '周一', value: 42, percent: 85 },
    { label: '周二', value: 38, percent: 76 },
    { label: '周三', value: 45, percent: 90 },
    { label: '周四', value: 50, percent: 100 },
    { label: '周五', value: 48, percent: 96 },
    { label: '周六', value: 35, percent: 70 },
    { label: '周日', value: 22, percent: 44 }
  ];

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.overviewCard}>
        <Text className={styles.cardTitle}>本周完成巡检</Text>
        <Text className={styles.cardValue}>{stats.inspectedWeek}</Text>
        <Text className={styles.cardSub}>
          设备总数：{stats.totalDevices} | 完成率：{stats.completionRate}%
        </Text>
      </View>

      <View className={styles.statsGrid}>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>今日巡检</Text>
          <Text className={`${styles.statValue} ${styles.primary}`}>
            {stats.inspectedToday}
          </Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>超时任务</Text>
          <Text className={`${styles.statValue} ${styles.warning}`}>
            {stats.overdueTasks}
          </Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>待处理工单</Text>
          <Text className={`${styles.statValue} ${styles.error}`}>
            {stats.pendingWorkOrders}
          </Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statLabel}>平均处理时长</Text>
          <Text className={`${styles.statValue} ${styles.success}`}>
            {stats.averageTime}h
          </Text>
        </View>
      </View>

      <View className={styles.chartCard}>
        <Text className={styles.chartTitle}>本周巡检趋势</Text>
        <View className={styles.barChart}>
          {weekData.map((item, index) => (
            <View key={index} className={styles.barItem}>
              <Text className={styles.barLabel}>{item.label} - {item.value}台</Text>
              <View className={styles.barContainer}>
                <View
                  className={`${styles.barFill} ${styles.blue}`}
                  style={{ width: `${item.percent}%` }}
                />
                <Text className={styles.barValue}>{item.percent}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default StatisticsPage;
