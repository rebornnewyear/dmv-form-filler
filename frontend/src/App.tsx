import { Container, Typography, Paper, Box } from '@mui/material';
import FormWizard from './components/FormWizard';

export default function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            DMV Form REG-156
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Application for Replacement Plates, Stickers, Documents
          </Typography>
        </Box>
        <FormWizard />
      </Paper>
    </Container>
  );
}
