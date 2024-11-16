import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { 
  Slider, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Container,
  Paper,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SettingsIcon from '@mui/icons-material/Settings';

const TemperatureAnalyzer = () => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [ambientTemp, setAmbientTemp] = useState(null);
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showSettings, setShowSettings] = useState(false);

  const generateData = () => {
    setLoading(true);
    const newData = [];
    for (let hour = 0; hour < 24; hour++) {
      const localTemp = 18 + Math.sin(hour * Math.PI / 12) * 5 + Math.random() * 2;
      const batteryTemp = 25 + Math.sin(hour * Math.PI / 12) * 5 + Math.random() * 3;
      
      newData.push({
        hour,
        localTemp: parseFloat(localTemp.toFixed(1)),
        batteryTemp: parseFloat(batteryTemp.toFixed(1)),
      });
    }
    setData(newData);
    setLoading(false);
    setSnackbar({ open: true, message: 'Temperature data refreshed!' });
  };

  useEffect(() => {
    generateData();
  }, []);

  const calculateAmbientTemperature = () => {
    const currentData = data.find(d => d.hour === selectedHour);
    if (currentData) {
      const weightedAvg = (currentData.localTemp * 0.6 + currentData.batteryTemp * 0.4);
      const randomFactor = (Math.random() - 0.5) * 2;
      const ambient = weightedAvg + randomFactor;
      setAmbientTemp(parseFloat(ambient.toFixed(1)));
      setSnackbar({ open: true, message: 'Ambient temperature calculated!' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Temperature Analysis Dashboard
          </Typography>
          <Box>
            <IconButton onClick={() => setShowSettings(!showSettings)} color="primary">
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={generateData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Box>
        </Stack>
      </Box>

      {showSettings && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </Stack>
        </Paper>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ width: '100%', height: 400 }}>
              <LineChart
                width={800}
                height={400}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  label={{ value: 'Hour of Day', position: 'bottom' }}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value) => [`${value}°C`]}
                  labelFormatter={(hour) => `${hour}:00`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="localTemp"
                  stroke="#2196f3"
                  name="Local Temperature"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="batteryTemp"
                  stroke="#4caf50"
                  name="Battery Temperature"
                  strokeWidth={2}
                />
                {ambientTemp && (
                  <ReferenceLine
                    y={ambientTemp}
                    stroke="#f50057"
                    strokeDasharray="3 3"
                    label={{ value: `Ambient: ${ambientTemp}°C`, position: 'right' }}
                  />
                )}
              </LineChart>
            </Box>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography gutterBottom>
              Select Hour: {selectedHour}:00
            </Typography>
            <Slider
              value={selectedHour}
              onChange={(_, value) => setSelectedHour(value)}
              max={23}
              min={0}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}:00`}
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<ThermostatIcon />}
              onClick={calculateAmbientTemperature}
              fullWidth
            >
              Calculate Ambient Temperature
            </Button>
            <Button
              variant="outlined"
              startIcon={<PhoneIphoneIcon />}
              onClick={generateData}
              fullWidth
            >
              Refresh Data
            </Button>
          </Stack>

          {ambientTemp && (
            <Alert severity="success" variant="filled">
              <Typography variant="h6">
                Estimated Room Temperature at {selectedHour}:00
              </Typography>
              <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {ambientTemp}°C
              </Typography>
            </Alert>
          )}
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default TemperatureAnalyzer;