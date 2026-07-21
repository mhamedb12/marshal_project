/* ===================================================
   بستان — متجر النباتات والمنتجات الزراعية
   ملف الجافاسكربت المشترك بين جميع الصفحات
=================================================== */

/* -------- بيانات المنتجات (مستخدمة في صفحة المنتجات والرئيسية) -------- */
const PRODUCTS = [
  { name: "نبات الزاميا",     cat: "نباتات داخلية",     desc: "يتحمل الإضاءة المنخفضة، مثالي للمكاتب والمنازل.", price: 95  },
  { name: "نبات البوتس",      cat: "نباتات داخلية",     desc: "سهل العناية، ينقّي الهواء وينمو بسرعة.",           price: 60  },
  { name: "نبات الثعبان",     cat: "نباتات داخلية",     desc: "يعيش بأقل قدر من الري والضوء.",                    price: 70  },
  { name: "صبار مصغّر",       cat: "نباتات داخلية",     desc: "مجموعة صبار صغير أنيق لطاولة المكتب.",             price: 45  },
  { name: "نخيل الزينة",      cat: "نباتات خارجية",     desc: "يضيف طابعًا استوائيًا مميزًا لحديقتك.",            price: 180 },
  { name: "شجرة الليمون",     cat: "نباتات خارجية",     desc: "تثمر موسميًا وتحتاج إلى شمس كاملة.",               price: 220 },
  { name: "ورد جوري",         cat: "نباتات خارجية",     desc: "شتلة ورد عطري متوفرة بألوان متعددة.",              price: 55  },
  { name: "ياسمين متسلّق",    cat: "نباتات خارجية",     desc: "مثالي لتغطية الأسوار والعرائش.",                   price: 75  },
  { name: "بذور طماطم",       cat: "بذور",              desc: "عبوة بذور طماطم عضوية عالية نسبة الإنبات.",        price: 12  },
  { name: "بذور ريحان",       cat: "بذور",              desc: "مناسبة للزراعة المنزلية وأطباق المطبخ.",           price: 10  },
  { name: "بذور خس",          cat: "بذور",              desc: "إنبات سريع، مناسبة للأصص الصغيرة.",                price: 9   },
  { name: "سماد عضوي",        cat: "أسمدة ومستلزمات",   desc: "كيس 5 كجم لتغذية التربة بشكل طبيعي.",              price: 35  },
  { name: "تربة زراعية",      cat: "أسمدة ومستلزمات",   desc: "مزيج تربة جاهز وغني بالمغذيات.",                   price: 28  },
  { name: "أدوات تقليم",      cat: "أسمدة ومستلزمات",   desc: "مقص تقليم احترافي مقاوم للصدأ.",                   price: 49  },
  { name: "رشّاش ماء يدوي",   cat: "أسمدة ومستلزمات",   desc: "لرذاذ ماء لطيف يناسب النباتات الحساسة.",           price: 22  },
  { name: "أصيص فخاري",       cat: "أسمدة ومستلزمات",   desc: "أصيص تراكوتا متوسط الحجم مع صحن تصريف.",          price: 18  }
];

/* أيقونة ورقة تستخدم داخل كل بطاقة منتج */
const LEAF_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke-width="1.4">
    <path d="M12 21c0-8 4-14 9-16 0 9-4 15-9 16Zm0 0c0-8-4-14-9-16 0 9 4 15 9 16Z"/>
  </svg>`;

/* عدّاد السلة في الذاكرة (يبدأ من صفر في كل صفحة لعدم توفر خادم) */
let cartCount = 0;

/* -------- بناء بطاقة منتج واحدة -------- */
function buildProductCard(p) {
  return `
    <div class="product-card">
      <div class="product-media">${LEAF_ICON}</div>
      <div class="product-body">
        <span class="product-tag">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-foot">
          <span class="price">${p.price} ر.س</span>
          <button class="add-btn" onclick="addToCart(this, '${p.name}')">أضف للسلة</button>
        </div>
      </div>
    </div>`;
}

/* -------- عرض منتجات مختارة في الصفحة الرئيسية -------- */
function renderFeaturedProducts(containerId, count = 4) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = PRODUCTS.slice(0, count).map(buildProductCard).join("");
}

/* -------- عرض كل المنتجات مع دعم الفلترة في صفحة المنتجات -------- */
function renderAllProducts(containerId, filter = "الكل") {
  const el = document.getElementById(containerId);
  if (!el) return;
  const list = filter === "الكل" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  el.innerHTML = list.length
    ? list.map(buildProductCard).join("")
    : `<p style="text-align:center; color:var(--text-soft); grid-column:1/-1;">لا توجد منتجات في هذه الفئة حاليًا.</p>`;
}

/* -------- ربط أزرار الفلترة -------- */
function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderAllProducts("all-products", btn.dataset.filter);
    });
  });
}

/* -------- إضافة منتج للسلة -------- */
function addToCart(btn, name) {
  cartCount++;
  const counter = document.getElementById("cart-count");
  if (counter) counter.textContent = cartCount;

  if (btn) {
    const original = btn.textContent;
    btn.textContent = "أُضيف ✓";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("added");
    }, 1200);
  }
  showToast(`تمت إضافة "${name}" إلى السلة`);
}

/* -------- تنبيه Toast بسيط -------- */
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* -------- تبديل قائمة الجوال -------- */
function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

/* -------- التحقق من نموذج تسجيل الدخول -------- */
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const emailField = document.getElementById("email");
  const passField = document.getElementById("password");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const emailWrap = emailField.closest(".field");
    const passWrap = passField.closest(".field");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      emailWrap.classList.add("invalid");
      valid = false;
    } else {
      emailWrap.classList.remove("invalid");
    }

    if (passField.value.trim().length < 6) {
      passWrap.classList.add("invalid");
      valid = false;
    } else {
      passWrap.classList.remove("invalid");
    }

    if (!valid) {
      showToast("يرجى تصحيح البيانات المُدخلة");
      return;
    }

    const successBox = document.getElementById("form-success");
    if (successBox) successBox.classList.add("show");
    form.reset();
    showToast("تم تسجيل الدخول بنجاح (عرض تجريبي)");
  });
}

/* -------- تشغيل عام عند تحميل أي صفحة -------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initFilters();
  initLoginForm();
});
