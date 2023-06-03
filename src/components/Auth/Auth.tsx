import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState('');

  const onSubmit = async () => {
    try {
    } catch (error) {
      console.log('onSubmit error', error);
    }
  };

  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Text>Create a UserName</Text>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter a username"
            />
            <Button width="100%">Save</Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">Chat Application</Text>
            <Button
              onClick={() => signIn('google')}
              leftIcon={<Image height="20px" src="/Images/googleLogo.png" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
