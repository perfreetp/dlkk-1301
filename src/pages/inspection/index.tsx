import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { devices, todayTasks } from '../../data/mockData';
import { useAppState } from '../../store/AppContext';

const InspectionPage: React.FC = () => {
  const router = useRouter();
  const { saveOfflineInspection, addInspectionRecord } = useAppState();
  const [device, setDevice] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [waterPressure, setWaterPressure] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('normal');
  const [disinfectionTime, setDisinfectionTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  useEffect(() => {
    const { deviceId, taskId, code } = router.params;

    if (code) {
      const foundDevice = devices.find(d => d.code === code);
      if (foundDevice) {
        setDevice(foundDevice);
        if (foundDevice.waterPressure) {
          setWaterPressure(foundDevice.waterPressure.toString());
        }
        if (foundDevice.filterStatus) {
          setFilterStatus(foundDevice.filterStatus);
        }
      }
    } else if (deviceId) {
      const foundDevice = devices.find(d => d.id === deviceId);
      if (foundDevice) {
        setDevice(foundDevice);
        if (foundDevice.waterPressure) {
          setWaterPressure(foundDevice.waterPressure.toString());
        }
        if (foundDevice.filterStatus) {
          setFilterStatus(foundDevice.filterStatus);
        }
      }
    } else if (taskId) {
      const foundTask = todayTasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        const foundDevice = devices.find(d => d.id === foundTask.deviceId);
        if (foundDevice) {
          setDevice(foundDevice);
          if (foundDevice.waterPressure) {
            setWaterPressure(foundDevice.waterPressure.toString());
          }
          if (foundDevice.filterStatus) {
            setFilterStatus(foundDevice.filterStatus);
          }
        }
      }
    }
  }, [router.params]);

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

  const handleSaveOffline = () => {
    if (!waterPressure) {
      Taro.showToast({
        title: '请填写水压数据',
        icon: 'none'
      });
      return;
    }

    saveOfflineInspection({
      deviceId: device?.id,
      taskId: task?.id,
      waterPressure,
      filterStatus,
      disinfectionTime,
      photos,
      videos,
      notes
    });

    Taro.showToast({
      title: '已暂存到离线',
      icon: 'success'
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleSubmit = () => {
    if (!waterPressure) {
      Taro.showToast({
        title: '请填写水压数据',
        icon: 'none'
      });
      return;
    }

    Taro.showModal({
      title: '确认提交',
      content: '确认提交巡检记录？提交后将进入待复核状态。',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });

          const newRecord = {
            id: `ir${Date.now()}`,
            deviceId: device?.id || '',
            deviceCode: device?.code || '',
            deviceName: device?.name || '',
            inspector: '李师傅',
            inspectionTime: new Date().toLocaleString('zh-CN'),
            waterPressure: parseFloat(waterPressure),
            filterStatus: filterStatus === 'normal' ? '正常' : '需更换',
            disinfectionTime: disinfectionTime || new Date().toISOString().split('T')[0],
            photos: photos,
            videos: videos,
            notes: notes,
            status: 'submitted',
            taskId: task?.id
          };

          setTimeout(() => {
            addInspectionRecord(newRecord);

            Taro.hideLoading();
            Taro.showToast({
              title: '提交成功',
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
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      normal: '正常',
      warning: '预警',
      error: '故障',
      offline: '离线'
    };
    return map[status] || status;
  };

  if (!device) {
    return (
      <View className={styles.container}>
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '32rpx', color: '#86909c' }}>未找到设备信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.deviceInfo}>
        <View className={styles.infoHeader}>
          <View>
            <Text className={styles.deviceName}>{device.name}</Text>
            <Text className={styles.deviceCode}>{device.code}</Text>
          </View>
          <Text className={`${styles.statusBadge} ${styles[device.status]}`}>
            {getStatusText(device.status)}
          </Text>
        </View>
        <View className={styles.locationInfo}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text>{device.location}</Text>
        </View>
      </View>

      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>
          巡检数据
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
          className={`${styles.btn} ${styles.secondary}`}
          onClick={handleSaveOffline}
        >
          离线暂存
        </View>
        <View
          className={`${styles.btn} ${styles.primary}`}
          onClick={handleSubmit}
        >
          提交巡检
        </View>
      </View>
    </View>
  );
};

export default InspectionPage;
