import { BroadCastType, MessageType } from "@/types";
import { Card, Typography } from "@mui/material";

export interface ChatListProps {
    type: BroadCastType;
    messages: MessageType[];
}
export default function ChatList(props: ChatListProps){

    return(
        <Card sx={{height: "calc(100vh - 64px)"}}>
            <Card key={123} variant="elevation">
                <Typography variant="h5" py={1}>{props.type}</Typography>
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