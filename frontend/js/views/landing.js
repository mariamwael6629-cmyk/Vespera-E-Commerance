/* ===================== VIEW: LANDING ===================== */
function renderLanding(){
  const featured = PRODUCTS.filter(p=>['p01','p07','p02','p03'].includes(p.id));
  const bestsellers = PRODUCTS.filter(p=>p.tag==='Bestseller' || p.rating>=4.7).slice(0,4);
  return `
  <section style="position:relative;padding:64px 0 0;overflow:hidden;">
    <div class="container" style="display:grid;grid-template-columns:1.1fr 1fr;gap:60px;align-items:center;min-height:78vh;" id="hero-grid">
      <div style="position:relative;z-index:2;">
        <div class="eyebrow" style="margin-bottom:24px;">Spring/Summer collection — No. 04</div>
        <h1 class="serif" style="font-size:clamp(42px,6vw,76px);line-height:1.02;font-weight:500;letter-spacing:-.01em;margin-bottom:24px;">
          Objects built<br><span style="font-style:italic;color:var(--copper-bright);">to be kept,</span><br>not replaced.
        </h1>
        <p style="font-size:16px;color:var(--text-dim);max-width:440px;line-height:1.7;margin-bottom:36px;">
          Vespera designs the small technology you touch every day — headphones, carry, and desk objects machined from real materials and finished by hand.
        </p>
        <div style="display:flex;gap:14px;flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" onclick="navigate('catalog',{cat:'all'})">Shop the collection ${icon('arrow-right',15)}</button>
          <button class="btn btn-ghost btn-lg" onclick="navigate('product',{id:'p01'})">View Aria II</button>
        </div>
        <div style="display:flex;gap:36px;margin-top:56px;">
          <div><div class="serif" style="font-size:26px;">12k+</div><div class="mono" style="font-size:10.5px;color:var(--text-faint);letter-spacing:.08em;">OBJECTS SHIPPED</div></div>
          <div><div class="serif" style="font-size:26px;">4.8/5</div><div class="mono" style="font-size:10.5px;color:var(--text-faint);letter-spacing:.08em;">AVG. RATING</div></div>
          <div><div class="serif" style="font-size:26px;">7 yrs</div><div class="mono" style="font-size:10.5px;color:var(--text-faint);letter-spacing:.08em;">AVG. PRODUCT LIFE</div></div>
        </div>
      </div>
      <div style="position:relative;height:560px;" class="hero-visual">
        <div style="position:absolute;inset:0;border-radius:32px;overflow:hidden;background:linear-gradient(155deg,var(--surface),var(--ink-soft));">
          <img src="${img('hero-aria',900,1100)}" alt="Aria II Headphones in walnut finish" style="width:100%;height:100%;object-fit:cover;opacity:.92;">
        </div>
        <div class="glass reveal in" style="position:absolute;bottom:28px;left:-28px;padding:18px 22px;border-radius:var(--radius-md);max-width:230px;box-shadow:0 24px 48px -16px rgba(0,0,0,.5);">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="width:30px;height:30px;border-radius:50%;background:${MATERIALS.walnut.sw};flex:none;"></span>
            <span style="font-size:13px;font-weight:600;">Aria II — Walnut</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="mono" style="font-size:15px;font-weight:600;color:var(--copper-bright);">${fmt(429)}</span>
            ${starRow(4.8,12)}
          </div>
        </div>
        <div class="glass" style="position:absolute;top:24px;right:-20px;padding:14px 16px;border-radius:var(--radius-md);display:flex;align-items:center;gap:10px;">
          ${icon('truck',16)}<span style="font-size:12px;">Free shipping over $150</span>
        </div>
      </div>
    </div>
  </section>

  <section style="padding:120px 0 40px;">
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="eyebrow" style="margin-bottom:14px;">Shop by world</div>
          <h2 class="serif" style="font-size:clamp(28px,3.4vw,40px);font-weight:500;">Four categories. No clutter.</h2>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;" class="cat-grid">
        ${CATEGORIES.map((c,i)=>`
          <button onclick="navigate('catalog',{cat:'${c.id}'})" class="card reveal" style="aspect-ratio:3/4;position:relative;overflow:hidden;text-align:left;padding:0;cursor:pointer;"
            onmouseover="this.querySelector('img').style.transform='scale(1.07)'" onmouseout="this.querySelector('img').style.transform='scale(1)'">
            <img src="${img('cat-'+c.id,500,700)}" alt="" style="width:100%;height:100%;object-fit:cover;transition:transform .6s var(--ease);">
            <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(21,17,15,0.85), rgba(21,17,15,0.1) 50%);"></div>
            <div style="position:absolute;bottom:0;left:0;padding:22px;">
              <div class="serif" style="font-size:21px;color:#fff;margin-bottom:6px;">${c.name}</div>
              <div class="mono" style="font-size:10.5px;color:rgba(255,255,255,.7);letter-spacing:.06em;">EXPLORE →</div>
            </div>
          </button>`).join('')}
      </div>
    </div>
  </section>

  <section style="padding:100px 0;">
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="eyebrow" style="margin-bottom:14px;">Featured</div>
          <h2 class="serif" style="font-size:clamp(28px,3.4vw,40px);font-weight:500;">This season's collection</h2>
        </div>
        <button class="btn btn-ghost" onclick="navigate('catalog',{cat:'all'})">View all products</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;" class="product-grid">
        ${featured.map(productCard).join('')}
      </div>
    </div>
  </section>

  <section style="padding:40px 0 120px;">
    <div class="container">
      <div class="card reveal" style="background:linear-gradient(135deg, var(--burgundy) 0%, var(--ink-soft) 60%);border:none;border-radius:32px;padding:72px 60px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px;overflow:hidden;position:relative;">
        <div style="position:absolute;right:-60px;top:-60px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle, rgba(184,122,75,0.25), transparent 70%);"></div>
        <div style="position:relative;z-index:1;">
          <div class="eyebrow" style="margin-bottom:16px;color:var(--copper-bright);">Members get more</div>
          <h2 class="serif" style="font-size:clamp(26px,3.2vw,38px);color:#fff;margin-bottom:14px;max-width:480px;">Create an account for early access and member pricing.</h2>
          <p style="color:rgba(246,239,228,.7);font-size:14.5px;max-width:420px;">Track orders, save wishlists across devices, and get first access to limited finishes.</p>
        </div>
        <button class="btn btn-primary btn-lg" style="position:relative;z-index:1;" onclick="navigate('register')">Create free account</button>
      </div>
    </div>
  </section>

  <section style="padding:0 0 120px;" id="about-anchor">
    <div class="container">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;" class="about-grid">
        <div class="reveal">
          <div class="eyebrow" style="margin-bottom:18px;">Bestsellers</div>
          <h2 class="serif" style="font-size:clamp(26px,3vw,36px);margin-bottom:20px;">What people keep coming back for</h2>
          <p style="color:var(--text-dim);font-size:14.5px;line-height:1.7;margin-bottom:28px;max-width:440px;">
            Every Vespera object is designed to outlast the trend cycle — built from materials that age well and repaired, not replaced, when something wears out.
          </p>
          <button class="btn btn-dark" onclick="navigate('catalog',{cat:'all',sort:'rating'})">Shop bestsellers ${icon('arrow-right',15)}</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          ${bestsellers.map(p=>`
            <button onclick="navigate('product',{id:'${p.id}'})" class="card reveal" style="padding:16px;text-align:left;cursor:pointer;">
              <img src="${p.images[0]}" alt="${p.name}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:12px;">
              <div style="font-size:12.5px;font-weight:600;margin-bottom:4px;">${p.name}</div>
              <div class="mono" style="font-size:12px;color:var(--copper-bright);">${fmt(p.price)}</div>
            </button>`).join('')}
        </div>
      </div>
    </div>
  </section>
  `;
}

