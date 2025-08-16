import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Alert, CircularProgress, Container
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../service/authService';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email) {
      alert('Please initiate password reset from the "Forgot Password" page.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (newPassword !== confirmNewPassword) {
      setMessage('New password and confirm password do not match.');
      setIsError(true);
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(email, otpCode, newPassword);
      setMessage(response);
      setIsError(false);
      navigate('/login');
    } catch (error) {
      setMessage(error || 'Failed to reset password. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
        <Typography variant="h4" align="center" gutterBottom>Reset Password</Typography>
        <Typography align="center" gutterBottom>
          Enter the OTP sent to your email and your new password.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email address"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ readOnly: !!location.state?.email }}
            required
          />
          <TextField
            label="OTP"
            fullWidth
            margin="normal"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </form>

        {message && (
          <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        <Typography align="center" sx={{ mt: 3 }}>
          <Link to="/login" style={{ color: '#3f51b5' }}>
            Back to Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPassword;
