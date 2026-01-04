import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    TextField, 
    Typography, 
    Alert, 
    InputAdornment, 
    CircularProgress,
    Container
} from '@mui/material';
import { Person, Lock } from '@mui/icons-material';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      const token = response.data.data.token; 

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setError("Token tidak ditemukan di response.");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Gagal terhubung ke server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
        sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' // Gradient Biru
        }}
    >
        <Container maxWidth="xs">
            <Card elevation={10} sx={{ borderRadius: 4, p: 2 }}>
                <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                            POS System
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Silakan masuk untuk melanjutkan
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            autoFocus
                        />
                        
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button 
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'LOGIN'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            
            <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3, color: 'white', opacity: 0.8 }}>
                &copy; 2026 Point of Sales System. All rights reserved.
            </Typography>
        </Container>
    </Box>
  );
};

export default LoginPage;