import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { InspectionTask, InspectionRecord, Message } from '../types';
import { todayTasks as initialTasks, inspectionRecords as initialRecords, messages as initialMessages } from '../data/mockData';

interface AppState {
  todayTasks: InspectionTask[];
  inspectionRecords: InspectionRecord[];
  messages: Message[];
  offlineInspections: any[];
  version: number;
  addInspectionRecord: (record: InspectionRecord) => void;
  updateTaskStatus: (taskId: string, status: string) => void;
  updateRecordStatus: (recordId: string, status: string, reviewComment?: string) => void;
  editRecord: (recordId: string, updates: Partial<InspectionRecord>) => void;
  markMessageAsRead: (messageId: string) => void;
  markMessageAsProcessed: (messageId: string) => void;
  getUnreadMessageCount: () => number;
  getPendingMessageCount: () => number;
  getProcessedMessageCount: () => number;
  getPendingReviewCount: () => number;
  saveOfflineInspection: (inspection: any) => void;
  removeOfflineInspection: (id: string) => void;
  getOfflineInspections: () => any[];
  updateOfflineInspection: (id: string, updates: any) => void;
  refreshData: () => void;
  getTaskById: (taskId: string) => InspectionTask | undefined;
  getRecordById: (recordId: string) => InspectionRecord | undefined;
  getMessageById: (messageId: string) => Message | undefined;
  getTodayCompletedTasks: () => number;
  getPendingTasksCount: () => number;
  getOverdueTasksCount: () => number;
}

