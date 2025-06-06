import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

const ResumeUploader = () => {
  const navigate = useNavigate();
  const [jd, setJd] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    certificates: '',
    username: ''
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setLoading(true);

      // Simulate processing delay
      setTimeout(() => {
        setFormData({
          name: 'Derick Johnson',
          email: 'djohn242@depaul.edu',
          skills: 'Network Security, Web Application Security',
          certificates: 'CEH, eJPT v2, CAP',
          username: 'derickjohnson242'
        });
        setLoading(false);
      }, 2000);
    } else {
      alert('Only PDF files are accepted.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert('✅ Profile updated!');
    navigate('/interview-setup');
    console.log('Submitted:', { jd, ...formData });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>

      <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>Upload Resume</Typography>

      <Select
        fullWidth
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="" disabled>Select Job Description</MenuItem>
        <MenuItem value="JD 1">React Dev</MenuItem>
        <MenuItem value="JD 2">Cybersecurity Analyst</MenuItem>
        <MenuItem value="JD 3">API Tester</MenuItem>
        <MenuItem value="JD 4">WebDev</MenuItem>
      </Select>

      <Button
        variant="contained"
        component="label"
        sx={{ mb: 3, backgroundColor: '#1976d2' }}
      >
        Upload Resume (PDF only)
        <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={24} />
          <Typography>Processing your resume...</Typography>
        </Box>
      ) : (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth />
          <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
          <TextField label="Skills" name="skills" value={formData.skills} onChange={handleInputChange} fullWidth />
          <TextField label="Certificates" name="certificates" value={formData.certificates} onChange={handleInputChange} fullWidth />
          <TextField label="Username" name="username" value={formData.username} onChange={handleInputChange} fullWidth />
          <Button variant="contained" sx={{ mt: 2, backgroundColor: '#1976d2' }} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ResumeUploader;
