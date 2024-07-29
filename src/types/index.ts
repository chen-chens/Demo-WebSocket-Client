export enum BroadCastType {
    GLOBAL = "Global",
    GROUP = "Group",
    PRIVATE = "Private"
}

export interface MessageType {
    fromUser: string;
    fromUserId: string;
    traceId: string;
    content: string;
    createdTime: string;
}

export interface GroupMessageType extends MessageType {
    groupName?: string;
    groupId: string;
}

export interface PrivateMessageType extends MessageType {
    toUserName?: string;
    toUserId: string;
}

export interface GroupMessageListType {
    [key: string]: GroupMessageType[];
}

export interface PrivateMessageListType {
    [key: string]: PrivateMessageType[];
}

export interface BaseObject {
    id: string;
    name: string;
}

export interface OnlineUserInfo {
    id: string;
    name: string;
    avator?: string;
    groups: string[];
}