const AppContext = createContext<AppState | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'inspection_tasks',
  RECORDS: 'inspection_records',
  MESSAGES: 'inspection_messages',
  OFFLINE: 'offline_inspections'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todayTasks, setTodayTasks] = useState<InspectionTask[]>(() => {
    const saved = Taro.getStorageSync(STORAGE_KEYS.TASKS);
    return saved || initialTasks;
  });
  
  const [inspectionRecords, setInspectionRecords] = useState<InspectionRecord[]>(() => {
    const saved = Taro.getStorageSync(STORAGE_KEYS.RECORDS);
    return saved || initialRecords;
  });
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = Taro.getStorageSync(STORAGE_KEYS.MESSAGES);
    return saved || initialMessages;
  });
  
  const [offlineInspections, setOfflineInspections] = useState<any[]>(() => {
    const saved = Taro.getStorageSync(STORAGE_KEYS.OFFLINE);
    return saved || [];
  });
  
  const [version, setVersion] = useState<number>(0);

  useEffect(() => {
    Taro.setStorageSync(STORAGE_KEYS.TASKS, todayTasks);
  }, [todayTasks]);

  useEffect(() => {
    Taro.setStorageSync(STORAGE_KEYS.RECORDS, inspectionRecords);
  }, [inspectionRecords]);

  useEffect(() => {
    Taro.setStorageSync(STORAGE_KEYS.MESSAGES, messages);
  }, [messages]);

  useEffect(() => {
    Taro.setStorageSync(STORAGE_KEYS.OFFLINE, offlineInspections);
  }, [offlineInspections]);

  const refreshData = useCallback(() => {
    const savedTasks = Taro.getStorageSync(STORAGE_KEYS.TASKS);
    const savedRecords = Taro.getStorageSync(STORAGE_KEYS.RECORDS);
    const savedMessages = Taro.getStorageSync(STORAGE_KEYS.MESSAGES);
    const savedOffline = Taro.getStorageSync(STORAGE_KEYS.OFFLINE);
    
    if (savedTasks) setTodayTasks(savedTasks);
    if (savedRecords) setInspectionRecords(savedRecords);
    if (savedMessages) setMessages(savedMessages);
    if (savedOffline) setOfflineInspections(savedOffline);
    
    setVersion(v => v + 1);
  }, []);

  useEffect(() => {
    Taro.onAppShow(() => {
      refreshData();
    });
  }, [refreshData]);

  const addInspectionRecord = useCallback((record: InspectionRecord) => {
    setInspectionRecords(prev => {
      const newRecords = [record, ...prev];
      return newRecords;
    });
    
    if (record.taskId) {
      updateTaskStatus(record.taskId, 'completed');
    }
    
    setVersion(v => v + 1);
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: string) => {
    setTodayTasks(prev => {
      const updated = prev.map(task => {
        if (task.id === taskId) {
          return { ...task, status };
        }
        return task;
      });
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const updateRecordStatus = useCallback((recordId: string, status: string, reviewComment?: string) => {
    setInspectionRecords(prev => {
      const updated = prev.map(record => {
        if (record.id === recordId) {
          const updatedRecord = { ...record, status };
          if (reviewComment) {
            updatedRecord.reviewHistory = updatedRecord.reviewHistory || [];
            updatedRecord.reviewHistory.push({
              time: new Date().toLocaleString('zh-CN'),
              status,
              comment: reviewComment
            });
            updatedRecord.reviewComment = reviewComment;
          }
          if (status === 'reviewed') {
            updatedRecord.reviewTime = new Date().toLocaleString('zh-CN');
          }
          return updatedRecord;
        }
        return record;
      });
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const editRecord = useCallback((recordId: string, updates: Partial<InspectionRecord>) => {
    setInspectionRecords(prev => {
      const updated = prev.map(record => {
        if (record.id === recordId) {
          return { ...record, ...updates, lastEditTime: new Date().toLocaleString('zh-CN') };
        }
        return record;
      });
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const markMessageAsProcessed = useCallback((messageId: string) => {
    setMessages(prev => {
      const updated = prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isProcessed: true, processedTime: new Date().toLocaleString('zh-CN') };
        }
        return msg;
      });
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const getUnreadMessageCount = useCallback(() => {
    return messages.filter(msg => !msg.isRead).length;
  }, [messages]);

  const getPendingMessageCount = useCallback(() => {
    return messages.filter(msg => !msg.isProcessed && (msg.type === 'dispatch' || msg.type === 'reminder' || msg.type === 'review')).length;
  }, [messages]);

  const getProcessedMessageCount = useCallback(() => {
    return messages.filter(msg => msg.isProcessed).length;
  }, [messages]);

  const getPendingReviewCount = useCallback(() => {
    return inspectionRecords.filter(record => record.status === 'submitted').length;
  }, [inspectionRecords]);

  const getTodayCompletedTasks = useCallback(() => {
    return todayTasks.filter(t => t.status === 'completed').length;
  }, [todayTasks]);

  const getPendingTasksCount = useCallback(() => {
    return todayTasks.filter(t => t.status === 'pending' || t.status === 'overdue').length;
  }, [todayTasks]);

  const getOverdueTasksCount = useCallback(() => {
    return todayTasks.filter(t => t.status === 'overdue').length;
  }, [todayTasks]);

  const saveOfflineInspection = useCallback((inspection: any) => {
    const newOffline = {
      ...inspection,
      id: `offline_${Date.now()}`,
      savedAt: new Date().toISOString(),
      status: 'draft'
    };
    setOfflineInspections(prev => {
      const updated = [...prev, newOffline];
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const removeOfflineInspection = useCallback((id: string) => {
    setOfflineInspections(prev => {
      const updated = prev.filter(item => item.id !== id);
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const updateOfflineInspection = useCallback((id: string, updates: any) => {
    setOfflineInspections(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return { ...item, ...updates, updatedAt: new Date().toISOString() };
        }
        return item;
      });
      return updated;
    });
    setVersion(v => v + 1);
  }, []);

  const getOfflineInspections = useCallback(() => {
    return offlineInspections;
  }, [offlineInspections]);

  const getTaskById = useCallback((taskId: string) => {
    return todayTasks.find(t => t.id === taskId);
  }, [todayTasks]);

  const getRecordById = useCallback((recordId: string) => {
    return inspectionRecords.find(r => r.id === recordId);
  }, [inspectionRecords]);

  const getMessageById = useCallback((messageId: string) => {
    return messages.find(m => m.id === messageId);
  }, [messages]);

  const value: AppState = {
    todayTasks,
    inspectionRecords,
    messages,
    offlineInspections,
    version,
    addInspectionRecord,
    updateTaskStatus,
    updateRecordStatus,
    editRecord,
    markMessageAsRead,
    markMessageAsProcessed,
    getUnreadMessageCount,
    getPendingMessageCount,
    getProcessedMessageCount,
    getPendingReviewCount,
    saveOfflineInspection,
    removeOfflineInspection,
    updateOfflineInspection,
    getOfflineInspections,
    refreshData,
    getTaskById,
    getRecordById,
    getMessageById,
    getTodayCompletedTasks,
    getPendingTasksCount,
    getOverdueTasksCount
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
