interface Users {
  token: string
  res: {
    UserInterface: any
    Attributes: {
      deviceID: string
      externalUserID: string
      openID: string
      userID: string
      raw: string
    }
  }
}
