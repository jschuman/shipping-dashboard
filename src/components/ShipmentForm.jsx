import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

// US States and Territories array
const US_STATES = [
  'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 
  'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 
  'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 
  'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'U.S. Virgin Islands', 
  'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 
  'Wyoming'
].sort();

const ShipmentForm = ({ shipment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    originState: '',
    destinationState: '',
    description: '',
    containerQuantity: '',
    vehicleType: '',
  });

  useEffect(() => {
    if (shipment) {
      setFormData(shipment);
    }
  }, [shipment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box sx={{ p: 3, minWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        {shipment ? 'Edit Shipment' : 'Add New Shipment'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Origin State</InputLabel>
          <Select
            name="originState"
            value={formData.originState}
            onChange={handleChange}
            required
            label="Origin State"
          >
            {US_STATES.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Destination State</InputLabel>
          <Select
            name="destinationState"
            value={formData.destinationState}
            onChange={handleChange}
            required
            label="Destination State"
          >
            {US_STATES.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Container Quantity"
          name="containerQuantity"
          type="number"
          value={formData.containerQuantity}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Vehicle Type</InputLabel>
          <Select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            label="Vehicle Type"
          >
            <MenuItem value="Truck">Truck</MenuItem>
            <MenuItem value="Ship">Ship</MenuItem>
            <MenuItem value="Airplane">Airplane</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="primary">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ShipmentForm; 