import { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Alert, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [ttl_seconds, setTtlSeconds] = useState('');
  const [max_views, setMaxViews] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await axios.post('/api/pastes', {
        content: content.trim(),
        ttl_seconds: ttl_seconds ? Number(ttl_seconds) : undefined,
        max_views: max_views ? Number(max_views) : undefined,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create paste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Create New Paste</Typography>

        <TextField
          label="Paste Content *"
          multiline
          rows={10}
          fullWidth
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <TextField
            label="TTL (seconds, optional)"
            type="number"
            value={ttl_seconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            fullWidth
          />
          <TextField
            label="Max views (optional)"
            type="number"
            value={max_views}
            onChange={(e) => setMaxViews(e.target.value)}
            fullWidth
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Paste'}
        </Button>

        {result && (
          <Alert severity="success" sx={{ mt: 3 }}>
            Paste created! Share this link:<br />
            <strong>
              <a 
                href={`/p/${result.id}`} 
                rel="noopener noreferrer"
                style={{ color: '#90caf9', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {result.url}
              </a>
            </strong>
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      </CardContent>
    </Card>
  );
}