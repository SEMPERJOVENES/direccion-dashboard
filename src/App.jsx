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
  { id: "comunidades",  label: "Comunidades",  icon: "◎" },
  { id: "eventos",      label: "Eventos",      icon: "◇" },
  { id: "admin",        label: "Admin",        icon: "⚙" },
];
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;
const ADMIN_SUBS = [
  { id: "reunion",   label: "Reunión",   icon: "📋" },
  { id: "gestionar", label: "Gestionar", icon: "✏️" },
  { id: "historial", label: "Historial", icon: "📜" },
];

const Flame = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 4C24 4 34 16 34 26C34 32.627 29.627 38 24 38C18.373 38 14 32.627 14 26C14 16 24 4 24 4Z" fill="#f5820a"/>
    <path d="M24 18C24 18 29 24 29 29C29 31.761 26.761 34 24 34C21.239 34 19 31.761 19 29C19 24 24 18 24 18Z" fill="#fbbf24"/>
    <circle cx="24" cy="30" r="3" fill="white" fillOpacity="0.5"/>
  </svg>
);

// ── Ministry name aliases for matching ──
const MINISTRY_ALIASES = {
  formacion: ["formación", "formacion"],
  ad_intra: ["ad intra", "adintra", "ad-intra"],
  misa_tabor: ["misa y tabor", "misa", "tabor"],
  acc: ["a contra corriente", "acc", "contracorriente", "a contracorriente"],
  comunicaciones: ["comunicaciones", "comunicación", "comunicacion", "cc", "comms"],
  ceu: ["ceu"],
  economia: ["economía", "economia"],
  brand: ["brand", "marca"],
};

const ALERT_KEYWORDS = [
  "urgente", "problema", "falta", "pendiente", "atención", "atencion",
  "ojo", "cuidado", "resolver", "preocupa", "mal", "poco", "poca",
  "necesita", "necesitan", "tarda", "retraso", "bloquea", "riesgo",
];

