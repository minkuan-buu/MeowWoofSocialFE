import { PetStoreReq } from "@/interface/petstoreservices";
import { API_URL } from "./Endpoint";

export const BOOKING = async (bookingReq: PetStoreReq, token: string) => {
    const res = await fetch(API_URL + `petcarebooking/create-pet-care-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(bookingReq),
    });
  
    if (res.ok) {
      const data = await res.json();
      // If API returns a redirect URL, navigate to it
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } else {
      console.error("Booking failed.");
    }
  };
  