/* ===================== MOCK DATA ===================== */
const CATEGORIES = [
  {id:'audio', name:'Audio', desc:'Headphones, speakers, and listening objects'},
  {id:'carry', name:'Carry', desc:'Leather sleeves, bags, and device cases'},
  {id:'desk', name:'Desk', desc:'Stands, trays, and considered hardware'},
  {id:'wearables', name:'Wearables', desc:'Straps, bands, and quiet tech'},
];

const MATERIALS = {
  walnut:{name:'Walnut', sw:'linear-gradient(135deg,#6b4730,#4a2f1d)'},
  obsidian:{name:'Obsidian', sw:'linear-gradient(135deg,#3a3530,#15110F)'},
  ivory:{name:'Bone Ivory', sw:'linear-gradient(135deg,#F6EFE4,#D8CBB0)'},
  burgundy:{name:'Burgundy', sw:'linear-gradient(135deg,#7A2330,#3C1015)'},
  copper:{name:'Copper', sw:'linear-gradient(135deg,#D49A6A,#8C6240)'},
  slate:{name:'Slate', sw:'linear-gradient(135deg,#5b5650,#36322e)'},
};

function img(seed, w=800, h=800){ return `https://picsum.photos/seed/${seed}/${w}/${h}`; }

const PRODUCTS = [
  {id:'p01', name:'Aria II Headphones', cat:'audio', price:429, compareAt:480, rating:4.8, reviews:212,
   tag:'Bestseller', materials:['obsidian','walnut','burgundy'], stock:14,
   desc:"Hand-finished walnut earcups around a 40mm beryllium driver. Aria II is tuned for warmth without losing detail — built for rooms, not gyms.",
   specs:{'Driver':'40mm beryllium-coated','Battery':'38 hrs','Weight':'284g','Connectivity':'Bluetooth 5.3, 3.5mm'},
   images:[img('aria1'),img('aria2'),img('aria3'),img('aria4')]},
  {id:'p02', name:'Folio Sleeve — 14"', cat:'carry', price:189, compareAt:null, rating:4.9, reviews:98,
   tag:'New', materials:['burgundy','obsidian','copper'], stock:31,
   desc:"Full-grain leather, vegetable tanned, that darkens beautifully with use. A single seam, no branding, just a quiet copper pull-tab.",
   specs:{'Material':'Full-grain leather','Fit':'13"–14" laptops','Lining':'Brushed wool felt','Origin':'Made in Portugal'},
   images:[img('folio1'),img('folio2'),img('folio3'),img('folio4')]},
  {id:'p03', name:'Monolith Stand', cat:'desk', price:159, compareAt:null, rating:4.7, reviews:64,
   tag:null, materials:['obsidian','slate','walnut'], stock:22,
   desc:"A single block of resin-cast stone, milled to hold any laptop at a 12° typing angle. Cools passively. Sits like furniture, not hardware.",
   specs:{'Material':'Cast composite stone','Angle':'12°','Weight':'1.2kg','Compatibility':'11"–16" laptops'},
   images:[img('mono1'),img('mono2'),img('mono3'),img('mono4')]},
  {id:'p04', name:'Cusp Earbuds', cat:'audio', price:249, compareAt:289, rating:4.6, reviews:341,
   tag:'Sale', materials:['ivory','obsidian','copper'], stock:8,
   desc:"Ceramic-shelled earbuds with adaptive noise cancellation tuned across three listening profiles. The case doubles as a wireless charging puck.",
   specs:{'ANC':'Adaptive, 3 profiles','Battery':'6h + 24h case','Charging':'USB-C, Qi','Water rating':'IPX4'},
   images:[img('cusp1'),img('cusp2'),img('cusp3'),img('cusp4')]},
  {id:'p05', name:'Strand Watch Band', cat:'wearables', price:89, compareAt:null, rating:4.5, reviews:52,
   tag:null, materials:['burgundy','walnut','slate'], stock:46,
   desc:"Woven Italian leather strand-strap with a brushed copper clasp. Fits all standard 20mm lug watches and most smartwatches.",
   specs:{'Width':'20mm','Material':'Woven leather','Clasp':'Brushed copper','Adjustable':'6 positions'},
   images:[img('strand1'),img('strand2'),img('strand3'),img('strand4')]},
  {id:'p06', name:'Ledger Tray', cat:'desk', price:119, compareAt:null, rating:4.9, reviews:39,
   tag:'New', materials:['walnut','obsidian','ivory'], stock:17,
   desc:"A catch-all valet tray in solid walnut with a felt-lined recess for watches, rings, and the small things that pile up by your keyboard.",
   specs:{'Material':'Solid walnut','Dimensions':'24×14×3cm','Lining':'Wool felt','Finish':'Hand-oiled'},
   images:[img('ledger1'),img('ledger2'),img('ledger3'),img('ledger4')]},
  {id:'p07', name:'Halcyon Speaker', cat:'audio', price:599, compareAt:649, rating:4.8, reviews:127,
   tag:'Sale', materials:['obsidian','burgundy','slate'], stock:11,
   desc:"A single full-range driver inside a cast aluminum body wrapped in wool. Fills a room evenly without a subwoofer's bloat.",
   specs:{'Driver':'Full-range 4"','Power':'60W class D','Connectivity':'Wi-Fi, Bluetooth 5.3','Weight':'2.1kg'},
   images:[img('halc1'),img('halc2'),img('halc3'),img('halc4')]},
  {id:'p08', name:'Weekender Carryall', cat:'carry', price:349, compareAt:null, rating:4.7, reviews:76,
   tag:null, materials:['burgundy','walnut','obsidian'], stock:9,
   desc:"A 38-litre weekend bag in waxed canvas and leather trim, built around a padded laptop sleeve and a separate shoe compartment.",
   specs:{'Capacity':'38L','Material':'Waxed canvas, leather trim','Laptop sleeve':'Up to 16"','Strap':'Detachable, adjustable'},
   images:[img('week1'),img('week2'),img('week3'),img('week4')]},
  {id:'p09', name:'Cradle Charging Dock', cat:'desk', price:99, compareAt:null, rating:4.4, reviews:58,
   tag:null, materials:['obsidian','copper','ivory'], stock:0,
   desc:"Three-coil wireless charging dock machined from a single aluminum block, finished to match Aria II and Cusp.",
   specs:{'Output':'15W phone, 5W buds, 3W watch','Material':'Anodized aluminum','Cable':'2m braided USB-C','Compatibility':'Qi-enabled devices'},
   images:[img('cradle1'),img('cradle2'),img('cradle3'),img('cradle4')]},
  {id:'p10', name:'Quill Stylus', cat:'wearables', price:129, compareAt:149, rating:4.6, reviews:88,
   tag:'Sale', materials:['walnut','obsidian','burgundy'], stock:25,
   desc:"A pressure-sensitive stylus turned from solid walnut around an aluminum core, magnetically charging and pairing in one motion.",
   specs:{'Pressure levels':'4096','Battery':'2 weeks','Charging':'Magnetic dock','Compatibility':'Most tablets'},
   images:[img('quill1'),img('quill2'),img('quill3'),img('quill4')]},
  {id:'p11', name:'Aria II — Travel Case', cat:'carry', price:69, compareAt:null, rating:4.8, reviews:44,
   tag:null, materials:['obsidian','burgundy'], stock:38,
   desc:"A molded EVA case wrapped in the same leather as Folio, shaped precisely for Aria II's earcups and folded headband.",
   specs:{'Material':'EVA + leather wrap','Fit':'Aria II only','Closure':'Magnetic flap','Interior':'Microsuede lining'},
   images:[img('case1'),img('case2'),img('case3'),img('case4')]},
  {id:'p12', name:'Plinth Phone Stand', cat:'desk', price:59, compareAt:null, rating:4.3, reviews:29,
   tag:null, materials:['slate','walnut','obsidian'], stock:54,
   desc:"A minimal, weighted phone stand for calls, video, and counter-top recipes. Two viewing angles, no moving parts.",
   specs:{'Material':'Cast resin + steel base','Angles':'2 fixed positions','Compatibility':'All phone sizes','Weight':'310g'},
   images:[img('plinth1'),img('plinth2'),img('plinth3'),img('plinth4')]},
];

