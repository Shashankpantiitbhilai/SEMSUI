import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Alert,
  AlertTitle,
  Snackbar,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Thermostat as ThermostatIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Warning as WarningIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';

const TemperatureAnalyzer = () => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [ambientTemp, setAmbientTemp] = useState(null);
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [tempThreshold, setTempThreshold] = useState(30);
  const [historicalData, setHistoricalData] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);

  const generateData = () => {
    setLoading(true);
    const newData = [];
    for (let hour = 0; hour < 24; hour++) {
      const localTemp = 18 + Math.sin(hour * Math.PI / 12) * 5 + Math.random() * 2;
      const batteryTemp = 25 + Math.sin(hour * Math.PI / 12) * 5 + Math.random() * 3;
      const humidity = Math.floor(40 + Math.random() * 30);

      newData.push({
        hour,
        localTemp: parseFloat(localTemp.toFixed(1)),
        batteryTemp: parseFloat(batteryTemp.toFixed(1)),
        humidity
      });
    }
    setData(newData);
    setLoading(false);
    setNotification('Temperature data refreshed!');
    setTimeout(() => setNotification(''), 3000);
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
      const calculatedTemp = parseFloat(ambient.toFixed(1));
      setAmbientTemp(calculatedTemp);

      // Add to historical data
      setHistoricalData(prev => [...prev, {
        timestamp: new Date().toLocaleString(),
        hour: selectedHour,
        temperature: calculatedTemp
      }]);

      setNotification('Ambient temperature calculated!');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const speedDialActions = [
    { icon: <SaveIcon />, name: 'Save Data', action: () => console.log('Saving data...') },
    { icon: <AddIcon />, name: 'Add Note', action: () => console.log('Adding note...') },
    { icon: <HistoryIcon />, name: 'View History', action: () => setShowDrawer(true) }
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <Box sx={{ height: 400 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <ResponsiveContainer>
               <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis
    dataKey="hour"
    label={{ value: 'Hour of Day', position: 'bottom' }}
    tickFormatter={(hour) => `${hour}:00`}
  />
  <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
  <Tooltip
    formatter={(value, name) => [
      `${value}${name.includes('humidity') ? '%' : '°C'}`,
      name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1'),
    ]}
  />
  <Legend
    content={({ payload }) => (
      <ul style={{ display: 'flex', gap: '20px', padding: 0, listStyle: 'none', margin: '10px 0' }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="10" height="10" style={{ marginRight: 5 }}>
              <circle cx="5" cy="5" r="5" fill={entry.color} />
            </svg>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    )}
  />
  <Line type="monotone" dataKey="localTemp" stroke="#2196f3" name="Local Temperature" />
  <Line type="monotone" dataKey="batteryTemp" stroke="#4caf50" name="Battery Temperature" />
  <Line type="monotone" dataKey="humidity" stroke="#ff9800" name="Humidity" />
</LineChart>

              </ResponsiveContainer>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Historical Data</Typography>
            {historicalData.map((record, index) => (
              <Alert severity="info" key={index} sx={{ mb: 1 }}>
                <AlertTitle>{record.timestamp}</AlertTitle>
                Hour: {record.hour}:00 - Temperature: {record.temperature}°C
              </Alert>
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: 3, bgcolor: darkMode ? 'grey.900' : 'grey.50' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Temperature Analysis Dashboard
        </Typography>
        <Box>
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton onClick={() => setShowSettings(!showSettings)}>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={generateData}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Settings Panel */}
      {showSettings && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Dashboard Settings</Typography>
            <FormControlLabel
              control={<Switch checked={showTips} onChange={() => setShowTips(!showTips)} />}
              label="Show Tips"
            />
            <TextField
              label="Temperature Threshold"
              type="number"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(Number(e.target.value))}
              InputProps={{
                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
              }}
              sx={{ ml: 2 }}
            />
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)} sx={{ mb: 2 }}>
            <Tab icon={<TimelineIcon />} label="Temperature Chart" />
            <Tab icon={<TableChartIcon />} label="Historical Data" />
          </Tabs>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent>
          <Typography gutterBottom>Select Hour: {selectedHour}:00</Typography>
          <Slider
            value={selectedHour}
            onChange={(_, value) => setSelectedHour(value)}
            step={1}
            marks
            min={0}
            max={23}
            valueLabelDisplay="auto"
          />
          <Button
            onClick={calculateAmbientTemperature}
            variant="contained"
            startIcon={<ThermostatIcon />}
            disabled={loading}
          >
            Calculate Ambient Temperature
          </Button>
        </CardContent>
      </Card>

      {/* Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification('')}
        message={notification}
      />

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

      {/* Drawer */}
      <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>History</Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {historicalData.map((record, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={record.timestamp}
                  secondary={`Hour: ${record.hour}:00, Temperature: ${record.temperature}°C`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TemperatureAnalyzer;
