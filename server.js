const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let users = [];
let orders = [];
let services = [
{id:101,cat:"Instagram",name:"IG Followers MIXED Refill",price:35,min:100,max:100000,status:"Active"},
{id:102,cat:"Instagram",name:"IG Followers REAL PH",price:95,min:100,max:10000,status:"Active"},
{id:201,cat:"Facebook",name:"FB Page Followers",price:55,min:100,max:100000,status:"Active"},
{id:301,cat:"TikTok",name:"TikTok Followers REAL",price:52,min:100,max:1000000,status:"Active"},
{id:401,cat:"YouTube",name:"YT Subs REAL",price:175,min:100,max:10000,status:"Active"}
];
const ADMIN_EMAIL = "admin@boosthub.ph";
const ADMIN_PASS = "admin123";

function isAdmin(t){ if(!t) return false; let p=t.split("|"); return p[0]==ADMIN_EMAIL && p[1]==ADMIN_PASS; }

app.get('/', (req,res)=>{
res.send(`
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{margin:0;background:#0a0a0f;color:#fff;font-family:Arial}.header{background:#12121a;padding:14px;display:flex;justify-content:space-between}.btn{background:#a855f7;color:#fff;border:none;padding:10px 14px;border-radius:8px}.card{background:#14141f;border:1px solid #232336;border-radius:12px;padding:12px;margin-bottom:8px}.auth{position:fixed;top:0;left:0;width:100%;height:100%;background:#07070a;display:flex;justify-content:center;align-items:center;z-index:99}.box{background:#14141f;padding:20px;border-radius:12px;width:90%;max-width:350px;border:1px solid #2a2a3a}input{width:100%;padding:10px;background:#0f0f17;border:1px solid #333;border-radius:8px;color:#fff;margin:6px 0;box-sizing:border-box}.main{display:none}.show{display:block}
</style></head><body>
<div class="auth" id="authScreen"><div class="box"><h2 style="color:#a855f7;text-align:center">BOOSTHUB.PH</h2><h3 id="t">Login</h3><input id="email" placeholder="Email"><input id="pass" type="password" placeholder="Password"><button class="btn" style="width:100%" onclick="auth()">Submit</button><p style="text-align:center"><span onclick="sw()" id="sw" style="color:#a855f7;cursor:pointer">No account? Create</span></p></div></div>
<div class="main" id="main"><div class="header"><b style="color:#a855f7">BOOSTHUB</b><div><span id="bal" style="color:#22c55e;background:#1a2e1a;padding:5px 10px;border-radius:20px">P0</span> <button class="btn" style="background:#222" onclick="logout()">Logout</button></div></div><div style="padding:12px"><div id="info" style="background:#12121a;padding:10px;border-radius:8px;border:1px solid #a855f7;margin-bottom:10px"></div><div id="list"></div><h3>Orders <span id="cnt">0</span></h3><div id="ords"></div></div></div>
<script>
let isLogin=true, cur=null, svcs=[];
async function loadSvc(){let r=await fetch("/api/services");svcs=await r.json();show();}
function check(){let u=localStorage.getItem("u");if(u){cur=JSON.parse(u);document.getElementById("authScreen").style.display="none";document.getElementById("main").classList.add("show");document.getElementById("bal").innerText="P"+cur.balance;document.getElementById("info").innerHTML="Hi <b>"+cur.email+"</b> Balance: P"+cur.balance;loadSvc();loadOrd();}else{document.getElementById("authScreen").style.display="flex";}}
function sw(){isLogin=!isLogin;document.getElementById("t").innerText=isLogin?"Login":"Create Account";document.getElementById("sw").innerText=isLogin?"No account? Create":"Have account? Login";}
async function auth(){let e=document.getElementById("email").value,p=document.getElementById("pass").value;if(!e||!p)return alert("Fill");let url=isLogin?"/api/login":"/api/register";let r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,pass:p})});let d=await r.json();if(d.error)return alert(d.error);cur=d.user;localStorage.setItem("u",JSON.stringify(cur));check();}
function logout(){localStorage.removeItem("u");location.reload();}
function show(){let h="";for(let s of svcs){h+="<div class=card><b>"+s.id+" - "+s.name+"</b><br><small>Min "+s.min+" Max "+s.max+"</small><br><div style=display:flex;justify-content:space-between;margin-top:8px><b style=color:#22c55e>P"+s.price+"/1k</b><button class=btn onclick=order("+s.id+")>Order</button></div></div>";}document.getElementById("list").innerHTML=h;}
async function order(id){let s=svcs.find(x=>x.id==id);let link=prompt("Link:");if(!link)return;let qty=prompt("Qty:");if(!qty)return;let tot=(qty/1000)*s.price;if(cur.balance<tot)return alert("Kulang balance Need P"+tot);let r=await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:cur.id,serviceName:s.name,link,qty,total:tot})});let d=await r.json();if(d.error)return alert(d.error);alert("Order ok #"+d.order.id);loadOrd();let ru=await fetch("/api/user/"+cur.id);let du=await ru.json();cur=du.user;localStorage.setItem("u",JSON.stringify(cur));document.getElementById("bal").innerText="P"+cur.balance;}
async function loadOrd(){let r=await fetch("/api/orders?userId="+cur.id);let d=await r.json();document.getElementById("cnt").innerText=d.length;let h="";for(let i=d.length-1;i>=0;i--){let o=d[i];h+="<div class=card><b>#"+o.id+" "+o.serviceName+"</b><br><small>"+o.link+" | "+o.qty+" | P"+o.total+" | "+o.status+"</small></div>";}document.getElementById("ords").innerHTML=h;}
check();
</script></body></html>
`);
});

