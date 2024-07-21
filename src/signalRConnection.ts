import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

let connection: HubConnection|null = null;

export const createConnection = (): HubConnection => {
    if(connection === null){
        connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/chathub') // 後端 WebSocket Server 位置
            .withAutomaticReconnect()
            .build();
    }

    return connection;
}

export const getConnection = (): HubConnection|null => {
    return connection;
}