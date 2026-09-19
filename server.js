const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const categories = [
  { id: 'ig', name: '📸 Instagram', icon: '📸' },
  { id: 'fb', name: '👍 Facebook', icon: '👍' },
  { id: 'tt', name: '🎵 TikTok', icon: '🎵' },
  { id: 'yt', name: '▶️ YouTube', icon: '▶️' },
  { id: 'tw', name: '🐦 Twitter/X', icon: '🐦' },
  { id: 'tg', name: '✈️ Telegram', icon: '✈️' },
];

const services = [
  // Instagram - parang hazeofbliss
  { id: 101, cat: 'ig', name: 'Instagram Followers [Real] [Refill 30d]', price: 45, min: 100, max: 100000, desc: 'High Quality, No Drop, Fast Start' },
  { id: 102, cat: 'ig', name: 'Instagram Followers [PH] 🇵🇭', price: 85, min: 100, max: 50000, desc: 'Philippines Followers, Real PH Accounts' },
  { id: 103, cat: 'ig', name: 'Instagram Likes [Real]', price: 15, min: 50, max: 50000, desc: 'Instant Start, No Drop' },
  { id: 104, cat: 'ig', name: 'Instagram Views + Likes + Saves', price: 8, min: 100, max: 1000000, desc: 'For Reels & Posts' },
  { id: 105, cat: 'ig', name: 'Instagram Story Views', price: 5, min: 100, max: 50000, desc: 'Fast Delivery' },
  // Facebook
  { id: 201, cat: 'fb', name: 'Facebook Page Followers', price: 60, min: 100, max: 50000, desc: 'Real, Lifetime' },
  { id: 202, cat: 'fb', name: 'Facebook Post Likes [Real]', price: 25, min: 50, max: 20000, desc: 'Fast' },
  { id: 203, cat: 'fb', name: 'Facebook Reels Views', price: 6, min: 500, max: 1000000, desc: 'Monetizable' },
  // TikTok
  { id: 301, cat: 'tt', name: 'TikTok Followers [Real]', price: 55, min: 100, max: 100000, desc: 'No Drop, Refill 30d' },
  { id: 302, cat: 'tt', name: 'TikTok Followers [PH] 🇵🇭', price: 95, min: 100, max: 20000, desc: 'PH Audience' },
  { id: 303, cat: 'tt', name: 'TikTok Likes', price: 12, min: 50, max: 100000, desc: 'Super Fast' },
  { id: 304, cat: 'tt', name: 'TikTok Views [10M+]', price: 3, min: 1000, max: 10000000, desc: 'Viral Push' },
  // YouTube
  { id: 401, cat: 'yt', name: 'YouTube Subscribers [Real]', price: 180, min: 100, max: 10000, desc: 'Monetization Safe' },
  { id: 402, cat: 'yt', name: 'YouTube Views [High Retention]', price: 45, min: 500, max: 500000, desc: '30min retention' },
  { id: 403, cat: 'yt', name: 'YouTube Likes', price: 20, min: 50, max: 20000, desc: 'Real' },
  { id: 404, cat: 'yt', name: 'YouTube Watch Hours 4000H', price: 850, min: 1000, max: 4000, desc: 'For Monetization' },
];

let orders = [];

