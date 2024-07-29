import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';



export const createConnection = (): HubConnection => {
    let connection: HubConnection|null = null;
    // 初始化連線對象
    connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5230/chathub', { withCredentials: true }) // 後端 WebSocket Server 位置
        .withAutomaticReconnect()
        .build();


    return connection;
}
