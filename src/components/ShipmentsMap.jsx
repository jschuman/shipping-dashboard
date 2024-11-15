import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { feature } from 'topojson-client';
import usStatesJson from 'us-atlas/states-10m.json';

const ShipmentsMap = ({ shipments, onStateSelect, selectedState }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const getStateColor = (geo) => {
    const stateName = geo.properties.name;
    
    // If this is the selected state, return blue
    if (stateName === selectedState) {
      return "#1976d2";  // Material-UI primary blue
    }
    
    const stateShipments = shipments.filter(s => s.originState === stateName);
    
    if (stateShipments.length === 0) return "#FFFFFF";
    
    // Calculate opacity based on number of shipments (max 0.9 to keep text readable)
    const baseOpacity = Math.min(0.1 + (stateShipments.length * 0.15), 0.9);
    
    // Return a green with dynamic opacity
    return `rgba(46, 125, 50, ${baseOpacity})`;
  };

  const getShipmentCount = (stateName) => {
    return shipments.filter(s => s.originState === stateName).length;
  };

  // Convert TopoJSON to GeoJSON
  const geoUrl = feature(usStatesJson, usStatesJson.objects.states).features;

  return (
    <div style={{ position: 'relative' }}>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map(geo => {
                const stateName = geo.properties.name;
                const shipmentCount = getShipmentCount(stateName);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onStateSelect(stateName)}
                    onMouseEnter={(evt) => {
                      setTooltip({
                        show: true,
                        content: `${stateName}: ${shipmentCount} shipment${shipmentCount !== 1 ? 's' : ''}`,
                        x: evt.clientX,
                        y: evt.clientY
                      });
                    }}
                    onMouseLeave={() => {
                      setTooltip({ show: false, content: '', x: 0, y: 0 });
                    }}
                    style={{
                      default: {
                        fill: getStateColor(geo),
                        outline: "none",
                        stroke: "#CCCCCC",
                        strokeWidth: 0.75
                      },
                      hover: {
                        fill: getStateColor(geo),
                        outline: "none",
                        stroke: "#999999",
                        strokeWidth: 1
                      },
                      pressed: {
                        fill: getStateColor(geo),
                        outline: "none",
                        stroke: "#666666",
                        strokeWidth: 1
                      }
                    }}
                  />
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
      
      {tooltip.show && (
        <div style={{
          position: 'fixed',
          left: tooltip.x + 10,
          top: tooltip.y - 10,
          background: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {tooltip.content}
        </div>
      )}
      
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        padding: '10px',
        borderRadius: '4px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '12px', marginBottom: '5px' }}>Shipments per State:</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', background: '#FFFFFF', border: '1px solid #CCCCCC', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px' }}>0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <div style={{ 
              width: '100px', 
              height: '20px', 
              background: 'linear-gradient(to right, rgba(46, 125, 50, 0.1), rgba(46, 125, 50, 0.9))',
              marginRight: '5px' 
            }}></div>
            <span style={{ fontSize: '12px' }}>More Shipments →</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <div style={{ width: '20px', height: '20px', background: '#1976d2', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px' }}>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsMap; 