import { Device, InspectionTask, WorkOrder, Part, PartApplication, Message, InspectionRecord, User, Statistics, Community } from '../types';

// 小区和楼栋数据
export const communities: Community[] = [
  {
    id: '1',
    name: '阳光花园',
    buildings: [
      { id: '1-1', name: '1栋', units: ['1单元', '2单元', '3单元'] },
      { id: '1-2', name: '2栋', units: ['1单元', '2单元'] },
      { id: '1-3', name: '3栋', units: ['1单元', '2单元', '3单元'] }
    ]
  },
  {
    id: '2',
    name: '绿城小区',
    buildings: [
      { id: '2-1', name: 'A栋', units: ['1单元', '2单元'] },
      { id: '2-2', name: 'B栋', units: ['1单元'] }
    ]
  },
  {
    id: '3',
    name: '锦绣华庭',
    buildings: [
      { id: '3-1', name: '1号楼', units: ['1单元', '2单元', '3单元', '4单元'] },
      { id: '3-2', name: '2号楼', units: ['1单元', '2单元'] }
    ]
  }
];

// 设备列表
export const devices: Device[] = [
  {
    id: 'd1',
    code: 'WD-2024-001',
    name: '饮水机-1号',
    location: '阳光花园1栋1单元',
    community: '阳光花园',
    building: '1栋',
    unit: '1单元',
    status: 'normal',
    lastInspectionTime: '2024-01-15 09:30',
    nextInspectionTime: '2024-01-22 09:30',
    waterPressure: 0.35,
    filterStatus: 'normal',
    disinfectionTime: '2024-01-15',
    latitude: 30.5728,
    longitude: 114.2528
  },
  {
    id: 'd2',
    code: 'WD-2024-002',
    name: '饮水机-2号',
    location: '阳光花园1栋2单元',
    community: '阳光花园',
    building: '1栋',
    unit: '2单元',
    status: 'warning',
    lastInspectionTime: '2024-01-14 14:20',
    nextInspectionTime: '2024-01-21 14:20',
    waterPressure: 0.28,
    filterStatus: 'replace',
    latitude: 30.5730,
    longitude: 114.2530
  },
  {
    id: 'd3',
    code: 'WD-2024-003',
    name: '饮水机-3号',
    location: '绿城小区A栋1单元',
    community: '绿城小区',
    building: 'A栋',
    unit: '1单元',
    status: 'error',
    lastInspectionTime: '2024-01-13 10:15',
    nextInspectionTime: '2024-01-20 10:15',
    waterPressure: 0.18,
    filterStatus: 'replace',
    latitude: 30.5750,
    longitude: 114.2550
  },
  {
    id: 'd4',
    code: 'WD-2024-004',
    name: '饮水机-4号',
    location: '锦绣华庭1号楼1单元',
    community: '锦绣华庭',
    building: '1号楼',
    unit: '1单元',
    status: 'normal',
    lastInspectionTime: '2024-01-15 11:00',
    nextInspectionTime: '2024-01-22 11:00',
    waterPressure: 0.38,
    filterStatus: 'normal',
    latitude: 30.5780,
    longitude: 114.2580
  },
  {
    id: 'd5',
    code: 'WD-2024-005',
    name: '饮水机-5号',
    location: '锦绣华庭2号楼2单元',
    community: '锦绣华庭',
    building: '2号楼',
    unit: '2单元',
    status: 'offline',
    lastInspectionTime: '2024-01-10 08:00',
    nextInspectionTime: '2024-01-17 08:00',
    latitude: 30.5785,
    longitude: 114.2585
  }
];

// 今日任务
export const todayTasks: InspectionTask[] = [
  {
    id: 't1',
    deviceId: 'd1',
    deviceCode: 'WD-2024-001',
    deviceName: '饮水机-1号',
    location: '阳光花园1栋1单元',
    scheduledTime: '2024-01-22 09:30',
    status: 'pending',
    type: 'daily'
  },
  {
    id: 't2',
    deviceId: 'd2',
    deviceCode: 'WD-2024-002',
    deviceName: '饮水机-2号',
    location: '阳光花园1栋2单元',
    scheduledTime: '2024-01-22 10:00',
    status: 'overdue',
    type: 'periodic'
  },
  {
    id: 't3',
    deviceId: 'd3',
    deviceCode: 'WD-2024-003',
    deviceName: '饮水机-3号',
    location: '绿城小区A栋1单元',
    scheduledTime: '2024-01-22 14:00',
    status: 'pending',
    type: 'repair'
  },
  {
    id: 't4',
    deviceId: 'd4',
    deviceCode: 'WD-2024-004',
    deviceName: '饮水机-4号',
    location: '锦绣华庭1号楼1单元',
    scheduledTime: '2024-01-22 15:00',
    status: 'pending',
    type: 'daily'
  }
];

