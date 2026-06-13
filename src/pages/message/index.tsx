import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';
import { todayTasks, devices } from '../../data/mockData';

const MessagePage: React.FC = () => {
  const { messages, markMessageAsRead, markMessageAsProcessed } = useAppState();
  const [activeTab, setActiveTab] = useState<string>('pending');

  const pendingMessages = messages.filter(msg => !msg.isProcessed);
  const processedMessages = messages.filter(msg => msg.isProcessed);

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
      Taro.showToast({
        title: '正在处理...',
        icon: 'loading',
        duration: 500
      });
      setTimeout(() => {
        markMessageAsProcessed(message.id);
        Taro.navigateTo({
          url: `/pages/workorderDetail/index?orderId=${message.relatedId}`
        });
      }, 600);
    } else if (message.type === 'reminder' && message.relatedId) {
      Taro.showToast({
        title: '正在处理...',
        icon: 'loading',
        duration: 500
      });
      setTimeout(() => {
        markMessageAsProcessed(message.id);
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
      }, 600);
    } else if (message.type === 'review') {
      Taro.showToast({
        title: '正在处理...',
        icon: 'loading',
        duration: 500
      });
      setTimeout(() => {
        markMessageAsProcessed(message.id);
        Taro.navigateTo({
          url: '/pages/review/index'
        });
      }, 600);
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

  const getProcessedStatus = (message: any): string => {
    if (message.type === 'dispatch' && message.relatedId) {
      return '已处理：查看工单';
    }
    if (message.type === 'reminder') {
      return '已处理：任务已查看';
    }
    if (message.type === 'review') {
      return '已处理：进入复核';
    }
    return '已读';
  };

  const displayedMessages = activeTab === 'pending' ? pendingMessages : processedMessages;

  return (
    <View className={styles.container}>
      <View className={styles.filterTabs}>
        <View className={styles.tabList}>
          <Button
            className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            待处理
            {pendingMessages.length > 0 && (
              <View className={styles.tabBadge}>
                <Text className={styles.badgeText}>{pendingMessages.length}</Text>
              </View>
            )}
          </Button>
          <Button
            className={`${styles.tab} ${activeTab === 'processed' ? styles.active : ''}`}
            onClick={() => setActiveTab('processed')}
          >
            已处理
            {processedMessages.length > 0 && (
              <View className={styles.tabBadgeGray}>
                <Text className={styles.badgeTextGray}>{processedMessages.length}</Text>
              </View>
            )}
          </Button>
        </View>
      </View>

      <ScrollView className={styles.messageList} scrollY>
        {displayedMessages.length > 0 ? (
          displayedMessages.map((message) => (
            <View
              key={message.id}
              className={`${styles.messageCard} ${!message.isRead ? styles.unread : ''} ${message.isProcessed ? styles.processed : ''}`}
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
              
              {message.isProcessed && (
                <View className={styles.processedStatus}>
                  <Text className={styles.processedIcon}>✓</Text>
                  <Text className={styles.processedText}>{getProcessedStatus(message)}</Text>
                </View>
              )}
              
              {!message.isProcessed && (
                <View className={styles.actionHint}>
                  <Text>点击处理 ›</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>
              {activeTab === 'pending' ? '✅' : '📭'}
            </Text>
            <Text className={styles.emptyText}>
              {activeTab === 'pending' ? '暂无待处理消息' : '暂无已处理消息'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagePage;
