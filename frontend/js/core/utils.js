/* ===================== UTILS ===================== */
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function fmt(n){ return '$' + n.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0}); }
function fmt2(n){ return '$' + n.toFixed(2); }
function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }
function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

function navigate(view, params={}){
  State.prevView = State.view;
  State.view = view;
  State.params = params;
  window.scrollTo({top:0, behavior:'instant'});
  render();
}

function icon(name, size=18){
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;" aria-hidden="true"></i>`;
}

function refreshIcons(){ if(window.lucide) lucide.createIcons(); }

function toast(type, title, msg){
  const id = Date.now() + Math.random();
  State.toasts.push({id,type,title,msg});
  renderToasts();
  setTimeout(()=>dismissToast(id), 4200);
}
function dismissToast(id){
  const el = document.getElementById('toast-'+id);
  if(el){ el.classList.add('leaving'); setTimeout(()=>{ State.toasts = State.toasts.filter(t=>t.id!==id); renderToasts(); }, 300); }
  else { State.toasts = State.toasts.filter(t=>t.id!==id); renderToasts(); }
}
function renderToasts(){
  const stack = document.getElementById('toast-stack');
  const icons = {success:'check-circle', error:'x-circle', info:'info'};
  const colors = {
    success:{accent:'#9FC79A', iconBg:'rgba(120,160,110,0.16)'},
    error:{accent:'#E8919E', iconBg:'rgba(122,35,48,0.2)'},
    info:{accent:'var(--copper-bright)', iconBg:'rgba(184,122,75,0.16)'},
  };
  stack.innerHTML = State.toasts.map(t=>{
    const c = colors[t.type]||colors.info;
    return `<div class="toast glass" id="toast-${t.id}" style="border-color:${c.accent}33;">
      <div class="toast-icon" style="background:${c.iconBg};color:${c.accent};">${icon(icons[t.type]||'info',16)}</div>
      <div style="flex:1;min-width:0;">
        <div class="toast-title">${t.title}</div>
        <div class="toast-msg">${t.msg}</div>
      </div>
      <button class="toast-close" onclick="dismissToast(${t.id})" aria-label="Dismiss">×</button>
    </div>`;
  }).join('');
  refreshIcons();
}

function cartCount(){ return State.cart.reduce((s,i)=>s+i.qty,0); }
function cartSubtotal(){
  return State.cart.reduce((s,i)=>{
    const p = getProduct(i.pid); return s + (p?p.price*i.qty:0);
  },0);
}
function addToCart(pid, material, qty=1){
  const existing = State.cart.find(i=>i.pid===pid && i.material===material);
  if(existing){ existing.qty += qty; } else { State.cart.push({pid,material,qty}); }
  saveCart();
  const p = getProduct(pid);
  toast('success', 'Added to cart', `${p.name} — ${MATERIALS[material].name}`);
  renderCartBadge();
}
function removeFromCart(pid, material){
  State.cart = State.cart.filter(i=>!(i.pid===pid && i.material===material));
  saveCart(); renderCartBadge();
  if(State.view==='cart') renderApp();
}
function updateCartQty(pid, material, qty){
  const item = State.cart.find(i=>i.pid===pid && i.material===material);
  if(item){ item.qty = clamp(qty,1,9); saveCart(); }
  if(State.view==='cart') renderApp();
  renderCartBadge();
}
async function toggleWishlist(pid){
  const idx = State.wishlist.indexOf(pid);
  const p = getProduct(pid);
  const wasSaved = idx>-1;
  if(State.user){
    try{
      const data = wasSaved ? await apiFetch('/wishlist/'+pid, {method:'DELETE'}) : await apiFetch('/wishlist/'+pid, {method:'POST'});
      if(data && Array.isArray(data.product_ids)) State.wishlist = data.product_ids;
      toast(wasSaved?'info':'success', wasSaved?'Removed from wishlist':'Saved to wishlist', p.name);
    }catch(e){ toast('error','Could not update wishlist', e.message); }
  } else {
    if(wasSaved){ State.wishlist.splice(idx,1); toast('info','Removed from wishlist', p.name); }
    else { State.wishlist.push(pid); toast('success','Saved to wishlist', p.name); }
    saveWishlist();
  }
  renderApp();
}
function renderCartBadge(){
  $all('.cart-count').forEach(el=>{
    const n = cartCount();
    el.textContent = n;
    el.style.display = n>0 ? 'flex':'none';
  });
}

function starRow(rating, size=14){
  let html = '';
  for(let i=1;i<=5;i++){
    const fill = rating>=i ? 1 : (rating>i-1 ? rating-(i-1) : 0);
    html += `<span style="position:relative;display:inline-block;width:${size}px;height:${size}px;">
      <span style="position:absolute;inset:0;color:var(--line-strong);">${icon('star',size)}</span>
      <span style="position:absolute;inset:0;width:${fill*100}%;overflow:hidden;color:var(--copper-bright);">${icon('star',size)}</span>
    </span>`;
  }
  return `<span style="display:inline-flex;gap:2px;">${html}</span>`;
}

function materialSwatches(materialKeys, selected, onClick){
  return `<div style="display:flex;gap:10px;flex-wrap:wrap;">
    ${materialKeys.map(m=>{
      const mat = MATERIALS[m];
      const active = m===selected;
      return `<button onclick="${onClick}('${m}')" title="${mat.name}" aria-label="${mat.name}" aria-pressed="${active}"
        style="width:38px;height:38px;border-radius:50%;background:${mat.sw};cursor:pointer;
        border:2px solid ${active?'var(--copper-bright)':'transparent'};
        box-shadow:${active?'0 0 0 3px rgba(184,122,75,0.25)':'0 2px 6px rgba(0,0,0,.3)'};
        transition:transform .25s var(--ease), border-color .25s var(--ease);"
        onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></button>`;
    }).join('')}
  </div>`;
}