const REVIEWS_POOL = [
  {name:'Mariam K.', rating:5, title:'Worth every cent', body:"The walnut earcups are exactly as described — warm, detailed sound and they look incredible on a desk when not in use.", days:6},
  {name:'Theo R.', rating:5, title:'Better than the brand I switched from', body:"Comfortable for long sessions and the battery genuinely lasts the stated time. No notes.", days:14},
  {name:'Priya S.', rating:4, title:'Beautiful, slightly heavy', body:"Build quality is outstanding. Wish it were a touch lighter for travel but I'm not sending it back.", days:21},
  {name:'Daniel O.', rating:5, title:'Exceeded expectations', body:"Packaging alone felt premium. The product matches it. Already looking at the speaker next.", days:30},
  {name:'Yusuf A.', rating:4, title:'Great everyday piece', body:"Subtle, well-made, does the job without shouting about it. Exactly what I wanted.", days:45},
];

function genReviews(productId, count){
  const out = [];
  for(let i=0;i<count;i++){
    const base = REVIEWS_POOL[i % REVIEWS_POOL.length];
    out.push({...base, id:`${productId}-r${i}`});
  }
  return out;
}

const ORDERS = [
  {id:'VS-10482', date:'2026-06-12', status:'delivered', total:618, items:[{pid:'p01',qty:1,material:'walnut'},{pid:'p11',qty:1,material:'obsidian'}]},
  {id:'VS-10417', date:'2026-05-29', status:'shipped', total:159, items:[{pid:'p03',qty:1,material:'slate'}]},
  {id:'VS-10309', date:'2026-05-02', status:'processing', total:349, items:[{pid:'p08',qty:1,material:'burgundy'}]},
  {id:'VS-10201', date:'2026-04-11', status:'delivered', total:338, items:[{pid:'p05',qty:2,material:'walnut'},{pid:'p12',qty:1,material:'slate'}]},
];

