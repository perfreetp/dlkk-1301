import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppState } from '../../store/AppContext';
import { devices } from '../../data/mockData';

const InspectionEditPage: React.FC = () => {
  const router = useRouter();
  const { getRecordById, editRecord, updateOfflineInspection, removeOfflineInspection } = useAppState();
  const [record, setRecord] = useState<any>(null);
  const [device, setDevice] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineId, setOfflineId] = useState('');
  const [waterPressure, setWaterPressure] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('normal');
  const [disinfectionTime, setDisinfectionTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const { recordId, offlineId, isOffline: isOfflineParam } = router.params;
    
    if (offlineId) {
      setIsOffline(true);
      setOfflineId(offlineId);
      const offlineInspection = Taro.getStorageSync('offlineInspections') || [];
      const found = offlineInspection.find((item: any) => item.id === offlineId);
      
      if (found) {
        setRecord(found);
        setWaterPressure(found.waterPressure?.toString() || '');
        setFilterStatus(found.filterStatus || 'normal');
        setDisinfectionTime(found.disinfectionTime || '');
        setNotes(found.notes || '');
        setPhotos(found.photos || []);
        setVideos(found.videos || []);
        
        const foundDevice = devices.find(d => d.id === found.deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
        }
      }
    } else if (recordId) {
      setIsOffline(false);
      const foundRecord = getRecordById(recordId);
      if (foundRecord && foundRecord.status === 'rejected') {
        setRecord(foundRecord);
        setWaterPressure(foundRecord.waterPressure?.toString() || '');
        setFilterStatus(foundRecord.filterStatus === '正常' ? 'normal' : 'replace');
        setDisinfectionTime(foundRecord.disinfectionTime || '');
        setNotes(foundRecord.notes || '');
        setPhotos(foundRecord.photos || []);
        setVideos(foundRecord.videos || []);
        
        const foundDevice = devices.find(d => d.id === foundRecord.deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
        }
      } else {
        Taro.showToast({
          title: '该记录不可编辑',
          icon: 'none'
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    }
  }, [router.params, getRecordById]);

  const handleTakePhoto = () => {
    if (photos.length >= 3) {
      Taro.showToast({ title: '最多上传3张照片', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths];
        setPhotos(newPhotos);
      }
    });
  };

  const handleChooseImage = () => {
    if (photos.length >= 3) {
      Taro.showToast({ title: '最多上传3张照片', icon: 'none' });
      return;
    }
    Taro.chooseImage({
      count: 3 - photos.length,
      sourceType: ['album'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths];
        setPhotos(newPhotos);
      }
    });
  };

  const handleTakeVideo = () => {
    if (videos.length >= 2) {
      Taro.showToast({ title: '最多上传2个视频', icon: 'none' });
      return;
    }
    Taro.chooseVideo({
      sourceType: ['camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        const newVideos = [...videos, res.tempFilePath];
        setVideos(newVideos);
      }
    });
  };

  const handleChooseVideo = () => {
    if (videos.length >= 2) {
      Taro.showToast({ title: '最多上传2个视频', icon: 'none' });
      return;
    }
    Taro.chooseVideo({
      sourceType: ['album'],
      maxDuration: 60,
      success: (res) => {
        const newVideos = [...videos, res.tempFilePath];
        setVideos(newVideos);
      }
    });
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleDeleteVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleSave = () => {
    if (!waterPressure) {
      Taro.showToast({
        title: '请填写水压数据',
        icon: 'none'
      });
      return;
    }

    const waterPressureValue = parseFloat(waterPressure);
    if (isNaN(waterPressureValue) || waterPressureValue <= 0 || waterPressureValue > 1) {
      Taro.showToast({
        title: '请输入有效的水压值（0-1 MPa）',
        icon: 'none'
      });
      return;
    }

    if (isOffline) {
      updateOfflineInspection(offlineId, {
        waterPressure,
        filterStatus,
        disinfectionTime,
        photos,
        videos,
        notes
      });

      Taro.showToast({
        title: '保存成功',
        icon: 'success'
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } else {
      Taro.showModal({
        title: '确认重新提交',
        content: `本次为第${(record.reviewHistory?.length || 0) + 1}次提交，确认修改后重新提交巡检记录？`,
        confirmText: '确认提交',
        cancelText: '再检查一下',
        success: (res) => {
          if (res.confirm) {
            Taro.showLoading({ title: '提交中...' });

            setTimeout(() => {
              editRecord(record.id, {
                waterPressure: waterPressureValue,
                filterStatus: filterStatus === 'normal' ? '正常' : '需更换',
                disinfectionTime: disinfectionTime || new Date().toISOString().split('T')[0],
                photos: photos,
                videos: videos,
                notes: notes,
                status: 'submitted'
              });

              Taro.hideLoading();
              Taro.showToast({
                title: '重新提交成功',
                icon: 'success',
                duration: 2000
              });

              setTimeout(() => {
                Taro.navigateBack();
              }, 2000);
            }, 1500);
          }
        }
      });
    }
  };

  if (!record) {
    return (
      <View className={styles.container}>
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '32rpx', color: '#86909c' }}>未找到可编辑的记录</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      {record.reviewComment && !isOffline && (
        <View className={styles.rejectInfo}>
          <View className={styles.rejectTitle}>
            <Text className={styles.rejectIcon}>⚠️</Text>
            <Text>被驳回原因</Text>
          </View>
          <View className={styles.rejectReasonBox}>
            <Text className={styles.rejectReason}>{record.reviewComment}</Text>
          </View>
          {record.reviewHistory && record.reviewHistory.length > 0 && (
            <View className={styles.historyList}>
              <Text className={styles.historyTitle}>复核历史：</Text>
              {record.reviewHistory.map((item: any, index: number) => (
                <View key={index} className={styles.historyItem}>
                  <Text className={styles.historyTime}>{item.time}</Text>
                  <Text className={`${styles.historyStatus} ${item.status === 'rejected' ? styles.rejected : styles.approved}`}>
                    {item.status === 'rejected' ? '驳回' : '通过'}
                  </Text>
                  <Text className={styles.historyComment}>{item.comment}</Text>
                </View>
              ))}
            </View>
          )}
          <View className={styles.tipBox}>
            <Text className={styles.tipIcon}>💡</Text>
            <Text className={styles.tipText}>请根据驳回原因修改后重新提交，提交后将进入待复核状态</Text>
          </View>
        </View>
      )}

      {isOffline && (
        <View className={styles.offlineInfo}>
          <View className={styles.offlineTitle}>
            <Text className={styles.offlineIcon}>📝</Text>
            <Text>离线暂存记录</Text>
          </View>
          <Text className={styles.offlineDesc}>这是一条离线暂存的巡检记录，编辑完成后请在联网环境下提交</Text>
        </View>
      )}

      {device && (
        <View className={styles.deviceInfo}>
          <View className={styles.infoHeader}>
            <View>
              <Text className={styles.deviceName}>{device.name}</Text>
              <Text className={styles.deviceCode}>{device.code}</Text>
            </View>
            <Text className={styles.statusBadge}>{isOffline ? '待提交' : '待重提'}</Text>
          </View>
          <View className={styles.locationInfo}>
            <Text className={styles.locationIcon}>📍</Text>
            <Text>{device.location}</Text>
          </View>
        </View>
      )}

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          {isOffline ? '继续编辑' : '修改巡检数据'}
          <Text className={styles.required}>*</Text>
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.label}>水压检测 (MPa)</Text>
          <View className={styles.inputGroup}>
            <Input
              type="digit"
              placeholder="请输入水压值"
              value={waterPressure}
              onInput={(e) => setWaterPressure(e.detail.value)}
            />
            <Text className={styles.unit}>MPa</Text>
          </View>
          {waterPressure && parseFloat(waterPressure) < 0.3 && (
            <Text style={{ fontSize: '24rpx', color: '#ff7d00', marginTop: '8rpx' }}>
              ⚠️ 水压偏低，建议检查供水管路
            </Text>
          )}
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>滤芯状态</Text>
          <View className={styles.radioGroup}>
            <View
              className={`${styles.radioItem} ${filterStatus === 'normal' ? styles.active : ''}`}
              onClick={() => setFilterStatus('normal')}
            >
              正常
            </View>
            <View
              className={`${styles.radioItem} ${filterStatus === 'replace' ? styles.active : ''}`}
              onClick={() => setFilterStatus('replace')}
            >
              需更换
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.label}>消毒时间</Text>
          <Input
            className={styles.input}
            type="text"
            placeholder="格式：2024-01-22 10:30"
            value={disinfectionTime}
            onInput={(e) => setDisinfectionTime(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.photoSection}>
        <Text className={styles.sectionTitle}>现场照片（{photos.length}/3）</Text>
        <View className={styles.photoGrid}>
          {photos.map((photo, index) => (
            <View key={index} className={styles.photoItem}>
              <Image src={photo} mode="aspectFill" />
              <View
                className={styles.deleteBtn}
                onClick={() => handleDeletePhoto(index)}
              >
                ✕
              </View>
            </View>
          ))}
          {photos.length < 3 && (
            <>
              <View className={`${styles.photoItem} ${styles.addBtn}`} onClick={handleTakePhoto}>
                <Text className={styles.addIcon}>📷</Text>
                <Text className={styles.addText}>拍照</Text>
              </View>
              <View className={`${styles.photoItem} ${styles.addBtn}`} onClick={handleChooseImage}>
                <Text className={styles.addIcon}>🖼️</Text>
                <Text className={styles.addText}>相册</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View className={styles.photoSection}>
        <Text className={styles.sectionTitle}>现场视频（{videos.length}/2）</Text>
        <View className={styles.photoGrid}>
          {videos.map((video, index) => (
            <View key={index} className={styles.photoItem}>
              <View style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: '48rpx' }}>🎬</Text>
              </View>
              <View
                className={styles.deleteBtn}
                onClick={() => handleDeleteVideo(index)}
              >
                ✕
              </View>
            </View>
          ))}
          {videos.length < 2 && (
            <>
              <View className={`${styles.photoItem} ${styles.addBtn}`} onClick={handleTakeVideo}>
                <Text className={styles.addIcon}>🎥</Text>
                <Text className={styles.addText}>录像</Text>
              </View>
              <View className={`${styles.photoItem} ${styles.addBtn}`} onClick={handleChooseVideo}>
                <Text className={styles.addIcon}>📁</Text>
                <Text className={styles.addText}>选择视频</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View className={styles.notesSection}>
        <Text className={styles.sectionTitle}>备注说明</Text>
        <Textarea
          placeholder="请输入巡检备注..."
          value={notes}
          onInput={(e) => setNotes(e.detail.value)}
        />
      </View>

      <View className={styles.bottomBar}>
        <View
          className={`${styles.btn} ${styles.primary}`}
          onClick={handleSave}
        >
          {isOffline ? '保存暂存' : '重新提交'}
        </View>
      </View>
    </View>
  );
};

export default InspectionEditPage;