// ── Smart parser: extract items from free-form meeting text ──
function smartParseMeeting(raw, ministries) {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const items = []; // { id, ministry (id), text, type: "tarea"|"alerta", removed: false }
  let currentMinistry = null;
  let uid = 0;

  for (const line of lines) {
    // Try to detect ministry header
    const cleanLine = line.toLowerCase().replace(/[:#\-*•→\d.)(]/g, "").trim();

    let foundMinistry = null;
    for (const [mId, aliases] of Object.entries(MINISTRY_ALIASES)) {
      for (const alias of aliases) {
        if (cleanLine === alias || cleanLine.startsWith(alias + " ") || cleanLine.endsWith(" " + alias)) {
          foundMinistry = mId;
          break;
        }
      }
      if (foundMinistry) break;
    }

    // Also check actual ministry names
    if (!foundMinistry) {
      for (const m of ministries) {
        if (cleanLine === m.name.toLowerCase() || cleanLine.startsWith(m.name.toLowerCase())) {
          foundMinistry = m.id;
          break;
        }
      }
    }

    if (foundMinistry) {
      currentMinistry = foundMinistry;
      continue;
    }

    // Extract task/alert text
    const bulletMatch = line.match(/^[-*•·]\s*(.*)/);
    const numberedMatch = line.match(/^\d+[.)]\s*(.*)/);
    let text = bulletMatch ? bulletMatch[1].trim() : numberedMatch ? numberedMatch[1].trim() : null;

    // If no bullet but we have a current ministry and the line looks like content
    if (!text && currentMinistry && line.length > 5 && line.length < 200 && !line.endsWith(":")) {
      text = line;
    }

    if (!text || text.length < 3) continue;
    if (!currentMinistry) continue;

    // Determine if it's an alert or a task
    const lower = text.toLowerCase();
    const isAlert = ALERT_KEYWORDS.some(kw => lower.includes(kw));

    uid++;
    items.push({
      id: uid,
      ministry: currentMinistry,
      text,
      type: isAlert ? "alerta" : "tarea",
      removed: false,
    });
  }

  return items;
}

function applyParsedItems(data, items) {
  const now = new Date().toLocaleDateString("es-ES");
  const activeItems = items.filter(i => !i.removed);

  const newMinistries = data.ministries.map(m => {
    const mItems = activeItems.filter(i => i.ministry === m.id);
    const newTasks = mItems.filter(i => i.type === "tarea");
    const newAlerts = mItems.filter(i => i.type === "alerta");

    let tasks = [...m.tasks];
    let maxId = tasks.reduce((a, t) => Math.max(a, t.id), 0);

    for (const nt of newTasks) {
      const exists = tasks.some(t => t.text.toLowerCase() === nt.text.toLowerCase());
      if (!exists) {
        maxId++;
        tasks.push({ id: maxId, text: nt.text, done: false });
      }
    }

    let alerts = [...m.alerts];
    for (const na of newAlerts) {
      const exists = alerts.some(a => a.toLowerCase() === na.text.toLowerCase());
      if (!exists) {
        alerts.push(na.text);
      }
    }

    return { ...m, tasks, alerts };
  });

  return { ...data, ministries: newMinistries };
}

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

  /* Admin styles */
  .admin-input{background:rgba(255,255,255,0.06);border:1.5px solid ${B.border};border-radius:10px;color:${B.text};font-family:inherit;font-size:0.85rem;padding:10px 14px;outline:none;transition:border-color 0.2s;width:100%;}
  .admin-input:focus{border-color:${B.orange};}
  .admin-input::placeholder{color:${B.textMuted};}
  .admin-btn{background:${B.orange};border:none;border-radius:10px;color:#fff;font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:10px 22px;cursor:pointer;transition:all 0.2s;}
  .admin-btn:hover{background:${B.orangeLight};}
  .admin-btn:disabled{opacity:0.4;cursor:default;}
  .admin-btn-outline{background:none;border:1.5px solid ${B.orange};border-radius:10px;color:${B.orange};font-family:inherit;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:10px 22px;cursor:pointer;transition:all 0.2s;}
  .admin-btn-outline:hover{background:rgba(245,130,10,0.1);}
  .admin-textarea{background:rgba(255,255,255,0.06);border:1.5px solid ${B.border};border-radius:10px;color:${B.text};font-family:'Courier New',monospace;font-size:0.78rem;padding:14px;outline:none;transition:border-color 0.2s;width:100%;min-height:180px;resize:vertical;line-height:1.6;}
  .admin-textarea:focus{border-color:${B.orange};}
  .admin-textarea::placeholder{color:${B.textMuted};}
  .deleted-row{display:flex;align-items:flex-start;gap:10px;padding:9px 6px;border-bottom:1px solid rgba(255,255,255,0.03);opacity:0.5;}
  .deleted-row:last-child{border-bottom:none;}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
  .shake{animation:shake 0.3s ease;}

  /* Admin sub-tabs */
  .admin-subtabs{display:flex;gap:4px;margin-bottom:20px;background:rgba(255,255,255,0.03);border-radius:12px;padding:4px;}
  .admin-subtab{flex:1;background:none;border:none;cursor:pointer;font-family:inherit;font-size:0.7rem;font-weight:600;letter-spacing:0.05em;color:${B.textMuted};padding:10px 8px;border-radius:9px;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:6px;}
  .admin-subtab.active{background:rgba(245,130,10,0.15);color:${B.orange};}
  .admin-subtab:hover:not(.active){background:rgba(255,255,255,0.04);}

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

  /* Preview editable row */
  .preview-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.04);border-radius:6px;transition:background 0.15s;}
  .preview-item:hover{background:rgba(255,255,255,0.03);}
  .preview-item.removed{opacity:0.25;text-decoration:line-through;}
  .preview-edit{background:none;border:none;color:${B.text};font-family:inherit;font-size:0.78rem;flex:1;outline:none;padding:4px 0;}
  .preview-edit:focus{border-bottom:1px solid ${B.orange};}
  .preview-select{background:rgba(255,255,255,0.06);border:1px solid ${B.border};border-radius:6px;color:${B.text};font-family:inherit;font-size:0.65rem;padding:4px 6px;outline:none;cursor:pointer;}
  .preview-select option{background:${B.bg};color:${B.text};}
  .type-toggle{background:none;border:1px solid;border-radius:12px;font-size:0.58rem;font-weight:700;letter-spacing:0.05em;padding:2px 8px;cursor:pointer;font-family:inherit;transition:all 0.15s;text-transform:uppercase;white-space:nowrap;}

  /* Ministry selector */
  .ministry-selector{background:rgba(255,255,255,0.06);border:1.5px solid ${B.border};border-radius:10px;color:${B.text};font-family:inherit;font-size:0.85rem;padding:10px 14px;outline:none;width:100%;cursor:pointer;transition:border-color 0.2s;appearance:none;-webkit-appearance:none;}
  .ministry-selector:focus{border-color:${B.orange};}
  .ministry-selector option{background:${B.bg};color:${B.text};}

  /* Manage item row */
  .manage-row{display:flex;align-items:center;gap:10px;padding:10px 8px;border-bottom:1px solid rgba(255,255,255,0.04);border-radius:6px;transition:background 0.15s;}
  .manage-row:hover{background:rgba(255,255,255,0.03);}
  .manage-row:last-child{border-bottom:none;}
