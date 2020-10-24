
export interface userMessage {
    text: string,
    fromUserId: string,
    toUserId: string,
    sendTime: Date
}

export interface user {
    id: string,
    userName: string
}