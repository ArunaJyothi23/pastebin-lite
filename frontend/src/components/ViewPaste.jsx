import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Alert, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

export default function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // fallback for local

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/pastes/${id}`);
        setPaste(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Paste expired or not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4, maxWidth: 'md', mx: 'auto' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ mt: 4, maxWidth: 'md', mx: 'auto' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Paste Content</Typography>

        <Box
          sx={{
            bgcolor: 'grey.100',
            p: 3,
            borderRadius: 1,
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            minHeight: 200,
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {paste?.content || 'No content available'}
        </Box>

        <Typography variant="body2" color="text.secondary">
          Remaining views: {paste?.remaining_views ?? 'Unlimited'}
          {paste?.expires_at && ` | Expires: ${new Date(paste.expires_at).toLocaleString()}`}
        </Typography>
      </CardContent>
    </Card>
  );
}