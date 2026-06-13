import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';

interface Feedback {
  id: string;
  deviceName: string;
  location: string;
  type: 'complaint' | 'suggestion' | 'praise';
  content: string;
  userName: string;
  createTime: string;
}

const FeedbackPage: React.FC = () => {
  const [feedbackList] = useState<Feedback[]>([
    {
      id: '1',
      deviceName: '饮水机-1号',
      location: '阳光花园1栋1单元',
      type: 'complaint',
      content: '出水有点小，希望尽快处理',
      userName: '张大爷',
      createTime: '2024-01-22 08:30'
    },
    {
      id: '2',
      deviceName: '饮水机-2号',
      location: '阳光花园1栋2单元',
      type: 'suggestion',
      content: '建议增加设备清洁频次',
      userName: '王阿姨',
      createTime: '2024-01-21 16:20'
    },
    {
      id: '3',
      deviceName: '饮水机-4号',
      location: '锦绣华庭1号楼1单元',
      type: 'praise',
      content: '服务态度很好，维修及时',
      userName: '李先生',
      createTime: '2024-01-20 10:15'
    }
  ]);

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      complaint: '投诉',
      suggestion: '建议',
      praise: '表扬'
    };
    return map[type] || type;
  };

  return (
    <View className={styles.container}>
      <ScrollView className={styles.feedbackList} scrollY>
        {feedbackList.length > 0 ? (
          feedbackList.map((feedback) => (
            <View key={feedback.id} className={styles.feedbackCard}>
              <View className={styles.feedbackHeader}>
                <View className={styles.deviceInfo}>
                  <Text className={styles.deviceName}>{feedback.deviceName}</Text>
                  <Text className={styles.location}>{feedback.location}</Text>
                </View>
                <Text className={`${styles.typeBadge} ${styles[feedback.type]}`}>
                  {getTypeText(feedback.type)}
                </Text>
              </View>

              <Text className={styles.feedbackContent}>{feedback.content}</Text>

              <View className={styles.feedbackMeta}>
                <Text>反馈人：{feedback.userName}</Text>
                <Text>{feedback.createTime}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>💬</Text>
            <Text className={styles.emptyText}>暂无用户反馈</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FeedbackPage;
