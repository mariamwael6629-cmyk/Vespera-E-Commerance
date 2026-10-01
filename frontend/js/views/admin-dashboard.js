/* ===================== VIEW: ADMIN DASHBOARD ===================== */
const ADMIN_NAV = [
  ['overview','Overview','layout-dashboard'],
  ['products','Products','package'],
  ['inventory','Inventory','boxes'],
  ['orders','Orders','clipboard-list'],
  ['users','Users','users'],
  ['promos','Promo codes','ticket'],
];

function renderAdmin(){
  if(State.params.adminView) State.adminView = State.params.adminView;
  if(!State.adminDataLoaded){ State.adminDataLoaded = true; loadAdminData(); }
  return `<div style="display:flex;min-height:100vh;" class="admin-shell">
    <aside style="width:240px;flex:none;background:var(--surface);border-right:1px solid var(--line);padding:24px 16px;display:flex;flex-direction:column;" class="admin-sidebar">
      <a href="#" onclick="navigate('landing');return false;" class="serif" style="font-size:19px;padding:0 10px;margin-bottom:32px;display:flex;align-items:center;gap:10px;">
        <span style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--copper-bright),var(--burgundy));display:inline-flex;align-items:center;justify-content:center;">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#15110F" stroke-width="1.8"/></svg>
        </span>Vespera <span class="mono" style="font-size:10px;color:var(--text-faint);">ADMIN</span>
      </a>
      <nav style="display:flex;flex-direction:column;gap:2px;flex:1;">
        ${ADMIN_NAV.map(([id,label,ic])=>`
          <button onclick="adminSetView('${id}')" style="display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:var(--radius-sm);font-size:13.5px;text-align:left;
            background:${State.adminView===id?'rgba(184,122,75,0.12)':'transparent'};color:${State.adminView===id?'var(--copper-bright)':'var(--text-dim)'};font-weight:${State.adminView===id?'600':'400'};">${icon(ic,16)}${label}</button>`).join('')}
      </nav>
      <div class="divider" style="margin:16px 0;"></div>
      <button onclick="navigate('landing')" style="display:flex;align-items:center;gap:12px;padding:11px 12px;font-size:13px;color:var(--text-faint);">${icon('arrow-left',16)}Back to store</button>
    </aside>
    <main style="flex:1;min-width:0;overflow-x:hidden;">
      <div style="position:sticky;top:0;z-index:50;background:var(--ink);border-bottom:1px solid var(--line);padding:18px 32px;display:flex;justify-content:space-between;align-items:center;">
        <h1 class="serif" style="font-size:20px;text-transform:capitalize;">${ADMIN_NAV.find(n=>n[0]===State.adminView)?.[1]}</h1>
        <div style="display:flex;align-items:center;gap:14px;">
          <button class="btn-icon" aria-label="Toggle theme" onclick="toggleTheme()">${icon(State.theme==='dark'?'sun':'moon',16)}</button>
          <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--copper-bright),var(--burgundy));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;">D</div>
        </div>
      </div>
      <div style="padding:32px;">${adminViewContent()}</div>
    </main>
  </div>`;
}
function adminSetView(v){ State.adminView=v; renderApp(); }

function adminViewContent(){
  switch(State.adminView){
    case 'overview': return adminOverview();
    case 'products': return adminProducts();
    case 'inventory': return adminInventory();
    case 'orders': return adminOrders();
    case 'users': return adminUsers();
    case 'promos': return adminPromos();
    default: return adminOverview();
  }
}

function adminOverview(){
  const sourceOrders = ADMIN_ORDERS.length ? ADMIN_ORDERS : ORDERS;
  const revenue = sourceOrders.reduce((s,o)=>s+o.total,0) * 38;
  const chartData = [42,55,49,68,61,74,82,77,91,86,98,112];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxV = Math.max(...chartData);
  const catSales = [['Audio',42],['Carry',27],['Desk',19],['Wearables',12]];
  return `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;" class="admin-stat-grid">
      ${adminStat('Revenue (30d)', fmt(revenue), '+18.2%', 'up', 'wallet')}
      ${adminStat('Orders', sourceOrders.length*47, '+9.4%', 'up', 'clipboard-list')}
      ${adminStat('Active users', ADMIN_USERS.filter(u=>u.status==='active').length*210, '+4.1%', 'up', 'users')}
      ${adminStat('Avg. order value', fmt(218), '−2.3%', 'down', 'receipt')}
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:28px;" class="admin-chart-row">
      <div class="card" style="padding:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:20px;"><h3 class="serif" style="font-size:16px;">Revenue trend</h3><span class="badge badge-copper">2026</span></div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:180px;">
          ${chartData.map((v,i)=>`
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end;">
              <div style="width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,var(--copper-bright),var(--copper-dim));height:${(v/maxV*100)}%;transition:height .8s var(--ease);" title="${months[i]}: ${fmt(v*1000)}"></div>
              <span class="mono" style="font-size:9.5px;color:var(--text-faint);">${months[i]}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="card" style="padding:24px;">
        <h3 class="serif" style="font-size:16px;margin-bottom:20px;">Sales by category</h3>
        ${catSales.map(([name,pct])=>`
          <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;"><span>${name}</span><span class="mono" style="color:var(--text-dim);">${pct}%</span></div>
            <div style="height:6px;background:var(--surface-soft);border-radius:4px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:var(--copper-bright);border-radius:4px;"></div></div>
          </div>`).join('')}
      </div>
    </div>
    <div class="card" style="overflow:hidden;">
      <div style="padding:20px 24px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;"><h3 class="serif" style="font-size:16px;">Recent orders</h3><button onclick="adminSetView('orders')" style="font-size:12px;color:var(--copper-bright);">View all →</button></div>
      ${adminOrdersTable(sourceOrders.slice(0,4))}
    </div>`;
}

function adminStat(label, value, delta, dir, ic){
  return `<div class="card" style="padding:20px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:14px;">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(184,122,75,0.12);color:var(--copper-bright);display:flex;align-items:center;justify-content:center;">${icon(ic,17)}</div>
      <span class="mono" style="font-size:11px;color:${dir==='up'?'#9FC79A':'#E8919E'};display:flex;align-items:center;gap:3px;">${icon(dir==='up'?'trending-up':'trending-down',12)}${delta}</span>
    </div>
    <div class="serif" style="font-size:24px;margin-bottom:4px;">${value}</div>
    <div style="font-size:12px;color:var(--text-dim);">${label}</div>
  </div>`;
}

function adminProducts(){
  return `
    <div style="display:flex;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;gap:10px;">
        <input placeholder="Search products…" style="background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--ivory);width:240px;">
        <select style="background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--ivory);">
          <option>All categories</option>${CATEGORIES.map(c=>`<option>${c.name}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-sm" onclick="adminAddProduct()">${icon('plus',14)} Add product</button>
    </div>
    <div class="card" style="overflow:hidden;">
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;min-width:760px;">
        <thead><tr style="border-bottom:1px solid var(--line);">
          ${['Product','Category','Price','Stock','Rating','Status',''].map(h=>`<th style="text-align:left;padding:14px 20px;font-size:11px;letter-spacing:.05em;color:var(--text-faint);font-family:var(--font-mono);">${h.toUpperCase()}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${PRODUCTS.map(p=>`
            <tr style="border-bottom:1px solid var(--line);" onmouseover="this.style.background='rgba(184,122,75,0.04)'" onmouseout="this.style.background='none'">
              <td style="padding:12px 20px;"><div style="display:flex;align-items:center;gap:12px;"><img src="${p.images[0]}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;"><span style="font-size:13px;font-weight:600;">${p.name}</span></div></td>
              <td style="padding:12px 20px;font-size:13px;color:var(--text-dim);">${CATEGORIES.find(c=>c.id===p.cat).name}</td>
              <td style="padding:12px 20px;font-size:13px;" class="mono">${fmt(p.price)}</td>
              <td style="padding:12px 20px;font-size:13px;" class="mono">${p.stock}</td>
              <td style="padding:12px 20px;font-size:13px;">${starRow(p.rating,11)}</td>
              <td style="padding:12px 20px;"><span class="badge ${p.stock===0?'badge-burgundy':'badge-success'}">${p.stock===0?'Out of stock':'Active'}</span></td>
              <td style="padding:12px 20px;"><div style="display:flex;gap:6px;">
                <button class="btn-icon" style="width:30px;height:30px;" onclick="adminEditProduct('${p.id}')" aria-label="Edit product">${icon('pencil',15)}</button>
                <button class="btn-icon" style="width:30px;height:30px;" onclick="adminDeleteProduct('${p.id}')" aria-label="Delete product">${icon('trash-2',15)}</button>
              </div></td>
            </tr>`).join('')}
        </tbody>
      </table>
      </div>
    </div>`;
}
async function adminAddProduct(){
  const name = window.prompt('Product name?');
  if(!name) return;
  const category_id = window.prompt('Category id? (' + CATEGORIES.map(c=>c.id).join(', ') + ')', CATEGORIES[0]?.id || '');
  if(!category_id) return;
  const price = parseFloat(window.prompt('Price?', '99'));
  if(!price || price<=0){ toast('error','Invalid price','Enter a valid number.'); return; }
  const stock = parseInt(window.prompt('Stock?', '10'),10) || 0;
  try{
    await apiFetch('/products', {method:'POST', body: JSON.stringify({name, category_id, price, stock})});
    toast('success','Product added', name);
    await loadProductsFromAPI(); renderApp();
  }catch(e){ toast('error','Could not add product', e.message); }
}
async function adminEditProduct(pid){
  const p = getProduct(pid);
  if(!p) return;
  const name = window.prompt('Product name?', p.name);
  if(name===null) return;
  const priceStr = window.prompt('Price?', p.price);
  if(priceStr===null) return;
  const stockStr = window.prompt('Stock?', p.stock);
  if(stockStr===null) return;
  try{
    await apiFetch('/products/'+pid, {method:'PUT', body: JSON.stringify({name, price: parseFloat(priceStr), stock: parseInt(stockStr,10)})});
    toast('success','Product updated', name);
    await loadProductsFromAPI(); renderApp();
  }catch(e){ toast('error','Could not update product', e.message); }
}
async function adminDeleteProduct(pid){
  const p = getProduct(pid);
  if(!p) return;
  if(!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
  try{
    await apiFetch('/products/'+pid, {method:'DELETE'});
    toast('success','Product deleted', p.name);
    await loadProductsFromAPI(); renderApp();
  }catch(e){ toast('error','Could not delete product', e.message); }
}

function adminInventory(){
  const low = PRODUCTS.filter(p=>p.stock>0 && p.stock<15);
  const out = PRODUCTS.filter(p=>p.stock===0);
  return `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px;">
      ${adminStat('Total SKUs', PRODUCTS.length, '', 'up', 'boxes')}
      ${adminStat('Low stock', low.length, '', 'down', 'alert-triangle')}
      ${adminStat('Out of stock', out.length, '', 'down', 'x-circle')}
    </div>
    ${out.length ? `<div class="card" style="padding:20px;margin-bottom:20px;border-color:rgba(122,35,48,0.3);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;color:#E8919E;">${icon('alert-triangle',16)}<span style="font-weight:600;font-size:13.5px;">Out of stock — restock recommended</span></div>
      ${out.map(p=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid var(--line);"><span style="font-size:13px;">${p.name}</span><button class="btn btn-ghost btn-sm" onclick="toast('success','Restock requested',\`A purchase order draft was created for ${p.name}.\`)">Request restock</button></div>`).join('')}
    </div>`:''}
    <div class="card" style="overflow:hidden;">
      <div style="padding:18px 24px;border-bottom:1px solid var(--line);"><h3 class="serif" style="font-size:16px;">Stock levels</h3></div>
      ${PRODUCTS.map(p=>`
        <div style="display:flex;align-items:center;gap:16px;padding:14px 24px;border-bottom:1px solid var(--line);">
          <img src="${p.images[0]}" style="width:38px;height:38px;border-radius:8px;object-fit:cover;flex:none;">
          <span style="font-size:13px;flex:1;">${p.name}</span>
          <div style="width:140px;height:6px;background:var(--surface-soft);border-radius:4px;overflow:hidden;flex:none;"><div style="height:100%;width:${clamp(p.stock/60*100,2,100)}%;background:${p.stock===0?'#7A2330':p.stock<15?'var(--copper-bright)':'#9FC79A'};"></div></div>
          <span class="mono" style="font-size:12.5px;width:30px;text-align:right;flex:none;">${p.stock}</span>
        </div>`).join('')}
    </div>`;
}

function adminOrdersTable(orders){
  return `<div style="overflow-x:auto;">
  <table style="width:100%;border-collapse:collapse;min-width:680px;">
    <thead><tr style="border-bottom:1px solid var(--line);">
      ${['Order','Customer','Date','Status','Total',''].map(h=>`<th style="text-align:left;padding:14px 24px;font-size:11px;letter-spacing:.05em;color:var(--text-faint);font-family:var(--font-mono);">${h.toUpperCase()}</th>`).join('')}
    </tr></thead>
    <tbody>
      ${orders.map((o,i)=>{ const s=STATUS_STYLE[o.status]; const custName = o.customer || (ADMIN_USERS[i%ADMIN_USERS.length]||{}).name || '—';
        return `<tr style="border-bottom:1px solid var(--line);" onmouseover="this.style.background='rgba(184,122,75,0.04)'" onmouseout="this.style.background='none'">
        <td style="padding:13px 24px;" class="mono" style="font-size:13px;">${o.id}</td>
        <td style="padding:13px 24px;font-size:13px;">${custName}</td>
        <td style="padding:13px 24px;font-size:13px;color:var(--text-dim);" class="mono">${o.date}</td>
        <td style="padding:13px 24px;"><span class="badge" style="background:${s.bg};color:${s.c};">${s.label}</span></td>
        <td style="padding:13px 24px;font-size:13px;" class="mono">${fmt(o.total)}</td>
        <td style="padding:13px 24px;"><button class="btn-icon" style="width:28px;height:28px;" onclick="openOrderTracking('${o.id}')">${icon('eye',14)}</button></td>
      </tr>`;}).join('')}
    </tbody>
  </table></div>`;
}

function adminOrders(){
  const allOrders = ADMIN_ORDERS.length ? ADMIN_ORDERS : [...ORDERS, ...ORDERS.map(o=>({...o,id:o.id+'-A'})), ...ORDERS.map(o=>({...o,id:o.id+'-B'}))];
  return `
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
      ${['All','Processing','Shipped','Delivered'].map((s,i)=>`<button class="badge ${i===0?'badge-copper':'badge-ivory'}" style="cursor:pointer;padding:8px 16px;">${s}</button>`).join('')}
    </div>
    <div class="card" style="overflow:hidden;">${adminOrdersTable(allOrders)}</div>`;
}

function adminUsers(){
  return `
    <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
      <input placeholder="Search users…" style="background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--ivory);width:240px;">
      <button class="btn btn-primary btn-sm" onclick="toast('info','Invite user','Prototype — invite flow not wired up.')">${icon('user-plus',14)} Invite user</button>
    </div>
    <div class="card" style="overflow:hidden;">
      <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;min-width:760px;">
        <thead><tr style="border-bottom:1px solid var(--line);">
          ${['User','Role','Orders','Spent','Joined','Status',''].map(h=>`<th style="text-align:left;padding:14px 20px;font-size:11px;letter-spacing:.05em;color:var(--text-faint);font-family:var(--font-mono);">${h.toUpperCase()}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${ADMIN_USERS.map(u=>`
            <tr style="border-bottom:1px solid var(--line);" onmouseover="this.style.background='rgba(184,122,75,0.04)'" onmouseout="this.style.background='none'">
              <td style="padding:12px 20px;"><div style="display:flex;align-items:center;gap:12px;"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--copper-bright),var(--burgundy));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex:none;">${u.name[0]}</div><div><div style="font-size:13px;font-weight:600;">${u.name}</div><div style="font-size:11px;color:var(--text-faint);">${u.email}</div></div></div></td>
              <td style="padding:12px 20px;"><span class="badge badge-ivory">${u.role}</span></td>
              <td style="padding:12px 20px;font-size:13px;" class="mono">${u.orders}</td>
              <td style="padding:12px 20px;font-size:13px;" class="mono">${fmt(u.spent)}</td>
              <td style="padding:12px 20px;font-size:13px;color:var(--text-dim);" class="mono">${u.joined}</td>
              <td style="padding:12px 20px;"><span class="badge ${u.status==='active'?'badge-success':'badge-burgundy'}">${u.status}</span></td>
              <td style="padding:12px 20px;"><button class="btn-icon" style="width:30px;height:30px;" onclick="adminManageUser('${u.id}', '${u.status}')" aria-label="Manage user">${icon(u.status==='active'?'user-x':'user-check',15)}</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
      </div>
    </div>`;
}
async function adminManageUser(id, currentStatus){
  if(State.user && String(State.user.id)===String(id)){ toast('error','Not allowed','You cannot block your own account.'); return; }
  const nextStatus = currentStatus==='active' ? 'blocked' : 'active';
  if(!window.confirm(`${nextStatus==='blocked'?'Block':'Reactivate'} this user?`)) return;
  try{
    await apiFetch('/admin/users/'+id, {method:'PATCH', body: JSON.stringify({status: nextStatus})});
    toast('success','User updated', `Status set to ${nextStatus}.`);
    await loadAdminUsers(); renderApp();
  }catch(e){ toast('error','Could not update user', e.message); }
}

function adminPromos(){
  return `
    <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
      <button class="btn btn-primary btn-sm" onclick="adminAddPromo()">${icon('plus',14)} New promo code</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;" class="promo-grid">
      ${PROMO_CODES.map(p=>`
        <div class="card" style="padding:20px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:14px;">
            <span class="mono" style="font-size:16px;font-weight:700;letter-spacing:.03em;">${p.code}</span>
            <span class="badge ${p.active?'badge-success':'badge-ivory'}">${p.active?'Active':'Expired'}</span>
          </div>
          <div style="font-size:13px;color:var(--text-dim);margin-bottom:14px;">
            ${p.type==='percent'?`${p.value}% off order`:p.type==='fixed'?`${fmt(p.value)} off order`:'Free shipping'}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-faint);margin-bottom:8px;">
            <span>Used ${p.uses}${p.limit?` / ${p.limit}`:''}</span><span>${p.expires?`Expires ${p.expires}`:'No expiry'}</span>
          </div>
          ${p.limit?`<div style="height:5px;background:var(--surface-soft);border-radius:4px;overflow:hidden;margin-bottom:14px;"><div style="height:100%;width:${clamp(p.uses/p.limit*100,2,100)}%;background:var(--copper-bright);"></div></div>`:''}
          <button class="btn btn-ghost btn-sm btn-block" onclick="adminTogglePromo(${p.id}, ${p.active})">${p.active?'Deactivate':'Activate'}</button>
        </div>`).join('')}
    </div>`;
}
async function adminAddPromo(){
  const code = window.prompt('Promo code?');
  if(!code) return;
  const type = window.prompt('Type? (percent / fixed / shipping)', 'percent');
  if(!type) return;
  const value = parseFloat(window.prompt('Value? (% or $ amount, 100 for free shipping)', '10')) || 0;
  try{
    await apiFetch('/promos', {method:'POST', body: JSON.stringify({code, type, value, active:true})});
    toast('success','Promo created', code.toUpperCase());
    await loadAdminPromos(); renderApp();
  }catch(e){ toast('error','Could not create promo', e.message); }
}
async function adminTogglePromo(id, active){
  try{
    await apiFetch('/promos/'+id, {method:'PUT', body: JSON.stringify({active: !active})});
    await loadAdminPromos(); renderApp();
  }catch(e){ toast('error','Could not update promo', e.message); }
}
