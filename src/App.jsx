import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// SEMPER brand colors
const B = {
  bg: "#1e1140",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  orange: "#f5820a",
  orangeLight: "#f9a040",
  orangeDim: "rgba(245,130,10,0.15)",
  purple: "#2d1a6e",
  purpleLight: "#3d2a8a",
  text: "#ece8f8",
  textSub: "#9e96c8",
  textMuted: "#5e5588",
};

const INITIAL_DATA = {
  communities: [
    { id: 1, name: "San Pablo", status: "warning", note: "Está flaqueando la asistencia", coordinator: "Pat Hidalgo" },
    { id: 2, name: "San Ignacio", status: "good", note: "Bien, buena asistencia", coordinator: "Pauli Sánchez" },
    { id: 3, name: "San Martín", status: "good", note: "Bien", coordinator: "Marta Giribert" },
  ],
  ministries: [
    {
      id: "formacion", name: "Formación", responsible: "Guillem", color: B.orange, icon: "📖",
      tasks: [
        { id: 1, text: "Subir 1 video a Instagram", done: true },
        { id: 2, text: "Posts recurrentes en la web", done: true },
        { id: 3, text: "Guion potencial y grabarlo (videos YT)", done: false },
        { id: 4, text: "Hacer Reels + Shorts", done: false },
        { id: 5, text: "Resolver: nadie se graba", done: false },
        { id: 6, text: "Chuleta Lux: puntos básicos, valores, credo", done: false },
      ],
      alerts: ["Nadie se graba — resolver urgente", "Chuleta Lux pendiente de completar"],
    },
    {
      id: "ad_intra", name: "Ad Intra", responsible: "Mari Tere", color: "#c084f5", icon: "🕊️",
      tasks: [
        { id: 1, text: "Compromisos", done: false },
        { id: 2, text: "Roots", done: false },
      ],
      alerts: [],
    },
    {
      id: "misa_tabor", name: "Misa y Tabor", responsible: "Marta", color: "#5ec47a", icon: "✝️",
      tasks: [
        { id: 1, text: "Mayor estructura y organización en el equipo", done: false },
        { id: 2, text: "Sistematización del ministerio", done: false },
        { id: 3, text: "Fomentar el servicio (poca ayuda tabores/misas)", done: false },
      ],
      alerts: ["Poca ayuda para tabores y misas"],
    },
    {
      id: "acc", name: "A Contra Corriente", responsible: "Alfonso", color: "#f56565", icon: "🎤",
      tasks: [
        { id: 1, text: "Avisar con 1 mes cuando haya libro en ACC", done: false },
        { id: 2, text: "Alfon contacta directamente con ponentes", done: false },
        { id: 3, text: "Equipo para montar (se necesitan manos)", done: false },
        { id: 4, text: "No montar durante la hora santa", done: true },
        { id: 5, text: "Ordenar almacén (Marta Giribert)", done: false },
        { id: 6, text: "Asistencia correcta (responsabilidad Alfon)", done: false },
        { id: 7, text: "Anticipar lanzamientos de ACC", done: false },
        { id: 8, text: "Mejorar landing (contenido, no diseño)", done: false },
      ],
      alerts: ["Anticipar lanzamientos con más tiempo", "Se necesitan manos para montar"],
      futureVision: ["Hacer visitas a museos", "Promocionar ACC más allá de Semper"],
    },
    {
      id: "comunicaciones", name: "Comunicaciones", responsible: "Blanca & Ori", color: "#60a5fa", icon: "📸",
      tasks: [
        { id: 1, text: "Buen ritmo en el mes de Jesús", done: true },
        { id: 2, text: "Curso formación fotografía (Stephanie)", done: false },
        { id: 3, text: "Mini curso formación diseño (Ori)", done: false },
        { id: 4, text: "Asignar roles al equipo de CC", done: false },
        { id: 5, text: "Ver si Moni Serrano puede ayudar", done: false },
      ],
      alerts: ["Falta gente", "Mini curso de diseño pendiente (Ori)", "Roles del equipo sin asignar"],
    },
    {
      id: "ceu", name: "CEU", responsible: "Agustín", color: "#fbbf24", icon: "🎓",
      tasks: [
        { id: 1, text: "Cuadernillo de catequistas", done: true },
        { id: 2, text: "Buen aforo en grupo Ayala", done: true },
        { id: 3, text: "Mejorar acogida catequistas de 1º bachillerato", done: false },
      ],
      alerts: ["Poca acogida en catequistas de 1º"],
    },
    {
      id: "economia", name: "Economía", responsible: "Leya", color: "#34d399", icon: "💶",
      tasks: [
        { id: 1, text: "Mayor entendimiento del ministerio", done: false },
        { id: 2, text: "Resolver: el Hno. tarda en transferencias", done: false },
        { id: 3, text: "Mini formación de economía", done: false },
        { id: 4, text: "Pendiente: ingresos Guille 100€", done: false },
        { id: 5, text: "Análisis rentabilidad ingresos vs costes", done: false },
        { id: 6, text: "Guille envía coste por unidad a Leya", done: false },
        { id: 7, text: "Registro diezmos trabajadores (hacienda)", done: false },
      ],
      alerts: ["El Hno. tarda en hacer transferencias", "Pendiente: ingresos Guille 100€"],
    },
    {
      id: "brand", name: "Brand", responsible: "Stefano", color: B.orangeLight, icon: "🛍️",
      tasks: [
        { id: 1, text: "Toldo cerrado (36.000€)", done: true },
        { id: 2, text: "Emma (diseñadora) → pendiente de que contacte", done: false },
        { id: 3, text: "Proveedores colección forro polar", done: false },
        { id: 4, text: "Subir colecciones a la web", done: false },
        { id: 5, text: "Imagery colecciones para Meta Ads", done: false },
      ],
      alerts: ["Emma quiere venir a Semper — estar pendiente"],
    },
  ],
  events: [
    { id: 1, name: "Luz del Mundo", date: "18-19-20", priority: "high", done: false },
    { id: 2, name: "BAC · Mírame", date: "14 Marzo", priority: "high", done: false },
    { id: 3, name: "Pendientes del Milagro", date: "20 Diciembre", priority: "medium", done: false },
    { id: 4, name: "Misiones Perú 2026", date: "17-31 Julio 2026", priority: "medium", done: false },
  ],
  deletedTasks: [],
  meetingLog: [],
};

