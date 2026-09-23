const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

function loadData(){
  if(!fs.existsSync(DATA_FILE)){
    const initial = {
      products: [
        { id:1, name:'86 Diamonds',  price:2500,  meta:'Fast top-up', icon:'💎' },
        { id:2, name:'172 Diamonds', price:4800,  meta:'Fast top-up', icon:'💎' },
        { id:3, name:'257 Diamonds', price:7200,  meta:'Best value',  icon:'💎', bonus:'+10' },
        { id:4, name:'344 Diamonds', price:9500,  meta:'Fast top-up', icon:'💎' },
        { id:5, name:'429 Diamonds', price:12000, meta:'Popular',     icon:'💎', bonus:'+25' },
        { id:6, name:'514 Diamonds', price:14500, meta:'Fast top-up', icon:'💎' },
        { id:7, name:'706 Diamonds', price:19500, meta:'Best seller', icon:'💎', bonus:'+50' },
        { id:8, name:'Weekly Pass',  price:8500,  meta:'Subscription',icon:'⚡' }
      ],
      accounts: [
        { id:1, name:'Mythical Glory Collector', price:185000, rank:'Mythical Glory', skins:120, heroes:95, tag:'COLLECTOR', desc:'High-tier collection.', image:'' },
        { id:2, name:'Mythic Premium',           price:98000,  rank:'Mythic',         skins:78,  heroes:82, tag:'EPIC',      desc:'Ranked ready.',         image:'' },
        { id:3, name:'Honor 90+ Skins',          price:72000,  rank:'Mythical Honor', skins:94,  heroes:88, tag:'HOT',       desc:'High-skin account.',    image:'' },
        { id:4, name:'Immortal Rare',            price:260000, rank:'Mythical Immortal', skins:165, heroes:120, tag:'RARE', desc:'Top-tier account.',     image:'' }
      ],
      orders: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data){
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/products', (req, res) => {
  res.json(loadData().products);
});

app.get('/api/accounts', (req, res) => {
  res.json(loadData().accounts);
});

app.post('/api/orders', (req, res) => {
  const data = loadData();
  const order = req.body;
  order.id = 'CK' + Date.now().toString().slice(-7);
  order.date = new Date().toISOString();
  order.status = 'Pending';
  data.orders.unshift(order);
  saveData(data);
  res.json({ ok:true, orderId:order.id });
});

app.get('/api/orders/:id', (req, res) => {
  const order = loadData().orders.find(o => o.id === req.params.id);
  if(!order) return res.status(404).json({ error:'Not found' });
  res.json(order);
});

const ADMIN_PASSWORD = 'admin123';

app.post('/api/admin/login', (req, res) => {
  if(req.body.password === ADMIN_PASSWORD){
    res.json({ ok:true });
  } else {
    res.status(401).json({ error:'Wrong password' });
  }
});

app.get('/api/admin/data', (req, res) => {
  res.json(loadData());
});

app.post('/api/admin/accounts', (req, res) => {
  const data = loadData();
  const acc = req.body;
  acc.id = Date.now();
  data.accounts.unshift(acc);
  saveData(data);
  res.json({ ok:true, id:acc.id });
});

app.delete('/api/admin/accounts/:id', (req, res) => {
  const data = loadData();
  data.accounts = data.accounts.filter(a => a.id != req.params.id);
  saveData(data);
  res.json({ ok:true });
});

app.patch('/api/admin/orders/:id', (req, res) => {
  const data = loadData();
  const order = data.orders.find(o => o.id === req.params.id);
  if(order){ order.status = req.body.status; saveData(data); }
  res.json({ ok:true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 CYBER KING running on port ' + PORT);
});
