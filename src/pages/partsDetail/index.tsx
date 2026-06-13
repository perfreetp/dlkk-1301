import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { parts } from '../../data/mockData';
import { Part } from '../../types';

const PartsDetailPage: React.FC = () => {
  const router = useRouter();
  const [part, setPart] = useState<Part | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const { partId } = router.params;
    if (partId) {
      const foundPart = parts.find(p => p.id === partId);
      if (foundPart) {
        setPart(foundPart);
      }
    }
  }, [router.params]);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'empty';
    if (stock < 10) return 'low';
    return 'sufficient';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return '缺货';
    if (stock < 10) return '库存紧张';
    return '库存充足';
  };

  const handleApply = () => {
    if (!reason) {
      Taro.showToast({
        title: '请填写申请原因',
        icon: 'none'
      });
      return;
    }

    Taro.showLoading({ title: '提交中...' });

    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '申请已提交',
        icon: 'success'
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }, 1000);
  };

  if (!part) {
    return (
      <View className={styles.container}>
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '32rpx', color: '#86909c' }}>未找到备件信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.partHeader}>
        <Text className={styles.partName}>{part.name}</Text>
        <Text className={styles.partCode}>{part.code}</Text>
        <View className={styles.stockInfo}>
          <Text className={`${styles.stockBadge} ${styles[getStockStatus(part.stock)]}`}>
            库存：{part.stock} {part.unit}
          </Text>
          <Text style={{ fontSize: '24rpx', color: '#86909c' }}>
            {getStockText(part.stock)}
          </Text>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.cardTitle}>备件信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>备件编号</Text>
          <Text className={styles.infoValue}>{part.code}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>备件名称</Text>
          <Text className={styles.infoValue}>{part.name}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>类别</Text>
          <Text className={styles.infoValue}>{part.category}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>单位</Text>
          <Text className={styles.infoValue}>{part.unit}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>库位</Text>
          <Text className={styles.infoValue}>{part.location}</Text>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.cardTitle}>申请信息</Text>
        <View className={styles.formItem}>
          <Text className={styles.label}>申请数量</Text>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f2f3f5',
              borderRadius: '12rpx',
              padding: '0 24rpx'
            }}
          >
            <input
              type="number"
              value={quantity}
              onInput={(e: any) => setQuantity(e.detail.value)}
              style={{
                flex: 1,
                height: '88rpx',
                background: 'transparent',
                border: 'none',
                fontSize: '28rpx'
              }}
            />
            <Text style={{ fontSize: '28rpx', color: '#86909c' }}>{part.unit}</Text>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>申请原因 <Text style={{ color: '#f53f3f' }}>*</Text></Text>
          <textarea
            placeholder="请填写申请原因..."
            value={reason}
            onInput={(e: any) => setReason(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btn} onClick={handleApply}>
          提交申请
        </View>
      </View>
    </View>
  );
};

export default PartsDetailPage;
