import Timestamp from "./Timestamp";

export default interface Message {
    sendAt: Timestamp;
    sentBy: string;
    text: string;
} 