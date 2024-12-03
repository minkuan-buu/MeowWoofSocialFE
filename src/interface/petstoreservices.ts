export interface PetStoreServices {
  id: string;
  name: string;
  description: string;
  type: string;
  attachment: string;
  averageRating: number;
}

export interface PetStoreReq{
  petStoreId: string;
  petCareBookingDetails: [
    {
      petId: string;
      typeTakeCare: string;
      typeOfDisease: string;
      bookingDate: Date;
    }
  ]
}