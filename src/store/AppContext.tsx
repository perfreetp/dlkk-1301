import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { InspectionTask, InspectionRecord, Message } from '../types';
import { todayTasks as initialTasks, inspectionRecords as initialRecords, messages as initialMessages } from '../data/mockData';

interface AppState {
  todayTasks: InspectionTask[];
  inspectionRecords: InspectionRecord[];
  messages: Message[];
  offlineInspections: any[];
  addInspectionRecord: (record: InspectionRecord) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
  updateRecordStatus: (recordId: string, status: string, reviewComment?: string) => void;
  markMessageAsRead: (messageId: string) => void;
  getUnreadMessageCount: () => number;
  getPendingReviewCount: () => number;
  saveOfflineInspection: (inspection: any) => void;
  removeOfflineInspection: (id: string) => void;
  getOfflineInspections: () => any[];
  refreshData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todayTasks, setTodayTasks] = useState<InspectionTask[]>(initialTasks);
  const [inspectionRecords, setInspectionRecords] = useState<InspectionRecord[]>(initialRecords);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [offlineInspections, setOfflineInspections] = useState<any[]>([]);

  useEffect(() => {
    const savedOffline = Taro.getStorageSync('offlineInspections');
    if (savedOffline) {
      setOfflineInspections(savedOffline);
    }
  }, []);

  const addInspectionRecord = (record: InspectionRecord) => {
    setInspectionRecords(prev => [record, ...prev]);
    
    if (record.taskId) {
      updateTaskStatus(record.taskId, 'completed');
    }
  };

  const updateTaskStatus = (taskId: string, status: string) => {
    setTodayTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const updateRecordStatus = (recordId: string, status: string, reviewComment?: string) => {
    setInspectionRecords(prev => prev.map(record => 
      record.id === recordId ? { ...record, status, reviewComment: reviewComment || record.reviewComment } : record
    ));
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const getUnreadMessageCount = () => {
    return messages.filter(msg => !msg.isRead).length;
  };

  const getPendingReviewCount = () => {
    return inspectionRecords.filter(record => record.status === 'submitted').length;
  };

  const saveOfflineInspection = (inspection: any) => {
    const newOffline = {
      ...inspection,
      id: `offline_${Date.now()}`,
      savedAt: new Date().toISOString(),
      status: 'draft'
    };
    const updated = [...offlineInspections, newOffline];
    setOfflineInspections(updated);
    Taro.setStorageSync('offlineInspections', updated);
  };

  const removeOfflineInspection = (id: string) => {
    const updated = offlineInspections.filter(item => item.id !== id);
    setOfflineInspections(updated);
    Taro.setStorageSync('offlineInspections', updated);
  };

  const getOfflineInspections = () => {
    return offlineInspections;
  };

  const refreshData = () => {
    const savedOffline = Taro.getStorageSync('offlineInspections');
    if (savedOffline) {
      setOfflineInspections(savedOffline);
    }
  };

  const value: AppState = {
    todayTasks,
    inspectionRecords,
    messages,
    offlineInspections,
    addInspectionRecord,
    updateTaskStatus,
    updateRecordStatus,
    markMessageAsRead,
    getUnreadMessageCount,
    getPendingReviewCount,
    saveOfflineInspection,
    removeOfflineInspection,
    getOfflineInspections,
    refreshData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};
