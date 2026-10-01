/* ===================== VIEW: CATALOG ===================== */
function getFilteredProducts(){
  let list = [...PRODUCTS];
  const f = State.filters;
  if(f.cat && f.cat!=='all') list = list.filter(p=>p.cat===f.cat);
  if(State.params.sale) list = list.filter(p=>p.compareAt);
  if(f.search) list = list.filter(p=>p.name.toLowerCase().includes(f.search.toLowerCase()));
  if(f.materials.length) list = list.filter(p=>p.materials.some(m=>f.materials.includes(m)));
  list = list.filter(p=>p.price>=f.price[0] && p.price<=f.price[1]);
  switch(f.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
    case 'new': list = list.filter(p=>p.tag==='New').concat(list.filter(p=>p.tag!=='New')); break;
    default: break;
  }
  return list;
}

function renderCatalog(){
  if(State.params.cat) State.filters.cat = State.params.cat;
  const list = getFilteredProducts();
  const activeCat = CATEGORIES.find(c=>c.id===State.filters.cat);
  return `
  <section style="padding:48px 0 100px;">
    <div class="container">
      <div style="margin-bottom:8px;" class="mono" style="font-size:11px;color:var(--text-faint);">
        <button onclick="navigate('landing')" style="color:var(--text-faint);">HOME</button> / <span style="color:var(--copper-bright);">${State.params.sale ? 'SALE' : (activeCat?activeCat.name.toUpperCase():'ALL PRODUCTS')}</span>
      </div>
      <h1 class="serif" style="font-size:clamp(30px,4vw,46px);font-weight:500;margin:10px 0 36px;">
        ${State.params.sale ? 'Current sale' : (activeCat?activeCat.name:'All products')}
      </h1>

      <div style="display:grid;grid-template-columns:240px 1fr;gap:40px;" class="catalog-grid">
        <aside class="catalog-filters">
          <div style="margin-bottom:32px;">
            <div class="eyebrow" style="margin-bottom:14px;">Category</div>
            <button onclick="setCatalogFilter('cat','all')" style="display:block;width:100%;text-align:left;padding:8px 0;font-size:13.5px;color:${State.filters.cat==='all'?'var(--ivory)':'var(--text-dim)'};font-weight:${State.filters.cat==='all'?'700':'400'};">All products</button>
            ${CATEGORIES.map(c=>`<button onclick="setCatalogFilter('cat','${c.id}')" style="display:block;width:100%;text-align:left;padding:8px 0;font-size:13.5px;color:${State.filters.cat===c.id?'var(--ivory)':'var(--text-dim)'};font-weight:${State.filters.cat===c.id?'700':'400'};">${c.name}</button>`).join('')}
          </div>
          <div style="margin-bottom:32px;">
            <div class="eyebrow" style="margin-bottom:14px;">Price</div>
            <input type="range" min="0" max="700" step="10" value="${State.filters.price[1]}" oninput="setCatalogPrice(this.value)" style="width:100%;accent-color:var(--copper);">
            <div style="display:flex;justify-content:space-between;" class="mono"><span style="font-size:11.5px;color:var(--text-dim);">$0</span><span style="font-size:11.5px;color:var(--text-dim);">${fmt(State.filters.price[1])}</span></div>
          </div>
          <div style="margin-bottom:32px;">
            <div class="eyebrow" style="margin-bottom:14px;">Material</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${Object.keys(MATERIALS).map(m=>{
                const active = State.filters.materials.includes(m);
                return `<button onclick="toggleMaterialFilter('${m}')" title="${MATERIALS[m].name}" style="width:30px;height:30px;border-radius:50%;background:${MATERIALS[m].sw};border:2px solid ${active?'var(--copper-bright)':'transparent'};opacity:${active?'1':'.85'};"></button>`;
              }).join('')}
            </div>
          </div>
          <button class="btn btn-ghost btn-sm btn-block" onclick="resetCatalogFilters()">Reset filters</button>
        </aside>

        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
            <span style="font-size:13px;color:var(--text-dim);">${list.length} product${list.length!==1?'s':''}</span>
            <select onchange="setCatalogFilter('sort',this.value)" style="background:var(--surface);border:1px solid var(--line-strong);border-radius:8px;padding:9px 14px;font-size:12.5px;color:var(--ivory);">
              <option value="featured" ${State.filters.sort==='featured'?'selected':''}>Featured</option>
              <option value="new" ${State.filters.sort==='new'?'selected':''}>Newest</option>
              <option value="price-asc" ${State.filters.sort==='price-asc'?'selected':''}>Price: Low to High</option>
              <option value="price-desc" ${State.filters.sort==='price-desc'?'selected':''}>Price: High to Low</option>
              <option value="rating" ${State.filters.sort==='rating'?'selected':''}>Top rated</option>
            </select>
          </div>
          ${list.length===0 ? `
            <div style="text-align:center;padding:80px 20px;">
              <div style="width:64px;height:64px;border-radius:50%;background:rgba(184,122,75,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--copper-bright);">${icon('search-x',26)}</div>
              <p class="serif" style="font-size:19px;margin-bottom:8px;">No products match these filters</p>
              <p style="font-size:13px;color:var(--text-dim);margin-bottom:20px;">Try widening the price range or clearing a material filter.</p>
              <button class="btn btn-primary btn-sm" onclick="resetCatalogFilters()">Reset filters</button>
            </div>` : `
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;" class="product-grid-3">
              ${list.map(productCard).join('')}
            </div>`}
        </div>
      </div>
    </div>
  </section>`;
}

