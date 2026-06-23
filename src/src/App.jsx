import { useState } from "react";

// ─── Палітра: холодний сірий + попелясто-лавандовий акцент + майже-білий текст
const C = {
  bg:          "#111214",
  surface:     "#18191C",
  card:        "#1E2024",
  cardHover:   "#23262B",
  border:      "#2C2F35",
  borderLight: "#363A42",
  accent:      "#A89BC2",   // пильний лавандово-сірий
  accentSoft:  "#C4BAD8",
  accentDim:   "#6B6380",
  silver:      "#C8CDD6",
  text:        "#ECEEF2",
  textMuted:   "#848A96",
  textDim:     "#4E5460",
  success:     "#7BAF8A",
  danger:      "#B87070",
  warn:        "#C4A46A",
};

const fmt = (n) => new Intl.NumberFormat("uk-UA").format(n);
const fmtDate = (d) => new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().slice(0, 10);

const SERVICES = [
  { id: 1, name: "Стрижка",        price: 350,  duration: 60  },
  { id: 2, name: "Фарбування",     price: 900,  duration: 180 },
  { id: 3, name: "Мелірування",    price: 1100, duration: 210 },
  { id: 4, name: "Тонування",      price: 650,  duration: 120 },
  { id: 5, name: "Кератин",        price: 1400, duration: 240 },
  { id: 6, name: "Укладання",      price: 280,  duration: 60  },
  { id: 7, name: "Маска / догляд", price: 200,  duration: 30  },
  { id: 8, name: "Завивка",        price: 1200, duration: 180 },
  { id: 9, name: "Ботокс для волосся", price: 1600, duration: 180 },
];

const MAT_CATS = ["Фарби","Окислювачі","Порошки","Шампуні","Маски","Кондиціонери","Стайлінг","Інше"];

const INIT_APPTS = [
  { id:1, client:"Олена Коваленко",  phone:"+380 67 123-45-67", serviceId:2, date:today,      time:"10:00", note:"Алергія на аміак", status:"done",    paid:900  },
  { id:2, client:"Марія Шевченко",   phone:"+380 50 234-56-78", serviceId:1, date:today,      time:"13:00", note:"",                  status:"pending", paid:0    },
  { id:3, client:"Ірина Бондаренко", phone:"+380 63 345-67-89", serviceId:5, date:today,      time:"15:30", note:"Постійна клієнтка", status:"pending", paid:0    },
  { id:4, client:"Тетяна Мельник",   phone:"+380 97 456-78-90", serviceId:3, date:tomorrow,   time:"11:00", note:"",                  status:"pending", paid:0    },
  { id:5, client:"Наталія Гриценко", phone:"+380 66 567-89-01", serviceId:6, date:yesterday,  time:"14:00", note:"",                  status:"done",    paid:280  },
  { id:6, client:"Юлія Лисенко",     phone:"+380 93 678-90-12", serviceId:4, date:twoDaysAgo, time:"12:00", note:"",                  status:"done",    paid:650  },
];

const INIT_MATS = [
  { id:1,  name:"Фарба Wella 8/0",          category:"Фарби",       qty:5,   unit:"туб", price:180, minQty:2   },
  { id:2,  name:"Фарба Matrix 7/7",          category:"Фарби",       qty:3,   unit:"туб", price:155, minQty:2   },
  { id:3,  name:"Окислювач 6%",              category:"Окислювачі",  qty:2,   unit:"л",   price:95,  minQty:1   },
  { id:4,  name:"Окислювач 9%",              category:"Окислювачі",  qty:1,   unit:"л",   price:95,  minQty:1   },
  { id:5,  name:"Порошок освітлюючий",       category:"Порошки",     qty:800, unit:"г",   price:210, minQty:200 },
  { id:6,  name:"Шампунь для фарбованих",    category:"Шампуні",     qty:1.5, unit:"л",   price:130, minQty:0.5 },
  { id:7,  name:"Маска відновлювальна",      category:"Маски",       qty:500, unit:"г",   price:190, minQty:100 },
  { id:8,  name:"Кондиціонер Redken",        category:"Кондиціонери",qty:1,   unit:"л",   price:145, minQty:0.3 },
  { id:9,  name:"Лак для волосся",           category:"Стайлінг",    qty:3,   unit:"шт",  price:110, minQty:1   },
  { id:10, name:"Крем-воск для укладання",   category:"Стайлінг",    qty:2,   unit:"шт",  price:120, minQty:1   },
];

