import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
  Stack,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import UserOperations from '../../../../graphql/operations/user';
import {
  CreateConversationData,
  CreateConversationInput,
  SearchUsersData,
  SearchUsersInput,
  SearchedUser,
} from '@/utils/types';
import UserSearchList from './UserSearchList';
import Participants from './Participants';
import toast from 'react-hot-toast';
import ConversationOperations from '../../../../graphql/operations/conversation';
import { Session } from 'next-auth';

interface ModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);
  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation
    );

  const onCreateConversation = async () => {
    const participantIds = [userId, ...participants.map((p) => p.id)];
    try {
      const { data } = await createConversation({
        variables: {
          participantIds,
        },
      });
    } catch (error: any) {
      console.log('onCreateConversation error', error);
      toast.error(error?.message);
    }
  };

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
    console.log('Inside onSubmit');
  };

  const addParticipants = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <Button
                  type="submit"
                  isDisabled={!username}
                  isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipants={addParticipants}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  _hover={{ bg: 'brand.100' }}
                  onClick={onCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