function setCatalogFilter(key,val){ State.filters[key]=val; State.params={}; renderApp(); }
function setCatalogPrice(val){ State.filters.price=[0,parseInt(val)]; renderApp(); }
function toggleMaterialFilter(m){
  const i = State.filters.materials.indexOf(m);
  if(i>-1) State.filters.materials.splice(i,1); else State.filters.materials.push(m);
  renderApp();
}
function resetCatalogFilters(){ State.filters={cat:'all',sort:'featured',price:[0,700],search:'',materials:[]}; State.params={}; renderApp(); }

/* Quick view modal */
function openQuickView(pid){
  const p = getProduct(pid);
  const root = $('#overlay-root');
  const html = `<div id="quickview-overlay" class="overlay" onclick="if(event.target===this)closeQuickView()">
    <div class="modal-center glass" style="width:min(820px,94vw);">
      <button class="btn-icon" onclick="closeQuickView()" style="position:absolute;top:16px;right:16px;background:var(--ink);z-index:2;" aria-label="Close">${icon('x',16)}</button>
      <div style="display:grid;grid-template-columns:1fr 1fr;" class="qv-grid">
        <img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;min-height:320px;border-radius:var(--radius-lg) 0 0 var(--radius-lg);">
        <div style="padding:32px;">
          <div class="mono" style="font-size:10.5px;color:var(--text-faint);letter-spacing:.06em;margin-bottom:8px;">${CATEGORIES.find(c=>c.id===p.cat).name.toUpperCase()}</div>
          <h3 class="serif" style="font-size:24px;margin-bottom:10px;">${p.name}</h3>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">${starRow(p.rating,13)}<span class="mono" style="font-size:11px;color:var(--text-faint);">(${p.reviews} reviews)</span></div>
          <div class="mono" style="font-size:20px;font-weight:700;color:var(--copper-bright);margin-bottom:16px;">${fmt(p.price)}</div>
          <p style="font-size:13px;color:var(--text-dim);line-height:1.6;margin-bottom:20px;">${p.desc}</p>
          <div style="margin-bottom:24px;">${materialSwatches(p.materials, p.materials[0], 'qvSelectMaterial')}</div>
          <button class="btn btn-primary btn-block" onclick="addToCart('${p.id}', window.__qvMaterial||'${p.materials[0]}');closeQuickView();">Add to bag — ${fmt(p.price)}</button>
          <button class="btn btn-ghost btn-block" style="margin-top:10px;" onclick="closeQuickView();navigate('product',{id:'${p.id}'})">View full details</button>
        </div>
      </div>
    </div>
  </div>`;
  const existing = document.getElementById('quickview-overlay');
  if(existing) existing.remove();
  root.insertAdjacentHTML('beforeend', html);
  window.__qvMaterial = p.materials[0];
  refreshIcons();
  requestAnimationFrame(()=>$('#quickview-overlay').classList.add('open'));
}
function qvSelectMaterial(m){ window.__qvMaterial = m; openQuickViewRefreshSwatch(m); }
function openQuickViewRefreshSwatch(m){
  $all('#quickview-overlay button[aria-pressed]').forEach(b=>{});
}
function closeQuickView(){
  const el = $('#quickview-overlay');
  if(el){ el.classList.remove('open'); setTimeout(()=>el.remove(),400); }
}
