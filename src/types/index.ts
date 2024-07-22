export enum BroadCastType {
    GLOBAL = "Global",
    GROUP = "Group",
    PRIVATE = "Private"
}

export interface MessageType {
    user: string;
    traceId: string;
    content: string;
    createdTime: string;
}

export interface GroupMessageType extends MessageType {
    groupName: string;
    groupId: string;
}

export interface PrivateMessageType extends MessageType {
    targetName: string;
    targetId: string;
}

export interface BaseObject {
    id: string;
    name: string;
}