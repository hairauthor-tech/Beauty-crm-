import { useState, useEffect } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Firebase ──────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBtEcQ69spy8Lp8R6ttJOX8krl1iH2j8X4",
  authDomain: "beauty-crm-8141c.firebaseapp.com",
  projectId: "beauty-crm-8141c",
  storageBucket: "beauty-crm-8141c.firebasestorage.app",
  messagingSenderId: "1011794290495",
  appId: "1:1011794290495:web:d5dac454ea696e4924158a"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Palette ───────────────────────────────────────────────────────
const C = {
  bg: "#111214", surface: "#18191C", card: "#1E2024", border: "#2C2F35",
  accent: "#A89BC2", accentSoft: "#C4BAD8", accentDim: "#6B6380",
  silver: "#C8CDD6", text: "#ECEEF2", textMuted: "#848A96", textDim: "#4E5460",
  success: "#7BAF8A", danger: "#B87070", warn: "#C4A46A",
};

const fmt = (n) => new Intl.NumberFormat("uk-UA").format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
const today = new Date().toISOString().slice(0, 10);

// ── Icons ─────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ic = {
  calendar: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  box: "M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  chart: "M3 3v18h18M7 16l4-4 4 4 4-4",
  services: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  warn: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  scissors: "M6 3a3 3 0 110 6 3 3 0 010-6zM18 3a3 3 0 110 6 3 3 0 010-6zM8.22 8.22l7.56 7.56M16.73 14.27l1.5 1.5a3 3 0 11-4.24 4.24l-1.5-1.5M7.27 9.73L5.77 8.23A3 3 0 111.53 4",
};

// ── Styles ────────────────────────────────────────────────────────
const st = {
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" },
  btn: (v = "primary") => ({
    padding: "9px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    fontSize: 13, transition: "all 0.15s", outline: "none", whiteSpace: "nowrap",
    background: v === "primary" ? C.accent : v === "danger" ? C.danger : "transparent",
    color: v === "ghost" ? C.textMuted : C.text,
    border: v === "ghost" ? `1px solid ${C.border}` : "none",
  }),
  input: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "9px 13px", color: C.text, fontSize: 14, width: "100%",
    boxSizing: "border-box", outline: "none",
  },
  label: { color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 5 },
  badge: (s) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: s === "done" ? "#7BAF8A22" : s === "cancelled" ? "#B8707022" : "#C4A46A22",
    color: s === "done" ? C.success : s === "cancelled" ? C.danger : C.warn,
  }),
};

