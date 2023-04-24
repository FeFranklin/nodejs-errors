export default class NotificationContext {
  constructor() {
    this.notifications = []
  }

  hasNotifications() {
    return this.notifications.length > 0
  }

  addNotification(notificaiton) {
    this.notifications.push(notificaiton)
  }
}