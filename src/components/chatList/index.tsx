import { BroadCastType, MessageType } from "@/types";
import { Card } from "@mui/material";

export interface ChatListProps {
    type: BroadCastType;
    messages: MessageType[];
}
export default function ChatList(props: ChatListProps){

    return(
        <Card>
            <Card key={123} variant="outlined" style={{margin: 10}}>
                <h2>{props.type}</h2>
            </Card>

            {props.messages.map((item, index) => (
                <Card key={index} variant="outlined" style={{margin: 10, padding: 10}}>
                    <h4>[{item.createdTime}] {item.user} : {item.content}</h4>
                    {/* <span>TraceId: {item.traceId}</span> */}
                </Card>
            ))}
        </Card>
    )
}