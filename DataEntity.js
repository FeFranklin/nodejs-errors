import NotificationContext from "./notificationContext.js"

export default class DataEntity extends NotificationContext{
  constructor({ name, age }) {
    super()
    this.name = name
    this.age = age
  }

  isValid() {
    if (this.age < 20) {
      this.addNotification("Field Age must be higher than 20.")
    }
  
    if (this.name?.length < 20) {
      this.addNotification("Name length must be longer than 4 characters.")
    }

    return !this.hasNotifications()
  }
}
