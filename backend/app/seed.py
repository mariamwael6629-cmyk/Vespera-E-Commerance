from app.core.security import hash_password
from app.database import SessionLocal
from app.core.config import settings
from app.models.order import Order, OrderItem
from app.models.product import Category, Product
from app.models.promo import PromoCode
from app.models.review import Review
from app.models.user import User, UserRole

CATEGORIES = [
    {"id": "audio", "name": "Audio", "description": "Headphones, speakers, and listening objects"},
    {"id": "carry", "name": "Carry", "description": "Leather sleeves, bags, and device cases"},
    {"id": "desk", "name": "Desk", "description": "Stands, trays, and considered hardware"},
    {"id": "wearables", "name": "Wearables", "description": "Straps, bands, and quiet tech"},
]


def _img(seed: str, w: int = 800, h: int = 800) -> str:
    return f"https://picsum.photos/seed/{seed}/{w}/{h}"


PRODUCTS = [
    {"id": "p01", "name": "Aria II Headphones", "category_id": "audio", "price": 429, "compare_at": 480,
     "rating": 4.8, "reviews_count": 212, "tag": "Bestseller", "materials": ["obsidian", "walnut", "burgundy"],
     "stock": 14,
     "description": "Hand-finished walnut earcups around a 40mm beryllium driver. Aria II is tuned for warmth without losing detail — built for rooms, not gyms.",
     "specs": {"Driver": "40mm beryllium-coated", "Battery": "38 hrs", "Weight": "284g", "Connectivity": "Bluetooth 5.3, 3.5mm"},
     "images": [_img("aria1"), _img("aria2"), _img("aria3"), _img("aria4")]},
    {"id": "p02", "name": 'Folio Sleeve — 14"', "category_id": "carry", "price": 189, "compare_at": None,
     "rating": 4.9, "reviews_count": 98, "tag": "New", "materials": ["burgundy", "obsidian", "copper"], "stock": 31,
     "description": "Full-grain leather, vegetable tanned, that darkens beautifully with use. A single seam, no branding, just a quiet copper pull-tab.",
     "specs": {"Material": "Full-grain leather", "Fit": '13"–14" laptops', "Lining": "Brushed wool felt", "Origin": "Made in Portugal"},
     "images": [_img("folio1"), _img("folio2"), _img("folio3"), _img("folio4")]},
    {"id": "p03", "name": "Monolith Stand", "category_id": "desk", "price": 159, "compare_at": None,
     "rating": 4.7, "reviews_count": 64, "tag": None, "materials": ["obsidian", "slate", "walnut"], "stock": 22,
     "description": "A single block of resin-cast stone, milled to hold any laptop at a 12° typing angle. Cools passively. Sits like furniture, not hardware.",
     "specs": {"Material": "Cast composite stone", "Angle": "12°", "Weight": "1.2kg", "Compatibility": '11"–16" laptops'},
     "images": [_img("mono1"), _img("mono2"), _img("mono3"), _img("mono4")]},
    {"id": "p04", "name": "Cusp Earbuds", "category_id": "audio", "price": 249, "compare_at": 289,
     "rating": 4.6, "reviews_count": 341, "tag": "Sale", "materials": ["ivory", "obsidian", "copper"], "stock": 8,
     "description": "Ceramic-shelled earbuds with adaptive noise cancellation tuned across three listening profiles. The case doubles as a wireless charging puck.",
     "specs": {"ANC": "Adaptive, 3 profiles", "Battery": "6h + 24h case", "Charging": "USB-C, Qi", "Water rating": "IPX4"},
     "images": [_img("cusp1"), _img("cusp2"), _img("cusp3"), _img("cusp4")]},
    {"id": "p05", "name": "Strand Watch Band", "category_id": "wearables", "price": 89, "compare_at": None,
     "rating": 4.5, "reviews_count": 52, "tag": None, "materials": ["burgundy", "walnut", "slate"], "stock": 46,
     "description": "Woven Italian leather strand-strap with a brushed copper clasp. Fits all standard 20mm lug watches and most smartwatches.",
     "specs": {"Width": "20mm", "Material": "Woven leather", "Clasp": "Brushed copper", "Adjustable": "6 positions"},
     "images": [_img("strand1"), _img("strand2"), _img("strand3"), _img("strand4")]},
    {"id": "p06", "name": "Ledger Tray", "category_id": "desk", "price": 119, "compare_at": None,
     "rating": 4.9, "reviews_count": 39, "tag": "New", "materials": ["walnut", "obsidian", "ivory"], "stock": 17,
     "description": "A catch-all valet tray in solid walnut with a felt-lined recess for watches, rings, and the small things that pile up by your keyboard.",
     "specs": {"Material": "Solid walnut", "Dimensions": "24×14×3cm", "Lining": "Wool felt", "Finish": "Hand-oiled"},
     "images": [_img("ledger1"), _img("ledger2"), _img("ledger3"), _img("ledger4")]},
    {"id": "p07", "name": "Halcyon Speaker", "category_id": "audio", "price": 599, "compare_at": 649,
     "rating": 4.8, "reviews_count": 127, "tag": "Sale", "materials": ["obsidian", "burgundy", "slate"], "stock": 11,
     "description": "A single full-range driver inside a cast aluminum body wrapped in wool. Fills a room evenly without a subwoofer's bloat.",
     "specs": {"Driver": 'Full-range 4"', "Power": "60W class D", "Connectivity": "Wi-Fi, Bluetooth 5.3", "Weight": "2.1kg"},
     "images": [_img("halc1"), _img("halc2"), _img("halc3"), _img("halc4")]},
    {"id": "p08", "name": "Weekender Carryall", "category_id": "carry", "price": 349, "compare_at": None,
     "rating": 4.7, "reviews_count": 76, "tag": None, "materials": ["burgundy", "walnut", "obsidian"], "stock": 9,
     "description": "A 38-litre weekend bag in waxed canvas and leather trim, built around a padded laptop sleeve and a separate shoe compartment.",
     "specs": {"Capacity": "38L", "Material": "Waxed canvas, leather trim", "Laptop sleeve": 'Up to 16"', "Strap": "Detachable, adjustable"},
     "images": [_img("week1"), _img("week2"), _img("week3"), _img("week4")]},
    {"id": "p09", "name": "Cradle Charging Dock", "category_id": "desk", "price": 99, "compare_at": None,
     "rating": 4.4, "reviews_count": 58, "tag": None, "materials": ["obsidian", "copper", "ivory"], "stock": 0,
     "description": "Three-coil wireless charging dock machined from a single aluminum block, finished to match Aria II and Cusp.",
     "specs": {"Output": "15W phone, 5W buds, 3W watch", "Material": "Anodized aluminum", "Cable": "2m braided USB-C", "Compatibility": "Qi-enabled devices"},
     "images": [_img("cradle1"), _img("cradle2"), _img("cradle3"), _img("cradle4")]},
    {"id": "p10", "name": "Quill Stylus", "category_id": "wearables", "price": 129, "compare_at": 149,
     "rating": 4.6, "reviews_count": 88, "tag": "Sale", "materials": ["walnut", "obsidian", "burgundy"], "stock": 25,
     "description": "A pressure-sensitive stylus turned from solid walnut around an aluminum core, magnetically charging and pairing in one motion.",
     "specs": {"Pressure levels": "4096", "Battery": "2 weeks", "Charging": "Magnetic dock", "Compatibility": "Most tablets"},
     "images": [_img("quill1"), _img("quill2"), _img("quill3"), _img("quill4")]},
    {"id": "p11", "name": "Aria II — Travel Case", "category_id": "carry", "price": 69, "compare_at": None,
     "rating": 4.8, "reviews_count": 44, "tag": None, "materials": ["obsidian", "burgundy"], "stock": 38,
     "description": "A molded EVA case wrapped in the same leather as Folio, shaped precisely for Aria II's earcups and folded headband.",
     "specs": {"Material": "EVA + leather wrap", "Fit": "Aria II only", "Closure": "Magnetic flap", "Interior": "Microsuede lining"},
     "images": [_img("case1"), _img("case2"), _img("case3"), _img("case4")]},
    {"id": "p12", "name": "Plinth Phone Stand", "category_id": "desk", "price": 59, "compare_at": None,
     "rating": 4.3, "reviews_count": 29, "tag": None, "materials": ["slate", "walnut", "obsidian"], "stock": 54,
     "description": "A minimal, weighted phone stand for calls, video, and counter-top recipes. Two viewing angles, no moving parts.",
     "specs": {"Material": "Cast resin + steel base", "Angles": "2 fixed positions", "Compatibility": "All phone sizes", "Weight": "310g"},
     "images": [_img("plinth1"), _img("plinth2"), _img("plinth3"), _img("plinth4")]},
]