// ── Modal ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div style={{ ...st.card, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", borderRadius: "16px 16px 0 0", boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4 }}><Icon d={ic.x} size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Appointment Form ──────────────────────────────────────────────
function ApptForm({ initial, services, onSave, onClose }) {
  const [f, setF] = useState(initial || { client: "", phone: "", serviceId: "", date: today, time: "10:00", note: "", status: "pending", paid: 0 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const svc = services.find(s => s.id === f.serviceId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div><label style={st.label}>Ім'я клієнтки</label><input style={st.input} value={f.client} onChange={e => set("client", e.target.value)} placeholder="Прізвище Ім'я" /></div>
      <div><label style={st.label}>Телефон</label><input style={st.input} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+380 xx xxx-xx-xx" /></div>
      <div>
        <label style={st.label}>Послуга</label>
        <select style={st.input} value={f.serviceId} onChange={e => set("serviceId", e.target.value)}>
          <option value="">— Оберіть послугу —</option>
          {services.map(sv => <option key={sv.id} value={sv.id}>{sv.name} — {fmt(sv.price)} грн</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={st.label}>Дата</label><input type="date" style={st.input} value={f.date} onChange={e => set("date", e.target.value)} /></div>
        <div><label style={st.label}>Час</label><input type="time" style={st.input} value={f.time} onChange={e => set("time", e.target.value)} /></div>
      </div>
      <div>
        <label style={st.label}>Статус</label>
        <select style={st.input} value={f.status} onChange={e => set("status", e.target.value)}>
          <option value="pending">Очікує</option>
          <option value="done">Виконано</option>
          <option value="cancelled">Скасовано</option>
        </select>
      </div>
      {f.status === "done" && <div><label style={st.label}>Оплачено (грн)</label><input type="number" style={st.input} value={f.paid} onChange={e => set("paid", +e.target.value)} /></div>}
      <div><label style={st.label}>Примітка</label><textarea style={{ ...st.input, height: 60, resize: "vertical" }} value={f.note} onChange={e => set("note", e.target.value)} /></div>
      {svc && <div style={{ background: C.surface, borderRadius: 8, padding: "10px 14px", color: C.textMuted, fontSize: 13 }}>
        Тривалість: {svc.duration} хв · Вартість: {fmt(svc.price)} грн
      </div>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={st.btn("ghost")} onClick={onClose}>Скасувати</button>
        <button style={st.btn()} onClick={() => { if (f.client && f.date && f.serviceId) { onSave(f); onClose(); } }}>Зберегти</button>
      </div>
    </div>
  );
}

// ── Service Form ──────────────────────────────────────────────────
function ServiceForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name: "", price: 0, duration: 60 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div><label style={st.label}>Назва послуги</label><input style={st.input} value={f.name} onChange={e => set("name", e.target.value)} placeholder="Стрижка, Фарбування..." /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={st.label}>Ціна (грн)</label><input type="number" style={st.input} value={f.price} onChange={e => set("price", +e.target.value)} /></div>
        <div><label style={st.label}>Тривалість (хв)</label><input type="number" style={st.input} value={f.duration} onChange={e => set("duration", +e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={st.btn("ghost")} onClick={onClose}>Скасувати</button>
        <button style={st.btn()} onClick={() => { if (f.name && f.price) { onSave(f); onClose(); } }}>Зберегти</button>
      </div>
    </div>
  );
}

// ── Material Form ─────────────────────────────────────────────────
const MAT_CATS = ["Фарби", "Окислювачі", "Порошки", "Шампуні", "Маски", "Кондиціонери", "Стайлінг", "Інше"];

function MatForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name: "", category: "Фарби", qty: 0, unit: "шт", price: 0, minQty: 1 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div><label style={st.label}>Назва</label><input style={st.input} value={f.name} onChange={e => set("name", e.target.value)} placeholder="Фарба Wella 8/0" /></div>
      <div><label style={st.label}>Категорія</label>
        <select style={st.input} value={f.category} onChange={e => set("category", e.target.value)}>
          {MAT_CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div><label style={st.label}>Кількість</label><input type="number" style={st.input} value={f.qty} onChange={e => set("qty", +e.target.value)} /></div>
        <div><label style={st.label}>Од.</label><input style={st.input} value={f.unit} onChange={e => set("unit", e.target.value)} placeholder="шт" /></div>
        <div><label style={st.label}>Мін.</label><input type="number" style={st.input} value={f.minQty} onChange={e => set("minQty", +e.target.value)} /></div>
      </div>
      <div><label style={st.label}>Ціна закупки (грн)</label><input type="number" style={st.input} value={f.price} onChange={e => set("price", +e.target.value)} /></div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={st.btn("ghost")} onClick={onClose}>Скасувати</button>
        <button style={st.btn()} onClick={() => { if (f.name) { onSave(f); onClose(); } }}>Зберегти</button>
      </div>
    </div>
  );
}

// ── Calendar Tab ──────────────────────────────────────────────────
function CalendarTab({ services }) {
  const [appts, setAppts] = useState([]);
  const [modal, setModal] = useState(false);
  const [editT, setEditT] = useState(null);
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("date"), orderBy("time"));
    const unsub = onSnapshot(q, snap => {
      setAppts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const list = appts.filter(a => a.date === date).sort((a, b) => a.time.localeCompare(b.time));

  const save = async (form) => {
    if (editT) {
      await updateDoc(doc(db, "appointments", editT.id), form);
    } else {
      await addDoc(collection(db, "appointments"), form);
    }
    setEditT(null);
  };

  const remove = async (id) => { if (window.confirm("Видалити запис?")) await deleteDoc(doc(db, "appointments", id)); };
  const markDone = async (a) => {
    const svc = services.find(s => s.id === a.serviceId);
    await updateDoc(doc(db, "appointments", a.id), { status: "done", paid: svc?.price || 0 });
  };

  const labels = { pending: "Очікує", done: "Виконано", cancelled: "Скасовано" };

  return (
    <div>
      {(modal || editT) && (
        <Modal title={editT ? "Редагувати запис" : "Новий запис"} onClose={() => { setModal(false); setEditT(null); }}>
          <ApptForm initial={editT} services={services} onSave={save} onClose={() => { setModal(false); setEditT(null); }} />
        </Modal>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input type="date" style={{ ...st.input, width: "auto", flex: 1 }} value={date} onChange={e => setDate(e.target.value)} />
        <button style={st.btn()} onClick={() => { setEditT(null); setModal(true); }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon d={ic.plus} size={14} />Новий запис</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Завантаження...</div>
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", color: C.textDim, padding: "60px 0", fontSize: 15 }}>На цей день записів немає</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {list.map(a => {
            const svc = services.find(sv => sv.id === a.serviceId);
            const barColor = a.status === "done" ? C.success : a.status === "cancelled" ? C.danger : C.accent;
            return (
              <div key={a.id} style={{ ...st.card, borderLeft: `3px solid ${barColor}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ minWidth: 48, textAlign: "center" }}>
                    <div style={{ color: C.accentSoft, fontWeight: 800, fontSize: 16 }}>{a.time}</div>
                    <div style={{ color: C.textDim, fontSize: 10 }}>{svc?.duration}хв</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{a.client}</span>
                      <span style={st.badge(a.status)}>{labels[a.status]}</span>
                    </div>
                    <div style={{ color: C.textMuted, fontSize: 12 }}>{svc?.name} · {a.phone}</div>
                    {a.note && <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>📝 {a.note}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: C.silver, fontWeight: 700, fontSize: 15 }}>{fmt(svc?.price || 0)} грн</div>
                    {a.status === "done" && <div style={{ color: C.success, fontSize: 11 }}>✓ Оплачено</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
                  {a.status === "pending" && (
                    <button style={{ ...st.btn("ghost"), padding: "5px 10px", fontSize: 12 }} onClick={() => markDone(a)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.success }}><Icon d={ic.check} size={13} color={C.success} />Виконано</span>
                    </button>
                  )}
                  <button style={{ ...st.btn("ghost"), padding: "5px 10px" }} onClick={() => setEditT(a)}><Icon d={ic.edit} size={13} /></button>
                  <button style={{ ...st.btn("ghost"), padding: "5px 10px" }} onClick={() => remove(a.id)}><Icon d={ic.trash} size={13} color={C.danger} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Services Tab ──────────────────────────────────────────────────
function ServicesTab({ services, setServices }) {
  const [modal, setModal] = useState(false);
  const [editT, setEditT] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), snap => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const save = async (form) => {
    if (editT) await updateDoc(doc(db, "services", editT.id), form);
    else await addDoc(collection(db, "services"), form);
    setEditT(null);
  };

  const remove = async (id) => { if (window.confirm("Видалити послугу?")) await deleteDoc(doc(db, "services", id)); };

  return (
    <div>
      {(modal || editT) && (
        <Modal title={editT ? "Редагувати послугу" : "Нова послуга"} onClose={() => { setModal(false); setEditT(null); }}>
          <ServiceForm initial={editT} onSave={save} onClose={() => { setModal(false); setEditT(null); }} />
        </Modal>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <button style={st.btn()} onClick={() => { setEditT(null); setModal(true); }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Icon d={ic.plus} size={14} />Додати послугу</span>
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Завантаження...</div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", color: C.textDim, padding: "60px 0" }}>Послуг поки немає — додай першу!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {services.sort((a, b) => a.name.localeCompare(b.name)).map(sv => (
            <div key={sv.id} style={{ ...st.card, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text, fontWeight: 600, fontSize: 15 }}>{sv.name}</div>
                <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>⏱ {sv.duration} хв</div>
              </div>
              <div style={{ color: C.silver, fontWeight: 700, fontSize: 16, minWidth: 90, textAlign: "right" }}>{fmt(sv.price)} грн</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...st.btn("ghost"), padding: "6px 10px" }} onClick={() => setEditT(sv)}><Icon d={ic.edit} size={13} /></button>
                <button style={{ ...st.btn("ghost"), padding: "6px 10px" }} onClick={() => remove(sv.id)}><Icon d={ic.trash} size={13} color={C.danger} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Materials Tab ─────────────────────────────────────────────────
function MaterialsTab() {
  const [mats, setMats] = useState([]);
  const [modal, setModal] = useState(false);
  const [editT, setEditT] = useState(null);
  const [cat, setCat] = useState("Всі");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "materials"), snap => {
      setMats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const save = async (form) => {
    if (editT) await updateDoc(doc(db, "materials", editT.id), form);
    else await addDoc(collection(db, "materials"), form);
    setEditT(null);
  };

  const remove = async (id) => { if (window.confirm("Видалити матеріал?")) await deleteDoc(doc(db, "materials", id)); };

  const low = mats.filter(m => m.qty <= m.minQty);
  const filtered = mats.filter(m => cat === "Всі" || m.category === cat);
  const grouped = MAT_CATS.map(c => ({ c, items: filtered.filter(m => m.category === c) })).filter(g => g.items.length > 0);

  return (
    <div>
      {(modal || editT) && (
        <Modal title={editT ? "Редагувати матеріал" : "Додати матеріал"} onClose={() => { setModal(false); setEditT(null); }}>
          <MatForm initial={editT} onSave={save} onClose={() => { setModal(false); setEditT(null); }} />
        </Modal>
      )}
      {low.length > 0 && (
        <div style={{ background: `${C.danger}12`, border: `1px solid ${C.danger}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon d={ic.warn} size={16} color={C.danger} />
          <span style={{ color: C.danger, fontSize: 13 }}>Закінчується: {low.map(m => m.name).join(", ")}</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {["Всі", ...MAT_CATS].map(c => (
          <button key={c} style={{ ...st.btn(cat === c ? "primary" : "ghost"), padding: "6px 12px", fontSize: 12, flexShrink: 0 }} onClick={() => setCat(c)}>{c}</button>
        ))}
        <button style={{ ...st.btn(), padding: "6px 12px", fontSize: 12, flexShrink: 0, marginLeft: "auto" }} onClick={() => { setEditT(null); setModal(true); }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon d={ic.plus} size={13} />Додати</span>
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: C.textDim, padding: "40px 0" }}>Завантаження...</div>
      ) : (
        (cat === "Всі" ? grouped : [{ c: cat, items: filtered }]).map(({ c, items }) => (
          <div key={c} style={{ marginBottom: 20 }}>
            <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>{c}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {items.map(m => {
                const isLow = m.qty <= m.minQty;
                return (
                  <div key={m.id} style={{ ...st.card, display: "flex", alignItems: "center", gap: 10, borderLeft: `3px solid ${isLow ? C.danger : C.border}` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: C.text, fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                      {isLow && <span style={{ ...st.badge("cancelled"), marginLeft: 8, fontSize: 10 }}>Мало</span>}
                    </div>
                    <div style={{ color: isLow ? C.danger : C.accentSoft, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{m.qty} {m.unit}</div>
                    <div style={{ color: C.silver, fontSize: 13, whiteSpace: "nowrap" }}>{fmt(m.price)} грн</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button style={{ ...st.btn("ghost"), padding: "5px 8px" }} onClick={() => setEditT(m)}><Icon d={ic.edit} size={12} /></button>
                      <button style={{ ...st.btn("ghost"), padding: "5px 8px" }} onClick={() => remove(m.id)}><Icon d={ic.trash} size={12} color={C.danger} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────
function AnalyticsTab({ services }) {
  const [appts, setAppts] = useState([]);
  const [mats, setMats] = useState([]);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    const u1 = onSnapshot(collection(db, "appointments"), s => setAppts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(collection(db, "materials"), s => setMats(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  }, []);

  const now = new Date();
  const done = appts.filter(a => {
    if (a.status !== "done") return false;
    const d = new Date(a.date);
    if (period === "week") { const w = new Date(now); w.setDate(now.getDate() - 7); return d >= w; }
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return d.getFullYear() === now.getFullYear();
  });

  const revenue = done.reduce((s, a) => s + (a.paid || services.find(sv => sv.id === a.serviceId)?.price || 0), 0);
  const matsCost = mats.reduce((s, m) => s + m.price * m.qty, 0);
  const avg = done.length ? Math.round(revenue / done.length) : 0;

  const byService = services.map(sv => {
    const count = done.filter(a => a.serviceId === sv.id).length;
    return { ...sv, count, revenue: count * sv.price };
  }).filter(sv => sv.count > 0).sort((a, b) => b.revenue - a.revenue);

  const byDay = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((label, i) => {
    const dn = (i + 1) % 7;
    const rev = done.filter(a => new Date(a.date).getDay() === dn).reduce((s, a) => s + (services.find(sv => sv.id === a.serviceId)?.price || 0), 0);
    return { label, rev };
  });
  const maxBar = Math.max(...byDay.map(d => d.rev), 1);
  const maxSvc = Math.max(...byService.map(s => s.revenue), 1);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto" }}>
        {[["week", "Тиждень"], ["month", "Місяць"], ["year", "Рік"]].map(([k, l]) => (
          <button key={k} style={{ ...st.btn(period === k ? "primary" : "ghost"), fontSize: 13, flexShrink: 0 }} onClick={() => setPeriod(k)}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Виручка", value: `${fmt(revenue)} грн`, sub: `${done.length} послуг`, color: C.silver },
          { label: "Середній чек", value: `${fmt(avg)} грн`, color: C.accentSoft },
          { label: "Вартість складу", value: `${fmt(matsCost)} грн`, color: C.textMuted },
          { label: "Клієнтів", value: done.length, color: C.accentDim },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ ...st.card, textAlign: "center" }}>
            <div style={{ color, fontWeight: 800, fontSize: 20, marginBottom: 3 }}>{value}</div>
            <div style={{ color: C.text, fontWeight: 600, fontSize: 12 }}>{label}</div>
            {sub && <div style={{ color: C.textMuted, fontSize: 11 }}>{sub}</div>}
          </div>
        ))}
      </div>
      <div style={{ ...st.card, marginBottom: 14 }}>
        <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>По днях тижня</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
          {byDay.map(({ label, rev }) => (
            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, color: C.textDim }}>{rev > 0 ? `${Math.round(rev / 100) * 100 >= 1000 ? `${(rev / 1000).toFixed(1)}к` : rev}` : ""}</div>
              <div style={{ width: "100%", background: rev > 0 ? `linear-gradient(to top,${C.accentDim},${C.accent})` : C.border, borderRadius: "3px 3px 0 0", height: `${Math.max((rev / maxBar) * 70, rev > 0 ? 4 : 2)}px` }} />
              <div style={{ fontSize: 10, color: C.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={st.card}>
        <div style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 14 }}>Послуги</div>
        {byService.length === 0 ? (
          <div style={{ color: C.textDim, textAlign: "center", padding: "20px 0" }}>Немає даних за цей період</div>
        ) : byService.map(sv => (
          <div key={sv.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: C.text, fontSize: 13 }}>{sv.name} <span style={{ color: C.textDim }}>×{sv.count}</span></span>
              <span style={{ color: C.silver, fontWeight: 700 }}>{fmt(sv.revenue)} грн</span>
            </div>
            <div style={{ background: C.border, borderRadius: 3, height: 4, overflow: "hidden" }}>
              <div style={{ width: `${(sv.revenue / maxSvc) * 100}%`, height: "100%", background: `linear-gradient(to right,${C.accentDim},${C.accentSoft})`, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function BeautyCRM() {
  const [tab, setTab] = useState("calendar");
  const [services, setServices] = useState([]);

  const nav = [
    { id: "calendar", icon: ic.calendar, label: "Записи" },
    { id: "services", icon: ic.services, label: "Послуги" },
    { id: "materials", icon: ic.box, label: "Склад" },
    { id: "analytics", icon: ic.chart, label: "Аналітика" },
  ];

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden", background: C.bg, color: C.text, fontFamily: "-apple-system,BlinkMacSystemFont,'Inter',sans-serif", paddingBottom: 70 }}>
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: `linear-gradient(135deg,${C.accentDim},${C.accent})`, borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={ic.scissors} size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>Beauty CRM</div>
            <div style={{ color: C.textDim, fontSize: 10 }}>{fmtDate(today)}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px" }}>
        {tab === "calendar" && <CalendarTab services={services} />}
        {tab === "services" && <ServicesTab services={services} setServices={setServices} />}
        {tab === "materials" && <MaterialsTab />}
        {tab === "analytics" && <AnalyticsTab services={services} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 50 }}>
        {nav.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 4px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: tab === id ? C.accentSoft : C.textDim,
          }}>
            <Icon d={icon} size={20} color={tab === id ? C.accentSoft : C.textDim} />
            <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 500 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