/* shared product card used across landing/catalog/recs */
function productCard(p){
  const wished = State.wishlist.includes(p.id);
  const outOfStock = p.stock===0;
  return `
  <div class="card reveal" style="overflow:hidden;display:flex;flex-direction:column;" onmouseover="this.style.borderColor='var(--copper-dim)';this.style.transform='translateY(-4px)';this.querySelector('.pc-img').style.transform='scale(1.06)'" onmouseout="this.style.borderColor='var(--line)';this.style.transform='translateY(0)';this.querySelector('.pc-img').style.transform='scale(1)'">
    <div style="position:relative;aspect-ratio:1;overflow:hidden;cursor:pointer;" onclick="navigate('product',{id:'${p.id}'})">
      <img class="pc-img" src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;transition:transform .5s var(--ease);${outOfStock?'opacity:.45;':''}">
      ${p.tag ? `<span class="badge ${p.tag==='Sale'?'badge-burgundy':'badge-copper'}" style="position:absolute;top:12px;left:12px;">${p.tag}</span>` : ''}
      ${outOfStock ? `<span class="badge badge-ivory" style="position:absolute;top:12px;left:12px;">Out of stock</span>` : ''}
      <button onclick="event.stopPropagation();toggleWishlist('${p.id}')" aria-label="Toggle wishlist" aria-pressed="${wished}"
        style="position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;background:rgba(21,17,15,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:${wished?'var(--copper-bright)':'#fff'};">
        <i data-lucide="heart" style="width:15px;height:15px;${wished?'fill:currentColor;':''}"></i>
      </button>
      <button onclick="event.stopPropagation();openQuickView('${p.id}')" class="mono"
        style="position:absolute;bottom:0;left:0;right:0;padding:10px;background:rgba(21,17,15,0.7);backdrop-filter:blur(8px);color:#fff;font-size:10.5px;letter-spacing:.08em;opacity:0;transition:opacity .3s var(--ease);"
        onmouseover="this.style.opacity='1'">QUICK VIEW</button>
    </div>
    <div style="padding:18px;flex:1;display:flex;flex-direction:column;cursor:pointer;" onclick="navigate('product',{id:'${p.id}'})">
      <div class="mono" style="font-size:10.5px;color:var(--text-faint);letter-spacing:.06em;margin-bottom:6px;">${CATEGORIES.find(c=>c.id===p.cat).name.toUpperCase()}</div>
      <div style="font-size:14.5px;font-weight:600;margin-bottom:8px;flex:1;">${p.name}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
        ${starRow(p.rating,12)}<span class="mono" style="font-size:10.5px;color:var(--text-faint);">(${p.reviews})</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="mono" style="font-size:15px;font-weight:700;color:${p.compareAt?'var(--copper-bright)':'var(--ivory)'};">${fmt(p.price)}</span>
        ${p.compareAt ? `<span class="mono" style="font-size:12.5px;color:var(--text-faint);text-decoration:line-through;">${fmt(p.compareAt)}</span>`:''}
      </div>
    </div>
  </div>`;
}
