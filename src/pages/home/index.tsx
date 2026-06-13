import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { todayTasks, workOrders, currentUser } from '../../data/mockData';
import { InspectionTask } from '../../types';

const HomePage: React.FC = () => {
  const [tasks] = useState<InspectionTask[]>(todayTasks);
  const user = currentUser;

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'overdue');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const pendingWorkOrders = workOrders.filter(w => w.status === 'pending' || w.status === 'assigned' || w.status === 'processing').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${month}月${day}日 ${weekdays[date.getDay()]}`;
  };

  const handleTaskAction = (task: InspectionTask) => {
    if (task.status === 'pending' || task.status === 'overdue') {
      Taro.navigateTo({
        url: `/pages/inspection/index?taskId=${task.id}&deviceId=${task.deviceId}`
      });
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'scan':
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
        break;
      case 'parts':
        Taro.navigateTo({
          url: '/pages/parts/index'
        });
        break;
      case 'emergency':
        Taro.navigateTo({
          url: '/pages/emergency/index'
        });
        break;
      case 'statistics':
        Taro.navigateTo({
          url: '/pages/statistics/index'
        });
        break;
    }
  };

  const getStatusText = (status: string) => {
    const map = {
      pending: '待巡检',
      overdue: '已超时',
      completed: '已完成',
      in_progress: '进行中'
    };
    return map[status] || status;
  };

  return (
    <ScrollView className={styles.container} scrollY enablePullDownRefresh>
      <View className={styles.header}>
        <Text className={styles.greeting}>{getGreeting()}，{user.name}</Text>
        <Text className={styles.date}>{getDate()}</Text>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{pendingTasks.length}</Text>
            <Text className={styles.statLabel}>待巡检</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{completedTasks.length}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={`${styles.statValue} ${styles.statValueWarning}`}>
              {overdueTasks.length}
            </Text>
            <Text className={styles.statLabel}>超时</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={`${styles.statValue} ${styles.statValueDanger}`}>
              {pendingWorkOrders}
            </Text>
            <Text className={styles.statLabel}>待处理工单</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.actionGrid}>
          <View
            className={styles.actionItem}
            onClick={() => handleQuickAction('scan')}
          >
            <View className={styles.actionIcon}>
              <Text className={styles.iconText}>📷</Text>
            </View>
            <Text className={styles.actionLabel}>扫码巡检</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => handleQuickAction('parts')}
          >
            <View className={styles.actionIcon}>
              <Text className={styles.iconText}>🔧</Text>
            </View>
            <Text className={styles.actionLabel}>备件领用</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => handleQuickAction('emergency')}
          >
            <View className={styles.actionIcon}>
              <Text className={styles.iconText}>🛑</Text>
            </View>
            <Text className={styles.actionLabel}>紧急停机</Text>
          </View>
          <View
            className={styles.actionItem}
            onClick={() => handleQuickAction('statistics')}
          >
            <View className={styles.actionIcon}>
              <Text className={styles.iconText}>📊</Text>
            </View>
            <Text className={styles.actionLabel}>统计报表</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>今日任务（{tasks.length}）</Text>
          <Button className={styles.moreBtn}>查看全部</Button>
        </View>

        <View className={styles.taskList}>
          {tasks.map((task) => (
            <View key={task.id} className={styles.taskCard}>
              <View className={styles.taskHeader}>
                <View className={styles.deviceInfo}>
                  <Text className={styles.deviceName}>{task.deviceName}</Text>
                  <Text className={styles.deviceCode}>{task.deviceCode}</Text>
                </View>
                <Text className={`${styles.statusBadge} ${styles[task.status]}`}>
                  {getStatusText(task.status)}
                </Text>
              </View>

              <View className={styles.taskInfo}>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>📍</Text>
                  <Text>{task.location}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.infoIcon}>🕐</Text>
                  <Text>{task.scheduledTime}</Text>
                </View>
              </View>

              <View className={styles.taskFooter}>
                <Text className={styles.timeInfo}>
                  {task.type === 'daily' ? '日常巡检' : task.type === 'periodic' ? '定期巡检' : '维修巡检'}
                </Text>
                <View className={styles.actionBtns}>
                  <View
                    className={`${styles.btn} ${styles.default}`}
                    onClick={() => {
                      Taro.navigateTo({
                        url: `/pages/deviceDetail/index?deviceId=${task.deviceId}`
                      });
                    }}
                  >
                    查看详情
                  </View>
                  {(task.status === 'pending' || task.status === 'overdue') && (
                    <View
                      className={`${styles.btn} ${styles.primary}`}
                      onClick={() => handleTaskAction(task)}
                    >
                      开始巡检
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
