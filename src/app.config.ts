export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/device/index',
    'pages/workorder/index',
    'pages/message/index',
    'pages/profile/index',
    'pages/inspection/index',
    'pages/parts/index',
    'pages/partsDetail/index',
    'pages/deviceDetail/index',
    'pages/inspectionRecord/index',
    'pages/inspectionDetail/index',
    'pages/workorderDetail/index',
    'pages/emergency/index',
    'pages/review/index',
    'pages/feedback/index',
    'pages/statistics/index',
    'pages/settings/index',
    'pages/offlineList/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '饮水设备巡检',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f6f7'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/device/index',
        text: '设备'
      },
      {
        pagePath: 'pages/workorder/index',
        text: '工单'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
