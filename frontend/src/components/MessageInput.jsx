import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationAtom,
  selectedConversationAtom,
} from "../../atoms/messagesAtom";

const MessageInput = ({ setMessages }) => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationAtom);
  const [messageText, setMessageText] = useState("");
  const handlesendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();

      if (data.res) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    }
  };

  return (
    <form style={{ flex: 95 }} onSubmit={handlesendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Type a message"
          onChange={(e) => setMessageText(e.target.value)}
        />
        <InputRightElement cursor={"pointer"} onClick={handlesendMessage}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
