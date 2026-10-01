/* ===================== API LAYER ===================== */
const API_BASE = 'http://localhost:8000/api';
const TOKEN_KEY = 'vsp_token';
function getToken(){ return localStorage.getItem(TOKEN_KEY); }
function setToken(t){ if(t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); }

async function apiFetch(path, options={}){
  const headers = Object.assign({'Content-Type':'application/json'}, options.headers||{});
  const token = getToken();
  if(token) headers['Authorization'] = 'Bearer '+token;
  const res = await fetch(API_BASE+path, Object.assign({}, options, {headers}));
  let data = null;
  try{ data = await res.json(); }catch(e){}
  if(!res.ok){
    const message = (data && data.detail) || res.statusText || 'Request failed';
    throw new Error(typeof message==='string' ? message : 'Request failed');
  }
  return data;
}

function normalizeProduct(p){
  return {id:p.id, name:p.name, cat:p.category_id, price:p.price, compareAt:p.compare_at,
    rating:p.rating, reviews:p.reviews_count, tag:p.tag, materials:p.materials, stock:p.stock,
    desc:p.description, specs:p.specs, images:p.images};
}
function normalizeCategory(c){ return {id:c.id, name:c.name, desc:c.description}; }
function normalizePromo(p){ return {id:p.id, code:p.code, type:p.type, value:p.value, uses:p.uses, limit:p.usage_limit, active:p.active, expires:p.expires}; }
function normalizeOrder(o){
  return {id:o.id, date:(o.created_at||'').slice(0,10), status:o.status, total:o.total,
    items:(o.items||[]).map(it=>({pid:it.product_id, qty:it.qty, material:it.material}))};
}
function normalizeAdminUser(u){
  return {id:u.id, name:u.name, email:u.email, role:u.role==='admin'?'Admin':'Customer',
    orders:u.orders_count, spent:u.spent, joined:(u.created_at||'').slice(0,10), status:u.status};
}
function daysAgo(iso){
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return Math.max(0, d);
}
function normalizeReview(r){
  return {id:r.id, name:r.author_name, rating:r.rating, title:r.title, body:r.body, days:daysAgo(r.created_at)};
}

async function loadCategoriesFromAPI(){
  try{ const data = await apiFetch('/categories'); if(Array.isArray(data) && data.length){ CATEGORIES.length=0; CATEGORIES.push(...data.map(normalizeCategory)); } }
  catch(e){ console.warn('Using local categories fallback:', e.message); }
}
async function loadProductsFromAPI(){
  try{ const data = await apiFetch('/products'); if(Array.isArray(data) && data.length){ PRODUCTS.length=0; PRODUCTS.push(...data.map(normalizeProduct)); } }
  catch(e){ console.warn('Using local products fallback:', e.message); }
}
async function loadMyOrders(){
  if(!State.user) return;
  try{ const data = await apiFetch('/orders'); if(Array.isArray(data)){ ORDERS.length=0; ORDERS.push(...data.map(normalizeOrder)); } }
  catch(e){ console.warn('Could not load orders:', e.message); }
}
async function loadMyWishlist(){
  try{ const data = await apiFetch('/wishlist'); if(data && Array.isArray(data.product_ids)){ State.wishlist = data.product_ids; } }
  catch(e){ console.warn('Could not load wishlist:', e.message); }
}
async function loadProductReviews(pid){
  try{
    const data = await apiFetch('/products/'+pid+'/reviews');
    if(Array.isArray(data)){
      pdpState.realReviews = data.map(normalizeReview);
      if(pdpState.pid===pid && pdpState.tab==='reviews') renderApp();
    }
  }catch(e){ console.warn('Could not load reviews:', e.message); }
}
function openWriteReview(pid){
  if(!State.user){ toast('info','Sign in required','Create an account to write a review.'); return; }
  const ratingStr = window.prompt('Rating (1-5)?', '5');
  if(ratingStr===null) return;
  const rating = clamp(parseInt(ratingStr,10)||5, 1, 5);
  const title = window.prompt('Review title?');
  if(title===null || !title.trim()) return;
  const body = window.prompt('Your review?');
  if(body===null || !body.trim()) return;
  submitReview(pid, {rating, title: title.trim(), body: body.trim()});
}
async function submitReview(pid, payload){
  try{
    await apiFetch('/products/'+pid+'/reviews', {method:'POST', body: JSON.stringify(payload)});
    toast('success','Review submitted','Thanks for sharing your feedback.');
    await Promise.all([loadProductReviews(pid), loadProductsFromAPI()]);
    renderApp();
  }catch(e){ toast('error','Could not submit review', e.message); }
}
async function loadAdminUsers(){
  try{ const data = await apiFetch('/admin/users'); if(Array.isArray(data)){ ADMIN_USERS.length=0; ADMIN_USERS.push(...data.map(normalizeAdminUser)); } }
  catch(e){ console.warn('Could not load admin users:', e.message); }
}
async function loadAdminPromos(){
  try{ const data = await apiFetch('/promos'); if(Array.isArray(data)){ PROMO_CODES.length=0; PROMO_CODES.push(...data.map(normalizePromo)); } }
  catch(e){ console.warn('Could not load admin promos:', e.message); }
}
async function loadAdminOrders(){
  try{
    const data = await apiFetch('/admin/orders');
    if(Array.isArray(data)){
      ADMIN_ORDERS.length=0;
      ADMIN_ORDERS.push(...data.map(o=>Object.assign(normalizeOrder(o), {customer:(o.shipping_address&&(o.shipping_address.name||o.shipping_address.email))||'—'})));
    }
  }catch(e){ console.warn('Could not load admin orders:', e.message); }
}
async function loadAdminData(){
  await Promise.all([loadAdminUsers(), loadAdminPromos(), loadAdminOrders()]);
  renderApp();
}
async function restoreSession(){
  const token = getToken();
  if(!token) return;
  try{
    const me = await apiFetch('/auth/me');
    State.user = {id:me.id, name:me.name, email:me.email, role:me.role};
    await Promise.all([loadMyOrders(), loadMyWishlist()]);
  }catch(e){ setToken(null); }
}