`;

export default function SemperDashboard() {
  const [data, setData] = useState(INITIAL_DATA);
  const [activeMinistry, setActiveMinistry] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loaded, setLoaded] = useState(false);

  // Admin state
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [adminSub, setAdminSub] = useState("reunion");

  // Meeting (Reunión) state
  const [meetingText, setMeetingText] = useState("");
  const [parsedItems, setParsedItems] = useState(null); // array of { id, ministry, text, type, removed }
  const [updateApplied, setUpdateApplied] = useState(false);

  // Gestionar state
  const [manageMinistry, setManageMinistry] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newAlertText, setNewAlertText] = useState("");

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

  const deleteTask = (mId, tId) => {
    const m = data.ministries.find(mm => mm.id === mId);
    const task = m?.tasks.find(t => t.id === tId);
    if (!m || !task) return;
    const now = new Date().toLocaleDateString("es-ES");
    save({
      ...data,
      ministries: data.ministries.map(mm => mm.id === mId ? { ...mm, tasks: mm.tasks.filter(t => t.id !== tId) } : mm),
      deletedTasks: [...(data.deletedTasks || []), { ministryId: mId, ministryName: m.name, text: task.text, wasDone: task.done, deletedAt: now }],
    });
  };

  const deleteAlert = (mId, alertIdx) => {
    save({
      ...data,
      ministries: data.ministries.map(m => m.id === mId ? { ...m, alerts: m.alerts.filter((_, i) => i !== alertIdx) } : m),
    });
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

  // ── Computed ──
  const totalTasks = data.ministries.reduce((a, m) => a + m.tasks.length, 0);
  const doneTasks  = data.ministries.reduce((a, m) => a + m.tasks.filter(t => t.done).length, 0);
  const totalAlerts = data.ministries.reduce((a, m) => a + m.alerts.length, 0);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const ministry = activeMinistry ? data.ministries.find(m => m.id === activeMinistry) : null;
  const managedMinistry = manageMinistry ? data.ministries.find(m => m.id === manageMinistry) : null;

  // ── Admin handlers ──
  const handlePassSubmit = () => {
    if (passInput === ADMIN_PASS) {
      setAdminUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 1500);
    }
    setPassInput("");
  };

  const handleParse = () => {
    if (!meetingText.trim()) return;
    const items = smartParseMeeting(meetingText, data.ministries);
    setParsedItems(items);
    setUpdateApplied(false);
  };

  const handleApplyParsed = () => {
    if (!parsedItems) return;
    const now = new Date().toLocaleDateString("es-ES");
    const newData = applyParsedItems(data, parsedItems);
    newData.meetingLog = [...(newData.meetingLog || []), { date: now, raw: meetingText }];
    save(newData);
    setParsedItems(null);
    setMeetingText("");
    setUpdateApplied(true);
    setTimeout(() => setUpdateApplied(false), 3000);
  };

  const updateParsedItem = (itemId, field, value) => {
    setParsedItems(prev => prev.map(i => i.id === itemId ? { ...i, [field]: value } : i));
  };

  const toggleParsedRemoved = (itemId) => {
    setParsedItems(prev => prev.map(i => i.id === itemId ? { ...i, removed: !i.removed } : i));
  };

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
          <button key={tab.id} className="tabtn" onClick={() => { setActiveTab(tab.id); setActiveMinistry(null); }}>
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
            <div>
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
                    {adminUnlocked && (
                      <button className="del-x" onClick={() => deleteAlert(m.id, i)} title="Eliminar alerta">✕</button>
                    )}
                  </div>
                )))}
              </div>
            </div>
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
                    {adminUnlocked && (
                      <button className="del-x" onClick={(e) => { e.stopPropagation(); deleteTask(ministry.id, task.id); }} title="Eliminar tarea">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ministry.alerts.length > 0 && (
                  <div className="card" style={{ padding: "18px 20px" }}>
                    <div className="label" style={{ color: "#f56565" }}>⚠ Alertas</div>
                    {ministry.alerts.map((a, i) => (
                      <div key={i} className="alerti" style={{ justifyContent: "space-between" }}>
                        <span style={{ flex: 1 }}>{a}</span>
                        {adminUnlocked && (
                          <button className="del-x" onClick={() => deleteAlert(ministry.id, i)} title="Eliminar alerta">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
              {data.events.map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${B.border}`, gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className={`cb${e.done ? " on" : ""}`} style={{ cursor: "pointer" }} onClick={() => toggleEvent(e.id)}>
                      {e.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", color: e.done ? B.textMuted : B.text, textDecoration: e.done ? "line-through" : "none", fontWeight: "600" }}>{e.name}</div>
                      <div style={{ fontSize: "0.67rem", color: B.textMuted, marginTop: 3, fontWeight: "600" }}>{e.date}</div>
                    </div>
                  </div>
                  <span className="pill" style={{
                    background: e.done ? "rgba(100,100,100,0.1)" : `${priCfg[e.priority]?.color}1a`,
                    color: e.done ? B.textMuted : priCfg[e.priority]?.color, flexShrink: 0,
                  }}>
                    {e.done ? "✓ Hecho" : priCfg[e.priority]?.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════ ADMIN ═══════ */}
        {activeTab === "admin" && (
          <div className="fi">
            {!adminUnlocked ? (
              /* ── Password gate ── */
              <div style={{ maxWidth: 360, margin: "60px auto", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>⚙</div>
                <div style={{ fontSize: "0.9rem", color: B.textSub, marginBottom: 24, fontWeight: "600" }}>Panel de Administración</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    className={`admin-input${passError ? " shake" : ""}`}
                    type="password" placeholder="Contraseña"
                    value={passInput}
                    onChange={e => setPassInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handlePassSubmit()}
                    style={passError ? { borderColor: "#f56565" } : {}}
                  />
                  <button className="admin-btn" onClick={handlePassSubmit}>Entrar</button>
                </div>
                {passError && <div style={{ color: "#f56565", fontSize: "0.72rem", marginTop: 10 }}>Contraseña incorrecta</div>}
              </div>
            ) : (
              <div>
                {/* Header + logout */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Panel de Administración</div>
                    <div style={{ fontSize: "0.65rem", color: B.textMuted, marginTop: 3 }}>Gestiona tareas, alertas y notas de reunión</div>
                  </div>
                  <button className="admin-btn-outline" onClick={() => setAdminUnlocked(false)} style={{ fontSize: "0.6rem", padding: "6px 14px" }}>
                    Cerrar sesión
                  </button>
                </div>

                {/* Sub-tabs */}
                <div className="admin-subtabs">
                  {ADMIN_SUBS.map(s => (
                    <button key={s.id} className={`admin-subtab${adminSub === s.id ? " active" : ""}`} onClick={() => setAdminSub(s.id)}>
                      <span>{s.icon}</span> {s.label}
                    </button>
                  ))}
                </div>

                {/* ────── REUNIÓN ────── */}
                {adminSub === "reunion" && (
                  <div>
                    <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
                      <div className="label">Pegar acta o transcripción de reunión</div>
                      <div style={{ fontSize: "0.7rem", color: B.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
                        Pega el texto de la reunión. El sistema detectará automáticamente los ministerios mencionados
                        y extraerá tareas y alertas. Podrás revisarlas y editarlas antes de aplicar.
                      </div>
                      <textarea
                        className="admin-textarea"
                        placeholder={"Pega aquí el acta de la reunión...\n\nEjemplo:\nFormación:\n- Grabar video para YouTube\n- Urgente: nadie se graba\n\nBrand:\n- Contactar nuevo proveedor\n- Pendiente: subir colecciones"}
                        value={meetingText}
                        onChange={e => { setMeetingText(e.target.value); setParsedItems(null); setUpdateApplied(false); }}
                      />
                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <button className="admin-btn" onClick={handleParse} disabled={!meetingText.trim()}>
                          Analizar texto
                        </button>
                      </div>
                      {updateApplied && (
                        <div style={{ color: "#5ec47a", fontSize: "0.75rem", marginTop: 10, fontWeight: "600" }}>
                          ✓ Cambios aplicados correctamente
                        </div>
                      )}
                    </div>

                    {/* ── Editable preview ── */}
                    {parsedItems && (
                      <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                          <div className="label" style={{ color: B.orange, marginBottom: 0 }}>
                            Vista previa — {parsedItems.filter(i => !i.removed).length} items detectados
                          </div>
                          <button className="admin-btn" onClick={handleApplyParsed} disabled={parsedItems.filter(i => !i.removed).length === 0}>
                            Aplicar cambios
                          </button>
                        </div>
                        {parsedItems.length === 0 && (
                          <div style={{ fontSize: "0.78rem", color: B.textMuted, padding: "20px 0", textAlign: "center" }}>
                            No se detectaron tareas ni alertas. Prueba a estructurar el texto con nombres de ministerio como encabezados.
                          </div>
                        )}
                        {parsedItems.map(item => {
                          const m = data.ministries.find(mm => mm.id === item.ministry);
                          return (
                            <div key={item.id} className={`preview-item${item.removed ? " removed" : ""}`}>
                              {/* Type toggle */}
                              <button
                                className="type-toggle"
                                onClick={() => updateParsedItem(item.id, "type", item.type === "tarea" ? "alerta" : "tarea")}
                                style={{
                                  borderColor: item.type === "alerta" ? "#f56565" : "#5ec47a",
                                  color: item.type === "alerta" ? "#f56565" : "#5ec47a",
                                }}
                              >
                                {item.type === "alerta" ? "⚠ Alerta" : "✓ Tarea"}
                              </button>

                              {/* Ministry selector */}
                              <select
                                className="preview-select"
                                value={item.ministry}
                                onChange={e => updateParsedItem(item.id, "ministry", e.target.value)}
                              >
                                {data.ministries.map(mm => (
                                  <option key={mm.id} value={mm.id}>{mm.icon} {mm.name}</option>
                                ))}
                              </select>

                              {/* Editable text */}
                              <input
                                className="preview-edit"
                                value={item.text}
                                onChange={e => updateParsedItem(item.id, "text", e.target.value)}
                              />

                              {/* Remove/restore */}
                              <button
                                className="del-x"
                                onClick={() => toggleParsedRemoved(item.id)}
                                title={item.removed ? "Restaurar" : "Quitar"}
                                style={item.removed ? { color: "#5ec47a" } : {}}
                              >
                                {item.removed ? "↩" : "✕"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ────── GESTIONAR ────── */}
                {adminSub === "gestionar" && (
                  <div>
                    {/* Ministry selector */}
                    <div style={{ marginBottom: 18, position: "relative" }}>
                      <div className="label">Seleccionar ministerio</div>
                      <select
                        className="ministry-selector"
                        value={manageMinistry}
                        onChange={e => { setManageMinistry(e.target.value); setNewTaskText(""); setNewAlertText(""); }}
                      >
                        <option value="">— Elige un ministerio —</option>
                        {data.ministries.map(m => (
                          <option key={m.id} value={m.id}>{m.icon} {m.name} ({m.responsible})</option>
                        ))}
                      </select>
                    </div>

                    {managedMinistry && (
                      <>
                        {/* Ministry header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 10,
                            background: `${managedMinistry.color}1a`, border: `1.5px solid ${managedMinistry.color}44`,
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem",
                          }}>{managedMinistry.icon}</div>
                          <div>
                            <div style={{ fontSize: "0.95rem", color: managedMinistry.color, fontWeight: "700" }}>{managedMinistry.name}</div>
                            <div style={{ fontSize: "0.65rem", color: B.textMuted, fontWeight: "600" }}>{managedMinistry.responsible}</div>
                          </div>
                        </div>

                        {/* Tasks */}
                        <div className="card" style={{ padding: "18px 20px", marginBottom: 14 }}>
                          <div className="label">Tareas ({managedMinistry.tasks.length})</div>
                          {managedMinistry.tasks.map(task => (
                            <div key={task.id} className="manage-row">
                              <div
                                className={`cb${task.done ? " on" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => toggleTask(managedMinistry.id, task.id)}
                              >
                                {task.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                              </div>
                              <span style={{
                                flex: 1, fontSize: "0.82rem", lineHeight: 1.5,
                                color: task.done ? B.textMuted : B.textSub,
                                textDecoration: task.done ? "line-through" : "none",
                              }}>{task.text}</span>
                              <button className="del-x" onClick={() => deleteTask(managedMinistry.id, task.id)} title="Eliminar tarea">✕</button>
                            </div>
                          ))}
                          <div className="add-row">
                            <input
                              className="add-input"
                              placeholder="Nueva tarea..."
                              value={newTaskText}
                              onChange={e => setNewTaskText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && newTaskText.trim()) { addTask(managedMinistry.id, newTaskText); setNewTaskText(""); } }}
                            />
                            <button className="add-btn" disabled={!newTaskText.trim()} onClick={() => { addTask(managedMinistry.id, newTaskText); setNewTaskText(""); }}>+</button>
                          </div>
                        </div>

                        {/* Alerts */}
                        <div className="card" style={{ padding: "18px 20px", marginBottom: 14 }}>
                          <div className="label" style={{ color: "#f56565" }}>⚠ Alertas ({managedMinistry.alerts.length})</div>
                          {managedMinistry.alerts.length === 0 && (
                            <div style={{ fontSize: "0.75rem", color: B.textMuted, padding: "6px 0" }}>Sin alertas</div>
                          )}
                          {managedMinistry.alerts.map((a, i) => (
                            <div key={i} className="manage-row">
                              <span style={{ fontSize: "0.72rem", color: "#f56565", flexShrink: 0 }}>⚠</span>
                              <span style={{ flex: 1, fontSize: "0.82rem", color: B.textSub, lineHeight: 1.5 }}>{a}</span>
                              <button className="del-x" onClick={() => deleteAlert(managedMinistry.id, i)} title="Eliminar alerta">✕</button>
                            </div>
                          ))}
                          <div className="add-row">
                            <input
                              className="add-input"
                              placeholder="Nueva alerta..."
                              value={newAlertText}
                              onChange={e => setNewAlertText(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter" && newAlertText.trim()) { addAlert(managedMinistry.id, newAlertText); setNewAlertText(""); } }}
                            />
                            <button className="add-btn" disabled={!newAlertText.trim()} onClick={() => { addAlert(managedMinistry.id, newAlertText); setNewAlertText(""); }}>+</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ────── HISTORIAL ────── */}
                {adminSub === "historial" && (
                  <div>
                    {(data.meetingLog || []).length > 0 && (
                      <div className="card" style={{ padding: "20px", marginBottom: 16 }}>
                        <div className="label">Historial de reuniones</div>
                        {[...(data.meetingLog || [])].reverse().map((log, i) => (
                          <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${B.border}` }}>
                            <div style={{ fontSize: "0.7rem", color: B.orange, fontWeight: "600", marginBottom: 6 }}>{log.date}</div>
                            <pre style={{
                              fontSize: "0.68rem", color: B.textMuted, whiteSpace: "pre-wrap", wordBreak: "break-word",
                              fontFamily: "'Courier New', monospace", lineHeight: 1.5, margin: 0,
                              maxHeight: 120, overflow: "hidden",
                            }}>{log.raw}</pre>
                          </div>
                        ))}
                      </div>
                    )}
                    {(data.meetingLog || []).length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px 0", color: B.textMuted, fontSize: "0.8rem" }}>
                        No hay reuniones registradas todavía.
                      </div>
                    )}

                    {(data.deletedTasks || []).length > 0 && (
                      <div className="card" style={{ padding: "20px" }}>
                        <div className="label" style={{ color: B.textMuted }}>Todas las tareas eliminadas</div>
                        {(data.deletedTasks || []).map((dt, i) => (
                          <div key={i} className="deleted-row">
                            <span style={{ color: B.textMuted, fontSize: "0.7rem" }}>✕</span>
                            <div>
                              <span style={{ fontSize: "0.72rem", color: B.textMuted, textDecoration: "line-through" }}>{dt.text}</span>
                              <div style={{ fontSize: "0.58rem", color: B.textMuted, marginTop: 2 }}>
                                {dt.ministryName} · Eliminada el {dt.deletedAt}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: `1px solid ${B.border}`, padding: "10px 18px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Flame size={14} />
        <span style={{ fontSize: "0.57rem", color: B.textMuted, letterSpacing: "0.15em", fontWeight: "600" }}>
          SEMPER · JÓVENES MADRID · {adminUnlocked ? "🔓 Admin activo · " : ""}Guardado automático
        </span>
      </div>
    </div>
  );
}
