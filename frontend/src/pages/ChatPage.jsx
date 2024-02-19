import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CiSearch } from "react-icons/ci";
import { GiConversation } from "react-icons/gi";

import Conversation from "../components/Conversation";
import { useEffect, useState } from "react";
import useShowToast from "./../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationAtom } from "../../atoms/messagesAtom";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtoms";
import { useSocket } from "../../context/SocketContext";
import MessageContainer from "./../components/MessageContainer";
const ChatPage = () => {
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchinhUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();
  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();

        if (data.res) {
          showToast("Error", data.error, "error");
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        return;
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversation();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchinhUser(true);

    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.res) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      const messagingYourSelf = searchedUser._id === currentUser._id;

      if (messagingYourSelf) {
        showToast("Error", "You can't chat with yourself.", "error");
        return;
      }

      const conversationAlreadyExist = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExist) {
        setSelectedConversation({
          _id: conversationAlreadyExist._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            userId: searchedUser._id,
            username: searchedUser.username,
            userProfilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevCons) => [...prevCons, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    } finally {
      setSearchinhUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <CiSearch />
              </Button>
            </Flex>
          </form>
          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
