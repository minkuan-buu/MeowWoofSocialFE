import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

function TransactionNotifications() {
    var orderId = 12345;
    const [messages, setMessages] = useState<{ orderId: number; message: any }[]>([]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://api.meowwoofsocial.com/hub/transactionhub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.start().then(() => {
            console.log("Connected to the SignalR hub");
            // Join the group based on the orderId
            connection.invoke("JoinGroup", orderId).catch(err => console.error("Error joining group: ", err));
        }).catch(err => console.error("Error connecting to SignalR hub: ", err));

        connection.on("ReceiveTransactionUpdate", (data) => {
            console.log("Order ID:", data.orderId, "Message:", data.data);
            // Lưu tin nhắn vào state
            setMessages(prevMessages => [...prevMessages, { orderId: data.orderId, message: data.data }]);
        });

        return () => {
            connection.stop();
        };
    }, [orderId]); // Chạy lại effect khi orderId thay đổi

    return (
        <div>
            <h2>Transaction Updates for Order ID: {orderId}</h2>
            {messages.map((msg, index) => (
                <p key={index}>{`Order ID: ${msg.orderId}, Message: ${msg.message}`}</p>
            ))}
        </div>
    );
}

export default TransactionNotifications;
