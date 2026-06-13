import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { parts, partApplications } from '../../data/mockData';
import { Part, PartApplication } from '../../types';

const PartsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('inventory');
  const [partList] = useState<Part[]>(parts);
  const [applicationList] = useState<PartApplication[]>(partApplications);

  const tabs = [
    { key: 'inventory', label: '库存' },
    { key: 'application', label: '申请记录' }
  ];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'empty';
    if (stock < 10) return 'low';
    return 'sufficient';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return '缺货';
    if (stock < 10) return '库存紧张';
    return '充足';
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待审批',
      approved: '已批准',
      rejected: '已拒绝',
      received: '已领取'
    };
    return map[status] || status;
  };

  const handleApply = (part: Part) => {
    Taro.navigateTo({
      url: `/pages/partsDetail/index?partId=${part.id}`
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
            </Button>
          ))}
        </View>
      </View>

      <ScrollView scrollY style={{ flex: 1 }}>
        {activeTab === 'inventory' ? (
          <View className={styles.partsList}>
            {partList.map((part) => (
              <View key={part.id} className={styles.partCard}>
                <View className={styles.partHeader}>
                  <View className={styles.partInfo}>
                    <Text className={styles.partName}>{part.name}</Text>
                    <Text className={styles.partCode}>{part.code}</Text>
                  </View>
                  <Text className={`${styles.stockBadge} ${styles[getStockStatus(part.stock)]}`}>
                    {part.stock} {part.unit} | {getStockText(part.stock)}
                  </Text>
                </View>

                <View className={styles.partDetails}>
                  <View className={styles.detailItem}>
                    <Text className={styles.detailLabel}>类别：</Text>
                    <Text>{part.category}</Text>
                  </View>
                  <View className={styles.detailItem}>
                    <Text className={styles.detailLabel}>库位：</Text>
                    <Text>{part.location}</Text>
                  </View>
                </View>

                <View className={styles.actionBtns}>
                  <View className={`${styles.btn} ${styles.default}`}>
                    查看详情
                  </View>
                  <View
                    className={`${styles.btn} ${styles.primary}`}
                    onClick={() => handleApply(part)}
                  >
                    申请领用
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.applicationList}>
            {applicationList.length > 0 ? (
              applicationList.map((app) => (
                <View key={app.id} className={styles.appCard}>
                  <View className={styles.appHeader}>
                    <View className={styles.appInfo}>
                      <Text className={styles.partName}>{app.partName}</Text>
                      <Text className={styles.appNo}>
                        数量：{app.quantity} | 申请人：{app.applicant}
                      </Text>
                    </View>
                    <Text className={`${styles.statusBadge} ${styles[app.status]}`}>
                      {getStatusText(app.status)}
                    </Text>
                  </View>

                  <View className={styles.appDetails}>{app.reason}</View>

                  <View className={styles.appMeta}>
                    <Text>申请时间：{app.applyTime}</Text>
                    {app.approvedTime && (
                      <Text>审批时间：{app.approvedTime}</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📦</Text>
                <Text className={styles.emptyText}>暂无申请记录</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PartsPage;
