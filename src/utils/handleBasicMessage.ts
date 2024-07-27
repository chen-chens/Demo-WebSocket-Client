import { MessageType } from "@/types";
import dayjs from "dayjs";

const handleBasicMessage = (user: string, content: string): MessageType => {
    const message: MessageType = {
        user,
        traceId: `${new Date().getTime()}`,
        content,
        createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    return message;
}

export default handleBasicMessage;