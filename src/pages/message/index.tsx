import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';
import { todayTasks, devices } from '../../data/mockData';

const MessagePage: React.FC = () => {
  const { messages, markMessageAsRead } = useAppState();

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      dispatch: '📨',
      reminder: '⏰',
      review: '📋',
      system: '🔔'
    };
    return icons[type] || '📢';
  };

  const getTypeName = (type: string) => {
    const names: Record<string, string> = {
      dispatch: '派单通知',
      reminder: '超时提醒',
      review: '复核通知',
      system: '系统消息'
    };
    return names[type] || '消息';
  };

  const handleMessageClick = (message: any) => {
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }

    if (message.type === 'dispatch' && message.relatedId) {
      Taro.navigateTo({
        url: `/pages/workorderDetail/index?orderId=${message.relatedId}`
      });
    } else if (message.type === 'reminder' && message.relatedId) {
      const task = todayTasks.find(t => t.id === message.relatedId);
      if (task) {
        Taro.navigateTo({
          url: `/pages/inspection/index?taskId=${task.id}&deviceId=${task.deviceId}`
        });
      } else {
        const device = devices.find(d => d.id === message.relatedId);
        if (device) {
          Taro.navigateTo({
            url: `/pages/deviceDetail/index?deviceId=${device.id}`
          });
        }
      }
    } else if (message.type === 'review') {
      Taro.navigateTo({
        url: '/pages/review/index'
      });
    } else if (message.type === 'system') {
      Taro.showModal({
        title: '系统公告',
        content: message.content,
        showCancel: false
      });
    }
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return timeStr;
  };

  const getPreviewText = (message: any): string => {
    if (message.type === 'reminder' && message.relatedId) {
      const task = todayTasks.find(t => t.id === message.relatedId);
      if (task) {
        return `设备：${task.deviceName} | 位置：${task.location}`;
      }
    }
    if (message.type === 'dispatch' && message.relatedId) {
      return `点击查看工单详情`;
    }
    if (message.type === 'review') {
      return `点击进入复核页面`;
    }
    return message.content;
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.messageList} scrollY>
        {messages.length > 0 ? (
          messages.map((message) => (
            <View
              key={message.id}
              className={`${styles.messageCard} ${!message.isRead ? styles.unread : ''}`}
              onClick={() => handleMessageClick(message)}
            >
              {!message.isRead && <View className={styles.unreadDot} />}

              <View className={styles.messageHeader}>
                <View className={styles.messageType}>
                  <Text className={styles.typeIcon}>{getTypeIcon(message.type)}</Text>
                  <Text className={styles.typeName}>{getTypeName(message.type)}</Text>
                </View>
                <Text className={styles.messageTime}>{formatTime(message.createTime)}</Text>
              </View>

              <Text className={styles.messageTitle}>{message.title}</Text>
              <Text className={styles.messageContent}>{message.content}</Text>
              
              <Text className={styles.previewText}>{getPreviewText(message)}</Text>
              
              <View className={styles.actionHint}>
                <Text>点击查看详情 ›</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无消息</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
