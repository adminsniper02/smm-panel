const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load services - kahit saan nakalagay
let services = [];
try {
  if (fs.existsSync(path.join(__dirname, 'services.json'))) {
    services = JSON.parse(fs.readFileSync(path.join(__dirname, 'services.json'), 'utf8'));
  }
} catch (e) {
  console.log('Error loading services:', e.message);
  services = [];
}

let orders = [];

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.post('/api/orders', (req, res) => {
  const { platform, serviceId, quantity, link, email } = req.body;
  const service = services.find(s => s.id === serviceId);
  if (!service) return res.status(400).json({ error: 'Invalid service' });

  let total = service.pricePer1000;
  if (['instagram', 'facebook', 'tiktok', 'youtube'].includes(service.platform)) {
    const qty = parseInt(quantity) || 1000;
    total = (service.pricePer1000 * qty) / 1000;
  }

  const order = {
    id: 'ORD-' + Date.now(),
    platform,
    serviceId,
    quantity: quantity || 1,
    link: link || 'N/A',
    email,
    total,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.json(order);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});