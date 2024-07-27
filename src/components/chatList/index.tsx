import { BroadCastType, MessageType } from "@/types";
import { Card, Chip, Divider, Typography } from "@mui/material";
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';


export interface ChatListProps {
    type: BroadCastType;
    title?: string;
    notice?: string;
    messages: MessageType[];
}
export default function ChatList(props: ChatListProps){
    const broadCastIcons = {
        [BroadCastType.GLOBAL]: <Chip icon={<PublicIcon />} label={BroadCastType.GLOBAL} />,
        [BroadCastType.GROUP]: <Chip icon={<GroupsIcon />} label={BroadCastType.GROUP} />,
        [BroadCastType.PRIVATE]: <Chip icon={<PersonIcon />} label={BroadCastType.PRIVATE} />,
    }


    return(
        <Card sx={{height: "calc(100vh - 64px)", textAlign: 'left', p: 2}}>
            <Card key={123} variant="elevation">
                <Typography variant="h6" py={1} mb={1}>
                    {broadCastIcons[props.type]} {props.title}
                </Typography>
            </Card>

            <Divider />
            {   props.notice &&
                <Typography variant="subtitle2" py={1} mb={1}>
                    通報：{props.notice}
                </Typography>
            }
            {props.messages.map((item, index) => (
                <Card key={index} variant="outlined" style={{margin: 10, padding: 10}}>
                    <h4>[{item.createdTime}] {item.user} : {item.content}</h4>
                    {/* <span>TraceId: {item.traceId}</span> */}
                </Card>
            ))}
        </Card>
    )
}