// 维修工单
export const workOrders: WorkOrder[] = [
  {
    id: 'w1',
    orderNo: 'WO-2024-0128',
    deviceId: 'd2',
    deviceCode: 'WD-2024-002',
    deviceName: '饮水机-2号',
    location: '阳光花园1栋2单元',
    type: 'fault',
    priority: 'high',
    status: 'assigned',
    description: '滤芯堵塞，出水量明显减小',
    reporter: '张大爷',
    reporterPhone: '138****1234',
    reportedTime: '2024-01-21 16:30',
    assignedTime: '2024-01-21 17:00',
    handler: '李师傅',
    handlerPhone: '139****5678'
  },
  {
    id: 'w2',
    orderNo: 'WO-2024-0127',
    deviceId: 'd3',
    deviceCode: 'WD-2024-003',
    deviceName: '饮水机-3号',
    location: '绿城小区A栋1单元',
    type: 'repair',
    priority: 'high',
    status: 'processing',
    description: '水压异常低，需要检查供水管路',
    reporter: '王阿姨',
    reporterPhone: '137****5678',
    reportedTime: '2024-01-21 09:15',
    assignedTime: '2024-01-21 09:30',
    processedTime: '2024-01-21 10:00',
    handler: '李师傅',
    handlerPhone: '139****5678'
  },
  {
    id: 'w3',
    orderNo: 'WO-2024-0126',
    deviceId: 'd5',
    deviceCode: 'WD-2024-005',
    deviceName: '饮水机-5号',
    location: '锦绣华庭2号楼2单元',
    type: 'replacement',
    priority: 'medium',
    status: 'completed',
    description: '滤芯到期，需要更换',
    reporter: '物业管理员',
    reporterPhone: '136****9012',
    reportedTime: '2024-01-20 14:00',
    assignedTime: '2024-01-20 14:30',
    processedTime: '2024-01-20 15:30',
    completedTime: '2024-01-21 10:00',
    handler: '王师傅',
    handlerPhone: '138****3456',
    parts: ['FL-001 滤芯', 'FL-002 滤芯'],
    result: '已完成滤芯更换，设备正常运行'
  }
];

// 备件列表
export const parts: Part[] = [
  {
    id: 'p1',
    code: 'FL-001',
    name: 'PP棉滤芯',
    category: '滤芯类',
    stock: 50,
    unit: '个',
    location: 'A区-01-01'
  },
  {
    id: 'p2',
    code: 'FL-002',
    name: '活性炭滤芯',
    category: '滤芯类',
    stock: 45,
    unit: '个',
    location: 'A区-01-02'
  },
  {
    id: 'p3',
    code: 'FL-003',
    name: 'RO反渗透膜',
    category: '滤芯类',
    stock: 20,
    unit: '个',
    location: 'A区-01-03'
  },
  {
    id: 'p4',
    code: 'XL-001',
    name: '压力桶',
    category: '配件类',
    stock: 10,
    unit: '个',
    location: 'B区-02-01'
  },
  {
    id: 'p5',
    code: 'XL-002',
    name: '电磁阀',
    category: '配件类',
    stock: 15,
    unit: '个',
    location: 'B区-02-02'
  }
];

// 备件申请记录
export const partApplications: PartApplication[] = [
  {
    id: 'pa1',
    partId: 'p1',
    partName: 'PP棉滤芯',
    quantity: 2,
    reason: '更换阳光花园1栋2单元饮水机滤芯',
    status: 'approved',
    applicant: '李师傅',
    applyTime: '2024-01-21 17:05',
    approvedTime: '2024-01-21 17:30'
  },
  {
    id: 'pa2',
    partId: 'p2',
    partName: '活性炭滤芯',
    quantity: 1,
    reason: '锦绣华庭巡检发现需要更换',
    status: 'pending',
    applicant: '李师傅',
    applyTime: '2024-01-22 09:00'
  }
];

// 消息列表
export const messages: Message[] = [
  {
    id: 'm1',
    type: 'dispatch',
    title: '新工单派发',
    content: '您有一个新的维修工单，请及时处理',
    relatedId: 'w1',
    relatedType: 'workorder',
    isRead: false,
    createTime: '2024-01-21 17:00'
  },
  {
    id: 'm2',
    type: 'reminder',
    title: '巡检超时提醒',
    content: '阳光花园1栋2单元饮水机巡检已超时，请尽快处理',
    relatedId: 't2',
    relatedType: 'inspection',
    isRead: false,
    createTime: '2024-01-22 10:00'
  },
  {
    id: 'm3',
    type: 'review',
    title: '复核通知',
    content: '您有3条巡检记录待主管复核',
    relatedId: 'review',
    isRead: true,
    createTime: '2024-01-21 18:00'
  },
  {
    id: 'm4',
    type: 'system',
    title: '系统公告',
    content: '春节假期期间请做好设备巡检工作',
    isRead: true,
    createTime: '2024-01-20 10:00'
  }
];

// 巡检记录
export const inspectionRecords: InspectionRecord[] = [
  {
    id: 'ir1',
    deviceId: 'd1',
    deviceCode: 'WD-2024-001',
    deviceName: '饮水机-1号',
    inspector: '李师傅',
    inspectionTime: '2024-01-15 09:30',
    waterPressure: 0.35,
    filterStatus: '正常',
    disinfectionTime: '2024-01-15',
    photos: ['https://picsum.photos/id/292/300/200'],
    videos: [],
    notes: '设备运行正常',
    status: 'reviewed'
  },
  {
    id: 'ir2',
    deviceId: 'd4',
    deviceCode: 'WD-2024-004',
    deviceName: '饮水机-4号',
    inspector: '李师傅',
    inspectionTime: '2024-01-15 11:00',
    waterPressure: 0.38,
    filterStatus: '正常',
    disinfectionTime: '2024-01-15',
    photos: ['https://picsum.photos/id/326/300/200'],
    videos: [],
    notes: '水质检测合格',
    status: 'submitted'
  }
];

// 用户信息
export const currentUser: User = {
  id: 'u1',
  name: '李师傅',
  phone: '139****5678',
  role: 'repairman',
  avatar: 'https://picsum.photos/id/64/200/200',
  community: '阳光花园、绿城小区、锦绣华庭',
  todayTasks: 4,
  completedTasks: 2,
  overdueTasks: 1,
  pendingWorkOrders: 2,
  unreadMessages: 2
};

// 统计数据
export const statistics: Statistics = {
  totalDevices: 128,
  inspectedToday: 45,
  inspectedWeek: 280,
  overdueTasks: 3,
  pendingWorkOrders: 5,
  completionRate: 94.5,
  averageTime: 2.5
};
