//==============Notice =================
export interface NotificationModel {
    _id: string;
    userId: string;
    formUser: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }
  
  export interface NotificationResponse {
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
  }
  
  export interface NotificationPushModel {
    title: string;
    message: string;
  }