import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useLocation, useParams } from "react-router-dom";
import { CANCELTRANSACTION, CHECKREF } from "@/api/Order";
import Logout from "@/components/logout";
import { PaymentCard } from "@/components/store/payment/paymentCard";
import { set } from "date-fns";
const cassoApiKey = import.meta.env.VITE_CASSO_APIKEY;

function Transaction() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);

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
  const [ok, setOk] = useState(false);
  const fetchRefId = async () => {
    if (ok) return;
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
        if ('data' in result.res) {
          const data = result.res.data;
          setCurrentTransactionId(data.id)
          setOk(true);
        }
      } else {
        if (result.statusCode === 401) {
          Logout();
          return;
        } else if (result.statusCode === 400) {
          window.location.href = "/stores";
          return;
        }
      }
      
    } catch (e) {
      console.log(e);
    }
  }
  
  var intervalId: NodeJS.Timeout;

  useEffect(() => {
    // const timerId = setTimeout(() => {
    //   fetchPayment();

    //   intervalId = setInterval(fetchPayment, 60000);

    //   return () => clearInterval(intervalId);
    // }, 10000);

    // return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (messages.find(obj => obj.message.statusPayment === "Success")){
      clearInterval(intervalId);
    }
  }, [messages]);

  useEffect(() => {
    fetchRefId();
  }, [refId]);

  useEffect(() => {
    if (ok) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://api.meowwoofsocial.com/hub/transactionhub")
        .configureLogging(signalR.LogLevel.Information)
        .build();
  
      let isUserNavigatingAway = false;
  
      // Handle connection close
      connection.onclose((error) => {
        cancelTransaction();
        alert("Giao dịch đã bị hủy");
        console.warn("SignalR connection closed:", error);
        if (isUserNavigatingAway) {
          alert("User navigated away");
          // User intentionally navigated away, so call the API to cancel the transaction
          // cancelTransaction();
        } else {
          // Handle reconnection logic or show a warning to the user
        }
      });
  
      const cancelTransaction = async () => {
        if(currentTransactionId == null) {
          return window.location.href = "/stores";
        };
        try {
          // Gọi API để hủy giao dịch
          const result = await CANCELTRANSACTION({
            transactionId: currentTransactionId,
            token: localStorage.token,
          });
        } catch (error) {
          console.error("Failed to cancel transaction:", error);
        }
      };
  
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        isUserNavigatingAway = true;
        alert("Are you sure you want to leave?");
        // Optionally show a confirmation message if needed
        // event.returnValue = "Are you sure you want to leave?";
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
  
      connection.start().then(() => {
        console.log("Connected to the SignalR hub");
        connection.invoke("JoinGroup", refId).catch((err) =>
          console.error("Error joining group: ", err)
        );
      }).catch((err) => console.error("Error connecting to SignalR hub: ", err));
  
      connection.on("ReceiveTransactionUpdate", (data) => {
        console.log("Order ID:", data.orderId, "Message:", data.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { orderId: data.orderId, message: data.data },
        ]);
      });
  
      // Cleanup on unmount
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        connection.stop();
      };
    }
  }, [ok]);
  

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