REVIEWS_POOL = [
    {"author_name": "Mariam K.", "rating": 5, "title": "Worth every cent",
     "body": "The walnut earcups are exactly as described — warm, detailed sound and they look incredible on a desk when not in use."},
    {"author_name": "Theo R.", "rating": 5, "title": "Better than the brand I switched from",
     "body": "Comfortable for long sessions and the battery genuinely lasts the stated time. No notes."},
    {"author_name": "Priya S.", "rating": 4, "title": "Beautiful, slightly heavy",
     "body": "Build quality is outstanding. Wish it were a touch lighter for travel but I'm not sending it back."},
    {"author_name": "Daniel O.", "rating": 5, "title": "Exceeded expectations",
     "body": "Packaging alone felt premium. The product matches it. Already looking at the speaker next."},
    {"author_name": "Yusuf A.", "rating": 4, "title": "Great everyday piece",
     "body": "Subtle, well-made, does the job without shouting about it. Exactly what I wanted."},
]

PROMO_CODES = [
    {"code": "WELCOME10", "type": "percent", "value": 10, "uses": 842, "usage_limit": 5000, "active": True, "expires": "2026-12-31"},
    {"code": "SUMMER25", "type": "percent", "value": 25, "uses": 301, "usage_limit": 1000, "active": True, "expires": "2026-08-31"},
    {"code": "FREESHIP", "type": "shipping", "value": 100, "uses": 1209, "usage_limit": None, "active": True, "expires": None},
    {"code": "VIP50", "type": "fixed", "value": 50, "uses": 44, "usage_limit": 200, "active": False, "expires": "2026-03-01"},
]

