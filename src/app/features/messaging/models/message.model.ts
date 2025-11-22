export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  messageText: string;
  mediaUrl?: string;
  timestamp: string; // ISO string
}
