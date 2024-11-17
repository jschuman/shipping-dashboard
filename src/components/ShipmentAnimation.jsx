import React from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const moveAcross = keyframes`
  from {
    left: -50px;
  }
  to {
    left: calc(100% + 50px);
  }
`;

const AnimatedContainer = styled.div`
  position: absolute;
  top: 50%;
  left: -50px;
  z-index: 1000;
  animation: ${moveAcross} 2s ease-in-out;
  font-size: 48px;
  color: #1976d2;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ShipmentAnimation = ({ vehicleType, show }) => {
  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'Truck':
        return <LocalShippingIcon sx={{ fontSize: 48 }} />;
      case 'Ship':
        return <DirectionsBoatIcon sx={{ fontSize: 48 }} />;
      case 'Airplane':
        return <AirplanemodeActiveIcon sx={{ fontSize: 48, transform: 'rotate(-45deg)' }} />;
      default:
        return null;
    }
  };

  return (
    <AnimatedContainer show={show}>
      {getVehicleIcon()}
    </AnimatedContainer>
  );
};

export default ShipmentAnimation; 