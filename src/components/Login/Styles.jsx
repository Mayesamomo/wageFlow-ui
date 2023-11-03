import { styled } from '@mui/system';

const Container = styled('div')({
  marginTop: (theme) => theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: (theme) => theme.spacing(2),
});

const Root = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: (theme) => theme.spacing(2),
  width: '100%',
});

const AvatarContainer = styled('div')({
  margin: (theme) => theme.spacing(1),
  backgroundColor: '#1976d2',
});

const FormContainer = styled('form')({
  width: '100%',
  marginTop: (theme) => theme.spacing(3),
});

const SubmitButton = styled('button')({
  margin: (theme) => theme.spacing(3, 0, 2),
});

export {
  Container,
  Root,
  AvatarContainer,
  FormContainer,
  SubmitButton,
};