app.get('/admin',(req,res)=>{
res.send(`
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{background:#050507;color:#fff;font-family:Arial;padding:10px;margin:0}.header{background:#12121a;padding:12px;border-radius:8px;display:flex;justify-content:space-between;margin-bottom:10px}.stat{background:#14141f;border:1px solid #232336;padding:10px;border-radius:8px;text-align:center;display:inline-block;width:22%;margin:1%}.card{background:#14141f;border:1px solid #232336;padding:10px;border-radius:8px;margin-bottom:6px}.btn{background:#a855f7;color:#fff;border:none;padding:6px 10px;border-radius:6px;margin:2px}.btn-green{background:#22c55e;color:#000}.btn-red{background:#ef4444}input,select{padding:6px;background:#0f0f17;border:1px solid #333;border-radius:6px;color:#fff;margin:2px}.tabs{display:flex;gap:5px;margin:10px 0}.tab{padding:7px 12px;background:#1e1e2e;color:#888;border:none;border-radius:20px}.tab.active{background:#a855f7;color:#fff}.sec{display:none}.sec.active{display:block}
</style></head><body>
<div id="login" style="max-width:350px;margin:50px auto;text-align:center"><h2>Admin Login</h2><input id="ae" style="width:100%;box-sizing:border-box" value="admin@boosthub.ph"><input id="ap" type="password" style="width:100%;box-sizing:border-box" value="admin123"><br><br><button class="btn" style="width:100%" onclick="login()">Login</button></div>
<div id="panel" style="display:none"><div class="header"><b style="color:#a855f7">ADMIN PANEL</b><div><button class="btn" onclick="location.href='/'">Site</button><button class="btn btn-red" onclick="localStorage.clear();location.reload()">Logout</button></div></div>
<div><div class="stat"><b id="tu">0</b><br>Users</div><div class="stat"><b id="to">0</b><br>Orders</div><div class="stat"><b id="tr">P0</b><br>Sales</div><div class="stat"><b id="ts">0</b><br>Services</div></div>
<div class="tabs"><button class="tab active" onclick="showTab(0)">Users</button><button class="tab" onclick="showTab(1)">Orders</button><button class="tab" onclick="showTab(2)">Services</button></div>
<div id="s0" class="sec active"><input id="us" placeholder="Search email" style="width:100%;box-sizing:border-box;padding:10px" onkeyup="fUsers()"><div id="ulist"></div></div>
<div id="s1" class="sec"><div id="olist"></div></div>
<div id="s2" class="sec"><div class="card"><b>Add Service</b><br><select id="nc"><option>Instagram</option><option>Facebook</option><option>TikTok</option><option>YouTube</option></select><input id="nn" placeholder="Name" style="width:150px"><input id="np" type="number" placeholder="Price" style="width:60px"><button class="btn btn-green" onclick="addSvc()">Add</button></div><div id="slist"></div></div>
</div>
<script>
let token="", allU=[], allO=[], allS=[];
function showTab(i){document.querySelectorAll(".tab").forEach((b,idx)=>{b.classList.toggle("active",idx==i)});document.querySelectorAll(".sec").forEach((s,idx)=>{s.classList.toggle("active",idx==i)});}
async function login(){let e=document.getElementById("ae").value,p=document.getElementById("ap").value;let r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,pass:p})});let d=await r.json();if(!d.ok)return alert("Wrong");token=e+"|"+p;localStorage.setItem("at",token);document.getElementById("login").style.display="none";document.getElementById("panel").style.display="block";load();}
async function load(){let ru=await fetch("/api/all-users?token="+encodeURIComponent(token));allU=await ru.json();let ro=await fetch("/api/all-orders?token="+encodeURIComponent(token));allO=await ro.json();let rs=await fetch("/api/services");allS=await rs.json();document.getElementById("tu").innerText=allU.length;document.getElementById("to").innerText=allO.length;let rev=0;allO.forEach(o=>rev+=o.total);document.getElementById("tr").innerText="P"+rev;document.getElementById("ts").innerText=allS.length;renderU(allU);renderO(allO);renderS(allS);}
function renderU(list){let h="";for(let u of list){h+="<div class=card><b style=color:#a855f7>"+u.email+"</b> - <b style=color:#22c55e>P"+u.balance+"</b><br><input id=pts_"+u.id+" type=number placeholder=100 style=width:70px><button class='btn btn-green' onclick=addP('"+u.id+"')>+Add</button><button class=btn onclick=setP('"+u.id+"')>Set</button><button class='btn btn-red' onclick=delU('"+u.id+"')>Del</button></div>";}document.getElementById("ulist").innerHTML=h||"No users";}
function renderO(list){let h="";for(let i=list.length-1;i>=0;i--){let o=list[i];h+="<div class=card><b>#"+o.id+" "+o.serviceName+"</b> "+o.userEmail+"<br><small>"+o.link+" Qty:"+o.qty+" P"+o.total+" "+o.status+"</small><br><button class='btn btn-green' onclick=updO("+o.id+",'Completed')>Complete</button><button class='btn btn-red' onclick=delO("+o.id+")>Del</button></div>";}document.getElementById("olist").innerHTML=h||"No orders";}
function renderS(list){let h="";for(let s of list){h+="<div class=card><b>"+s.id+" - "+s.name+"</b> P"+s.price+"<br><input id=pr_"+s.id+" value="+s.price+" style=width:60px><button class=btn onclick=updS("+s.id+")>Save</button><button class='btn btn-red' onclick=delS("+s.id+")>Del</button></div>";}document.getElementById("slist").innerHTML=h;}
function fUsers(){let q=document.getElementById("us").value.toLowerCase();renderU(allU.filter(u=>u.email.toLowerCase().includes(q)));}
async function addP(id){let v=document.getElementById("pts_"+id).value;if(!v)return;await fetch("/api/add-points",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,points:parseInt(v),token})});load();}
async function setP(id){let v=document.getElementById("pts_"+id).value;if(!v)return;await fetch("/api/set-points",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,points:parseInt(v),token})});load();}
async function delU(id){if(!confirm("Delete?"))return;await fetch("/api/admin/delete-user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,token})});load();}
async function updO(id,st){await fetch("/api/admin/update-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status:st,token})});load();}
async function delO(id){await fetch("/api/admin/delete-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,token})});load();}
async function addSvc(){let c=document.getElementById("nc").value,n=document.getElementById("nn").value,p=document.getElementById("np").value;if(!n||!p)return alert("fill");await fetch("/api/admin/add-service",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({cat:c,name:n,price:parseFloat(p),token})});load();}
async function updS(id){let p=document.getElementById("pr_"+id).value;await fetch("/api/admin/update-service",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,price:parseFloat(p),token})});load();}
async function delS(id){await fetch("/api/admin/delete-service",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,token})});load();}
let saved=localStorage.getItem("at");if(saved){token=saved;document.getElementById("login").style.display="none";document.getElementById("panel").style.display="block";load();}
</script></body></html>
`);
});

