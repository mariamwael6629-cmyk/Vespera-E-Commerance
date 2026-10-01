/* ===================== VIEW: PRODUCT DETAIL ===================== */
let pdpState = { activeImg:0, material:null, qty:1, tab:'description' };

function renderProductDetail(){
  const p = getProduct(State.params.id) || PRODUCTS[0];
  if(pdpState.pid !== p.id){ pdpState = {pid:p.id, activeImg:0, material:p.materials[0], qty:1, tab:'description', realReviews:null}; loadProductReviews(p.id); }
  const wished = State.wishlist.includes(p.id);
  const reviews = (pdpState.realReviews && pdpState.realReviews.length) ? pdpState.realReviews : genReviews(p.id, 5);
  const related = PRODUCTS.filter(r=>r.cat===p.cat && r.id!==p.id).slice(0,4);
  const recs = PRODUCTS.filter(r=>r.id!==p.id).sort((a,b)=>b.rating-a.rating).slice(0,4);

  return `
  <section style="padding:32px 0 80px;">
    <div class="container">
      <div class="mono" style="font-size:11px;color:var(--text-faint);margin-bottom:24px;">
        <button onclick="navigate('landing')" style="color:var(--text-faint);">HOME</button> /
        <button onclick="navigate('catalog',{cat:'${p.cat}'})" style="color:var(--text-faint);">${CATEGORIES.find(c=>c.id===p.cat).name.toUpperCase()}</button> /
        <span style="color:var(--copper-bright);">${p.name.toUpperCase()}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;margin-bottom:90px;" class="pdp-grid">
        <div>
          <div class="card" style="aspect-ratio:1;overflow:hidden;margin-bottom:14px;">
            <img id="pdp-main-img" src="${p.images[pdpState.activeImg]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;transition:opacity .3s var(--ease);">
          </div>
          <div style="display:flex;gap:12px;">
            ${p.images.map((im,i)=>`<button onclick="pdpSetImg(${i})" class="card" style="width:76px;height:76px;overflow:hidden;padding:0;border-color:${i===pdpState.activeImg?'var(--copper-bright)':'var(--line)'};">
              <img src="${im}" style="width:100%;height:100%;object-fit:cover;"></button>`).join('')}
          </div>
        </div>

        <div>
          ${p.tag ? `<span class="badge ${p.tag==='Sale'?'badge-burgundy':'badge-copper'}" style="margin-bottom:14px;">${p.tag}</span>`:''}
          <h1 class="serif" style="font-size:clamp(28px,3.6vw,40px);font-weight:500;margin-bottom:12px;">${p.name}</h1>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
            ${starRow(p.rating,15)}
            <span class="mono" style="font-size:12px;color:var(--text-dim);">${p.rating} · ${p.reviews} reviews</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:12px;margin-bottom:24px;">
            <span class="mono" style="font-size:26px;font-weight:700;color:${p.compareAt?'var(--copper-bright)':'var(--ivory)'};">${fmt(p.price)}</span>
            ${p.compareAt ? `<span class="mono" style="font-size:16px;color:var(--text-faint);text-decoration:line-through;">${fmt(p.compareAt)}</span><span class="badge badge-burgundy">SAVE ${Math.round((1-p.price/p.compareAt)*100)}%</span>`:''}
          </div>
          <p style="font-size:14.5px;color:var(--text-dim);line-height:1.7;margin-bottom:28px;">${p.desc}</p>

          <div style="margin-bottom:28px;">
            <div class="eyebrow" style="margin-bottom:12px;">Finish — ${MATERIALS[pdpState.material].name}</div>
            ${materialSwatches(p.materials, pdpState.material, 'pdpSelectMaterial')}
          </div>

          <div style="display:flex;gap:14px;margin-bottom:18px;">
            <div style="display:flex;align-items:center;border:1px solid var(--line-strong);border-radius:999px;">
              <button onclick="pdpSetQty(${pdpState.qty-1})" style="width:44px;height:48px;font-size:16px;" aria-label="Decrease quantity">−</button>
              <span class="mono" style="font-size:14px;width:34px;text-align:center;">${pdpState.qty}</span>
              <button onclick="pdpSetQty(${pdpState.qty+1})" style="width:44px;height:48px;font-size:16px;" aria-label="Increase quantity">+</button>
            </div>
            <button class="btn btn-primary btn-lg" style="flex:1;" ${p.stock===0?'disabled':''} onclick="addToCart('${p.id}', pdpState.material, pdpState.qty)">
              ${p.stock===0?'Out of stock':`Add to bag — ${fmt(p.price*pdpState.qty)}`}
            </button>
            <button class="btn-icon" style="width:48px;height:48px;" onclick="toggleWishlist('${p.id}');renderApp();" aria-label="Toggle wishlist">
              <i data-lucide="heart" style="width:18px;height:18px;color:${wished?'var(--copper-bright)':'currentColor'};${wished?'fill:currentColor;':''}"></i>
            </button>
          </div>
          ${p.stock>0 && p.stock<15 ? `<div style="font-size:12px;color:var(--copper-bright);margin-bottom:18px;">${icon('flame',13)} Only ${p.stock} left in this finish</div>`:''}

          <div style="display:flex;gap:20px;padding-top:20px;border-top:1px solid var(--line);">
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-dim);">${icon('truck',16)}Free shipping over $150</div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-dim);">${icon('rotate-ccw',16)}30-day returns</div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-dim);">${icon('shield-check',16)}2-year warranty</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:90px;">
        <div style="display:flex;gap:32px;border-bottom:1px solid var(--line);margin-bottom:32px;">
          ${['description','specifications','reviews'].map(t=>`
            <button onclick="pdpSetTab('${t}')" style="padding:14px 0;font-size:13.5px;font-weight:600;text-transform:capitalize;border-bottom:2px solid ${pdpState.tab===t?'var(--copper-bright)':'transparent'};color:${pdpState.tab===t?'var(--ivory)':'var(--text-dim)'};">${t}${t==='reviews'?` (${p.reviews})`:''}</button>`).join('')}
        </div>
        ${pdpState.tab==='description' ? `<p style="font-size:14.5px;color:var(--text-dim);line-height:1.8;max-width:680px;">${p.desc} Every unit is inspected by hand before it ships, and finished with materials chosen to age rather than degrade — the walnut will darken, the leather will soften, and the copper will develop a patina that's entirely its own.</p>` : ''}
        ${pdpState.tab==='specifications' ? `
          <div style="max-width:560px;">
            ${Object.entries(p.specs).map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);"><span style="font-size:13px;color:var(--text-dim);">${k}</span><span class="mono" style="font-size:13px;">${v}</span></div>`).join('')}
          </div>` : ''}
        ${pdpState.tab==='reviews' ? `
          <div style="display:grid;grid-template-columns:280px 1fr;gap:48px;" class="reviews-grid">
            <div>
              <div class="serif" style="font-size:48px;margin-bottom:8px;">${p.rating}</div>
              ${starRow(p.rating,16)}
              <div style="font-size:12.5px;color:var(--text-dim);margin:8px 0 24px;">Based on ${p.reviews} reviews</div>
              <button class="btn btn-ghost btn-block" onclick="openWriteReview('${p.id}')">Write a review</button>
            </div>
            <div>
              ${reviews.map(r=>`
                <div style="padding-bottom:24px;margin-bottom:24px;border-bottom:1px solid var(--line);">
                  <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                    <div style="font-weight:600;font-size:13.5px;">${r.name}</div>
                    <span class="mono" style="font-size:11px;color:var(--text-faint);">${r.days}d ago</span>
                  </div>
                  ${starRow(r.rating,12)}
                  <div style="font-weight:600;font-size:13.5px;margin:10px 0 4px;">${r.title}</div>
                  <p style="font-size:13px;color:var(--text-dim);line-height:1.6;">${r.body}</p>
                </div>`).join('')}
            </div>
          </div>` : ''}
      </div>

      <div style="margin-bottom:90px;">
        <div class="eyebrow" style="margin-bottom:16px;">Pairs well with</div>
        <h2 class="serif" style="font-size:28px;margin-bottom:32px;">Complete the set</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;" class="product-grid">${related.map(productCard).join('')}</div>
      </div>

      <div>
        <div class="eyebrow" style="margin-bottom:16px;">${icon('sparkles',13)} Curated for you</div>
        <h2 class="serif" style="font-size:28px;margin-bottom:32px;">Recommended based on your browsing</h2>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;" class="product-grid">${recs.map(productCard).join('')}</div>
      </div>
    </div>
  </section>`;
}

function pdpSetImg(i){ pdpState.activeImg=i; renderApp(); }
function pdpSelectMaterial(m){ pdpState.material=m; renderApp(); }
function pdpSetQty(q){ pdpState.qty=clamp(q,1,9); renderApp(); }
function pdpSetTab(t){ pdpState.tab=t; renderApp(); }
