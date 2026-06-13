import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { workOrders } from '../../data/mockData';
import { WorkOrder } from '../../types';

const WorkOrderPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [orderList] = useState<WorkOrder[]>(workOrders);

  const tabs = [
    { key: 'all', label: '全部', count: workOrders.length },
    { key: 'pending', label: '待接单', count: workOrders.filter(w => w.status === 'pending' || w.status === 'assigned').length },
    { key: 'processing', label: '处理中', count: workOrders.filter(w => w.status === 'processing').length },
    { key: 'completed', label: '已完成', count: workOrders.filter(w => w.status === 'completed' || w.status === 'verified').length }
  ];

  const filteredOrders = orderList.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending' || order.status === 'assigned';
    if (activeTab === 'processing') return order.status === 'processing';
    if (activeTab === 'completed') return order.status === 'completed' || order.status === 'verified';
    return true;
  });

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

  const handleOrderClick = (order: WorkOrder) => {
    Taro.navigateTo({
      url: `/pages/workorderDetail/index?orderId=${order.id}`
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.filterTabs}>
        <View className={styles.tabList}>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.count > 0 && tab.key !== 'all' && (
                <Text className={styles.tabBadge}>{tab.count}</Text>
              )}
            </Button>
          ))}
        </View>
      </View>

      <ScrollView className={styles.workOrderList} scrollY>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <View
              key={order.id}
              className={styles.workOrderCard}
              onClick={() => handleOrderClick(order)}
            >
              <View className={styles.orderHeader}>
                <View className={styles.orderInfo}>
                  <Text className={styles.orderNo}>{order.orderNo}</Text>
                  <Text className={styles.deviceInfo}>
                    {order.deviceName} | {order.location}
                  </Text>
                </View>
                <Text className={`${styles.priorityBadge} ${styles[order.priority]}`}>
                  {getPriorityText(order.priority)}
                </Text>
              </View>

              <View className={styles.orderDesc}>
                {order.description}
              </View>

              <View className={styles.orderMeta}>
                <View className={styles.metaItem}>
                  <Text className={styles.metaIcon}>🏷️</Text>
                  <Text>{getTypeText(order.type)}</Text>
                </View>
                <View className={styles.metaItem}>
                  <Text className={styles.metaIcon}>👤</Text>
                  <Text>{order.reporter}</Text>
                </View>
                <View className={styles.metaItem}>
                  <Text className={styles.metaIcon}>🕐</Text>
                  <Text>{order.reportedTime}</Text>
                </View>
              </View>

              <View className={styles.orderFooter}>
                <Text className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {getStatusText(order.status)}
                </Text>
                <View
                  className={styles.actionBtn}
                  onClick={() => handleOrderClick(order)}
                >
                  查看详情
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无工单</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WorkOrderPage;
