
export interface userMessage {
    text: string,
    fromUserId: string,
    toUserId: string,
    sendTime: Date,
    isRead: boolean
}

export interface user {
    id: string,
    userName: string
    unreadCount: number
}