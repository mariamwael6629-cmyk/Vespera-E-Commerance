/* ===================== VIEW: USER DASHBOARD ===================== */
let dashTab = 'overview';
function renderDashboard(){
  if(!State.user){ return renderLoggedOutDashboard(); }
  if(State.params.tab) dashTab = State.params.tab;
  const tabs = [['overview','Overview','layout-dashboard'],['orders','Orders','package'],['wishlist','Wishlist','heart'],['addresses','Addresses','map-pin'],['profile','Profile','user']];
  return `<section style="padding:40px 0 100px;"><div class="container">
    <div style="display:grid;grid-template-columns:240px 1fr;gap:40px;" class="dash-grid">
      <aside>
        <div class="card" style="padding:20px;margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--copper-bright),var(--burgundy));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">${State.user.name[0].toUpperCase()}</div>
            <div style="min-width:0;"><div style="font-weight:700;font-size:14px;">${State.user.name}</div><div style="font-size:11.5px;color:var(--text-faint);overflow:hidden;text-overflow:ellipsis;">${State.user.email}</div></div>
          </div>
        </div>
        <nav style="display:flex;flex-direction:column;gap:2px;">
          ${tabs.map(([id,label,ic])=>`
            <button onclick="dashSetTab('${id}')" style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--radius-sm);font-size:13.5px;text-align:left;
              background:${dashTab===id?'rgba(184,122,75,0.1)':'transparent'};color:${dashTab===id?'var(--copper-bright)':'var(--text-dim)'};font-weight:${dashTab===id?'600':'400'};">${icon(ic,16)}${label}</button>`).join('')}
          <button onclick="doLogout()" style="display:flex;align-items:center;gap:12px;padding:12px 14px;font-size:13.5px;color:var(--text-faint);margin-top:14px;border-top:1px solid var(--line);padding-top:18px;">${icon('log-out',16)}Sign out</button>
        </nav>
      </aside>
      <div>${dashboardTabContent()}</div>
    </div>
  </div></section>`;
}
function dashSetTab(t){ dashTab=t; renderApp(); }
function doLogout(){ State.user=null; setToken(null); ORDERS.length=0; loadWishlistLocal(); toast('info','Signed out','See you again soon.'); navigate('landing'); }

function renderLoggedOutDashboard(){
  return `<section style="padding:120px 0;"><div class="container" style="text-align:center;max-width:420px;">
    <div style="width:64px;height:64px;border-radius:50%;background:rgba(184,122,75,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:var(--copper-bright);">${icon('user',26)}</div>
    <h1 class="serif" style="font-size:26px;margin-bottom:12px;">Sign in to view your account</h1>
    <p style="font-size:14px;color:var(--text-dim);margin-bottom:24px;">Track orders, manage your wishlist, and update your details.</p>
    <button class="btn btn-primary" onclick="navigate('login')">Sign in</button>
  </div></section>`;
}

function dashboardTabContent(){
  if(dashTab==='overview'){
    const recentOrder = ORDERS[0];
    return `
      <h1 class="serif" style="font-size:26px;margin-bottom:24px;">Welcome back, ${State.user.name.split(' ')[0]}</h1>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;" class="stat-grid">
        ${statCard('Total orders', ORDERS.length, 'package', '+1 this month')}
        ${statCard('Saved items', State.wishlist.length, 'heart', null)}
        ${statCard('Lifetime spend', fmt(ORDERS.reduce((s,o)=>s+o.total,0)), 'wallet', null)}
      </div>
      <div class="card" style="padding:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:18px;"><h3 class="serif" style="font-size:17px;">Most recent order</h3><button onclick="dashSetTab('orders')" style="font-size:12px;color:var(--copper-bright);">View all →</button></div>
        ${orderRow(recentOrder)}
      </div>`;
  }
  if(dashTab==='orders'){
    return `<h1 class="serif" style="font-size:26px;margin-bottom:24px;">Order history</h1>
      <div class="card" style="overflow:hidden;">${ORDERS.map(orderRow).join('<div class="divider"></div>')}</div>`;
  }
  if(dashTab==='wishlist'){
    const items = PRODUCTS.filter(p=>State.wishlist.includes(p.id));
    return `<h1 class="serif" style="font-size:26px;margin-bottom:24px;">Wishlist</h1>
      ${items.length===0 ? `<p style="color:var(--text-dim);font-size:13.5px;">No items saved yet.</p>` :
      `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;" class="product-grid-3">${items.map(productCard).join('')}</div>`}`;
  }
  if(dashTab==='addresses'){
    return `<h1 class="serif" style="font-size:26px;margin-bottom:24px;">Saved addresses</h1>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="addr-grid">
        <div class="card" style="padding:20px;">
          <span class="badge badge-copper" style="margin-bottom:12px;">Default</span>
          <p style="font-size:14px;line-height:1.6;">Mariam Khalil<br>248 Birch Hollow Lane<br>Austin, TX 78701<br>United States</p>
          <div style="display:flex;gap:10px;margin-top:14px;"><button class="btn btn-ghost btn-sm">Edit</button><button class="btn btn-ghost btn-sm">Remove</button></div>
        </div>
        <button class="card" style="padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-dim);min-height:140px;" onclick="toast('info','New address','This is a prototype — address form not wired up.')">
          ${icon('plus',20)}<span style="font-size:13px;margin-top:8px;">Add new address</span>
        </button>
      </div>`;
  }
  if(dashTab==='profile'){
    return `<h1 class="serif" style="font-size:26px;margin-bottom:24px;">Profile settings</h1>
      <div class="card" style="padding:28px;max-width:480px;">
        <div class="field"><label>Full name</label><input value="${State.user.name}" id="prof-name"></div>
        <div class="field"><label>Email</label><input value="${State.user.email}" id="prof-email"></div>
        <div class="field"><label>Phone</label><input placeholder="+1 (555) 000-0000"></div>
        <label class="checkbox-row" style="margin-bottom:24px;"><input type="checkbox" checked> Email me about order updates and new arrivals</label>
        <button class="btn btn-primary" onclick="toast('success','Profile updated','Your changes have been saved.')">Save changes</button>
      </div>`;
  }
}

function statCard(label, value, ic, sub){
  return `<div class="card" style="padding:20px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(184,122,75,0.12);color:var(--copper-bright);display:flex;align-items:center;justify-content:center;">${icon(ic,17)}</div>
    </div>
    <div class="serif" style="font-size:26px;margin-bottom:4px;">${value}</div>
    <div style="font-size:12px;color:var(--text-dim);">${label}</div>
    ${sub?`<div class="mono" style="font-size:10.5px;color:var(--copper-bright);margin-top:6px;">${sub}</div>`:''}
  </div>`;
}

const STATUS_STYLE = {
  delivered:{bg:'rgba(120,160,110,0.14)',c:'#9FC79A',label:'Delivered'},
  shipped:{bg:'rgba(184,122,75,0.16)',c:'var(--copper-bright)',label:'Shipped'},
  processing:{bg:'rgba(246,239,228,0.08)',c:'var(--text-dim)',label:'Processing'},
};

function orderRow(o){
  const s = STATUS_STYLE[o.status];
  const firstProduct = getProduct(o.items[0].pid);
  return `<div style="display:flex;align-items:center;gap:16px;padding:18px 24px;cursor:pointer;" onclick="openOrderTracking('${o.id}')">
    <img src="${firstProduct.images[0]}" style="width:54px;height:54px;border-radius:10px;object-fit:cover;flex:none;">
    <div style="flex:1;min-width:0;">
      <div style="display:flex;gap:10px;align-items:center;"><span class="mono" style="font-size:13px;font-weight:600;">${o.id}</span><span class="badge" style="background:${s.bg};color:${s.c};">${s.label}</span></div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:4px;">${o.items.length} item${o.items.length>1?'s':''} · Placed ${o.date}</div>
    </div>
    <span class="mono" style="font-size:14px;font-weight:600;flex:none;">${fmt(o.total)}</span>
    <span style="color:var(--text-faint);flex:none;">${icon('chevron-right',16)}</span>
  </div>`;
}

function openOrderTracking(orderId){
  const o = ORDERS.find(x=>x.id===orderId);
  const steps = ['Order placed','Processing','Shipped','Out for delivery','Delivered'];
  const statusIdx = {processing:1, shipped:2, delivered:4}[o.status] ?? 1;
  const root = $('#overlay-root');
  const html = `<div id="track-overlay" class="overlay" onclick="if(event.target===this)closeTracking()">
    <div class="modal-center glass" style="width:min(520px,92vw);padding:32px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:24px;">
        <div><div class="mono" style="font-size:13px;color:var(--copper-bright);">${o.id}</div><div style="font-size:13px;color:var(--text-dim);">Placed ${o.date}</div></div>
        <button class="btn-icon" onclick="closeTracking()" aria-label="Close">${icon('x',16)}</button>
      </div>
      <div style="margin-bottom:28px;">
        ${steps.map((s,i)=>`
          <div style="display:flex;gap:14px;">
            <div style="display:flex;flex-direction:column;align-items:center;">
              <div style="width:22px;height:22px;border-radius:50%;background:${i<=statusIdx?'var(--copper-bright)':'var(--surface-soft)'};display:flex;align-items:center;justify-content:center;flex:none;">${i<=statusIdx?icon('check',12):''}</div>
              ${i<steps.length-1?`<div style="width:1.5px;flex:1;background:${i<statusIdx?'var(--copper-bright)':'var(--line-strong)'};min-height:28px;"></div>`:''}
            </div>
            <div style="padding-bottom:24px;"><div style="font-size:13.5px;font-weight:${i<=statusIdx?'600':'400'};color:${i<=statusIdx?'var(--ivory)':'var(--text-faint)'};">${s}</div></div>
          </div>`).join('')}
      </div>
      <div class="card" style="padding:16px;">
        ${o.items.map(it=>{ const p=getProduct(it.pid); return `<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;"><img src="${p.images[0]}" style="width:34px;height:34px;border-radius:6px;object-fit:cover;"><span style="font-size:12.5px;flex:1;">${p.name}</span><span class="mono" style="font-size:11px;color:var(--text-faint);">×${it.qty}</span></div>`}).join('')}
      </div>
    </div>
  </div>`;
  const existing = document.getElementById('track-overlay'); if(existing) existing.remove();
  root.insertAdjacentHTML('beforeend', html);
  refreshIcons();
  requestAnimationFrame(()=>$('#track-overlay').classList.add('open'));
}
function closeTracking(){
  const el = $('#track-overlay');
  if(el){ el.classList.remove('open'); setTimeout(()=>el.remove(),400); }
}
