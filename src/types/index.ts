// 设备信息
export interface Device {
  id: string;
  code: string; // 设备编号
  name: string;
  location: string; // 安装位置
  community: string; // 小区
  building: string; // 楼栋
  unit: string; // 单元
  status: 'normal' | 'warning' | 'error' | 'offline';
  lastInspectionTime: string;
  nextInspectionTime: string;
  waterPressure?: number; // 水压
  filterStatus?: 'normal' | 'replace'; // 滤芯状态
  disinfectionTime?: string; // 消毒时间
  latitude?: number;
  longitude?: number;
}

// 巡检任务
export interface InspectionTask {
  id: string;
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  location: string;
  scheduledTime: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  type: 'daily' | 'periodic' | 'repair';
  waterPressure?: number;
  filterStatus?: 'normal' | 'replace';
  disinfectionTime?: string;
  photos?: string[];
  videos?: string[];
  notes?: string;
  isOfflineSaved?: boolean;
}

// 维修工单
export interface WorkOrder {
  id: string;
  orderNo: string;
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  location: string;
  type: 'fault' | 'repair' | 'replacement';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'assigned' | 'processing' | 'completed' | 'verified';
  description: string;
  reporter: string;
  reporterPhone: string;
  reportedTime: string;
  assignedTime?: string;
  processedTime?: string;
  completedTime?: string;
  photos?: string[];
  handler?: string;
  handlerPhone?: string;
  parts?: string[]; // 使用的备件
  result?: string; // 处理结果
}

// 备件
export interface Part {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  location: string;
}

export interface PartApplication {
  id: string;
  partId: string;
  partName: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'received';
  applicant: string;
  applyTime: string;
  approvedTime?: string;
  receivedTime?: string;
}

// 消息
export interface Message {
  id: string;
  type: 'dispatch' | 'reminder' | 'review' | 'system';
  title: string;
  content: string;
  relatedId?: string; // 相关工单或设备ID
  relatedType?: 'workorder' | 'device' | 'inspection';
  isRead: boolean;
  isProcessed?: boolean; // 是否已处理
  processedTime?: string; // 处理时间
  createTime: string;
}

// 复核历史
export interface ReviewHistory {
  time: string;
  status: string;
  comment: string;
}

// 巡检记录
export interface InspectionRecord {
  id: string;
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  inspector: string;
  inspectionTime: string;
  waterPressure: number;
  filterStatus: string;
  disinfectionTime: string;
  photos: string[];
  videos: string[];
  notes: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'rejected';
  taskId?: string; // 关联的任务ID
  reviewComment?: string; // 最新复核意见
  reviewTime?: string; // 复核时间
  lastEditTime?: string; // 最后编辑时间
  reviewHistory?: ReviewHistory[]; // 复核历史
}

// 用户信息
export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'repairman' | 'supervisor';
  avatar?: string;
  community?: string; // 负责片区
  todayTasks: number;
  completedTasks: number;
  overdueTasks: number;
  pendingWorkOrders: number;
  unreadMessages: number;
}

// 统计数据
export interface Statistics {
  totalDevices: number;
  inspectedToday: number;
  inspectedWeek: number;
  overdueTasks: number;
  pendingWorkOrders: number;
  completionRate: number;
  averageTime: number; // 平均处理时长
}

// 小区和楼栋筛选
export interface Community {
  id: string;
  name: string;
  buildings: Building[];
}

export interface Building {
  id: string;
  name: string;
  units: string[];
}
