const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let orders = [];

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BoostHub PH - HazeofBliss Style</title>
<style>
body{margin:0;background:#0a0a0f;color:#fff;font-family:Arial}
.header{background:#12121a;padding:15px;border-bottom:1px solid #222;display:flex;justify-content:space-between}
.logo{color:#a855f7;font-weight:900}
.container{padding:12px;max-width:1100px;margin:auto}
.tab{background:#1e1e2e;color:#888;padding:8px 14px;border-radius:20px;border:none;margin:3px}
.tab.active{background:#a855f7;color:#fff}
.search{width:100%;padding:12px;background:#1a1a27;border:1px solid #333;border-radius:8px;color:#fff;margin:10px 0}
.card{background:#14141f;border:1px solid #232336;border-radius:10px;padding:12px;margin-bottom:8px}
.price{color:#22c55e;font-weight:bold;float:right}
.btn{background:#a855f7;color:#fff;border:none;padding:8px 15px;border-radius:7px}
</style>
</head>
<body>
<div class="header"><div class="logo">BOOSTHUB - 18 Services Like HazeofBliss</div><div style="color:#22c55e;font-size:12px">LIVE</div></div>
<div class="container">
<input id="searchBox" class="search" placeholder="Search followers, likes..." onkeyup="showList()">
<div id="tabs"></div>
<div id="list"></div>
<h3 style="margin-top:20px">Orders: <span id="cnt">0</span></h3>
<div id="orders"></div>
</div>
<script>
var services=[
{id:101,cat:"Instagram",name:"IG Followers MIXED 100K Refill",price:35,min:100,max:100000},
{id:102,cat:"Instagram",name:"IG Followers REAL PH",price:95,min:100,max:10000},
{id:103,cat:"Instagram",name:"IG Likes REAL No Drop",price:12,min:50,max:50000},
{id:104,cat:"Instagram",name:"IG Views REELS Viral",price:4,min:500,max:1000000},
{id:105,cat:"Instagram",name:"IG Comments Custom PH",price:150,min:10,max:1000},
{id:201,cat:"Facebook",name:"FB Page Followers REAL",price:55,min:100,max:100000},
{id:202,cat:"Facebook",name:"FB Post Likes REAL",price:22,min:50,max:50000},
{id:203,cat:"Facebook",name:"FB Reels Views Monetize",price:5,min:500,max:5000000},
{id:301,cat:"TikTok",name:"TikTok Followers REAL REFILL",price:52,min:100,max:1000000},
{id:302,cat:"TikTok",name:"TikTok Followers PH REAL",price:105,min:100,max:10000},
{id:303,cat:"TikTok",name:"TikTok Likes REAL",price:10,min:50,max:100000},
{id:304,cat:"TikTok",name:"TikTok Views Super Fast 10M",price:2,min:1000,max:10000000},
{id:401,cat:"YouTube",name:"YT Subs REAL REFILL",price:175,min:100,max:10000},
{id:402,cat:"YouTube",name:"YT Views High Retention",price:42,min:500,max:1000000},
{id:403,cat:"YouTube",name:"YT Likes REAL",price:18,min:50,max:50000},
{id:404,cat:"YouTube",name:"YT Watch Hours 4000H",price:850,min:1000,max:4000},
{id:501,cat:"Telegram",name:"Telegram Members REAL 50K",price:45,min:100,max:50000},
{id:601,cat:"Twitter",name:"Twitter Followers REAL",price:65,min:100,max:10000}
];
var currentCat="All";
var cats=["All","Instagram","Facebook","TikTok","YouTube","Telegram","Twitter"];
function buildTabs(){
var h="";
for(var i=0;i<cats.length;i++){
var c=cats[i];
if(c==currentCat){h+='<button class="tab active" onclick="pickCat(\\''+c+'\\')">'+c+'</button>';}
else{h+='<button class="tab" onclick="pickCat(\\''+c+'\\')">'+c+'</button>';}
}
document.getElementById("tabs").innerHTML=h;
}
function pickCat(c){currentCat=c;buildTabs();showList();}
function showList(){
var q=document.getElementById("searchBox").value.toLowerCase();
var html="";
for(var i=0;i<services.length;i++){
var s=services[i];
if(currentCat!="All" && s.cat!=currentCat) continue;
if(q && s.name.toLowerCase().indexOf(q)==-1) continue;
html+='<div class="card"><div><b>'+s.id+' - '+s.name+'</b><br><small style="color:#888">Min '+s.min+' Max '+s.max+' | Fast Start | Refill</small></div><div><div class="price">P'+s.price+'/1k</div><button class="btn" onclick="doOrder('+s.id+')">Order</button></div></div>';
}
document.getElementById("list").innerHTML=html;
}
async function doOrder(id){
var s=null;
for(var i=0;i<services.length;i++){if(services[i].id==id){s=services[i];break;}}
var link=prompt("Paste Link for "+s.name);
if(!link) return;
var qty=prompt("Quantity Min "+s.min+" Max "+s.max);
if(!qty) return;
var res=await fetch("/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId:id,serviceName:s.name,link:link,qty:qty})});
var data=await res.json();
alert("Order Success ID "+data.order.id);
loadOrders();
}
async function loadOrders(){
var r=await fetch("/orders");
var d=await r.json();
document.getElementById("cnt").innerText=d.length;
var h="";
for(var i=d.length-1;i>=0 && i>d.length-11;i--){
var o=d[i];
h+='<div class="card"><b>#'+o.id+' '+o.serviceName+'</b><br><small>'+o.link+' | '+o.qty+' | '+o.status+'</small></div>';
}
document.getElementById("orders").innerHTML=h;
}
buildTabs();showList();loadOrders();
</script>
</body>
</html>
  `);
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.post('/order', (req, res) => {
  var o = {
    id: Math.floor(10000 + Math.random() * 90000),
    serviceId: req.body.serviceId,
    serviceName: req.body.serviceName,
    link: req.body.link,
    qty: req.body.qty,
    status: 'Pending'
  };
  orders.push(o);
  console.log('New Order', o);
  res.json({ order: o });
});

var PORT = process.env.PORT || 10000;
app.listen(PORT, function() {
  console.log('Live on ' + PORT);
});
