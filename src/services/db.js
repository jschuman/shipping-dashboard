import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import initialData from '../data/shipments.json'

// Configure lowdb to use localStorage
const adapter = new LocalStorage('shipments-db')
const db = low(adapter)

// Initialize with data from shipments.json if db is empty
const initializeDb = () => {
  // Create a new object with the initial data to ensure it's extensible
  const defaultData = {
    shipments: [...initialData.shipments]
  }
  db.defaults(defaultData).write()
}

export const getShipments = () => {
  // If database is empty, initialize it
  if (!db.has('shipments').value()) {
    initializeDb()
  }
  return [...db.get('shipments').value()]
}

export const addShipment = (shipment) => {
  const shipments = [...db.get('shipments').value()]
  const newId = Math.max(...shipments.map(s => s.id)) + 1
  const newShipment = { ...shipment, id: newId }
  
  // Create a new array with the existing shipments plus the new one
  const updatedShipments = [...shipments, newShipment]
  
  // Write the entire new array back to the database
  db.set('shipments', updatedShipments).write()
    
  return newShipment
}

export const updateShipment = (shipment) => {
  const shipments = [...db.get('shipments').value()]
  const index = shipments.findIndex(s => s.id === shipment.id)
  
  if (index !== -1) {
    shipments[index] = { ...shipment }
    db.set('shipments', shipments).write()
    return shipment
  }
  return null
}

export const deleteShipment = (id) => {
  const shipments = [...db.get('shipments').value()]
  const updatedShipments = shipments.filter(s => s.id !== id)
  db.set('shipments', updatedShipments).write()
}

// Initialize the database when the module is loaded
if (!db.has('shipments').value()) {
  initializeDb()
}

export default db 