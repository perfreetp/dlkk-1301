import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { messages } from '../../data/mockData';
import { Message } from '../../types';

const MessagePage: React.FC = () => {
  const [messageList] = useState<Message[]>(messages);

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
      reminder: '提醒',
      review: '复核通知',
      system: '系统消息'
    };
    return names[type] || '消息';
  };

  const handleMessageClick = (message: Message) => {
    if (!message.isRead) {
      message.isRead = true;
    }

    if (message.relatedType === 'workorder' && message.relatedId) {
      Taro.navigateTo({
        url: `/pages/workorderDetail/index?orderId=${message.relatedId}`
      });
    } else if (message.relatedType === 'inspection' && message.relatedId) {
      Taro.navigateTo({
        url: `/pages/inspectionRecord/index?taskId=${message.relatedId}`
      });
    } else if (message.relatedId === 'review') {
      Taro.navigateTo({
        url: '/pages/review/index'
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

  return (
    <View className={styles.container}>
      <ScrollView className={styles.messageList} scrollY>
        {messageList.length > 0 ? (
          messageList.map((message) => (
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