const statusCfg = {
  good:    { label: "Bien",      color: "#5ec47a", bg: "rgba(94,196,122,0.12)" },
  warning: { label: "Atención",  color: "#f56565", bg: "rgba(245,101,101,0.12)" },
  neutral: { label: "Sin datos", color: "#9e96c8", bg: "rgba(158,150,200,0.1)" },
};
const priCfg = {
  high:   { color: "#f56565", label: "Alta" },
  medium: { color: B.orange,  label: "Media" },
};
const TABS = [
  { id: "overview",     label: "General",      icon: "⬡" },
  { id: "ministerios",  label: "Ministerios",  icon: "⬢" },
  { id: "personas",     label: "Personas",     icon: "👤" },
  { id: "comunidades",  label: "Comunidades",  icon: "◎" },
  { id: "eventos",      label: "Eventos",      icon: "◇" },
];

const Flame = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 4C24 4 34 16 34 26C34 32.627 29.627 38 24 38C18.373 38 14 32.627 14 26C14 16 24 4 24 4Z" fill="#f5820a"/>
    <path d="M24 18C24 18 29 24 29 29C29 31.761 26.761 34 24 34C21.239 34 19 31.761 19 29C19 24 24 18 24 18Z" fill="#fbbf24"/>
    <circle cx="24" cy="30" r="3" fill="white" fillOpacity="0.5"/>
  </svg>
);


