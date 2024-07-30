import { MessageType } from "@/types";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';

const handleBasicMessage = (fromUserName: string, fromUserId: string, content: string): MessageType => {
    const message: MessageType = {
        fromUserName,
        fromUserId,
        traceId: uuidv4(),
        content,
        createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    return message;
}

export default handleBasicMessage;