// ── Icons ────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ic = {
  calendar: "M8 2v3M16 2v3M3 8h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  box:      "M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  chart:    "M3 3v18h18M7 16l4-4 4 4 4-4",
  plus:     "M12 5v14M5 12h14",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18M6 6l12 12",
  edit:     "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  warn:     "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  scissors: "M6 3a3 3 0 110 6 3 3 0 010-6zM18 3a3 3 0 110 6 3 3 0 010-6zM8.22 8.22l7.56 7.56M16.73 14.27l1.5 1.5a3 3 0 11-4.24 4.24l-1.5-1.5M7.27 9.73L5.77 8.23A3 3 0 111.53 4",
};

// ── Style helpers ─────────────────────────────────────────────────
const st = {
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" },
  btn: (v = "primary") => ({
    padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    fontSize: 13, transition: "all 0.15s", outline: "none",
    background: v === "primary" ? C.accent : v === "danger" ? C.danger : "transparent",
    color: v === "ghost" ? C.textMuted : C.text,
    border: v === "ghost" ? `1px solid ${C.border}` : v === "primary" ? "none" : v === "danger" ? "none" : `1px solid ${C.border}`,
  }),
  input: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "9px 13px", color: C.text, fontSize: 14, width: "100%",
    boxSizing: "border-box", outline: "none",
  },
  label: { color: C.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 5 },
  badge: (s) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
    background: s === "done" ? "#7BAF8A22" : s === "cancelled" ? "#B8707022" : "#C4A46A22",
    color:      s === "done" ? C.success    : s === "cancelled" ? C.danger    : C.warn,
  }),
};

