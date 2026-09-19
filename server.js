const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const services = [
  {id:101,cat:'Instagram',name:'IG Followers MIXED 100K Refill',price:35,min:100,max:100000},
  {id:102,cat:'Instagram',name:'IG Followers REAL PH',price:95,min:100,max:10000},
  {id:103,cat:'Instagram',name:'IG Likes REAL',price:12,min:50,max:50000},
  {id:104,cat:'Instagram',name:'IG Views REELS Viral 1M',price:4,min:500,max:10000000},
  {id:105,cat:'Instagram',name:'IG Comments Custom PH',price:150,min:10,max:1000},
  {id:201,cat:'Facebook',name:'FB Page Followers REAL 100K',price:55,min:100,max:100000},
  {id:202,cat:'Facebook',name:'FB Post Likes REAL',price:22,min:50,max:50000},
  {id:203,cat:'Facebook',name:'FB Reels Views 1M Monetize',price:5,min:500,max:5000000},
  {id:301,cat:'TikTok',name:'TikTok Followers REAL REFILL',price:52,min:100,max:1000000},
  {id:302,cat:'TikTok',name:'TikTok Followers PH REAL',price:105,min:100,max:10000},
  {id:303,cat:'TikTok',name:'TikTok Likes REAL',price:10,min:50,max:100000},
  {id:304,cat:'TikTok',name:'TikTok Views Super Fast 10M',price:2,min:1000,max:10000000},
  {id:401,cat:'YouTube',name:'YT Subs REAL REFILL 10K',price:175,min:100,max:10000},
  {id:402,cat:'YouTube',name:'YT Views High Retention 1M',price:42,min:500,max:1000000},
  {id:403,cat:'YouTube',name:'YT Likes REAL',price:18,min:50,max:50000},
  {id:404,cat:'YouTube',name:'YT Watch Hours 4000H',price:850,min:1000,max:4000},
  {id:501,cat:'Telegram',name:'Telegram Members REAL 50K',price:45,min:100,max:50000},
  {id:601,cat:'Twitter',name:'Twitter Followers REAL',price:65,min:100,max:10000}
];

let orders = [];

app.get('/', (req,res)=>{
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>BoostHub PH</title>
  <style>
  body{background:#07070a;color:#fff;font-family:sans-serif;margin:0;padding:0}
  .head{background:#12121a;padding:12px;border-bottom:1px solid #222;display:flex;justify-content:space-between}
  .logo{color:#a855f7;font-weight:900}
  .container{padding:10px;max-width:1100px;margin:auto}
  .tabs{display:flex;gap:6px;overflow:auto;padding:10px 0}
  .tab{background:#1e1e2e;color:#888;padding:7px 12px;border-radius:20px;border:none;font-size:12px}
  .tab.active{background:#a855f7;color:#fff}
  .search{width:100%;padding:10px;background:#1a1a26;border:1px solid #333;border-radius:8px;color:#fff;margin-bottom:10px}
  .card{background:#14141f;border:1px solid #222;padding:12px;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between}
  .price{color:#22c55e;font-weight:900}
  .btn{background:#a855f7;color:#fff;border:none;padding:6px 12px;border-radius:6px;margin-top:5px}
  </style>
  </head>
  <body>
  <div class="head"><div class="logo">BOOSTHUB.PH - Like HazeofBliss</div><div style="color:#22c55e;font-size:11px">LIVE</div></div>
  <div class="container">
  <input id="search" class="search" placeholder="Search services..." onkeyup="render()">
  <div class="tabs" id="tabs"></div>
  <div id="list"></div>
  <h3 style="margin-top:20px">Orders: <span id="cnt">0</span></h3>
  <div id="ords"></div>
  </div>
  <script>
  const services = ${JSON.stringify([
  {id:101,cat:'Instagram',name:'IG Followers MIXED 100K Refill',price:35,min:100,max:100000},
  {id:102,cat:'Instagram',name:'IG Followers REAL PH',price:95,min:100,max:10000},
  {id:103,cat:'Instagram',name:'IG Likes REAL',price:12,min:50,max:50000},
  {id:104,cat:'Instagram',name:'IG Views REELS Viral 1M',price:4,min:500,max:10000000},
  {id:105,cat:'Instagram',name:'IG Comments Custom PH',price:150,min:10,max:1000},
  {id:201,cat:'Facebook',name:'FB Page Followers REAL 100K',price:55,min:100,max:100000},
  {id:202,cat:'Facebook',name:'FB Post Likes REAL',price:22,min:50,max:50000},
  {id:203,cat:'Facebook',name:'FB Reels Views 1M Monetize',price:5,min:500,max:5000000},
  {id:301,cat:'TikTok',name:'TikTok Followers REAL REFILL',price:52,min:100,max:1000000},
  {id:302,cat:'TikTok',name:'TikTok Followers PH REAL',price:105,min:100,max:10000},
  {id:303,cat:'TikTok',name:'TikTok Likes REAL',price:10,min:50,max:100000},
  {id:304,cat:'TikTok',name:'TikTok Views Super Fast 10M',price:2,min:1000,max:10000000},
  {id:401,cat:'YouTube',name:'YT Subs REAL REFILL 10K',price:175,min:100,max:10000},
  {id:402,cat:'YouTube',name:'YT Views High Retention 1M',price:42,min:500,max:1000000},
  {id:403,cat:'YouTube',name:'YT Likes REAL',price:18,min:50,max:50000},
  {id:404,cat:'YouTube',name:'YT Watch Hours 4000H',price:850,min:1000,max:4000},
  {id:501,cat:'Telegram',name:'Telegram Members REAL 50K',price:45,min:100,max:50000},
  {id:601,cat:'Twitter',name:'Twitter Followers REAL',price:65,min:100,max:10000}
])};
  let cur='All';
  const cats=['All','Instagram','Facebook','TikTok','YouTube','Telegram','Twitter'];
  function initTabs(){
    document.getElementById('tabs').innerHTML=cats.map(c=>'<button class="tab '+(c==cur?'active':'')+'" onclick="setCat(\\''+c+'\\',this)">'+c+'</button>').join('');
  }
  function setCat(c,el){cur=c;document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));el.classList.add('active');render()}
  function render(){
    const q=document.getElementById('search').value.toLowerCase();
    let f=services;
    if(cur!=='All') f=f.filter(s=>s.cat==cur);
    if(q) f=f.filter(s=>s.name.toLowerCase().includes(q));
    document.getElementById('list').innerHTML=f.map(s=>'<div class=card><div><b>'+s.id+' - '+s.name+'</b><br><small style=color:#777>Min '+s.min+' - Max '+s.max+' | 0-6h Start | Refill</small></div><div style=text-align:right><div class=price>P'+s.price+'<br><small style=color:#666;font-size:9px>/1000</small></div><button class=btn onclick=order('+s.id+')>Order</button></div></div>').join('');
  }
  async function order(id){
    const s=services.find(x=>x.id==id);
    const link=prompt('Paste Link for '+s.name+':');
    if(!link) return;
    const qty=prompt('Quantity Min '+s.min+' Max '+s.max+':');
    if(!qty) return;
    const res=await fetch('/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({serviceId:id,serviceName:s.name,link,qty
