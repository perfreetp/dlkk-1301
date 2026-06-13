import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { workOrders } from '../../data/mockData';
import { useAppState } from '../../store/AppContext';

const ProfilePage: React.FC = () => {
  const { todayTasks, getUnreadMessageCount, getPendingReviewCount } = useAppState();

  const pendingTasks = todayTasks.filter(t => t.status === 'pending' || t.status === 'overdue').length;
  const completedTasks = todayTasks.filter(t => t.status === 'completed').length;
  const overdueTasks = todayTasks.filter(t => t.status === 'overdue').length;
  const unreadMessages = getUnreadMessageCount();
  const pendingWorkOrders = workOrders.filter(w => w.status === 'pending' || w.status === 'assigned' || w.status === 'processing').length;
  const pendingReview = getPendingReviewCount();

  const menuItems = [
    {
      icon: '📝',
      title: '巡检记录',
      desc: '查看历史巡检记录',
      url: '/pages/inspectionRecord/index',
      badge: 0
    },
    {
      icon: '📤',
      title: '离线暂存',
      desc: '查看暂存的巡检数据',
      url: '/pages/offlineList/index',
      badge: 0
    },
    {
      icon: '🔧',
      title: '备件领用',
      desc: '申请和领取备件',
      url: '/pages/parts/index',
      badge: pendingWorkOrders
    },
    {
      icon: '📊',
      title: '巡检统计',
      desc: '查看巡检数据统计',
      url: '/pages/statistics/index',
      badge: 0
    },
    {
      icon: '✅',
      title: '主管复核',
      desc: '复核巡检记录',
      url: '/pages/review/index',
      badge: pendingReview
    },
    {
      icon: '💬',
      title: '用户反馈',
      desc: '查看用户反馈',
      url: '/pages/feedback/index',
      badge: 0
    },
    {
      icon: '⚙️',
      title: '设置',
      desc: '应用设置',
      url: '/pages/settings/index',
      badge: 0
    }
  ];

  const handleMenuClick = (url: string) => {
    Taro.navigateTo({ url });
  };

  return (
    <ScrollView className={styles.container} scrollY>
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <View className={styles.avatar}>
            <Image src="https://picsum.photos/id/64/200/200" mode="aspectFill" />
          </View>
          <View className={styles.userInfo}>
            <Text className={styles.userName}>李师傅</Text>
            <Text className={styles.userRole}>维修师傅</Text>
            <Text className={styles.userPhone}>139****5678</Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{pendingTasks}</Text>
            <Text className={styles.statLabel}>待巡检</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{completedTasks}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{overdueTasks}</Text>
            <Text className={styles.statLabel}>超时</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{unreadMessages}</Text>
            <Text className={styles.statLabel}>未读消息</Text>
          </View>
        </View>
      </View>

      <View className={styles.menuSection}>
        <Text className={styles.sectionTitle}>常用功能</Text>
        <View className={styles.menuList}>
          {menuItems.map((item) => (
            <View
              key={item.title}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item.url)}
            >
              <Text className={styles.menuIcon}>{item.icon}</Text>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              {item.badge > 0 && (
                <Text className={styles.menuBadge}>{item.badge}</Text>
              )}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.logoutBtn}>
        <View className={styles.logoutText}>退出登录</View>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
