const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = []; // {id,email,pass,balance}
let orders = [];
const ADMIN_PASS = "boosthub123";

// HOME
app.get('/', (req,res)=>{
res.send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>BoostHub - Points System</title>
<style>
body{margin:0;background:#0a0a0f;color:#fff;font-family:Arial}
.header{background:#12121a;padding:12px;border-bottom:1px solid #222;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0}
.logo{color:#a855f7;font-weight:900}
.btn{background:#a855f7;color:#fff;border:none;padding:8px 14px;border-radius:7px;font-weight:bold}
.tab{background:#1e1e2e;color:#888;padding:7px 12px;border-radius:20px;border:none;margin:3px}
.tab.active{background:#a855f7;color:#fff}
.search{width:100%;padding:10px;background:#1a1a27;border:1px solid #333;border-radius:8px;color:#fff;margin:10px 0}
.card{background:#14141f;border:1px solid #232336;border-radius:10px;padding:12px;margin-bottom:8px}
.price{color:#22c55e;font-weight:bold;float:right}
.modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:none;justify-content:center;align-items:center;z-index:99}
.modal-box{background:#1a1a27;padding:20px;border-radius:12px;width:90%;max-width:360px;border:1px solid #333}
input{width:100%;padding:10px;background:#0f0f17;border:1px solid #333;border-radius:8px;color:#fff;margin:6px 0;box-sizing:border-box}
</style></head><body>
<div class="header">
<div class="logo">BOOSTHUB</div>
<div style="display:flex;gap:8px;align-items:center">
<span id="balance" style="color:#22c55e;font-size:12px;font-weight:bold;display:none">P0</span>
<button id="loginBtn" class="btn" onclick="openAuth()">Login</button>
<button id="logoutBtn" class="btn" style="display:none;background:#333" onclick="logout()">Logout</button>
<a href="/admin" style="color:#666;font-size:11px;text-decoration:none">Admin</a>
</div>
</div>
<div style="max-width:1100px;margin:auto;padding:12px">
<div id="userInfo" style="display:none;background:#12121a;padding:10px;border-radius:8px;margin-bottom:10px;border:1px solid #a855f7"></div>
<input id="searchBox" class="search" placeholder="Search IG, TikTok, YT..." onkeyup="showList()">
<div id="tabs"></div><div id="list"></div>
<h3 style="margin-top:20px">My Orders: <span id="cnt">0</span></h3><div id="orders"></div>
</div>

<div class="modal" id="authModal"><div class="modal-box">
<h3 id="authTitle">Login</h3>
<input id="email" placeholder="Email">
<input id="password" type="password" placeholder="Password">
<button class="btn" style="width:100%;margin-top:10px" onclick="doAuth()">Submit</button>
<p style="font-size:12px;color:#888;text-align:center;margin-top:10px"><span onclick="switchAuth()" id="switchText" style="color:#a855f7;cursor:pointer">No account? Register</span></p>
<button onclick="closeAuth()" style="background:none;border:none;color:#666;width:100%;margin-top:5px">Close</button>
</div></div>

<script>
var services=[
{id:101,cat:"Instagram",name:"IG Followers MIXED 100K Refill",price:35,min:100,max:100000},
{id:102,cat:"Instagram",name:"IG Followers REAL PH",price:95,min:100,max:10000},
{id:103,cat:"Instagram",name:"IG Likes REAL",price:12,min:50,max:50000},
{id:104,cat:"Instagram",name:"IG Views REELS",price:4,min:500,max:1000000},
{id:201,cat:"Facebook",name:"FB Page Followers REAL",price:55,min:100,max:100000},
{id:202,cat:"Facebook",name:"FB Reels Views",price:5,min:500,max:5000000},
{id:301,cat:"TikTok",name:"TikTok Followers REAL REFILL",price:52,min:100,max:1000000},
{id:302,cat:"TikTok",name:"TikTok Followers PH",price:105,min:100,max:10000},
{id:304,cat:"TikTok",name:"TikTok Views 10M",price:2,min:1000,max:10000000},
{id:401,cat:"YouTube",name:"YT Subs REAL REFILL",price:175,min:100,max:10000},
{id:402,cat:"YouTube",name:"YT Views High Retention",price:42,min:500,max:1000000},
{id:404,cat:"YouTube",name:"YT Watch Hours 4000H",price:850,min:1000,max:4000}
];
var currentCat="All";var cats=["All","Instagram","Facebook","TikTok","YouTube"];var isLogin=true;var currentUser=null;
function loadUser(){var u=localStorage.getItem("boost_user");if(u){currentUser=JSON.parse(u);document.getElementById("balance").style.display="block";document.getElementById("balance").innerText="P"+currentUser.balance;document.getElementById("loginBtn").style.display="none";document.getElementById("logoutBtn").style.display="block";document.getElementById("userInfo").style.display="block";document.getElementById("userInfo").innerHTML="Logged in as <b>"+currentUser.email+"</b> | Balance: <b style=color:#22c55e>P"+currentUser.balance+"</b><br><small style=color:#888>Magbayad via GCash kay admin para madagdagan points</small>";refreshBalance();}buildTabs();showList();loadOrders();}
function refreshBalance(){if(!currentUser) return;fetch("/api/user/"+currentUser.id).then(r=>r.json()).then(d=>{if(d.user){currentUser=d.user;localStorage.setItem("boost_user",JSON.stringify(d.user));document.getElementById("balance").innerText="P"+d.user.balance;document.getElementById("userInfo").innerHTML="Logged in as <b>"+d.user.email+"</b> | Balance: <b style=color:#22c55e>P"+d.user.balance+"</b>";}});}
function openAuth(){document.getElementById("authModal").style.display="flex";}
function closeAuth(){document.getElementById("authModal").style.display="none";}
function switchAuth(){isLogin=!isLogin;document.getElementById("authTitle").innerText=isLogin?"Login":"Register";document.getElementById("switchText").innerText=isLogin?"No account? Register":"Have account? Login";}
async function doAuth(){
var email=document.getElementById("email").value;var pass=document.getElementById("password").value;
if(!email||!pass){alert("Fill all");return;}
var url=isLogin?"/api/login":"/api/register";
var res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email,pass:pass})});
var data=await res.json();
if(data.error){alert(data.error);return;}
currentUser=data.user;localStorage.setItem("boost_user",JSON.stringify(data.user));closeAuth();loadUser();alert((isLogin?"Login":"Register")+" success! Balance: P"+data.user.balance);
}
function logout(){localStorage.removeItem("boost_user");location.reload();}
function buildTabs(){var h="";for(var i=0;i<cats.length;i++){var c=cats[i];h+='<button class="tab '+(c==currentCat?'active':'')+'" onclick="pickCat(\\''+c+'\\')">'+c+'</button>';}document.getElementById("tabs").innerHTML=h;}
function pickCat(c){currentCat=c;buildTabs();showList();}
function showList(){
var q=document.getElementById("searchBox").value.toLowerCase();var html="";for(var i=0;i<services.length;i++){var s=services[i];if(currentCat!="All"&&s.cat!=currentCat)continue;if(q&&s.name.toLowerCase().indexOf(q)==-1)continue;
html+='<div class="card"><div><b>'+s.id+' - '+s.name+'</b><br><small style=color:#888>Min '+s.min+' Max '+s.max+' | Refill</small></div><div><div class="price">P'+s.price+'/1k</div><button class="btn" onclick="doOrder('+s.id+')">Order</button></div></div>';}
document.getElementById("list").innerHTML=html;
}
async function doOrder(id){
if(!currentUser){alert("Login muna boss bago order!");openAuth();return;}
var s=null;for(var i=0;i<services.length;i++){if(services[i].id==id){s=services[i];break;}}
var link=prompt("Paste Link for "+s.name);if(!link)return;
var qty=prompt("Quantity Min "+s.min+" Max "+s.max);if(!qty)return;
var total=(qty/1000)*s.price;
if(currentUser.balance<total){alert("Kulang balance! Need P"+total+" pero balance mo P"+currentUser.balance+" lang. Bayad ka muna GCash kay admin.");return;}
var res=await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:currentUser.id,serviceId:id,serviceName:s.name,link:link,qty:qty,total:total})});
var data=await res.json();if(data.error){alert(data.error);return;}
alert("Order Success! ID "+data.order.id+" Nabawas P"+total);refreshBalance();loadOrders();
}
async function loadOrders(){
if(!currentUser){document.getElementById("cnt").innerText="0 (Login first)";return;}
var r=await fetch("/api/orders?userId="+currentUser.id);var d=await r.json();
document.getElementById("cnt").innerText=d.length;
var h="";for(var i=d.length-1;i>=0;i--){var o=d[i];h+='<div class="card"><b>#'+o.id+' '+o.serviceName+'</b><br><small>'+o.link+' | '+o.qty+' | P'+o.total+' | '+o.status+'</small></div>';}
document.getElementById("orders").innerHTML=h;
}
loadUser();
</script></body></html>
`);
});

app.get('/admin',(req,res)=>{
res.send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Panel</title>
<style>body{background:#050507;color:#fff;font-family:Arial;padding:12px}input{padding:10px;background:#1a1a27;border:1px solid #333;border-radius:8px;color:#fff;margin:4px}.card{background:#14141f;border:1px solid #232336;padding:12px;border-radius:10px;margin-bottom:8px}.btn{background:#a855f7;color:#fff;border:none;padding:8px 12px;border-radius:6px;margin:2px}.btn-green{background:#22c55e}.btn-red{background:#ef4444}</style></head><body>
<h2>Admin Panel</h2>
<div id="loginBox"><input id="pass" type="password" placeholder="Password (boosthub123)"><button class="btn" onclick="login()">Login</button></div>
<div id="adminBox" style="display:none">
<h3>Users - Add Points</h3><div id="users"></div>
<h3 style="margin-top:20px">All Orders: <span id="total">0</span></h3><div id="adminOrders"></div>
<br><a href="/" style="color:#a855f7">Back to site</a>
</div>
<script>
var token="";
function login(){var p=document.getElementById("pass").value;fetch("/admin/check?pass="+p).then(r=>r.json()).then(d=>{if(d.ok){token=p;document.getElementById("loginBox").style.display="none";document.getElementById("adminBox").style.display="block";loadAll();}else{alert("Wrong pass");}});}
async function loadAll(){
var ru=await fetch("/api/all-users?pass="+token);var du=await ru.json();
var hu="";for(var i=0;i<du.length;i++){var u=du[i];hu+='<div class="card"><b>'+u.email+'</b><br>Balance: <b style=color:#22c55e>P'+u.balance+'</b> | ID: '+u.id+'<br><input id="pts_'+u.id+'" type="number" placeholder="Points to add"><button class="btn btn-green" onclick="addPts('+u.id+')">+ Add Points</button><button class="btn" onclick="setPts('+u.id+')">Set Balance</button></div>';}
document.getElementById("users").innerHTML=hu||"No users yet";
var r=await fetch("/api/all-orders?pass="+token);var d=await r.json();
document.getElementById("total").innerText=d.length;
var h="";for(var i=d.length-1;i>=0;i--){var o=d[i];h+='<div class="card"><b>#'+o.id+' '+o.serviceName+'</b><br>User: '+o.userEmail+'<br>Link: '+o.link+'<br>Qty: '+o.qty+' | P'+o.total+' | '+o.status+'<br><button class="btn btn-green" onclick="upd('+o.id+',\\'Completed\\')">Complete</button><button class="btn" onclick="upd('+o.id+',\\'Processing\\')">Processing</button></div>';}
document.getElementById("adminOrders").innerHTML=h;
}
async function addPts(uid){var pts=document.getElementById("pts_"+uid).value;if(!pts)return;await fetch("/api/add-points",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:uid,points:parseInt(pts),pass:token})});loadAll();}
async function setPts(uid){var pts=document.getElementById("pts_"+uid).value;if(!pts)return;await fetch("/api/set-points",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:uid,points:parseInt(pts),pass:token})});loadAll();}
async function upd(id,st){await fetch("/admin/update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:id,status:st,pass:token})});loadAll();}
</script></body></html>
`);
});

app.get('/admin/check',(req,res)=>{res.json({ok:req.query.pass===ADMIN_PASS})});
app.get('/api/user/:id',(req,res)=>{var u=users.find(x=>x.id==req.params.id);res.json({user:u})});
app.get('/api/orders',(req,res)=>{var uid=req.query.userId;var filtered=orders.filter(o=>o.userId==uid);res.json(filtered);});
app.get('/api/all-orders',(req,res)=>{if(req.query.pass!==ADMIN_PASS) return res.json([]);res.json(orders);});
app.get('/api/all-users',(req,res)=>{if(req.query.pass!==ADMIN_PASS) return res.json([]);res.json(users);});

app.post('/api/register',(req,res)=>{
var email=req.body.email;var pass=req.body.pass;
if(users.find(u=>u.email==email)) return res.json({error:"Email exists na"});
var u={id:Date.now().toString(),email:email,pass:pass,balance:0};
users.push(u);res.json({user:{id:u.id,email:u.email,balance:u.balance}});
});
app.post('/api/login',(req,res)=>{
var u=users.find(x=>x.email==req.body.email&&x.pass==req.body.pass);
if(!u) return res.json({error:"Wrong email/pass"});
res.json({user:{id:u.id,email:u.email,balance:u.balance}});
});
app.post('/api/order',(req,res)=>{
var u=users.find(x=>x.id==req.body.userId);
if(!u) return res.json({error:"User not found"});
if(u.balance<req.body.total) return res.json({error:"Kulang balance"});
u.balance-=req.body.total;
var o={id:Math.floor(10000+Math.random()*90000),userId:u.id,userEmail:u.email,serviceId:req.body.serviceId,serviceName:req.body.serviceName,link:req.body.link,qty:req.body.qty,total:req.body.total,status:"Pending"};
orders.push(o);res.json({order:o});
});
app.post('/api/add-points',(req,res)=>{
if(req.body.pass!==ADMIN_PASS) return res.json({error:"unauthorized"});
var u=users.find(x=>x.id==req.body.userId.toString());if(u){u.balance+=parseInt(req.body.points);}res.json({ok:true});
});
app.post('/api/set-points',(req,res)=>{
if(req.body.pass!==ADMIN_PASS) return res.json({error:"unauthorized"});
var u=users.find(x=>x.id==req.body.userId.toString());if(u){u.balance=parseInt(req.body.points);}res.json({ok:true});
});
app.post('/admin/update',(req,res)=>{
if(req.body.pass!==ADMIN_PASS) return res.json({error:"unauthorized"});
var o=orders.find(x=>x.id==req.body.id);if(o) o.status=req.body.status;res.json({ok:true});
});

app.listen(process.env.PORT||10000,()=>console.log('Live with Points System'));
