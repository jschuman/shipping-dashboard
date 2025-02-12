import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  Select, 
  MenuItem, 
  IconButton, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShipmentForm from './ShipmentForm';
import ShipmentsMap from './ShipmentsMap';
import { getShipments, addShipment, updateShipment, deleteShipment } from '../services/db';
import './Dashboard.css';
import ShipmentAnimation from './ShipmentAnimation';

const Dashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [mapMode, setMapMode] = useState('origin');
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationVehicle, setAnimationVehicle] = useState(null);

  const vehicleTypes = [
    'Truck',
    'Ship',
    'Airplane'
  ];

  useEffect(() => {
    const data = getShipments();
    setShipments(data);
    setFilteredShipments(data);
  }, []);

  const handleVehicleTypeEdit = (params) => {
    const updatedShipment = {
      ...params.row,
      vehicleType: params.value
    };
    
    updateShipment(updatedShipment);
    
    const updatedShipments = shipments.map(s => 
      s.id === updatedShipment.id ? updatedShipment : s
    );
    setShipments(updatedShipments);
    
    if (selectedState) {
      setFilteredShipments(updatedShipments.filter(s => s.originState === selectedState));
    } else {
      setFilteredShipments(updatedShipments);
    }
  };

  const handleDelete = (shipment) => {
    setSelectedShipment(shipment);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteShipment(selectedShipment.id);
    
    const updatedShipments = shipments.filter(s => s.id !== selectedShipment.id);
    setShipments(updatedShipments);
    
    if (selectedState) {
      setFilteredShipments(updatedShipments.filter(s => s.originState === selectedState));
    } else {
      setFilteredShipments(updatedShipments);
    }
    
    setDeleteDialogOpen(false);
    setSelectedShipment(null);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'originState', headerName: 'Origin State', width: 130 },
    { field: 'destinationState', headerName: 'Destination State', width: 130 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'containerQuantity', headerName: 'Containers', width: 130, type: 'number' },
    { 
      field: 'vehicleType', 
      headerName: 'Vehicle Type', 
      width: 130,
      editable: true,
      renderCell: (params) => (
        <div style={{ width: '100%', padding: '5px 0' }}>
          <Select
            value={params.value || ''}
            onChange={(e) => handleVehicleTypeEdit({ ...params, value: e.target.value })}
            fullWidth
            variant="standard"
            sx={{ 
              border: 'none',
              '.MuiSelect-select': { 
                padding: '0px 8px',
                backgroundColor: 'transparent'
              }
            }}
          >
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </div>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleStateSelect = (stateName) => {
    if (stateName === selectedState) {
      setSelectedState(null);
      setFilteredShipments(shipments);
    } else {
      setSelectedState(stateName);
      const filtered = shipments.filter(shipment => 
        mapMode === 'origin' 
          ? shipment.originState === stateName
          : shipment.destinationState === stateName
      );
      setFilteredShipments(filtered);
    }
  };

  const handleMapModeChange = (event) => {
    setMapMode(event.target.value);
    setSelectedState(null);
    setFilteredShipments(shipments);
  };

  const handleEdit = (shipment) => {
    setSelectedShipment(shipment);
    setOpen(true);
  };

  const handleAdd = () => {
    let initialData = null;
    if (selectedState) {
      initialData = mapMode === 'origin' 
        ? { originState: selectedState }
        : { destinationState: selectedState };
    }
    setSelectedShipment(initialData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShipment(null);
  };

  const handleSave = (shipment) => {
    if (shipment.id) {
      updateShipment(shipment);
    } else {
      addShipment(shipment);
      setAnimationVehicle(shipment.vehicleType);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    }

    const updatedShipments = getShipments();
    setShipments(updatedShipments);
    
    if (selectedState) {
      setFilteredShipments(updatedShipments.filter(s => 
        mapMode === 'origin' 
          ? s.originState === selectedState
          : s.destinationState === selectedState
      ));
    } else {
      setFilteredShipments(updatedShipments);
    }
    
    handleClose();
  };

  return (
    <div className="dashboard-container">
      <div className="table-section">
        <h2>Shipment Data</h2>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAdd}
          className="add-button"
        >
          Add Shipment
        </Button>
        <DataGrid
          rows={filteredShipments}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
      
      <div className="map-section">
        <h2>Shipment Map</h2>
        <FormControl component="fieldset" style={{ marginBottom: '1rem' }}>
          <RadioGroup
            row
            name="map-mode"
            value={mapMode}
            onChange={handleMapModeChange}
          >
            <FormControlLabel 
              value="origin" 
              control={<Radio />} 
              label="Origin States" 
            />
            <FormControlLabel 
              value="destination" 
              control={<Radio />} 
              label="Destination States" 
            />
          </RadioGroup>
        </FormControl>
        <div style={{ position: 'relative' }}>
          <ShipmentsMap 
            shipments={shipments} 
            onStateSelect={handleStateSelect}
            selectedState={selectedState}
            mapMode={mapMode}
          />
          <ShipmentAnimation 
            vehicleType={animationVehicle}
            show={showAnimation}
          />
        </div>
      </div>
      
      <Dialog open={open} onClose={handleClose}>
        <ShipmentForm
          shipment={selectedShipment}
          onSave={handleSave}
          onCancel={handleClose}
        />
      </Dialog>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this shipment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard; 