DEMO_ORDERS = [
    {"id": "VS-10482", "status": "delivered", "total": 618, "items": [{"product_id": "p01", "qty": 1, "material": "walnut"}, {"product_id": "p11", "qty": 1, "material": "obsidian"}]},
    {"id": "VS-10417", "status": "shipped", "total": 159, "items": [{"product_id": "p03", "qty": 1, "material": "slate"}]},
    {"id": "VS-10309", "status": "processing", "total": 349, "items": [{"product_id": "p08", "qty": 1, "material": "burgundy"}]},
    {"id": "VS-10201", "status": "delivered", "total": 338, "items": [{"product_id": "p05", "qty": 2, "material": "walnut"}, {"product_id": "p12", "qty": 1, "material": "slate"}]},
]


def run_seed():
    db = SessionLocal()
    try:
        if db.query(Category).count() == 0:
            for cat in CATEGORIES:
                db.add(Category(**cat))
            db.commit()

        if db.query(Product).count() == 0:
            for product in PRODUCTS:
                db.add(Product(**product))
            db.commit()

            for product in PRODUCTS:
                for i in range(5):
                    base = REVIEWS_POOL[i % len(REVIEWS_POOL)]
                    db.add(Review(product_id=product["id"], author_name=base["author_name"],
                                   rating=base["rating"], title=base["title"], body=base["body"]))
            db.commit()

        if db.query(PromoCode).count() == 0:
            for promo in PROMO_CODES:
                db.add(PromoCode(**promo))
            db.commit()

        admin_user = db.query(User).filter(User.email == settings.admin_email).first()
        if not admin_user:
            admin_user = User(
                name=settings.admin_name,
                email=settings.admin_email,
                hashed_password=hash_password(settings.admin_password),
                role=UserRole.admin,
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)

        demo_user = db.query(User).filter(User.email == settings.demo_email).first()
        if not demo_user:
            demo_user = User(
                name=settings.demo_name,
                email=settings.demo_email,
                hashed_password=hash_password(settings.demo_password),
                role=UserRole.customer,
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            for order in DEMO_ORDERS:
                product_lookup = {p["id"]: p for p in PRODUCTS}
                items = [
                    OrderItem(
                        product_id=item["product_id"],
                        material=item["material"],
                        qty=item["qty"],
                        price=product_lookup[item["product_id"]]["price"],
                    )
                    for item in order["items"]
                ]
                db.add(Order(
                    id=order["id"],
                    user_id=demo_user.id,
                    status=order["status"],
                    subtotal=order["total"],
                    discount=0,
                    shipping_cost=0,
                    total=order["total"],
                    shipping_address={
                        "name": demo_user.name,
                        "email": demo_user.email,
                        "address": "123 Considered Ave",
                        "city": "Lisbon",
                        "state": "LX",
                        "zip": "1000-001",
                        "method": "standard",
                    },
                    payment_last4="4242",
                    items=items,
                ))
            db.commit()
    finally:
        db.close()