app.get('/', (req,res)=>{
  res.send(`
<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>BoostHub - Like hazeofbliss</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Inter,sans-serif}
body{background:#0a0a0f;color:white}
.header{background:#11111a;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222}
.logo{font-weight:900;color:#a855f7;font-size:20px}
.nav{display:flex;gap:10px;overflow-x:auto}
.cat-btn{background:#1e1e2e;color:#aaa;padding:8px 15px;border-radius:20px;border:none;white-space:nowrap;cursor:pointer}
.cat-btn.active{background:#a855f7;color:white}
.container{padding:15px;max-width:1100px;margin:0 auto}
.search{width:100%;padding:12px;background:#1a1a27;border:1px solid #2a2a3a;border-radius:10px;color:white;margin-bottom:15px}
.service{background:#14141f;border:1px solid #232336;border-radius:12px;padding:15px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.service-left{flex:1}
.service-name{font-weight:700;font-size:14px;margin-bottom:4px}
.service-desc{font-size:11px;color:#888;margin-bottom:4px}
.service-meta{font-size:11px;color:#a855f7}
.service-right{text-align:right}
.price{font-weight:900;color:#22c55e;font-size:16px}
.price small{font-size:10px;color:#666;display:block}
.order-btn{background:#a855f7;color:white;border:none;padding:8px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-top:5px}
.modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:none;justify-content:center;align-items:center;z-index:99}
.modal-box{background:#1a1a27;padding:20px;border-radius:15px;width:90%;max-width:400px;border:1px solid #333}
input{width:100%;padding:12px;background:#0f0f17;border:1px solid #333;border-radius:8px;color:white;margin:8px 0}
</style></head>
<body>
<div class="header"><div class="logo">⚡ BOOSTHUB</div><div style="font-size:12px;color:#22c55e">● LIVE | Balance: ₱9999</div></div>
<div class="container">
<input class="search" id="search" placeholder="🔍 Search services... like 'followers', 'likes', 'views'" onkeyup="filter()">
<div class="nav" id="cats">${categories.map(c=>`<button class="cat-btn ${c.id=='ig'?'active':''}" onclick="setCat('${c.id}',this)">${c.name}</button>`).join('')}</div>
<div id="list"></div>
<h3 style="margin-top:30px">📦 Recent Orders: <span id="ocount">0</span></h3><div id="orders"></div>
</div>
<div class="modal" id="modal"><div class="modal-box"><h3 id="mname"></h3><p id="mdesc" style="font-size:12px;color:#888"></p><input id="mlink" placeholder="Paste Link Here"><input id="mqty" type="number" placeholder="Quantity"><div style="display:flex;justify-content:space-between;margin:10px 0;font-size:12px"><span>Min: <span id="mmin"></span> - Max: <span id="mmax"></span></span><span id="mtotal" style="color:#22c55e;font-weight:800"></span></div><button class="order-btn" style="width:100%" onclick="submitOrder()">Place Order - Pay with GCash</button><button onclick="closeModal()" style="background:transparent;color:#888;border:none;width:100%;margin-top:10px">Cancel</button></div></div>
<script>
let curCat='ig'; let curService=null;
const services=${JSON.stringify(services)};
function render(){
  const s=document.getElementById('search').value.toLowerCase();
  const filtered=services.filter(x=>x.cat===curCat && x.name.toLowerCase().includes(s));
  document.getElementById('list').innerHTML=filtered.map(v=>\`
  <div class="service"><div class="service-left"><div class="service-name">\${v.id} - \${v.name}</div><div class="service-desc">\${v.desc}</div><div class="service-meta">⏱️ 0-1h Start • ♻️ Refill • Min \${v.min} - Max \${v.max}</div></div><div class="service-right"><div class="price">₱\${v.price}<small>per 1000</small></div><button class="order-btn" onclick="openModal(\${v.id})">Order</button></div></div>\`).join('');
}
function setCat(id,el){curCat=id;document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');render()}
function filter(){render()}
function openModal(id){curService=services.find(x=>x.id==id);document.getElementById('mname').innerText=curService.name;document.getElementById('mdesc').innerText=curService.desc;document.getElementById('mmin').innerText=curService.min;document.getElementById('mmax').innerText=curService.max;document.getElementById('mqty').value=curService.min;calc();document.getElementById('modal').style.display='flex';}
function closeModal(){document.getElementById('modal').style.display='none';}
function calc(){const q=document.getElementById('mqty').value||0;const total=(q/1000*curService.price).toFixed(2);document.getElementById('mtotal').innerText='Total: ₱'+total}
document.getElementById('mqty').addEventListener('input',calc);
async function submitOrder(){
  const link=document.getElementById('mlink').value; const qty=document.getElementById('mqty').value;
  if(!link||!qty){alert('Lagay mo link at quantity boss!');return}
  const res=await fetch('/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({serviceId:curService.id,serviceName:curService.name,link,qty})});
  const data=await res.json(); alert('✅ Order Placed! ID:'+data.order.id+' - I-process natin via GCash boss!'); closeModal(); loadOrders();
}
async function loadOrders(){const res=await fetch('/orders');const data=await res.json();document.getElementById('ocount').innerText=data.length;document.getElementById('orders').innerHTML=data.reverse().map(o=>'<div class=service><div class=service-left><div class=service-name>#'+o.id+' - '+o.serviceName+'</div><div class=service-desc>'+o.link+' | Qty: '+o.qty+' | Status: <span style=color:#22c55e>'+o.status+'</span></div></div></div>').join('');}
render();loadOrders();
</script></body></html>
  `);
});
app.get('/orders',(req,res)=>res.json(orders));
app.post('/order',(req,res)=>{
  const o={id:Math.floor(10000+Math.random()*90000),...req.body,status:'Pending',date:new Date()};
  orders.push(o); console.log(o); res.json({success:true,order:o});
});
const PORT=process.env.PORT||10000;
app.listen(PORT,()=>console.log('Live'));
`);

**After mo i-paste:**
1. Commit
2. Render > Manual Deploy > Deploy latest commit
3. Hintay 1 min > Refresh `smm-panel-yrsw.onrender.com`

**Boss magiging ganyan na itsura:**
- May categories sa taas (Instagram, Facebook, TikTok, YouTube) parang hazeofbliss
- May search bar
- May ID, price per 1000, min/max — pro look
- May GCash button na

**Gawin mo na boss, tapos screenshot mo ulit!** Pag okay na yan, next natin **connect natin sa totoong supplier** para auto deliver followers (kahit mura lang puhunan mo ₱20, benta mo ₱50)!

Commit mo na?
