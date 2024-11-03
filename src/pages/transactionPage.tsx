import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useLocation, useParams } from "react-router-dom";
import { CHECKREF } from "@/api/Order";
import Logout from "@/components/logout";
import { PaymentCard } from "@/components/store/payment/paymentCard";

function Transaction() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const orderId = queryParams.get("orderId");
  var refIdQuery = queryParams.get("refId");
  var refId: number = 0;
  const amount = queryParams.get("amount");
  if (refIdQuery == null){
    window.location.href = "/stores";
  } else {
    refId = parseInt(refIdQuery, 10);
  }
  const [messages, setMessages] = useState<{ orderId: number; message: any }[]>([]);

  const fetchRefId = async () => {
    try {
      if (refIdQuery == null) {
        window.location.href = "/stores";
        return;
      }

      if(!localStorage.token){
        Logout();
      }

      const result = await CHECKREF({
        refId: refIdQuery,
        token: localStorage.token,
      });

      if (result.isSuccess && result.res != null) {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("https://api.meowwoofsocial.com/hub/transactionhub")
          .configureLogging(signalR.LogLevel.Information)
          .build();

        connection.start().then(() => {
          console.log("Connected to the SignalR hub");
          // Join the group based on the orderId
          connection.invoke("JoinGroup", refId).catch(err => console.error("Error joining group: ", err));
        }).catch(err => console.error("Error connecting to SignalR hub: ", err));

        connection.on("ReceiveTransactionUpdate", (data) => {
          console.log("Order ID:", data.orderId, "Message:", data.data);
          // Lưu tin nhắn vào state
          setMessages(prevMessages => [...prevMessages, { orderId: data.orderId, message: data.data }]);
        });

        return () => {
          connection.stop();
        };
      } else {
        if (result.statusCode === 401) {
          Logout();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const fetchPayment = async () => {
    try {
      const response = await fetch("https://oauth.casso.vn/v2/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Apikey 785DC169D8B4C8FBFE2631398539C"
        },
        body: JSON.stringify({
          bank_acc_id: "1020546203",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Transaction synced successfully:", data);
      } else {
        console.error("Failed to sync transaction:", response.status);
      }
    } catch (error) {
      console.error("Error syncing transaction:", error);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchPayment();

      const intervalId = setInterval(fetchPayment, 60000);

      return () => clearInterval(intervalId);
    }, 10000);

    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    fetchRefId();
  }, [refId]);

  return (
    // <div>
    //   <h2>Transaction Updates for Order ID: {refId}</h2>
    //   {messages.map((msg, index) => (
    //     <p key={index}>{`Order ID: ${msg.orderId}, Message: ${msg.message}`}</p>
    //   ))}
    // </div>
    <div className="flex justify-center pt-5 pb-20">
      <div className="flex flex-col gap-4 min-w-[800px] h-full">
        {orderId && refId && amount && (<PaymentCard orderId={orderId} refId={refId} amount={amount} data={messages} />)}
      </div>
    </div>
  );
}

export default Transaction;
