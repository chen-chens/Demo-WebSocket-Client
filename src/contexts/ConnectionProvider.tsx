import { createConnection } from "@/signalRConnection";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";

interface ConnectionContextProps {
    connection: HubConnection | null;
    connectionState: HubConnectionState;
}

const ConnectionContext = createContext<ConnectionContextProps|undefined>(undefined);

export const useConnection = (): ConnectionContextProps => {
    const context = useContext(ConnectionContext);

    if(!context){
        throw Error("ConnectionContext is undefined!")
    }

    return context;
};

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<HubConnection|null>(null);
    const [connectionState, setConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);

    useEffect(() => {
        const buildConnection = async () => {
            const initConnection = createConnection();
            setConnection(initConnection);

            // 監聽連線狀態
            initConnection.onreconnecting(() => setConnectionState(HubConnectionState.Reconnecting));
            initConnection.onreconnected(() => setConnectionState(HubConnectionState.Connected));
            initConnection.onclose(() => setConnectionState(HubConnectionState.Disconnected));
    
            try{
                // 建立連線
                await initConnection.start();
                setConnectionState(HubConnectionState.Connected);
                alert("WebSocket connection success!");
            }catch(error){
                console.log("WebSocket connection fail!", error);
                alert("WebSocket connection fail!");
            }
        }

        if(connectionState !== HubConnectionState.Disconnected) {
            console.log("Connection is still active!")
            return;
        }else{
            buildConnection();
        }

        return () => {
            if(connection){
                connection.stop();
                setConnection(null);
                setConnectionState(HubConnectionState.Disconnected);
            }
        }
    }, [connectionState])

    return (
        <ConnectionContext.Provider value={{ connection, connectionState }}>
            {children}
        </ConnectionContext.Provider>
    );
};