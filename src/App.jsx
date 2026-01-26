import { useState } from 'react'
import { Button, CircularProgress, Container, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await axios.post("https://email-writer-production-5924.up.railway.app/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('An error occurred while generating the reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional) </InputLabel>
          <Select
            value={tone || ''}
            label={"Tone (Optional)"}
            onChange={(e) => setTone(e.target.value)}>
            <MenuItem value={""}>None</MenuItem>
            <MenuItem value={"Formal"}>Formal</MenuItem>
            <MenuItem value={"Informal"}>Informal</MenuItem>
            <MenuItem value={"Friendly"}>Friendly</MenuItem>
            <MenuItem value={"Professional"}>Professional</MenuItem>
            <MenuItem value={"Concise"}>Concise</MenuItem>
            <MenuItem value={"Detailed"}>Detailed</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply || ''}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App
