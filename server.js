const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Fake services para makita mo agad
const services = [
  { id: 1, name: "Instagram Followers", price: "₱50 / 1000", min: 100, max: 10000 },
  { id: 2, name: "Facebook Likes", price: "₱30 / 1000", min: 100, max: 10000 },
  { id: 3, name: "TikTok Views", price: "₱20 / 1000", min: 500, max: 50000 },
  { id: 4, name: "YouTube Subscribers", price: "₱150 / 1000", min: 100, max: 5000 }
];

let orders = [];

app.get('/', (req, res) => {
  res.send(`
  <html>
  <head><meta name="viewport" content="width=device-width,initial-scale=1"><title>BoostHub SMM</title>
  <style>body{font-family:sans-serif;background:#0f0f0f;color:white;padding:20px} .card{background:#1a1a1a;padding:15px;margin:10px 0;border-radius:10px;border:1px solid #333} button{background:#7c3aed;color:white;padding:10px 20px;border:none;border-radius:8px;width:100%} input{width:100%;padding:10px;margin:5px 0;border-radius:8px;border:1px solid #333;background:#222;color:white}</style>
  </head>
  <body>
  <h1>🔥 BoostHub SMM Panel - LIVE!</h1>
  <p>Welcome boss! Pili ka service:</p>
  ${services.map(s=>`
    <div class="card">
      <h3>${s.name}</h3>
      <p>${s.price}</p>
      <input id="link-${s.id}" placeholder="Paste Link (IG/FB/TikTok)">
      <input id="qty-${s.id}" type="number" placeholder="Quantity">
      <button onclick="order(${s.id})">Order Now - ${s.name}</button>
    </div>
  `).join('')}
  <div id="msg"></div>
  <h2>📦 Orders: <span id="count">0</span></h2>
  <div id="orders"></div>
  <script>
    async function order(id){
      const link=document.getElementById('link-'+id).value;
      const qty=document.getElementById('qty-'+id).value;
      if(!link||!qty){alert('Lagay link at qty boss!');return}
      const res=await fetch('/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({serviceId:id,link,qty})});
      const data=await res.json();
      document.getElementById('msg').innerHTML='<p style=color:#0f0>✅ Order success! ID:'+data.order.id+'</p>';
      loadOrders();
    }
    async function loadOrders(){
      const res=await fetch('/orders'); const data=await res.json();
      document.getElementById('count').innerText=data.length;
      document.getElementById('orders').innerHTML=data.map(o=>'<div class=card>Order #'+o.id+' - Service '+o.serviceId+' - '+o.qty+' - '+o.link+'</div>').join('');
    }
    loadOrders();
  </script>
  </body></html>
  `);
});

app.get('/orders', (req,res)=> res.json(orders));
app.post('/order', (req,res)=>{
  const order={id:Date.now(),...req.body, status:'Pending', date:new Date()};
  orders.push(order);
  console.log('New order:', order);
  res.json({success:true, order});
});

const PORT=process.env.PORT||10000;
app.listen(PORT, ()=> console.log('Live on '+PORT));