// ── CSS Styles ──
const STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:${B.purple}}
  ::-webkit-scrollbar-thumb{background:${B.purpleLight};border-radius:2px}
  .card{background:${B.bgCard};border:1px solid ${B.border};border-radius:14px;}
  .mcard{cursor:pointer;transition:all 0.2s;}
  .mcard:hover{background:${B.bgCardHover}!important;border-color:rgba(245,130,10,0.35)!important;transform:translateY(-2px);}
  .taskrow{display:flex;align-items:flex-start;gap:10px;padding:11px 6px;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;border-radius:6px;transition:background 0.15s;}
  .taskrow:hover{background:rgba(255,255,255,0.04);}
  .taskrow:last-child{border-bottom:none;}
  .cb{width:20px;height:20px;min-width:20px;border-radius:5px;border:1.5px solid ${B.textMuted};display:flex;align-items:center;justify-content:center;margin-top:1px;transition:all 0.2s;}
  .cb.on{background:${B.orange};border-color:${B.orange};}
  .pill{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:0.66rem;letter-spacing:0.07em;white-space:nowrap;font-weight:600;text-transform:uppercase;}
  .alerti{display:flex;gap:8px;padding:9px 12px;background:rgba(245,101,101,0.07);border-left:2px solid #f56565;border-radius:0 8px 8px 0;margin-bottom:6px;font-size:0.79rem;line-height:1.5;align-items:center;}
  .visioni{display:flex;gap:8px;padding:9px 12px;background:rgba(245,130,10,0.07);border-left:2px solid ${B.orange};border-radius:0 8px 8px 0;margin-bottom:6px;font-size:0.79rem;line-height:1.5;}
  .sbtn{background:none;border:1.5px solid;border-radius:20px;padding:4px 11px;font-size:0.64rem;letter-spacing:0.07em;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap;font-weight:600;text-transform:uppercase;}
  .tabtn{background:none;border:none;cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;flex:1;}
  .backbtn{background:none;border:none;cursor:pointer;color:${B.orange};font-family:inherit;font-size:0.82rem;letter-spacing:0.05em;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:18px;font-weight:600;}
  .backbtn:hover{opacity:0.75;}
  .label{font-size:0.62rem;letter-spacing:0.16em;text-transform:uppercase;color:${B.textMuted};margin-bottom:14px;font-weight:600;}
  @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .fi{animation:fi 0.25s ease;}
  .sg{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
  .mg{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
  .cg{display:grid;grid-template-columns:1fr;gap:12px;}
  .dg{display:grid;grid-template-columns:1fr;gap:14px;}
  .ag{display:grid;grid-template-columns:1fr;gap:6px;}
  @media(min-width:560px){
    .sg{grid-template-columns:repeat(4,1fr);gap:14px;}
    .mg{grid-template-columns:repeat(3,1fr);}
    .cg{grid-template-columns:repeat(3,1fr);}
    .ag{grid-template-columns:repeat(2,1fr);}
  }
  @media(min-width:860px){.dg{grid-template-columns:3fr 2fr;}}

  .deleted-row{display:flex;align-items:flex-start;gap:10px;padding:9px 6px;border-bottom:1px solid rgba(255,255,255,0.03);opacity:0.5;}
  .deleted-row:last-child{border-bottom:none;}

  /* Delete X button */
  .del-x{background:none;border:none;cursor:pointer;color:${B.textMuted};font-size:0.75rem;padding:2px 6px;border-radius:4px;transition:all 0.15s;line-height:1;flex-shrink:0;}
  .del-x:hover{color:#f56565;background:rgba(245,101,101,0.15);}

  /* Add row */
  .add-row{display:flex;gap:8px;margin-top:10px;}
  .add-input{background:rgba(255,255,255,0.06);border:1px solid ${B.border};border-radius:8px;color:${B.text};font-family:inherit;font-size:0.78rem;padding:8px 12px;outline:none;flex:1;transition:border-color 0.2s;}
  .add-input:focus{border-color:${B.orange};}
  .add-input::placeholder{color:${B.textMuted};}
  .add-btn{background:${B.orange};border:none;border-radius:8px;color:#fff;font-size:0.85rem;font-weight:700;padding:0 14px;cursor:pointer;transition:all 0.2s;flex-shrink:0;}
  .add-btn:hover{background:${B.orangeLight};}
  .add-btn:disabled{opacity:0.3;cursor:default;}

  /* Inline edit */
  .inline-edit{background:rgba(255,255,255,0.06);border:1.5px solid ${B.orange};border-radius:6px;color:${B.text};font-family:inherit;font-size:0.82rem;padding:6px 10px;outline:none;flex:1;line-height:1.5;}
  .edit-pencil{background:none;border:none;cursor:pointer;color:${B.textMuted};font-size:0.65rem;padding:2px 5px;border-radius:4px;transition:all 0.15s;flex-shrink:0;opacity:0.5;}
  .edit-pencil:hover{opacity:1;color:${B.orange};}
  .save-check{background:none;border:none;cursor:pointer;color:#5ec47a;font-size:0.8rem;padding:2px 5px;border-radius:4px;transition:all 0.15s;flex-shrink:0;}
  .save-check:hover{background:rgba(94,196,122,0.15);}
  .cancel-edit{background:none;border:none;cursor:pointer;color:${B.textMuted};font-size:0.7rem;padding:2px 5px;border-radius:4px;transition:all 0.15s;flex-shrink:0;}
  .cancel-edit:hover{color:#f56565;}

  /* Confirm delete modal */
  .confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);animation:fi 0.15s ease;}
  .confirm-box{background:${B.bg};border:1.5px solid ${B.border};border-radius:16px;padding:24px 28px;max-width:340px;width:100%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.4);}
  .confirm-box .icon{font-size:1.6rem;margin-bottom:12px;}
  .confirm-box .msg{font-size:0.82rem;color:${B.textSub};line-height:1.6;margin-bottom:8px;}
  .confirm-box .item-text{font-size:0.78rem;color:${B.text};background:rgba(255,255,255,0.05);border-radius:8px;padding:8px 12px;margin-bottom:18px;line-height:1.5;word-break:break-word;}
  .confirm-btns{display:flex;gap:10px;justify-content:center;}
  .confirm-btns .btn-cancel{background:rgba(255,255,255,0.06);border:1px solid ${B.border};border-radius:10px;color:${B.textSub};font-family:inherit;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:9px 20px;cursor:pointer;transition:all 0.2s;}
  .confirm-btns .btn-cancel:hover{background:rgba(255,255,255,0.1);}
  .confirm-btns .btn-delete{background:#f56565;border:none;border-radius:10px;color:#fff;font-family:inherit;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:9px 20px;cursor:pointer;transition:all 0.2s;}
  .confirm-btns .btn-delete:hover{background:#e04545;}
`;

export default function SemperDashboard() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeMinistry, setActiveMinistry] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  // Personas state
  const [activePerson, setActivePerson] = useState(null);

  // Inline editing state
  const [editingTask, setEditingTask] = useState(null); // { mId, tId, text }
  const [editingAlert, setEditingAlert] = useState(null); // { mId, idx, text }
  const [inlineNewTask, setInlineNewTask] = useState({}); // { [mId]: text }
  const [inlineNewAlert, setInlineNewAlert] = useState({}); // { [mId]: text }

  // Event editing state
  const [editingEvent, setEditingEvent] = useState(null); // { eId, name, date, priority }
  const [newEvent, setNewEvent] = useState({ name: "", date: "", priority: "medium" });

  // Confirm delete state: { type: "task"|"alert"|"event", mId?, tId?, idx?, eId?, text }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const saveTimer = useRef(null);

  // Load from Supabase on mount (fallback to localStorage for migration)
  useEffect(() => {
    (async () => {
      try {
        const { data: row, error } = await supabase
          .from("semper_state")
          .select("data")
          .eq("id", "main")
          .single();
        if (!error && row?.data && Object.keys(row.data).length > 0) {
          const d = row.data;
          setData({ ...INITIAL_DATA, ...d, deletedTasks: d.deletedTasks || [], meetingLog: d.meetingLog || [] });
        } else {
          // Migration: try localStorage
          const stored = localStorage.getItem("semper_v6");
          if (stored) {
            const parsed = JSON.parse(stored);
            const merged = { ...INITIAL_DATA, ...parsed, deletedTasks: parsed.deletedTasks || [], meetingLog: parsed.meetingLog || [] };
            setData(merged);
            // Push to Supabase
            await supabase.from("semper_state").upsert({ id: "main", data: merged, updated_at: new Date().toISOString() });
          }
        }
      } catch (_) {}
      setLoaded(true);
    })();
  }, []);

  // Debounced save to Supabase
  const save = useCallback((d) => {
    setData(d);
    // Immediate localStorage backup
    try { localStorage.setItem("semper_v6", JSON.stringify(d)); } catch (_) {}
    // Debounced Supabase write (300ms)
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await supabase.from("semper_state").upsert({ id: "main", data: d, updated_at: new Date().toISOString() });
      } catch (_) {}
    }, 300);
  }, []);

  // ── CRUD helpers ──
  const toggleTask  = (mId, tId) => save({ ...data, ministries: data.ministries.map(m => m.id === mId ? { ...m, tasks: m.tasks.map(t => t.id === tId ? { ...t, done: !t.done } : t) } : m) });
  const toggleEvent = (eId)       => save({ ...data, events: data.events.map(e => e.id === eId ? { ...e, done: !e.done } : e) });
  const setCommSt   = (cId, s)    => save({ ...data, communities: data.communities.map(c => c.id === cId ? { ...c, status: s } : c) });

  const requestDeleteTask = (mId, tId) => {
    const m = data.ministries.find(mm => mm.id === mId);
    const task = m?.tasks.find(t => t.id === tId);
    if (!m || !task) return;
    setConfirmDelete({ type: "task", mId, tId, text: task.text });
  };

  const requestDeleteAlert = (mId, idx) => {
    const m = data.ministries.find(mm => mm.id === mId);
    if (!m || idx >= m.alerts.length) return;
    setConfirmDelete({ type: "alert", mId, idx, text: m.alerts[idx] });
  };

  const executeDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === "task") {
      const m = data.ministries.find(mm => mm.id === confirmDelete.mId);
      const task = m?.tasks.find(t => t.id === confirmDelete.tId);
      if (m && task) {
        const now = new Date().toLocaleDateString("es-ES");
        save({
          ...data,
          ministries: data.ministries.map(mm => mm.id === confirmDelete.mId ? { ...mm, tasks: mm.tasks.filter(t => t.id !== confirmDelete.tId) } : mm),
          deletedTasks: [...(data.deletedTasks || []), { ministryId: confirmDelete.mId, ministryName: m.name, text: task.text, wasDone: task.done, deletedAt: now }],
        });
      }
    } else if (confirmDelete.type === "alert") {
      save({
        ...data,
        ministries: data.ministries.map(m => m.id === confirmDelete.mId ? { ...m, alerts: m.alerts.filter((_, i) => i !== confirmDelete.idx) } : m),
      });
    } else if (confirmDelete.type === "event") {
      save({
        ...data,
        events: data.events.filter(e => e.id !== confirmDelete.eId),
      });
    }
    setConfirmDelete(null);
  };

  const addTask = (mId, text) => {
    if (!text.trim()) return;
    save({
      ...data,
      ministries: data.ministries.map(m => {
        if (m.id !== mId) return m;
        const maxId = m.tasks.reduce((a, t) => Math.max(a, t.id), 0);
        return { ...m, tasks: [...m.tasks, { id: maxId + 1, text: text.trim(), done: false }] };
      }),
    });
  };

  const addAlert = (mId, text) => {
    if (!text.trim()) return;
    save({
      ...data,
      ministries: data.ministries.map(m => m.id === mId ? { ...m, alerts: [...m.alerts, text.trim()] } : m),
    });
  };

  const editTask = (mId, tId, newText) => {
    if (!newText.trim()) return;
    save({
      ...data,
      ministries: data.ministries.map(m => m.id === mId ? { ...m, tasks: m.tasks.map(t => t.id === tId ? { ...t, text: newText.trim() } : t) } : m),
    });
    setEditingTask(null);
  };

  const editAlert = (mId, idx, newText) => {
    if (!newText.trim()) return;
    save({
      ...data,
      ministries: data.ministries.map(m => m.id === mId ? { ...m, alerts: m.alerts.map((a, i) => i === idx ? newText.trim() : a) } : m),
    });
    setEditingAlert(null);
  };

  // ── Event CRUD ──
  const addEvent = () => {
    if (!newEvent.name.trim()) return;
    const maxId = data.events.reduce((a, e) => Math.max(a, e.id), 0);
    save({
      ...data,
      events: [...data.events, { id: maxId + 1, name: newEvent.name.trim(), date: newEvent.date.trim() || "Sin fecha", priority: newEvent.priority, done: false }],
    });
    setNewEvent({ name: "", date: "", priority: "medium" });
  };

  const editEvent = (eId) => {
    if (!editingEvent || !editingEvent.name.trim()) return;
    save({
      ...data,
      events: data.events.map(e => e.id === eId ? { ...e, name: editingEvent.name.trim(), date: editingEvent.date.trim() || e.date, priority: editingEvent.priority } : e),
    });
    setEditingEvent(null);
  };

  const requestDeleteEvent = (eId) => {
    const ev = data.events.find(e => e.id === eId);
    if (!ev) return;
    setConfirmDelete({ type: "event", eId, text: `${ev.name} (${ev.date})` });
  };

  // ── Computed ──
  const totalTasks = data.ministries.reduce((a, m) => a + m.tasks.length, 0);
  const doneTasks  = data.ministries.reduce((a, m) => a + m.tasks.filter(t => t.done).length, 0);
  const totalAlerts = data.ministries.reduce((a, m) => a + m.alerts.length, 0);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const ministry = activeMinistry ? data.ministries.find(m => m.id === activeMinistry) : null;

  // ── Personas computed ──
  const personsMap = {};
  data.ministries.forEach(m => {
    const name = m.responsible;
    if (!personsMap[name]) {
      personsMap[name] = { name, ministries: [], totalTasks: 0, doneTasks: 0, alerts: 0 };
    }
    personsMap[name].ministries.push(m);
    personsMap[name].totalTasks += m.tasks.length;
    personsMap[name].doneTasks += m.tasks.filter(t => t.done).length;
    personsMap[name].alerts += m.alerts.length;
  });
  // Also add community coordinators
  data.communities.forEach(c => {
    const name = c.coordinator;
    if (!personsMap[name]) {
      personsMap[name] = { name, ministries: [], totalTasks: 0, doneTasks: 0, alerts: 0 };
    }
    if (!personsMap[name].community) personsMap[name].community = [];
    personsMap[name].community.push(c);
  });
  const persons = Object.values(personsMap).sort((a, b) => b.totalTasks - a.totalTasks);
  const personDetail = activePerson ? personsMap[activePerson] : null;

  // ── Loading ──
  if (!loaded) return (
    <div style={{ background: B.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <Flame size={40} />
      <span style={{ color: B.orange, fontFamily: "'Trebuchet MS',sans-serif", letterSpacing: "0.2em", fontSize: "0.85rem" }}>CARGANDO…</span>
    </div>
  );

  // ── Render ──
  return (
    <div style={{ background: B.bg, minHeight: "100vh", fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif", color: B.text, display: "flex", flexDirection: "column" }}>
      <style>{STYLES}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: `1px solid ${B.border}`, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12,
        background: "linear-gradient(180deg, rgba(61,42,138,0.6) 0%, transparent 100%)",
      }}>
        <div style={{
          width: 38, height: 38, minWidth: 38, background: "#4a2d8a", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 16px rgba(245,130,10,0.4)",
        }}>
          <Flame size={24} />
        </div>
        <div>
          <div style={{ fontSize: "1rem", letterSpacing: "0.28em", fontWeight: "700", color: B.text }}>SEMPER</div>
          <div style={{ fontSize: "0.56rem", letterSpacing: "0.2em", color: B.textMuted, fontWeight: "600" }}>PANEL DE DIRECCIÓN</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontSize: "1.15rem", color: B.orange, fontWeight: "700", lineHeight: 1 }}>{progress}%</div>
          <div style={{ fontSize: "0.57rem", color: B.textMuted, marginTop: 3, letterSpacing: "0.05em" }}>{doneTasks}/{totalTasks} tareas</div>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{
        display: "flex", borderBottom: `1px solid ${B.border}`,
        background: "rgba(30,17,64,0.95)", position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(10px)",
      }}>
        {TABS.map(tab => (
          <button key={tab.id} className="tabtn" onClick={() => { setActiveTab(tab.id); setActiveMinistry(null); setActivePerson(null); }}>
            <span style={{ fontSize: "1rem", opacity: activeTab === tab.id ? 1 : 0.3, color: activeTab === tab.id ? B.orange : B.textSub }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: "0.56rem", letterSpacing: "0.1em",
              color: activeTab === tab.id ? B.orange : B.textMuted,
              textTransform: "uppercase", fontWeight: "700",
            }}>{tab.label}</span>
            {activeTab === tab.id && (
              <div style={{ width: "55%", height: 2, background: `linear-gradient(90deg,${B.orange},${B.orangeLight})`, borderRadius: 2 }} />
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", maxWidth: 1000, width: "100%", margin: "0 auto" }}>

        {/* ═══════ OVERVIEW ═══════ */}
        {activeTab === "overview" && (
          <div className="fi">
            <div className="sg" style={{ marginBottom: 20 }}>
              {[
                { label: "Completadas",  value: `${doneTasks}/${totalTasks}`, color: B.orange },
                { label: "Alertas",      value: totalAlerts,                  color: "#f56565" },
                { label: "Comun. OK",    value: data.communities.filter(c => c.status === "good").length, color: "#5ec47a" },
                { label: "Eventos pend.", value: data.events.filter(e => !e.done).length, color: "#60a5fa" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: "15px 16px", borderTop: `2px solid ${s.color}` }}>
                  <div style={{ fontSize: "1.7rem", color: s.color, lineHeight: 1, fontWeight: "700" }}>{s.value}</div>
                  <div style={{ fontSize: "0.63rem", color: B.textMuted, marginTop: 7, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: "0.63rem", color: B.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: "600" }}>Progreso global</span>
                <span style={{ fontSize: "0.63rem", color: B.orange, fontWeight: "700" }}>{progress}%</span>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${B.orange},${B.orangeLight})`, borderRadius: 4, transition: "width 0.5s", boxShadow: "0 0 8px rgba(245,130,10,0.5)" }} />
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div className="label">Comunidades</div>
              <div className="cg">
                {data.communities.map(c => (
                  <div key={c.id} className="card" style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>{c.name}</span>
                      <span className="pill" style={{ background: statusCfg[c.status].bg, color: statusCfg[c.status].color }}>{statusCfg[c.status].label}</span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: B.textMuted, marginTop: 5, fontWeight: "600" }}>{c.coordinator}</div>
                    <div style={{ fontSize: "0.78rem", color: B.textSub, marginTop: 6, lineHeight: 1.5 }}>{c.note}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div className="label">Todas las alertas</div>
              <div className="ag">
                {data.ministries.flatMap(m => m.alerts.map((a, i) => (
                  <div key={`${m.id}-${i}`} className="alerti" style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                      <span style={{ fontSize: "0.72rem", color: "#f56565", flexShrink: 0 }}>{m.icon}</span>
                      <span style={{ color: B.textSub, fontSize: "0.77rem" }}>
                        <strong style={{ color: "#f56565", fontWeight: "600" }}>{m.name}</strong> — {a}
                      </span>
                    </div>
                    <button className="del-x" onClick={() => requestDeleteAlert(m.id, i)} title="Eliminar alerta">✕</button>
                  </div>
                )))}
              </div>
            </div>

            {/* ── Actividad por persona ── */}
            <div style={{ marginBottom: 24 }}>
              <div className="label">Actividad por persona</div>
              <div className="card" style={{ padding: "14px 18px" }}>
                {persons.map(p => {
                  const pct = p.totalTasks > 0 ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0;
                  const mainColor = p.ministries.length > 0 ? p.ministries[0].color : B.textSub;
                  const untouched = p.ministries.reduce((acc, m) => acc + m.tasks.filter(t => !t.done).length, 0);
                  return (
                    <div key={p.name} style={{ padding: "10px 0", borderBottom: `1px solid ${B.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: "0.85rem" }}>👤</span>
                          <span style={{ fontSize: "0.82rem", color: mainColor, fontWeight: "700" }}>{p.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {untouched > 0 && (
                            <span style={{ fontSize: "0.6rem", color: "#f56565", fontWeight: "600" }}>{untouched} pendiente{untouched > 1 ? "s" : ""}</span>
                          )}
                          <span style={{ fontSize: "0.7rem", color: pct === 100 ? "#5ec47a" : pct > 0 ? B.orange : B.textMuted, fontWeight: "700" }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#5ec47a" : mainColor, borderRadius: 3, transition: "width 0.5s", opacity: 0.85 }} />
                      </div>
                      <div style={{ fontSize: "0.58rem", color: B.textMuted, marginTop: 4, fontWeight: "600" }}>
                        {p.doneTasks}/{p.totalTasks} tareas · {p.ministries.map(m => m.name).join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Tareas sin tocar ── */}
            {(() => {
              const untouchedTasks = data.ministries.flatMap(m =>
                m.tasks.filter(t => !t.done).map(t => ({ ...t, ministry: m }))
              );
              return untouchedTasks.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div className="label">Tareas pendientes sin completar ({untouchedTasks.length})</div>
                  <div className="card" style={{ padding: "8px 18px" }}>
                    {untouchedTasks.map(t => (
                      <div key={`${t.ministry.id}-${t.id}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${B.border}` }}>
                        <span style={{ fontSize: "0.85rem", flexShrink: 0 }}>{t.ministry.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.78rem", color: B.textSub, lineHeight: 1.5 }}>{t.text}</div>
                          <div style={{ fontSize: "0.58rem", color: B.textMuted, marginTop: 2, fontWeight: "600" }}>
                            {t.ministry.name} · {t.ministry.responsible}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══════ MINISTERIOS LIST ═══════ */}
        {activeTab === "ministerios" && !ministry && (
          <div className="fi">
            <div className="label">Toca un ministerio para ver el detalle</div>
            <div className="mg">
              {data.ministries.map(m => {
                const done = m.tasks.filter(t => t.done).length;
                const pct = m.tasks.length > 0 ? Math.round((done / m.tasks.length) * 100) : 0;
                return (
                  <div key={m.id} className="mcard card" onClick={() => setActiveMinistry(m.id)} style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: "1.3rem" }}>{m.icon}</span>
                      {m.alerts.length > 0 && (
                        <span className="pill" style={{ background: "rgba(245,101,101,0.12)", color: "#f56565" }}>
                          {m.alerts.length} ⚠
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.84rem", color: m.color, marginBottom: 2, fontWeight: "700", letterSpacing: "0.02em" }}>{m.name}</div>
                    <div style={{ fontSize: "0.67rem", color: B.textMuted, marginBottom: 13, fontWeight: "600" }}>{m.responsible}</div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 5 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: m.color, borderRadius: 3, opacity: 0.85, boxShadow: `0 0 6px ${m.color}88` }} />
                    </div>
                    <div style={{ fontSize: "0.63rem", color: B.textMuted, fontWeight: "600" }}>{done}/{m.tasks.length} · {pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ MINISTRY DETAIL ═══════ */}
        {activeTab === "ministerios" && ministry && (
          <div className="fi">
            <button className="backbtn" onClick={() => setActiveMinistry(null)}>← Todos los ministerios</button>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${ministry.color}1a`, border: `1.5px solid ${ministry.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
              }}>{ministry.icon}</div>
              <div>
                <div style={{ fontSize: "1.05rem", color: ministry.color, fontWeight: "700" }}>{ministry.name}</div>
                <div style={{ fontSize: "0.7rem", color: B.textMuted, marginTop: 2, fontWeight: "600" }}>{ministry.responsible}</div>
              </div>
            </div>
            <div className="dg">
              <div className="card" style={{ padding: "18px 20px" }}>
                <div className="label">Tareas</div>
                {ministry.tasks.map(task => (
                  <div key={task.id} className="taskrow" style={{ justifyContent: "space-between" }}>
                    {editingTask?.mId === ministry.id && editingTask?.tId === task.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                        <input className="inline-edit" value={editingTask.text} autoFocus
                          onChange={e => setEditingTask({ ...editingTask, text: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter") editTask(ministry.id, task.id, editingTask.text); if (e.key === "Escape") setEditingTask(null); }}
                        />
                        <button className="save-check" onClick={() => editTask(ministry.id, task.id, editingTask.text)} title="Guardar">✓</button>
                        <button className="cancel-edit" onClick={() => setEditingTask(null)} title="Cancelar">✕</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, cursor: "pointer" }} onClick={() => toggleTask(ministry.id, task.id)}>
                          <div className={`cb${task.done ? " on" : ""}`}>
                            {task.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                          </div>
                          <span style={{
                            fontSize: "0.84rem", lineHeight: 1.55,
                            color: task.done ? B.textMuted : B.textSub,
                            textDecoration: task.done ? "line-through" : "none",
                          }}>{task.text}</span>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                            <button className="edit-pencil" onClick={(e) => { e.stopPropagation(); setEditingTask({ mId: ministry.id, tId: task.id, text: task.text }); }} title="Editar">✎</button>
                            <button className="del-x" onClick={(e) => { e.stopPropagation(); requestDeleteTask(ministry.id, task.id); }} title="Eliminar">✕</button>
                          </div>
                      </>
                    )}
                  </div>
                ))}
                <div className="add-row">
                    <input className="add-input" placeholder="Añadir tarea..." value={inlineNewTask[ministry.id] || ""}
                      onChange={e => setInlineNewTask({ ...inlineNewTask, [ministry.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === "Enter" && (inlineNewTask[ministry.id] || "").trim()) { addTask(ministry.id, inlineNewTask[ministry.id]); setInlineNewTask({ ...inlineNewTask, [ministry.id]: "" }); } }}
                    />
                    <button className="add-btn" disabled={!(inlineNewTask[ministry.id] || "").trim()} onClick={() => { addTask(ministry.id, inlineNewTask[ministry.id]); setInlineNewTask({ ...inlineNewTask, [ministry.id]: "" }); }}>+</button>
                  </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="card" style={{ padding: "18px 20px" }}>
                  <div className="label" style={{ color: "#f56565" }}>⚠ Alertas</div>
                  {ministry.alerts.length === 0 && <div style={{ fontSize: "0.75rem", color: B.textMuted, padding: "6px 0" }}>Sin alertas</div>}
                  {ministry.alerts.map((a, i) => (
                    <div key={i} className="alerti" style={{ justifyContent: "space-between" }}>
                      {editingAlert?.mId === ministry.id && editingAlert?.idx === i ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                          <input className="inline-edit" value={editingAlert.text} autoFocus
                            onChange={e => setEditingAlert({ ...editingAlert, text: e.target.value })}
                            onKeyDown={e => { if (e.key === "Enter") editAlert(ministry.id, i, editingAlert.text); if (e.key === "Escape") setEditingAlert(null); }}
                          />
                          <button className="save-check" onClick={() => editAlert(ministry.id, i, editingAlert.text)} title="Guardar">✓</button>
                          <button className="cancel-edit" onClick={() => setEditingAlert(null)} title="Cancelar">✕</button>
                        </div>
                      ) : (
                        <>
                          <span style={{ flex: 1 }}>{a}</span>
                          <div style={{ display: "flex", gap: 2 }}>
                              <button className="edit-pencil" onClick={() => setEditingAlert({ mId: ministry.id, idx: i, text: a })} title="Editar">✎</button>
                              <button className="del-x" onClick={() => requestDeleteAlert(ministry.id, i)} title="Eliminar">✕</button>
                            </div>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="add-row">
                      <input className="add-input" placeholder="Añadir alerta..." value={inlineNewAlert[ministry.id] || ""}
                        onChange={e => setInlineNewAlert({ ...inlineNewAlert, [ministry.id]: e.target.value })}
                        onKeyDown={e => { if (e.key === "Enter" && (inlineNewAlert[ministry.id] || "").trim()) { addAlert(ministry.id, inlineNewAlert[ministry.id]); setInlineNewAlert({ ...inlineNewAlert, [ministry.id]: "" }); } }}
                      />
                      <button className="add-btn" disabled={!(inlineNewAlert[ministry.id] || "").trim()} onClick={() => { addAlert(ministry.id, inlineNewAlert[ministry.id]); setInlineNewAlert({ ...inlineNewAlert, [ministry.id]: "" }); }}>+</button>
                    </div>
                </div>
                {ministry.futureVision && (
                  <div className="card" style={{ padding: "18px 20px" }}>
                    <div className="label" style={{ color: B.orange }}>☁ A Futuro</div>
                    {ministry.futureVision.map((v, i) => <div key={i} className="visioni">{v}</div>)}
                  </div>
                )}
                {(data.deletedTasks || []).filter(dt => dt.ministryId === ministry.id).length > 0 && (
                  <div className="card" style={{ padding: "18px 20px" }}>
                    <div className="label" style={{ color: B.textMuted }}>Tareas eliminadas</div>
                    {(data.deletedTasks || []).filter(dt => dt.ministryId === ministry.id).map((dt, i) => (
                      <div key={i} className="deleted-row">
                        <span style={{ color: B.textMuted, fontSize: "0.7rem" }}>✕</span>
                        <div>
                          <span style={{ fontSize: "0.78rem", color: B.textMuted, textDecoration: "line-through" }}>{dt.text}</span>
                          <div style={{ fontSize: "0.6rem", color: B.textMuted, marginTop: 2 }}>Eliminada el {dt.deletedAt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PERSONAS LIST ═══════ */}
        {activeTab === "personas" && !personDetail && (
          <div className="fi">
            <div className="label">Toca una persona para ver sus tareas</div>
            <div className="mg">
              {persons.map(p => {
                const pct = p.totalTasks > 0 ? Math.round((p.doneTasks / p.totalTasks) * 100) : 0;
                const mainColor = p.ministries.length > 0 ? p.ministries[0].color : B.textSub;
                return (
                  <div key={p.name} className="mcard card" onClick={() => setActivePerson(p.name)} style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: "1.3rem" }}>👤</span>
                      {p.alerts > 0 && (
                        <span className="pill" style={{ background: "rgba(245,101,101,0.12)", color: "#f56565" }}>
                          {p.alerts} ⚠
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.88rem", color: mainColor, marginBottom: 2, fontWeight: "700" }}>{p.name}</div>
                    <div style={{ fontSize: "0.63rem", color: B.textMuted, marginBottom: 13, fontWeight: "600" }}>
                      {p.ministries.map(m => m.name).join(", ")}
                      {p.community ? (p.ministries.length > 0 ? " · " : "") + p.community.map(c => c.name).join(", ") : ""}
                    </div>
                    {p.totalTasks > 0 && (
                      <>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 5 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: mainColor, borderRadius: 3, opacity: 0.85, boxShadow: `0 0 6px ${mainColor}88` }} />
                        </div>
                        <div style={{ fontSize: "0.63rem", color: B.textMuted, fontWeight: "600" }}>{p.doneTasks}/{p.totalTasks} · {pct}%</div>
                      </>
                    )}
                    {p.totalTasks === 0 && p.community && (
                      <div style={{ fontSize: "0.63rem", color: B.textMuted, fontWeight: "600" }}>Coordinador/a de comunidad</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ PERSONA DETAIL ═══════ */}
        {activeTab === "personas" && personDetail && (
          <div className="fi">
            <button className="backbtn" onClick={() => setActivePerson(null)}>← Todas las personas</button>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "rgba(245,130,10,0.12)", border: `1.5px solid ${B.orange}44`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
              }}>👤</div>
              <div>
                <div style={{ fontSize: "1.05rem", color: B.orange, fontWeight: "700" }}>{personDetail.name}</div>
                <div style={{ fontSize: "0.7rem", color: B.textMuted, marginTop: 2, fontWeight: "600" }}>
                  {personDetail.doneTasks}/{personDetail.totalTasks} tareas completadas
                  {personDetail.alerts > 0 && ` · ${personDetail.alerts} alertas`}
                </div>
              </div>
            </div>

            {/* Per-ministry tasks */}
            {personDetail.ministries.map(m => {
              const mDone = m.tasks.filter(t => t.done).length;
              const mPct = m.tasks.length > 0 ? Math.round((mDone / m.tasks.length) * 100) : 0;
              return (
                <div key={m.id} className="card" style={{ padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: "1.1rem" }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", color: m.color, fontWeight: "700" }}>{m.name}</div>
                      <div style={{ fontSize: "0.6rem", color: B.textMuted, fontWeight: "600" }}>{mDone}/{m.tasks.length} · {mPct}%</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${m.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.7rem", color: m.color, fontWeight: "700" }}>{mPct}%</span>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="label" style={{ fontSize: "0.58rem" }}>Tareas</div>
                  {m.tasks.map(task => (
                    <div key={task.id} className="taskrow" style={{ justifyContent: "space-between" }}>
                      {editingTask?.mId === m.id && editingTask?.tId === task.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                          <input className="inline-edit" value={editingTask.text} autoFocus
                            onChange={e => setEditingTask({ ...editingTask, text: e.target.value })}
                            onKeyDown={e => { if (e.key === "Enter") editTask(m.id, task.id, editingTask.text); if (e.key === "Escape") setEditingTask(null); }}
                          />
                          <button className="save-check" onClick={() => editTask(m.id, task.id, editingTask.text)} title="Guardar">✓</button>
                          <button className="cancel-edit" onClick={() => setEditingTask(null)} title="Cancelar">✕</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, cursor: "pointer" }} onClick={() => toggleTask(m.id, task.id)}>
                            <div className={`cb${task.done ? " on" : ""}`}>
                              {task.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                            </div>
                            <span style={{
                              fontSize: "0.82rem", lineHeight: 1.55,
                              color: task.done ? B.textMuted : B.textSub,
                              textDecoration: task.done ? "line-through" : "none",
                            }}>{task.text}</span>
                          </div>
                          <div style={{ display: "flex", gap: 2 }}>
                              <button className="edit-pencil" onClick={(e) => { e.stopPropagation(); setEditingTask({ mId: m.id, tId: task.id, text: task.text }); }} title="Editar">✎</button>
                              <button className="del-x" onClick={(e) => { e.stopPropagation(); requestDeleteTask(m.id, task.id); }} title="Eliminar">✕</button>
                            </div>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="add-row">
                      <input className="add-input" placeholder="Añadir tarea..." value={inlineNewTask[m.id] || ""}
                        onChange={e => setInlineNewTask({ ...inlineNewTask, [m.id]: e.target.value })}
                        onKeyDown={e => { if (e.key === "Enter" && (inlineNewTask[m.id] || "").trim()) { addTask(m.id, inlineNewTask[m.id]); setInlineNewTask({ ...inlineNewTask, [m.id]: "" }); } }}
                      />
                      <button className="add-btn" disabled={!(inlineNewTask[m.id] || "").trim()} onClick={() => { addTask(m.id, inlineNewTask[m.id]); setInlineNewTask({ ...inlineNewTask, [m.id]: "" }); }}>+</button>
                    </div>

                  {/* Alerts for this ministry */}
                  <div style={{ marginTop: 14 }}>
                    <div className="label" style={{ fontSize: "0.58rem", color: "#f56565" }}>⚠ Alertas ({m.alerts.length})</div>
                    {m.alerts.length === 0 && <div style={{ fontSize: "0.72rem", color: B.textMuted, padding: "4px 0" }}>Sin alertas</div>}
                    {m.alerts.map((a, i) => (
                      <div key={i} className="alerti" style={{ justifyContent: "space-between" }}>
                        {editingAlert?.mId === m.id && editingAlert?.idx === i ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                            <input className="inline-edit" value={editingAlert.text} autoFocus
                              onChange={e => setEditingAlert({ ...editingAlert, text: e.target.value })}
                              onKeyDown={e => { if (e.key === "Enter") editAlert(m.id, i, editingAlert.text); if (e.key === "Escape") setEditingAlert(null); }}
                            />
                            <button className="save-check" onClick={() => editAlert(m.id, i, editingAlert.text)} title="Guardar">✓</button>
                            <button className="cancel-edit" onClick={() => setEditingAlert(null)} title="Cancelar">✕</button>
                          </div>
                        ) : (
                          <>
                            <span style={{ flex: 1 }}>{a}</span>
                            <div style={{ display: "flex", gap: 2 }}>
                                <button className="edit-pencil" onClick={() => setEditingAlert({ mId: m.id, idx: i, text: a })} title="Editar">✎</button>
                                <button className="del-x" onClick={() => requestDeleteAlert(m.id, i)} title="Eliminar">✕</button>
                              </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div className="add-row">
                        <input className="add-input" placeholder="Añadir alerta..." value={inlineNewAlert[m.id] || ""}
                          onChange={e => setInlineNewAlert({ ...inlineNewAlert, [m.id]: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter" && (inlineNewAlert[m.id] || "").trim()) { addAlert(m.id, inlineNewAlert[m.id]); setInlineNewAlert({ ...inlineNewAlert, [m.id]: "" }); } }}
                        />
                        <button className="add-btn" disabled={!(inlineNewAlert[m.id] || "").trim()} onClick={() => { addAlert(m.id, inlineNewAlert[m.id]); setInlineNewAlert({ ...inlineNewAlert, [m.id]: "" }); }}>+</button>
                      </div>
                  </div>
                </div>
              );
            })}

            {/* Communities they coordinate */}
            {personDetail.community && personDetail.community.length > 0 && (
              <div className="card" style={{ padding: "18px 20px", marginBottom: 14 }}>
                <div className="label">Comunidades que coordina</div>
                {personDetail.community.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${B.border}` }}>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: "600" }}>{c.name}</div>
                      <div style={{ fontSize: "0.72rem", color: B.textMuted, marginTop: 3 }}>{c.note}</div>
                    </div>
                    <span className="pill" style={{ background: statusCfg[c.status].bg, color: statusCfg[c.status].color, flexShrink: 0 }}>
                      {statusCfg[c.status].label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════ COMUNIDADES ═══════ */}
        {activeTab === "comunidades" && (
          <div className="fi">
            <div className="label">Estado de comunidades</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {data.communities.map(c => (
                <div key={c.id} className="card" style={{ padding: "16px 18px", borderLeft: `3px solid ${statusCfg[c.status].color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: 4 }}>{c.name}</div>
                      <div style={{ fontSize: "0.68rem", color: B.textMuted, fontWeight: "600" }}>{c.coordinator}</div>
                    </div>
                    <span className="pill" style={{ background: statusCfg[c.status].bg, color: statusCfg[c.status].color, flexShrink: 0 }}>
                      {statusCfg[c.status].label}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: B.textSub, lineHeight: 1.5, marginBottom: 14 }}>{c.note}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["good","warning","neutral"].map(s => (
                      <button key={s} className="sbtn" onClick={() => setCommSt(c.id, s)} style={{
                        borderColor: statusCfg[s].color,
                        color: c.status === s ? "#fff" : statusCfg[s].color,
                        background: c.status === s ? statusCfg[s].color : "transparent",
                      }}>{statusCfg[s].label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ EVENTOS ═══════ */}
        {activeTab === "eventos" && (
          <div className="fi">
            <div className="label">Fechas clave</div>
            <div className="card" style={{ padding: "4px 18px" }}>
              {data.events.map(ev => (
                <div key={ev.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${B.border}`, gap: 10 }}>
                  {editingEvent?.eId === ev.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <input className="inline-edit" value={editingEvent.name} autoFocus placeholder="Nombre del evento"
                        onChange={e => setEditingEvent({ ...editingEvent, name: e.target.value })}
                        onKeyDown={e => { if (e.key === "Enter") editEvent(ev.id); if (e.key === "Escape") setEditingEvent(null); }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="inline-edit" value={editingEvent.date} placeholder="Fecha" style={{ flex: 1 }}
                          onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter") editEvent(ev.id); if (e.key === "Escape") setEditingEvent(null); }}
                        />
                        <div style={{ display: "flex", gap: 4 }}>
                          {["high", "medium"].map(p => (
                            <button key={p} className="sbtn" onClick={() => setEditingEvent({ ...editingEvent, priority: p })} style={{
                              borderColor: priCfg[p].color, fontSize: "0.58rem", padding: "3px 8px",
                              color: editingEvent.priority === p ? "#fff" : priCfg[p].color,
                              background: editingEvent.priority === p ? priCfg[p].color : "transparent",
                            }}>{priCfg[p].label}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="save-check" onClick={() => editEvent(ev.id)} title="Guardar">✓</button>
                        <button className="cancel-edit" onClick={() => setEditingEvent(null)} title="Cancelar">✕</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div className={`cb${ev.done ? " on" : ""}`} style={{ cursor: "pointer" }} onClick={() => toggleEvent(ev.id)}>
                          {ev.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", color: ev.done ? B.textMuted : B.text, textDecoration: ev.done ? "line-through" : "none", fontWeight: "600" }}>{ev.name}</div>
                          <div style={{ fontSize: "0.67rem", color: B.textMuted, marginTop: 3, fontWeight: "600" }}>{ev.date}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="pill" style={{
                          background: ev.done ? "rgba(100,100,100,0.1)" : `${priCfg[ev.priority]?.color}1a`,
                          color: ev.done ? B.textMuted : priCfg[ev.priority]?.color, flexShrink: 0,
                        }}>
                          {ev.done ? "✓ Hecho" : priCfg[ev.priority]?.label}
                        </span>
                        <button className="edit-pencil" onClick={() => setEditingEvent({ eId: ev.id, name: ev.name, date: ev.date, priority: ev.priority })} title="Editar">✎</button>
                        <button className="del-x" onClick={() => requestDeleteEvent(ev.id)} title="Eliminar">✕</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Add event */}
            <div className="card" style={{ padding: "14px 18px", marginTop: 12 }}>
              <div className="label" style={{ marginBottom: 10 }}>Añadir evento</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="add-row" style={{ marginTop: 0 }}>
                  <input className="add-input" placeholder="Nombre del evento..." value={newEvent.name}
                    onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                    onKeyDown={e => { if (e.key === "Enter" && newEvent.name.trim()) addEvent(); }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="add-input" placeholder="Fecha..." value={newEvent.date} style={{ flex: 1 }}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                    onKeyDown={e => { if (e.key === "Enter" && newEvent.name.trim()) addEvent(); }}
                  />
                  <div style={{ display: "flex", gap: 4 }}>
                    {["high", "medium"].map(p => (
                      <button key={p} className="sbtn" onClick={() => setNewEvent({ ...newEvent, priority: p })} style={{
                        borderColor: priCfg[p].color, fontSize: "0.58rem", padding: "3px 8px",
                        color: newEvent.priority === p ? "#fff" : priCfg[p].color,
                        background: newEvent.priority === p ? priCfg[p].color : "transparent",
                      }}>{priCfg[p].label}</button>
                    ))}
                  </div>
                  <button className="add-btn" disabled={!newEvent.name.trim()} onClick={addEvent}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div className="icon">{confirmDelete.type === "event" ? "◇" : confirmDelete.type === "task" ? "🗑️" : "⚠️"}</div>
            <div className="msg">
              {confirmDelete.type === "task" ? "¿Eliminar esta tarea?" : confirmDelete.type === "alert" ? "¿Eliminar esta alerta?" : "¿Eliminar este evento?"}
            </div>
            <div className="item-text">{confirmDelete.text}</div>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>No</button>
              <button className="btn-delete" onClick={executeDelete}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        borderTop: `1px solid ${B.border}`, padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Flame size={14} />
        <span style={{ fontSize: "0.57rem", color: B.textMuted, letterSpacing: "0.15em", fontWeight: "600" }}>
          SEMPER · JÓVENES MADRID · Guardado automático
        </span>
      </div>
    </div>
  );
}
