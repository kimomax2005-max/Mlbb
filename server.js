const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

let accounts = [
  { id:1, name:'Mythical Glory Collector', price:185000, rank:'Mythical Glory', skins:120, heroes:95, tag:'COLLECTOR', image:'' },
  { id:2, name:'Mythic Premium',           price:98000,  rank:'Mythic',         skins:78,  heroes:82, tag:'EPIC',      image:'' },
  { id:3, name:'Honor 90+ Skins',          price:72000,  rank:'Mythical Honor', skins:94,  heroes:88, tag:'HOT',       image:'' },
  { id:4, name:'Immortal Rare',            price:260000, rank:'Mythical Immortal', skins:165, heroes:120, tag:'RARE',   image:'' }
];
let orders = [];

app.get('/api/products', (req, res) => {
  res.json([
    { id:1, name:'86 Diamonds',  price:2500,  meta:'Fast top-up', icon:'💎' },
    { id:2, name:'172 Diamonds', price:4800,  meta:'Fast top-up', icon:'💎' },
    { id:3, name:'257 Diamonds', price:7200,  meta:'Best value',  icon:'💎', bonus:'+10' },
    { id:4, name:'344 Diamonds', price:9500,  meta:'Fast top-up', icon:'💎' },
    { id:5, name:'429 Diamonds', price:12000, meta:'Popular',     icon:'💎', bonus:'+25' },
    { id:6, name:'514 Diamonds', price:14500, meta:'Fast top-up', icon:'💎' },
    { id:7, name:'706 Diamonds', price:19500, meta:'Best seller', icon:'💎', bonus:'+50' },
    { id:8, name:'Weekly Pass',  price:8500,  meta:'Subscription',icon:'⚡' }
  ]);
});

app.get('/api/accounts', (req, res) => res.json(accounts));

app.post('/api/orders', (req, res) => {
  const order = req.body;
  order.id = 'CK' + Date.now().toString().slice(-7);
  order.status = 'Pending';
  orders.unshift(order);
  res.json({ ok:true, orderId:order.id });
});

app.get('/api/orders/:id', (req, res) => {
  const o = orders.find(x => x.id === req.params.id);
  if(!o) return res.status(404).json({ error:'Not found' });
  res.json(o);
});

const ADMIN_PASSWORD = 'admin123';

app.post('/api/admin/login', (req, res) => {
  if(req.body.password === ADMIN_PASSWORD) res.json({ ok:true });
  else res.status(401).json({ error:'Wrong password' });
});

app.get('/api/admin/data', (req, res) => res.json({ accounts, orders }));

app.post('/api/admin/accounts', (req, res) => {
  const acc = req.body;
  acc.id = Date.now();
  accounts.unshift(acc);
  res.json({ ok:true });
});

app.delete('/api/admin/accounts/:id', (req, res) => {
  accounts = accounts.filter(a => a.id != req.params.id);
  res.json({ ok:true });
});

app.patch('/api/admin/orders/:id', (req, res) => {
  const o = orders.find(x => x.id === req.params.id);
  if(o) o.status = req.body.status;
  res.json({ ok:true });
});

// ⭐ ဒီစာကြောင်း က အရေးကြီးဆုံး — Vercel အတွက်
module.exports = app;