// ── Modal ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }}>
      <div style={{ ...st.card, width:480, maxHeight:"90vh", overflowY:"auto", boxShadow:`0 32px 80px rgba(0,0,0,0.6)` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ margin:0, color:C.text, fontSize:17, fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMuted, padding:4 }}><Icon d={ic.x} size={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Appointment Form ──────────────────────────────────────────────
function ApptForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { client:"", phone:"", serviceId:1, date:today, time:"10:00", note:"", status:"pending", paid:0 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const svc = SERVICES.find(s => s.id === +f.serviceId);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div><label style={st.label}>Ім'я клієнтки</label><input style={st.input} value={f.client} onChange={e=>set("client",e.target.value)} placeholder="Прізвище Ім'я"/></div>
      <div><label style={st.label}>Телефон</label><input style={st.input} value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="+380 xx xxx-xx-xx"/></div>
      <div>
        <label style={st.label}>Послуга</label>
        <select style={st.input} value={f.serviceId} onChange={e=>set("serviceId",+e.target.value)}>
          {SERVICES.map(sv=><option key={sv.id} value={sv.id}>{sv.name} — {fmt(sv.price)} грн</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div><label style={st.label}>Дата</label><input type="date" style={st.input} value={f.date} onChange={e=>set("date",e.target.value)}/></div>
        <div><label style={st.label}>Час</label><input type="time" style={st.input} value={f.time} onChange={e=>set("time",e.target.value)}/></div>
      </div>
      <div>
        <label style={st.label}>Статус</label>
        <select style={st.input} value={f.status} onChange={e=>set("status",e.target.value)}>
          <option value="pending">Очікує</option>
          <option value="done">Виконано</option>
          <option value="cancelled">Скасовано</option>
        </select>
      </div>
      {f.status==="done" && <div><label style={st.label}>Оплачено (грн)</label><input type="number" style={st.input} value={f.paid} onChange={e=>set("paid",+e.target.value)}/></div>}
      <div><label style={st.label}>Примітка</label><textarea style={{...st.input, height:64, resize:"vertical"}} value={f.note} onChange={e=>set("note",e.target.value)}/></div>
      {svc && <div style={{ background:C.surface, borderRadius:8, padding:"10px 14px", color:C.textMuted, fontSize:13 }}>
        Тривалість: {svc.duration} хв · Вартість: {fmt(svc.price)} грн
      </div>}
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
        <button style={st.btn("ghost")} onClick={onClose}>Скасувати</button>
        <button style={st.btn()} onClick={()=>{ if(f.client&&f.date){onSave(f);onClose();} }}>Зберегти</button>
      </div>
    </div>
  );
}

// ── Material Form ─────────────────────────────────────────────────
function MatForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { name:"", category:"Фарби", qty:0, unit:"шт", price:0, minQty:1 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div><label style={st.label}>Назва</label><input style={st.input} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Фарба Wella 8/0"/></div>
      <div>
        <label style={st.label}>Категорія</label>
        <select style={st.input} value={f.category} onChange={e=>set("category",e.target.value)}>
          {MAT_CATS.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <div><label style={st.label}>Кількість</label><input type="number" style={st.input} value={f.qty} onChange={e=>set("qty",+e.target.value)}/></div>
        <div><label style={st.label}>Од. вим.</label><input style={st.input} value={f.unit} onChange={e=>set("unit",e.target.value)} placeholder="шт"/></div>
        <div><label style={st.label}>Мін. запас</label><input type="number" style={st.input} value={f.minQty} onChange={e=>set("minQty",+e.target.value)}/></div>
      </div>
      <div><label style={st.label}>Ціна закупки (грн)</label><input type="number" style={st.input} value={f.price} onChange={e=>set("price",+e.target.value)}/></div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <button style={st.btn("ghost")} onClick={onClose}>Скасувати</button>
        <button style={st.btn()} onClick={()=>{ if(f.name){onSave(f);onClose();} }}>Зберегти</button>
      </div>
    </div>
  );
}

// ── Calendar Tab ──────────────────────────────────────────────────
function CalendarTab({ appts, setAppts }) {
  const [modal, setModal] = useState(false);
  const [editT, setEditT] = useState(null);
  const [date, setDate] = useState(today);

  const list = appts.filter(a=>a.date===date).sort((a,b)=>a.time.localeCompare(b.time));
  const save = (form) => {
    if (editT) setAppts(p=>p.map(a=>a.id===editT.id?{...form,id:a.id}:a));
    else setAppts(p=>[...p,{...form,id:Date.now()}]);
    setEditT(null);
  };
  const remove = id => setAppts(p=>p.filter(a=>a.id!==id));
  const markDone = id => setAppts(p=>p.map(a=>a.id===id?{...a,status:"done",paid:SERVICES.find(s=>s.id===a.serviceId)?.price||0}:a));
  const labels = { pending:"Очікує", done:"Виконано", cancelled:"Скасовано" };

  return (
    <div>
      {(modal||editT) && (
        <Modal title={editT?"Редагувати запис":"Новий запис"} onClose={()=>{setModal(false);setEditT(null);}}>
          <ApptForm initial={editT} onSave={save} onClose={()=>{setModal(false);setEditT(null);}}/>
        </Modal>
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <input type="date" style={{...st.input, width:"auto"}} value={date} onChange={e=>setDate(e.target.value)}/>
          <span style={{ color:C.textMuted, fontSize:14 }}>{list.length} {list.length===1?"запис":list.length<5?"записи":"записів"}</span>
        </div>
        <button style={st.btn()} onClick={()=>{setEditT(null);setModal(true);}}>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon d={ic.plus} size={15}/>Новий запис</span>
        </button>
      </div>

      {list.length===0 ? (
        <div style={{ textAlign:"center", color:C.textDim, padding:"70px 0", fontSize:15 }}>На цей день записів немає</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {list.map(a=>{
            const svc = SERVICES.find(sv=>sv.id===a.serviceId);
            const barColor = a.status==="done" ? C.success : a.status==="cancelled" ? C.danger : C.accent;
            return (
              <div key={a.id} style={{ ...st.card, display:"flex", alignItems:"center", gap:18, padding:"15px 20px", borderLeft:`3px solid ${barColor}` }}>
                <div style={{ minWidth:52, textAlign:"center" }}>
                  <div style={{ color:C.accentSoft, fontWeight:800, fontSize:17, fontVariantNumeric:"tabular-nums" }}>{a.time}</div>
                  <div style={{ color:C.textDim, fontSize:11 }}>{svc?.duration}хв</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ color:C.text, fontWeight:700, fontSize:15 }}>{a.client}</span>
                    <span style={st.badge(a.status)}>{labels[a.status]}</span>
                  </div>
                  <div style={{ color:C.textMuted, fontSize:13 }}>{svc?.name} · {a.phone}</div>
                  {a.note && <div style={{ color:C.textDim, fontSize:12, marginTop:3 }}>📝 {a.note}</div>}
                </div>
                <div style={{ textAlign:"right", minWidth:100 }}>
                  <div style={{ color:C.silver, fontWeight:700, fontSize:16 }}>{fmt(svc?.price)} грн</div>
                  {a.status==="done" && <div style={{ color:C.success, fontSize:12 }}>✓ Оплачено</div>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                  {a.status==="pending" && (
                    <button style={{...st.btn("ghost"), padding:"6px 10px"}} onClick={()=>markDone(a.id)} title="Позначити виконаним">
                      <Icon d={ic.check} size={14} color={C.success}/>
                    </button>
                  )}
                  <button style={{...st.btn("ghost"), padding:"6px 10px"}} onClick={()=>setEditT(a)}><Icon d={ic.edit} size={14}/></button>
                  <button style={{...st.btn("ghost"), padding:"6px 10px"}} onClick={()=>remove(a.id)}><Icon d={ic.trash} size={14} color={C.danger}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Materials Tab ─────────────────────────────────────────────────
function MaterialsTab({ mats, setMats }) {
  const [modal, setModal] = useState(false);
  const [editT, setEditT] = useState(null);
  const [cat, setCat] = useState("Всі");
  const [search, setSearch] = useState("");

  const low = mats.filter(m=>m.qty<=m.minQty);
  const filtered = mats.filter(m=>(cat==="Всі"||m.category===cat)&&m.name.toLowerCase().includes(search.toLowerCase()));
  const save = (form) => {
    if (editT) setMats(p=>p.map(m=>m.id===editT.id?{...form,id:m.id}:m));
    else setMats(p=>[...p,{...form,id:Date.now()}]);
    setEditT(null);
  };
  const remove = id => setMats(p=>p.filter(m=>m.id!==id));
  const grouped = MAT_CATS.map(c=>({ c, items:filtered.filter(m=>m.category===c) })).filter(g=>g.items.length>0);

  return (
    <div>
      {(modal||editT) && (
        <Modal title={editT?"Редагувати матеріал":"Додати матеріал"} onClose={()=>{setModal(false);setEditT(null);}}>
          <MatForm initial={editT} onSave={save} onClose={()=>{setModal(false);setEditT(null);}}/>
        </Modal>
      )}

      {low.length>0 && (
        <div style={{ background:`${C.danger}12`, border:`1px solid ${C.danger}44`, borderRadius:10, padding:"12px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:12 }}>
          <Icon d={ic.warn} size={18} color={C.danger}/>
          <span style={{ color:C.danger, fontSize:14 }}>Закінчується: {low.map(m=>m.name).join(", ")}</span>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <input style={{...st.input, maxWidth:210}} placeholder="Пошук..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {["Всі",...MAT_CATS].map(c=>(
            <button key={c} style={{...st.btn(cat===c?"primary":"ghost"), padding:"6px 13px", fontSize:12}} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
        <button style={{...st.btn(), marginLeft:"auto"}} onClick={()=>{setEditT(null);setModal(true);}}>
          <span style={{ display:"flex", alignItems:"center", gap:6 }}><Icon d={ic.plus} size={15}/>Додати</span>
        </button>
      </div>

      {(cat==="Всі"?grouped:[{c:cat,items:filtered}]).map(({c,items})=>(
        <div key={c} style={{ marginBottom:24 }}>
          <div style={{ color:C.textMuted, fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10 }}>{c}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {items.map(m=>{
              const isLow = m.qty<=m.minQty;
              return (
                <div key={m.id} style={{...st.card, display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderLeft:`3px solid ${isLow?C.danger:C.border}`}}>
                  <div style={{ flex:1 }}>
                    <span style={{ color:C.text, fontWeight:600, fontSize:14 }}>{m.name}</span>
                    {isLow && <span style={{...st.badge("cancelled"), marginLeft:10}}>Мало</span>}
                  </div>
                  <div style={{ display:"flex", gap:28, alignItems:"center" }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ color:isLow?C.danger:C.accentSoft, fontWeight:700, fontSize:16 }}>{m.qty} {m.unit}</div>
                      <div style={{ color:C.textDim, fontSize:11 }}>мін. {m.minQty}</div>
                    </div>
                    <div style={{ textAlign:"right", minWidth:90 }}>
                      <div style={{ color:C.silver, fontSize:14, fontWeight:600 }}>{fmt(m.price)} грн</div>
                      <div style={{ color:C.textDim, fontSize:11 }}>за од.</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={{...st.btn("ghost"), padding:"6px 10px"}} onClick={()=>setEditT(m)}><Icon d={ic.edit} size={13}/></button>
                    <button style={{...st.btn("ghost"), padding:"6px 10px"}} onClick={()=>remove(m.id)}><Icon d={ic.trash} size={13} color={C.danger}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Analytics Tab ─────────────────────────────────────────────────
function AnalyticsTab({ appts, mats }) {
  const [period, setPeriod] = useState("month");
  const now = new Date();

  const done = appts.filter(a=>{
    if (a.status!=="done") return false;
    const d = new Date(a.date);
    if (period==="week") { const w=new Date(now); w.setDate(now.getDate()-7); return d>=w; }
    if (period==="month") return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    return d.getFullYear()===now.getFullYear();
  });

  const revenue = done.reduce((s,a)=>s+(a.paid||SERVICES.find(sv=>sv.id===a.serviceId)?.price||0),0);
  const matsCost = mats.reduce((s,m)=>s+m.price*m.qty,0);
  const avg = done.length ? Math.round(revenue/done.length) : 0;

  const byService = SERVICES.map(sv=>{
    const count = done.filter(a=>a.serviceId===sv.id).length;
    return { ...sv, count, revenue: count*sv.price };
  }).filter(sv=>sv.count>0).sort((a,b)=>b.revenue-a.revenue);

  const byDay = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"].map((label,i)=>{
    const dn = (i+1)%7;
    const rev = done.filter(a=>new Date(a.date).getDay()===dn).reduce((s,a)=>s+(SERVICES.find(sv=>sv.id===a.serviceId)?.price||0),0);
    return { label, rev };
  });
  const maxBar = Math.max(...byDay.map(d=>d.rev),1);
  const maxSvc = Math.max(...byService.map(s=>s.revenue),1);

  const Stat = ({label,value,sub,color=C.accent}) => (
    <div style={{...st.card, textAlign:"center"}}>
      <div style={{ color, fontWeight:800, fontSize:26, marginBottom:4 }}>{value}</div>
      <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>{label}</div>
      {sub && <div style={{ color:C.textMuted, fontSize:12, marginTop:3 }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:24 }}>
        {[["week","Тиждень"],["month","Місяць"],["year","Рік"]].map(([k,l])=>(
          <button key={k} style={{...st.btn(period===k?"primary":"ghost"), fontSize:13}} onClick={()=>setPeriod(k)}>{l}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:26 }}>
        <Stat label="Виручка"        value={`${fmt(revenue)} грн`}   sub={`${done.length} послуг`}          color={C.silver}/>
        <Stat label="Середній чек"   value={`${fmt(avg)} грн`}       color={C.accentSoft}/>
        <Stat label="Склад (вартість)" value={`${fmt(matsCost)} грн`} sub={`${mats.length} позицій`}        color={C.textMuted}/>
      </div>

      {/* Bar chart */}
      <div style={{...st.card, marginBottom:18}}>
        <div style={{ color:C.textMuted, fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:18 }}>Виручка по днях тижня</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:110 }}>
          {byDay.map(({label,rev})=>(
            <div key={label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{ fontSize:10, color:C.textDim }}>{rev>0?`${Math.round(rev/100)*100>=1000?`${(rev/1000).toFixed(1)}к`:rev}`:""}</div>
              <div style={{ width:"100%", background:rev>0?`linear-gradient(to top,${C.accentDim},${C.accent})`:C.border, borderRadius:"4px 4px 0 0", height:`${Math.max((rev/maxBar)*88,rev>0?5:2)}px`, transition:"height 0.35s" }}/>
              <div style={{ fontSize:12, color:C.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div style={st.card}>
        <div style={{ color:C.textMuted, fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:18 }}>Послуги</div>
        {byService.length===0 ? (
          <div style={{ color:C.textDim, textAlign:"center", padding:"30px 0" }}>Немає виконаних послуг за цей період</div>
        ) : byService.map(sv=>(
          <div key={sv.id} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:C.text, fontSize:14 }}>{sv.name} <span style={{ color:C.textDim }}>×{sv.count}</span></span>
              <span style={{ color:C.silver, fontWeight:700 }}>{fmt(sv.revenue)} грн</span>
            </div>
            <div style={{ background:C.border, borderRadius:4, height:5, overflow:"hidden" }}>
              <div style={{ width:`${(sv.revenue/maxSvc)*100}%`, height:"100%", background:`linear-gradient(to right,${C.accentDim},${C.accentSoft})`, borderRadius:4, transition:"width 0.4s" }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App Shell ─────────────────────────────────────────────────────
export default function BeautyCRM() {
  const [tab, setTab] = useState("calendar");
  const [appts, setAppts] = useState(INIT_APPTS);
  const [mats, setMats] = useState(INIT_MATS);

  const pendingToday = appts.filter(a=>a.date===today&&a.status==="pending").length;
  const lowStock     = mats.filter(m=>m.qty<=m.minQty).length;

  const nav = [
    { id:"calendar",  icon:ic.calendar, label:"Записи",   badge:pendingToday, badgeColor:C.accent  },
    { id:"materials", icon:ic.box,      label:"Склад",    badge:lowStock,     badgeColor:C.danger  },
    { id:"analytics", icon:ic.chart,    label:"Аналітика",badge:0,            badgeColor:C.accent  },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:920, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 0" }}>
            <div style={{ background:`linear-gradient(135deg,${C.accentDim},${C.accent})`, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon d={ic.scissors} size={17} color="#fff"/>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, letterSpacing:"-0.01em", color:C.text }}>Beauty CRM</div>
              <div style={{ color:C.textDim, fontSize:11 }}>{fmtDate(today)}</div>
            </div>
          </div>
          {/* Nav */}
          <nav style={{ display:"flex", gap:3 }}>
            {nav.map(({id,icon,label,badge,badgeColor})=>(
              <button key={id} onClick={()=>setTab(id)} style={{
                background: tab===id ? `${C.accent}14` : "none",
                border: tab===id ? `1px solid ${C.accent}35` : "1px solid transparent",
                borderRadius:10, padding:"10px 18px", cursor:"pointer",
                color: tab===id ? C.accentSoft : C.textMuted,
                fontWeight:600, fontSize:13,
                display:"flex", alignItems:"center", gap:7, transition:"all 0.15s",
              }}>
                <Icon d={icon} size={15} color={tab===id?C.accentSoft:C.textMuted}/>
                {label}
                {badge>0 && <span style={{ background:badgeColor, color:"#fff", borderRadius:10, fontSize:10, fontWeight:800, padding:"1px 6px" }}>{badge}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:920, margin:"0 auto", padding:"28px 24px" }}>
        {tab==="calendar"  && <CalendarTab  appts={appts}  setAppts={setAppts}/>}
        {tab==="materials" && <MaterialsTab mats={mats}    setMats={setMats}/>}
        {tab==="analytics" && <AnalyticsTab appts={appts}  mats={mats}/>}
      </div>
    </div>
  );
}