app.get('/api/services',(req,res)=>res.json(services));
app.get('/api/user/:id',(req,res)=>{let u=users.find(x=>x.id==req.params.id);res.json({user:u})});
app.get('/api/orders',(req,res)=>res.json(orders.filter(o=>o.userId==req.query.userId)));
app.get('/api/all-users',(req,res)=>{if(!isAdmin(req.query.token))return res.json([]);res.json(users)});
app.get('/api/all-orders',(req,res)=>{if(!isAdmin(req.query.token))return res.json([]);res.json(orders)});
app.post('/api/admin/login',(req,res)=>{if(req.body.email==ADMIN_EMAIL && req.body.pass==ADMIN_PASS)res.json({ok:true});else res.json({ok:false})});
app.post('/api/register',(req,res)=>{if(users.find(u=>u.email==req.body.email))return res.json({error:"Exists"});let u={id:Date.now().toString(),email:req.body.email,pass:req.body.pass,balance:0};users.push(u);res.json({user:{id:u.id,email:u.email,balance:0}})});
app.post('/api/login',(req,res)=>{let u=users.find(x=>x.email==req.body.email&&x.pass==req.body.pass);if(!u)return res.json({error:"Wrong"});res.json({user:{id:u.id,email:u.email,balance:u.balance}})});
app.post('/api/order',(req,res)=>{let u=users.find(x=>x.id==req.body.userId);if(!u)return res.json({error:"No user"});if(u.balance<req.body.total)return res.json({error:"Kulang balance"});u.balance-=req.body.total;let o={id:Math.floor(10000+Math.random()*90000),userId:u.id,userEmail:u.email,serviceName:req.body.serviceName,link:req.body.link,qty:req.body.qty,total:req.body.total,status:"Pending"};orders.push(o);res.json({order:o})});
app.post('/api/add-points',(req,res)=>{if(!isAdmin(req.body.token))return res.json({error:"no"});let u=users.find(x=>x.id==req.body.userId);if(u)u.balance+=parseInt(req.body.points);res.json({ok:true})});
app.post('/api/set-points',(req,res)=>{if(!isAdmin(req.body.token))return res.json({error:"no"});let u=users.find(x=>x.id==req.body.userId);if(u)u.balance=parseInt(req.body.points);res.json({ok:true})});
app.post('/api/admin/delete-user',(req,res)=>{if(!isAdmin(req.body.token))return res.json({});users=users.filter(u=>u.id!=req.body.userId);res.json({ok:true})});
app.post('/api/admin/update-order',(req,res)=>{if(!isAdmin(req.body.token))return res.json({});let o=orders.find(x=>x.id==req.body.id);if(o)o.status=req.body.status;res.json({ok:true})});
app.post('/api/admin/delete-order',(req,res)=>{if(!isAdmin(req.body.token))return res.json({});orders=orders.filter(o=>o.id!=req.body.id);res.json({ok:true})});
app.post('/api/admin/add-service',(req,res)=>{if(!isAdmin(req.body.token))return res.json({});let s={id:Math.floor(100+Math.random()*900),cat:req.body.cat,name:req.body.name,price:req.body.price,min:100,max:10000,status:"Active"};services.push(s);res.json({ok:true})});
app.post('/api/admin/update-service',(req,res)=>{if(!isAdmin(req.body.token))return res.json({});let s=services.find(x=>x.id==req.body.id);if(s)s.price=req.body.price;res.json({ok:true})});
app.post('/api/admin/delete-service',(req,res)=>{if(!isAdmin(req.body.token))return res.json({});services=services.filter(s=>s.id!=req.body.id);res.json({ok:true})});
app.listen(process.env.PORT||10000,()=>console.log("OK"));
