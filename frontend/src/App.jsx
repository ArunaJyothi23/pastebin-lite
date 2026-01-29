import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';

function App() {
  return (
    <BrowserRouter>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pastebin-Lite
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 8 }}>
        <Box sx={{ minHeight: '70vh' }}>
          <Routes>
            <Route path="/" element={<CreatePaste />} />
            <Route path="/p/:id" element={<ViewPaste />} /> {/* ← FIXED: /p/:id */}
            <Route path="*" element={<CreatePaste />} /> {/* Fallback */}
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App;