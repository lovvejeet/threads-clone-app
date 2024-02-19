import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtoms";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilState(userAtom);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            {message.text}
          </Text>
          <Avatar src={user.profilePic} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
            {message.text}
          </Text>
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
        </Flex>
      )}
    </>
  );
};

export default Message;
