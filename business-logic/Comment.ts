import Message from "~/types/Message";

export default function buildMakeMessage() {
    return function makeMessage(message: Pick<Message, 'text' | 'sentBy'>) {
        return {
            getMessage: () => message.text,
            getCreatedOn: () => message.s
        };
    }
}