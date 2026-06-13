import React, { useState, useEffect } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { workOrders } from '../../data/mockData';
import { WorkOrder } from '../../types';

const WorkOrderDetailPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<WorkOrder | null>(null);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const { orderId } = router.params;
    if (orderId) {
      const foundOrder = workOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        if (foundOrder.result) {
          setResult(foundOrder.result);
        }
      }
    }
  }, [router.params]);

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待接单',
      assigned: '已派单',
      processing: '处理中',
      completed: '已完成',
      verified: '已验收'
    };
    return map[status] || status;
  };

  const getPriorityText = (priority: string) => {
    const map: Record<string, string> = {
      high: '紧急',
      medium: '普通',
      low: '低'
    };
    return map[priority] || priority;
  };

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      fault: '故障报修',
      repair: '维修',
      replacement: '更换'
    };
    return map[type] || type;
  };

  const handleProcess = () => {
    if (!result) {
      Taro.showToast({
        title: '请填写处理结果',
        icon: 'none'
      });
      return;
    }

    Taro.showLoading({ title: '提交中...' });

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '处理成功',
        icon: 'success'
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }, 1000);
  };

  const handleComplete = () => {
    if (!result) {
      Taro.showToast({
        title: '请填写处理结果',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '确认完成',
      content: '确认完成此工单？',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });

          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({
              title: '工单已完成',
              icon: 'success'
            });

            setTimeout(() => {
              Taro.navigateBack();
            }, 1500);
          }, 1000);
        }
      }
    });
  };

  if (!order) {
    return (
      <View className={styles.container}>
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '32rpx', color: '#86909c' }}>未找到工单信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.orderHeader}>
        <Text className={styles.orderNo}>{order.orderNo}</Text>
        <View className={styles.statusRow}>
          <Text className={`${styles.priorityBadge} ${styles[order.priority]}`}>
            {getPriorityText(order.priority)}
          </Text>
          <Text className={`${styles.statusBadge} ${styles[order.status]}`}>
            {getStatusText(order.status)}
          </Text>
        </View>
        <Text className={styles.deviceInfo}>
          {order.deviceName} | {order.location}
        </Text>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>工单信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>工单类型</Text>
          <Text className={styles.infoValue}>{getTypeText(order.type)}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>上报人</Text>
          <Text className={styles.infoValue}>{order.reporter}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>联系电话</Text>
          <Text className={styles.infoValue}>{order.reporterPhone}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>上报时间</Text>
          <Text className={styles.infoValue}>{order.reportedTime}</Text>
        </View>
        {order.handler && (
          <>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>处理人</Text>
              <Text className={styles.infoValue}>{order.handler}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>处理人电话</Text>
              <Text className={styles.infoValue}>{order.handlerPhone}</Text>
            </View>
          </>
        )}
        {order.assignedTime && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>派单时间</Text>
            <Text className={styles.infoValue}>{order.assignedTime}</Text>
          </View>
        )}
        {order.processedTime && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>开始处理</Text>
            <Text className={styles.infoValue}>{order.processedTime}</Text>
          </View>
        )}
        {order.completedTime && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>完成时间</Text>
            <Text className={styles.infoValue}>{order.completedTime}</Text>
          </View>
        )}
      </View>

      <View className={styles.descCard}>
        <Text className={styles.cardTitle}>问题描述</Text>
        <Text className={styles.descContent}>{order.description}</Text>
      </View>

      {order.parts && order.parts.length > 0 && (
        <View className={styles.partsCard}>
          <Text className={styles.cardTitle}>使用备件</Text>
          {order.parts.map((part, index) => (
            <View key={index} className={styles.partItem}>
              <Text className={styles.partIcon}>🔧</Text>
              <Text className={styles.partName}>{part}</Text>
            </View>
          ))}
        </View>
      )}

      {(order.status === 'processing' || order.status === 'assigned') && (
        <View className={styles.resultCard}>
          <Text className={styles.cardTitle}>处理结果</Text>
          <Textarea
            placeholder="请填写处理结果..."
            value={result}
            onInput={(e) => setResult(e.detail.value)}
          />
        </View>
      )}

      {order.status === 'completed' && result && (
        <View className={styles.descCard}>
          <Text className={styles.cardTitle}>处理结果</Text>
          <Text className={styles.descContent}>{result}</Text>
        </View>
      )}

      {(order.status === 'assigned' || order.status === 'processing') && (
        <View className={styles.bottomBar}>
          {order.status === 'assigned' && (
            <View className={`${styles.btn} ${styles.primary}`} onClick={handleProcess}>
              开始处理
            </View>
          )}
          {order.status === 'processing' && (
            <View className={`${styles.btn} ${styles.success}`} onClick={handleComplete}>
              完成工单
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default WorkOrderDetailPage;