const ADMIN_USERS = [
  {id:'u01', name:'Mariam Khalil', email:'mariam@vespera.shop', role:'Customer', orders:4, spent:1464, joined:'2025-11-02', status:'active'},
  {id:'u02', name:'Theo Reyes', email:'theo.reyes@gmail.com', role:'Customer', orders:1, spent:429, joined:'2026-02-18', status:'active'},
  {id:'u03', name:'Priya Sharma', email:'p.sharma@outlook.com', role:'Customer', orders:7, spent:2890, joined:'2025-08-30', status:'active'},
  {id:'u04', name:'Daniel Osei', email:'d.osei@proton.me', role:'Admin', orders:0, spent:0, joined:'2025-06-01', status:'active'},
  {id:'u05', name:'Yusuf Ahmed', email:'yusuf.a@icloud.com', role:'Customer', orders:2, spent:518, joined:'2026-03-22', status:'suspended'},
  {id:'u06', name:'Lena Voss', email:'lena.voss@vespera.shop', role:'Editor', orders:0, spent:0, joined:'2025-09-14', status:'active'},
];

const PROMO_CODES = [
  {code:'WELCOME10', type:'percent', value:10, uses:842, limit:5000, active:true, expires:'2026-12-31'},
  {code:'SUMMER25', type:'percent', value:25, uses:301, limit:1000, active:true, expires:'2026-08-31'},
  {code:'FREESHIP', type:'shipping', value:100, uses:1209, limit:null, active:true, expires:null},
  {code:'VIP50', type:'fixed', value:50, uses:44, limit:200, active:false, expires:'2026-03-01'},
];

let ADMIN_ORDERS = [];
