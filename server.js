
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory data store
let products = [
  { id: 'P-001', name: 'Fresh Espresso', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04', stock: 50 },
  { id: 'P-002', name: 'Classic Croissant', price: 3.25, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a', stock: 20 },
  { id: 'P-003', name: 'Avocado Toast', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8', stock: 15 },
];

let orders = [];
const validCustomerIds = ['CUST-001', 'CUST-002', 'ADMIN-001'];

// Auth endpoint
app.post('/login', (req, res) => {
  const { customerId } = req.body;
  if (validCustomerIds.includes(customerId)) {
    res.json({ success: true, customerId, isAdmin: customerId.startsWith('ADMIN') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Customer ID' });
  }
});

// Products endpoints
app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
  const newProduct = { ...req.body, id: `P-00${products.length + 1}` };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

// Orders endpoints
app.post('/orders', (req, res) => {
  const newOrder = { 
    ...req.body, 
    id: `ORD-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/orders', (req, res) => {
  const { customerId } = req.query;
  if (customerId && customerId.startsWith('ADMIN')) {
    res.json(orders);
  } else if (customerId) {
    res.json(orders.filter(o => o.customerId === customerId));
  } else {
    res.status(400).json({ message: 'Missing customerId' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
