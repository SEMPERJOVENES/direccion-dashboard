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
    { id: 1, name: "San Pablo", status: "warning", note: "Está flaqueando la asistencia", coordinator: "Pat Hidalgo", tasks: [] },
    { id: 2, name: "San Ignacio", status: "good", note: "Bien, buena asistencia", coordinator: "Pauli Sánchez", tasks: [] },
    { id: 3, name: "San Martín", status: "good", note: "Bien", coordinator: "Marta Giribert", tasks: [] },
  ],
  extraPersons: [],
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
      id: "administracion", name: "Administración", responsible: "Guille", color: "#a78bfa", icon: "📋",
      tasks: [],
      alerts: [],
    },
    {
      id: "operaciones", name: "Operaciones", responsible: "Carla", color: "#f59e0b", icon: "⚙️",
      tasks: [],
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
  { id: "overview",     label: "General",      icon: "🏠" },
  { id: "ministerios",  label: "Ministerios",  icon: "⛪" },
  { id: "personas",     label: "Personas",     icon: "👤" },
  { id: "comunidades",  label: "Comunidades",  icon: "🫂" },
  { id: "eventos",      label: "Eventos",      icon: "📅" },
  { id: "actividad",    label: "Actividad",    icon: "📈" },
];

const PERIOD_OPTIONS = [
  { id: "7d",  label: "7 días",   days: 7 },
  { id: "30d", label: "30 días",  days: 30 },
  { id: "90d", label: "3 meses",  days: 90 },
  { id: "all", label: "Todo",     days: 9999 },
];

const RECURRING_FREQ = [
  { id: "weekly",   label: "Semanal",   short: "Sem", days: 7 },
  { id: "biweekly", label: "Quincenal", short: "Quin", days: 14 },
  { id: "monthly",  label: "Mensual",   short: "Mens", days: 30 },
];
const recurringLabel = { weekly: "Semanal", biweekly: "Quincenal", monthly: "Mensual" };

// Check if a recurring task should be reset (done -> undone)
function shouldResetRecurring(task) {
  if (!task.done || !task.recurring || !task.lastCompleted) return false;
  const freq = RECURRING_FREQ.find(f => f.id === task.recurring);
  if (!freq) return false;
  const elapsed = (Date.now() - new Date(task.lastCompleted).getTime()) / (1000 * 60 * 60 * 24);
  return elapsed >= freq.days;
}

function resetTasksInArray(tasks) {
  if (!tasks || !tasks.length) return tasks;
  let changed = false;
  const result = tasks.map(t => {
    if (shouldResetRecurring(t)) { changed = true; return { ...t, done: false }; }
    return t;
  });
  return changed ? result : tasks;
}

const Flame = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ filter: "drop-shadow(0 0 6px rgba(245,130,10,0.6))" }}>
    <defs>
      <radialGradient id="flameGlow" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#fff7e0" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#f5820a" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="outerFlame" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#f5820a" />
        <stop offset="40%" stopColor="#f59e0a" />
        <stop offset="80%" stopColor="#e8520a" />
        <stop offset="100%" stopColor="#c2300a" />
      </linearGradient>
      <linearGradient id="innerFlame" x1="0.5" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#fef3c7" />
      </linearGradient>
    </defs>
    {/* Glow */}
    <circle cx="24" cy="30" r="14" fill="url(#flameGlow)">
      <animate attributeName="r" values="13;15;13" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.5s" repeatCount="indefinite" />
    </circle>
    {/* Outer flame */}
    <path fill="url(#outerFlame)">
      <animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="
        M24 5C24 5 35 16 35 26.5C35 33 30 38 24 38C18 38 13 33 13 26.5C13 16 24 5 24 5Z;
        M24 4C24 4 34 15 34 26C34 32.5 29.5 38.5 24 38.5C18.5 38.5 14 32.5 14 26C14 15 24 4 24 4Z;
        M24 6C24 6 36 17 36 27C36 33.5 30.5 37.5 24 37.5C17.5 37.5 12 33.5 12 27C12 17 24 6 24 6Z;
        M24 5C24 5 35 16 35 26.5C35 33 30 38 24 38C18 38 13 33 13 26.5C13 16 24 5 24 5Z
      " />
    </path>
    {/* Mid flame */}
    <path fill="#f59e0a" opacity="0.8">
      <animate attributeName="d" dur="0.6s" repeatCount="indefinite" values="
        M24 14C24 14 31 22 31 28C31 31.5 28 35 24 35C20 35 17 31.5 17 28C17 22 24 14 24 14Z;
        M24 12C24 12 30 21 30 27.5C30 31 27.5 35.5 24 35.5C20.5 35.5 18 31 18 27.5C18 21 24 12 24 12Z;
        M24 15C24 15 32 23 32 28.5C32 32 29 34.5 24 34.5C19 34.5 16 32 16 28.5C16 23 24 15 24 15Z;
        M24 14C24 14 31 22 31 28C31 31.5 28 35 24 35C20 35 17 31.5 17 28C17 22 24 14 24 14Z
      " />
    </path>
    {/* Inner flame */}
    <path fill="url(#innerFlame)">
      <animate attributeName="d" dur="0.5s" repeatCount="indefinite" values="
        M24 20C24 20 28.5 25 28.5 29C28.5 31.5 26.5 33.5 24 33.5C21.5 33.5 19.5 31.5 19.5 29C19.5 25 24 20 24 20Z;
        M24 19C24 19 28 24.5 28 28.5C28 31 26 34 24 34C22 34 20 31 20 28.5C20 24.5 24 19 24 19Z;
        M24 21C24 21 29 25.5 29 29.5C29 32 27 33 24 33C21 33 19 32 19 29.5C19 25.5 24 21 24 21Z;
        M24 20C24 20 28.5 25 28.5 29C28.5 31.5 26.5 33.5 24 33.5C21.5 33.5 19.5 31.5 19.5 29C19.5 25 24 20 24 20Z
      " />
    </path>
    {/* Core bright spot */}
    <ellipse cx="24" cy="31" rx="3" ry="4" fill="white" opacity="0.45">
      <animate attributeName="ry" values="4;3;4" dur="0.7s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.4;0.6;0.4" dur="0.7s" repeatCount="indefinite" />
    </ellipse>
    {/* Tiny spark flickers */}
    <circle cx="21" cy="18" r="0.8" fill="#fbbf24" opacity="0">
      <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" begin="0s" />
      <animate attributeName="cy" values="18;12;8" dur="2s" repeatCount="indefinite" begin="0s" />
    </circle>
    <circle cx="27" cy="16" r="0.6" fill="#f5820a" opacity="0">
      <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
      <animate attributeName="cy" values="16;10;6" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
    </circle>
  </svg>
);

const SEMPER_USERS = ["Stefano", "Guille", "Carla", "Pat", "Guillem", "Marta G.", "Alfonso", "Blanca", "Ori", "Agustín", "Leya", "Mari Tere", "Marta", "Pauli Sánchez", "Marta Giribert"];

function UserPicker({ onPick }) {
  const [custom, setCustom] = useState('');
  return (
    <div style={{ background: B.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, padding: '24px', fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <Flame size={40} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', color: B.textMuted, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>SEMPER · PANEL DE DIRECCIÓN</div>
        <div style={{ fontSize: '1.1rem', color: B.text, fontWeight: 600 }}>¿Quién eres?</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: '100%', maxWidth: 360 }}>
        {SEMPER_USERS.map(u => (
          <button key={u} onClick={() => onPick(u)}
            style={{ background: B.bgCard, border: `1px solid ${B.border}`, borderRadius: 10, color: B.text, fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, padding: '12px 8px', cursor: 'pointer', transition: 'all 0.15s' }}>
            {u}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 360 }}>
        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && custom.trim() && onPick(custom.trim())}
          placeholder="Otro nombre..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: `1px solid ${B.border}`, borderRadius: 8, color: B.text, fontFamily: 'inherit', fontSize: '0.82rem', padding: '10px 12px', outline: 'none' }}
        />
        <button onClick={() => custom.trim() && onPick(custom.trim())}
          style={{ background: B.orange, border: 'none', borderRadius: 8, color: '#fff', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 700, padding: '10px 16px', cursor: 'pointer' }}>
          OK
        </button>
      </div>
    </div>
  );
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

  /* Recurring badge */
  .rec-badge{display:inline-flex;align-items:center;gap:3px;padding:1px 7px;border-radius:10px;font-size:0.55rem;font-weight:700;letter-spacing:0.03em;background:rgba(96,165,250,0.12);color:#60a5fa;white-space:nowrap;margin-left:6px;flex-shrink:0;}
  .rec-toggle{background:none;border:1.5px solid ${B.border};border-radius:8px;color:${B.textMuted};font-size:0.6rem;font-weight:700;padding:4px 8px;cursor:pointer;transition:all 0.2s;font-family:inherit;white-space:nowrap;flex-shrink:0;}
  .rec-toggle:hover{border-color:#60a5fa;color:#60a5fa;}
  .rec-toggle.active{background:rgba(96,165,250,0.15);border-color:#60a5fa;color:#60a5fa;}
  .rec-menu{position:absolute;bottom:calc(100% + 4px);right:0;background:${B.bg};border:1.5px solid ${B.border};border-radius:10px;padding:4px;z-index:20;box-shadow:0 4px 20px rgba(0,0,0,0.4);display:flex;flex-direction:column;gap:2px;min-width:120px;}
  .rec-opt{background:none;border:none;cursor:pointer;font-family:inherit;font-size:0.68rem;font-weight:600;color:${B.textSub};padding:7px 10px;border-radius:7px;text-align:left;transition:all 0.15s;}
  .rec-opt:hover{background:rgba(96,165,250,0.1);color:#60a5fa;}
  .rec-opt.sel{background:rgba(96,165,250,0.15);color:#60a5fa;}

  /* Activity tab */
  .period-tabs{display:flex;gap:4px;margin-bottom:18px;background:rgba(255,255,255,0.03);border-radius:10px;padding:3px;}
  .period-tab{flex:1;background:none;border:none;cursor:pointer;font-family:inherit;font-size:0.65rem;font-weight:700;letter-spacing:0.04em;color:${B.textMuted};padding:8px 6px;border-radius:8px;transition:all 0.2s;text-align:center;}
  .period-tab.active{background:rgba(245,130,10,0.15);color:${B.orange};}
  .period-tab:hover:not(.active){background:rgba(255,255,255,0.04);}
  .act-stat{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid ${B.border};}
  .act-stat:last-child{border-bottom:none;}
  .act-bar{height:6px;background:rgba(255,255,255,0.06);border-radius:3px;flex:1;overflow:hidden;}
  .act-bar-fill{height:100%;border-radius:3px;transition:width 0.4s;}
  .act-feed-day{font-size:0.62rem;color:${B.orange};font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 0 6px;border-bottom:1px solid rgba(245,130,10,0.15);}
  .act-feed-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);font-size:0.76rem;}
  .act-feed-item:last-child{border-bottom:none;}
  .act-badge{display:inline-flex;padding:2px 7px;border-radius:10px;font-size:0.55rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;white-space:nowrap;}
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
  const [inlineNewCommTask, setInlineNewCommTask] = useState({}); // { [cId]: text }
  const [inlineNewExtraTask, setInlineNewExtraTask] = useState({}); // { [personName]: text }
  const [inlineNewRecurring, setInlineNewRecurring] = useState({}); // { [key]: "weekly"|"biweekly"|"monthly"|null }

  // Event editing state
  const [editingEvent, setEditingEvent] = useState(null); // { eId, name, date, priority }
  const [newEvent, setNewEvent] = useState({ name: "", date: "", priority: "medium" });

  // Confirm delete state: { type: "task"|"alert"|"event", mId?, tId?, idx?, eId?, text }
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Activity tab state
  const [activityData, setActivityData] = useState([]);
  const [activityPeriod, setActivityPeriod] = useState("30d");
  const [activityLoading, setActivityLoading] = useState(false);

  const saveTimer = useRef(null);
  const [currentUser, setCurrentUser] = useState(() => { try { return localStorage.getItem('semper_user') || null; } catch(_) { return null; } });

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
          // Ensure communities have tasks arrays
          const comms = (d.communities || INITIAL_DATA.communities).map(c => ({ ...c, tasks: c.tasks || [] }));
          setData({ ...INITIAL_DATA, ...d, communities: comms, extraPersons: d.extraPersons || INITIAL_DATA.extraPersons || [], deletedTasks: d.deletedTasks || [], meetingLog: d.meetingLog || [] });
        } else {
          // Migration: try localStorage
          const stored = localStorage.getItem("semper_v6");
          if (stored) {
            const parsed = JSON.parse(stored);
            const comms = (parsed.communities || INITIAL_DATA.communities).map(c => ({ ...c, tasks: c.tasks || [] }));
            const merged = { ...INITIAL_DATA, ...parsed, communities: comms, extraPersons: parsed.extraPersons || INITIAL_DATA.extraPersons || [], deletedTasks: parsed.deletedTasks || [], meetingLog: parsed.meetingLog || [] };
            setData(merged);
            // Push to Supabase
            await supabase.from("semper_state").upsert({ id: "main", data: merged, updated_at: new Date().toISOString() });
          }
        }
      } catch (_) {}
      setLoaded(true);
    })();
  }, []);

  // Auto-reset recurring tasks on load
  useEffect(() => {
    if (!loaded) return;
    let changed = false;
    const newMinistries = data.ministries.map(m => {
      const reset = resetTasksInArray(m.tasks);
      if (reset !== m.tasks) { changed = true; return { ...m, tasks: reset }; }
      return m;
    });
    const newComms = data.communities.map(c => {
      const reset = resetTasksInArray(c.tasks || []);
      if (reset !== (c.tasks || [])) { changed = true; return { ...c, tasks: reset }; }
      return c;
    });
    const newExtra = (data.extraPersons || []).map(ep => {
      const reset = resetTasksInArray(ep.tasks || []);
      if (reset !== (ep.tasks || [])) { changed = true; return { ...ep, tasks: reset }; }
      return ep;
    });
    if (changed) {
      save({ ...data, ministries: newMinistries, communities: newComms, extraPersons: newExtra }, 'recurring_reset', 'Tareas recurrentes reiniciadas');
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch activity when Actividad tab is active or period changes
  useEffect(() => {
    if (activeTab !== "actividad") return;
    setActivityLoading(true);
    const period = PERIOD_OPTIONS.find(p => p.id === activityPeriod);
    const since = new Date();
    since.setDate(since.getDate() - (period?.days || 30));
    (async () => {
      try {
        let query = supabase.from("semper_activity").select("*").order("created_at", { ascending: false });
        if (activityPeriod !== "all") {
          query = query.gte("created_at", since.toISOString());
        }
        const { data: rows } = await query.limit(500);
        setActivityData(rows || []);
      } catch (_) {}
      setActivityLoading(false);
    })();
  }, [activeTab, activityPeriod]);

  // Debounced save to Supabase
  const save = useCallback((d, action = '', detail = '') => {
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
    // Log activity
    let user; try { user = localStorage.getItem('semper_user'); } catch(_) {}
    if (action && user) {
      supabase.from("semper_activity").insert({ user_name: user, action, detail }).catch(() => {});
    }
  }, []);

  // ── CRUD helpers ──
  const toggleTask = (mId, tId) => {
    const m = data.ministries.find(mm => mm.id === mId);
    const t = m?.tasks.find(tt => tt.id === tId);
    const nowDone = !t?.done;
    save(
      { ...data, ministries: data.ministries.map(mm => mm.id === mId ? { ...mm, tasks: mm.tasks.map(tt => tt.id === tId ? { ...tt, done: nowDone, ...(nowDone && tt.recurring ? { lastCompleted: new Date().toISOString() } : {}) } : tt) } : mm) },
      t?.done ? 'task_undone' : 'task_done',
      `${t?.text || ''} — ${m?.name || ''}`
    );
  };
  const toggleEvent = (eId) => {
    const ev = data.events.find(e => e.id === eId);
    save(
      { ...data, events: data.events.map(e => e.id === eId ? { ...e, done: !e.done } : e) },
      ev?.done ? 'event_undone' : 'event_done',
      ev?.name || ''
    );
  };
  const setCommSt   = (cId, s)    => save({ ...data, communities: data.communities.map(c => c.id === cId ? { ...c, status: s } : c) });

  // ── Community task CRUD ──
  const toggleCommTask = (cId, tId) => {
    const c = data.communities.find(cc => cc.id === cId);
    const t = (c?.tasks || []).find(tt => tt.id === tId);
    const nowDone = !t?.done;
    save(
      { ...data, communities: data.communities.map(cc => cc.id === cId ? { ...cc, tasks: (cc.tasks || []).map(tt => tt.id === tId ? { ...tt, done: nowDone, ...(nowDone && tt.recurring ? { lastCompleted: new Date().toISOString() } : {}) } : tt) } : cc) },
      t?.done ? 'task_undone' : 'task_done',
      `${t?.text || ''} — Comunidad ${c?.name || ''}`
    );
  };
  const addCommTask = (cId, text, recurring = null) => {
    if (!text.trim()) return;
    const c = data.communities.find(cc => cc.id === cId);
    save({
      ...data,
      communities: data.communities.map(cc => {
        if (cc.id !== cId) return cc;
        const tasks = cc.tasks || [];
        const maxId = tasks.reduce((a, t) => Math.max(a, t.id), 0);
        const newTask = { id: maxId + 1, text: text.trim(), done: false };
        if (recurring) { newTask.recurring = recurring; newTask.lastCompleted = null; }
        return { ...cc, tasks: [...tasks, newTask] };
      }),
    }, 'task_added', `${text.trim()}${recurring ? ` (${recurringLabel[recurring]})` : ''} — Comunidad ${c?.name || ''}`);
  };
  const editCommTask = (cId, tId, newText) => {
    if (!newText.trim()) return;
    const c = data.communities.find(cc => cc.id === cId);
    save({
      ...data,
      communities: data.communities.map(cc => cc.id === cId ? { ...cc, tasks: (cc.tasks || []).map(t => t.id === tId ? { ...t, text: newText.trim() } : t) } : cc),
    }, 'task_edited', `${newText.trim()} — Comunidad ${c?.name || ''}`);
    setEditingTask(null);
  };
  const requestDeleteCommTask = (cId, tId) => {
    const c = data.communities.find(cc => cc.id === cId);
    const task = (c?.tasks || []).find(t => t.id === tId);
    if (!c || !task) return;
    setConfirmDelete({ type: "commTask", cId, tId, text: task.text });
  };

  // ── Extra person task CRUD ──
  const toggleExtraTask = (personName, tId) => {
    const ep = (data.extraPersons || []).find(p => p.name === personName);
    const t = (ep?.tasks || []).find(tt => tt.id === tId);
    const nowDone = !t?.done;
    save({
      ...data,
      extraPersons: (data.extraPersons || []).map(p => p.name === personName ? { ...p, tasks: (p.tasks || []).map(tt => tt.id === tId ? { ...tt, done: nowDone, ...(nowDone && tt.recurring ? { lastCompleted: new Date().toISOString() } : {}) } : tt) } : p),
    }, t?.done ? 'task_undone' : 'task_done', `${t?.text || ''} — ${personName}`);
  };
  const addExtraTask = (personName, text, recurring = null) => {
    if (!text.trim()) return;
    save({
      ...data,
      extraPersons: (data.extraPersons || []).map(p => {
        if (p.name !== personName) return p;
        const tasks = p.tasks || [];
        const maxId = tasks.reduce((a, t) => Math.max(a, t.id), 0);
        const newTask = { id: maxId + 1, text: text.trim(), done: false };
        if (recurring) { newTask.recurring = recurring; newTask.lastCompleted = null; }
        return { ...p, tasks: [...tasks, newTask] };
      }),
    }, 'task_added', `${text.trim()}${recurring ? ` (${recurringLabel[recurring]})` : ''} — ${personName}`);
  };
  const editExtraTask = (personName, tId, newText) => {
    if (!newText.trim()) return;
    save({
      ...data,
      extraPersons: (data.extraPersons || []).map(p => p.name === personName ? { ...p, tasks: (p.tasks || []).map(t => t.id === tId ? { ...t, text: newText.trim() } : t) } : p),
    }, 'task_edited', `${newText.trim()} — ${personName}`);
    setEditingTask(null);
  };
  const requestDeleteExtraTask = (personName, tId) => {
    const ep = (data.extraPersons || []).find(p => p.name === personName);
    const task = (ep?.tasks || []).find(t => t.id === tId);
    if (!ep || !task) return;
    setConfirmDelete({ type: "extraTask", personName, tId, text: task.text });
  };

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
        }, 'task_deleted', `${task.text} — ${m.name}`);
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
    } else if (confirmDelete.type === "commTask") {
      const c = data.communities.find(cc => cc.id === confirmDelete.cId);
      const task = (c?.tasks || []).find(t => t.id === confirmDelete.tId);
      if (c && task) {
        save({
          ...data,
          communities: data.communities.map(cc => cc.id === confirmDelete.cId ? { ...cc, tasks: (cc.tasks || []).filter(t => t.id !== confirmDelete.tId) } : cc),
        }, 'task_deleted', `${task.text} — Comunidad ${c.name}`);
      }
    } else if (confirmDelete.type === "extraTask") {
      const ep = (data.extraPersons || []).find(p => p.name === confirmDelete.personName);
      const task = (ep?.tasks || []).find(t => t.id === confirmDelete.tId);
      if (ep && task) {
        save({
          ...data,
          extraPersons: (data.extraPersons || []).map(p => p.name === confirmDelete.personName ? { ...p, tasks: (p.tasks || []).filter(t => t.id !== confirmDelete.tId) } : p),
        }, 'task_deleted', `${task.text} — ${ep.name}`);
      }
    }
    setConfirmDelete(null);
  };

  const addTask = (mId, text, recurring = null) => {
    if (!text.trim()) return;
    const m = data.ministries.find(mm => mm.id === mId);
    save({
      ...data,
      ministries: data.ministries.map(mm => {
        if (mm.id !== mId) return mm;
        const maxId = mm.tasks.reduce((a, t) => Math.max(a, t.id), 0);
        const newTask = { id: maxId + 1, text: text.trim(), done: false };
        if (recurring) { newTask.recurring = recurring; newTask.lastCompleted = null; }
        return { ...mm, tasks: [...mm.tasks, newTask] };
      }),
    }, 'task_added', `${text.trim()}${recurring ? ` (${recurringLabel[recurring]})` : ''} — ${m?.name || ''}`);
  };

  const addAlert = (mId, text) => {
    if (!text.trim()) return;
    const m = data.ministries.find(mm => mm.id === mId);
    save({
      ...data,
      ministries: data.ministries.map(mm => mm.id === mId ? { ...mm, alerts: [...mm.alerts, text.trim()] } : mm),
    }, 'alert_added', `${text.trim()} — ${m?.name || ''}`);
  };

  const editTask = (mId, tId, newText) => {
    if (!newText.trim()) return;
    const m = data.ministries.find(mm => mm.id === mId);
    save({
      ...data,
      ministries: data.ministries.map(mm => mm.id === mId ? { ...mm, tasks: mm.tasks.map(t => t.id === tId ? { ...t, text: newText.trim() } : t) } : mm),
    }, 'task_edited', `${newText.trim()} — ${m?.name || ''}`);
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
    }, 'event_added', newEvent.name.trim());
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
    // Count community tasks
    const cTasks = c.tasks || [];
    personsMap[name].totalTasks += cTasks.length;
    personsMap[name].doneTasks += cTasks.filter(t => t.done).length;
  });
  // Also add extra standalone persons
  (data.extraPersons || []).forEach(ep => {
    const name = ep.name;
    if (!personsMap[name]) {
      personsMap[name] = { name, ministries: [], totalTasks: 0, doneTasks: 0, alerts: 0 };
    }
    personsMap[name].extraTasks = ep.tasks || [];
    personsMap[name].totalTasks += (ep.tasks || []).length;
    personsMap[name].doneTasks += (ep.tasks || []).filter(t => t.done).length;
  });
  const PERSON_ORDER = ["Stefano", "Alfonso", "Leya", "Guillem", "Blanca & Ori", "Marta", "Agustín", "Mari Tere", "Guille", "Carla", "Pat Hidalgo", "Pauli Sánchez", "Marta Giribert"];
  const persons = Object.values(personsMap).sort((a, b) => {
    const ai = PERSON_ORDER.indexOf(a.name);
    const bi = PERSON_ORDER.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return b.totalTasks - a.totalTasks;
  });
  const personDetail = activePerson ? personsMap[activePerson] : null;

  // ── Recurring UI helpers ──
  const [recMenuOpen, setRecMenuOpen] = useState(null); // key of open menu
  const RecBadge = ({ task }) => task.recurring ? (
    <span className="rec-badge">🔄 {recurringLabel[task.recurring]}</span>
  ) : null;
  const cycleRecurring = (key) => {
    const cur = inlineNewRecurring[key] || null;
    const order = [null, "weekly", "biweekly", "monthly"];
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setInlineNewRecurring({ ...inlineNewRecurring, [key]: next });
  };

  // ── User picker ──
  if (!currentUser) return (
    <UserPicker onPick={(name) => { try { localStorage.setItem('semper_user', name); } catch(_) {} setCurrentUser(name); }} />
  );

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
          <button onClick={() => { try { localStorage.removeItem('semper_user'); } catch(_) {} setCurrentUser(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: B.textMuted, fontSize: '0.58rem', letterSpacing: '0.04em', fontFamily: 'inherit', padding: 0, marginTop: 4 }}>
            {currentUser} ×
          </button>
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
                {[...ministry.tasks].sort((a, b) => a.done - b.done).map(task => (
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
                          <RecBadge task={task} />
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
                      onKeyDown={e => { if (e.key === "Enter" && (inlineNewTask[ministry.id] || "").trim()) { addTask(ministry.id, inlineNewTask[ministry.id], inlineNewRecurring[ministry.id] || null); setInlineNewTask({ ...inlineNewTask, [ministry.id]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [ministry.id]: null }); } }}
                    />
                    <div style={{ position: "relative" }}>
                      <button className={`rec-toggle${inlineNewRecurring[ministry.id] ? " active" : ""}`} onClick={() => cycleRecurring(ministry.id)} title="Tarea recurrente">
                        {inlineNewRecurring[ministry.id] ? `🔄 ${recurringLabel[inlineNewRecurring[ministry.id]]}` : "🔄"}
                      </button>
                    </div>
                    <button className="add-btn" disabled={!(inlineNewTask[ministry.id] || "").trim()} onClick={() => { addTask(ministry.id, inlineNewTask[ministry.id], inlineNewRecurring[ministry.id] || null); setInlineNewTask({ ...inlineNewTask, [ministry.id]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [ministry.id]: null }); }}>+</button>
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
                  {[...m.tasks].sort((a, b) => a.done - b.done).map(task => (
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
                          <RecBadge task={task} />
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
                        onKeyDown={e => { if (e.key === "Enter" && (inlineNewTask[m.id] || "").trim()) { addTask(m.id, inlineNewTask[m.id], inlineNewRecurring[m.id] || null); setInlineNewTask({ ...inlineNewTask, [m.id]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [m.id]: null }); } }}
                      />
                      <div style={{ position: "relative" }}>
                        <button className={`rec-toggle${inlineNewRecurring[m.id] ? " active" : ""}`} onClick={() => cycleRecurring(m.id)} title="Tarea recurrente">
                          {inlineNewRecurring[m.id] ? `🔄 ${recurringLabel[inlineNewRecurring[m.id]]}` : "🔄"}
                        </button>
                      </div>
                      <button className="add-btn" disabled={!(inlineNewTask[m.id] || "").trim()} onClick={() => { addTask(m.id, inlineNewTask[m.id], inlineNewRecurring[m.id] || null); setInlineNewTask({ ...inlineNewTask, [m.id]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [m.id]: null }); }}>+</button>
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

            {/* Communities they coordinate — with tasks */}
            {personDetail.community && personDetail.community.length > 0 && personDetail.community.map(c => {
              const cTasks = c.tasks || [];
              const cDone = cTasks.filter(t => t.done).length;
              const cPct = cTasks.length > 0 ? Math.round((cDone / cTasks.length) * 100) : 0;
              return (
                <div key={c.id} className="card" style={{ padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: "1.1rem" }}>🫂</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", color: "#5ec47a", fontWeight: "700" }}>{c.name}</div>
                      <div style={{ fontSize: "0.6rem", color: B.textMuted, fontWeight: "600" }}>
                        {cTasks.length > 0 ? `${cDone}/${cTasks.length} · ${cPct}%` : "Coordinador/a de comunidad"}
                      </div>
                    </div>
                    <span className="pill" style={{ background: statusCfg[c.status].bg, color: statusCfg[c.status].color, flexShrink: 0 }}>
                      {statusCfg[c.status].label}
                    </span>
                  </div>
                  {c.note && <div style={{ fontSize: "0.76rem", color: B.textSub, marginBottom: 12, lineHeight: 1.5 }}>{c.note}</div>}

                  {/* Community Tasks */}
                  <div className="label" style={{ fontSize: "0.58rem" }}>Tareas</div>
                  {[...cTasks].sort((a, b) => a.done - b.done).map(task => (
                    <div key={task.id} className="taskrow" style={{ justifyContent: "space-between" }}>
                      {editingTask?.cId === c.id && editingTask?.tId === task.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                          <input className="inline-edit" value={editingTask.text} autoFocus
                            onChange={e => setEditingTask({ ...editingTask, text: e.target.value })}
                            onKeyDown={e => { if (e.key === "Enter") editCommTask(c.id, task.id, editingTask.text); if (e.key === "Escape") setEditingTask(null); }}
                          />
                          <button className="save-check" onClick={() => editCommTask(c.id, task.id, editingTask.text)} title="Guardar">✓</button>
                          <button className="cancel-edit" onClick={() => setEditingTask(null)} title="Cancelar">✕</button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, cursor: "pointer" }} onClick={() => toggleCommTask(c.id, task.id)}>
                            <div className={`cb${task.done ? " on" : ""}`}>
                              {task.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                            </div>
                            <span style={{
                              fontSize: "0.82rem", lineHeight: 1.55,
                              color: task.done ? B.textMuted : B.textSub,
                              textDecoration: task.done ? "line-through" : "none",
                            }}>{task.text}</span>
                          <RecBadge task={task} />
                          </div>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button className="edit-pencil" onClick={(e) => { e.stopPropagation(); setEditingTask({ cId: c.id, tId: task.id, text: task.text }); }} title="Editar">✎</button>
                            <button className="del-x" onClick={(e) => { e.stopPropagation(); requestDeleteCommTask(c.id, task.id); }} title="Eliminar">✕</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {cTasks.length === 0 && <div style={{ fontSize: "0.72rem", color: B.textMuted, padding: "4px 0" }}>Sin tareas aún</div>}
                  <div className="add-row">
                    <input className="add-input" placeholder="Añadir tarea..." value={inlineNewCommTask[c.id] || ""}
                      onChange={e => setInlineNewCommTask({ ...inlineNewCommTask, [c.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === "Enter" && (inlineNewCommTask[c.id] || "").trim()) { addCommTask(c.id, inlineNewCommTask[c.id], inlineNewRecurring[`c_${c.id}`] || null); setInlineNewCommTask({ ...inlineNewCommTask, [c.id]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [`c_${c.id}`]: null }); } }}
                    />
                    <div style={{ position: "relative" }}>
                      <button className={`rec-toggle${inlineNewRecurring[`c_${c.id}`] ? " active" : ""}`} onClick={() => cycleRecurring(`c_${c.id}`)} title="Tarea recurrente">
                        {inlineNewRecurring[`c_${c.id}`] ? `🔄 ${recurringLabel[inlineNewRecurring[`c_${c.id}`]]}` : "🔄"}
                      </button>
                    </div>
                    <button className="add-btn" disabled={!(inlineNewCommTask[c.id] || "").trim()} onClick={() => { addCommTask(c.id, inlineNewCommTask[c.id], inlineNewRecurring[`c_${c.id}`] || null); setInlineNewCommTask({ ...inlineNewCommTask, [c.id]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [`c_${c.id}`]: null }); }}>+</button>
                  </div>
                </div>
              );
            })}

            {/* Extra person tasks (for standalone persons like Guille) */}
            {personDetail.extraTasks && (
              <div className="card" style={{ padding: "18px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: "1.1rem" }}>📋</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", color: B.orange, fontWeight: "700" }}>Tareas personales</div>
                    <div style={{ fontSize: "0.6rem", color: B.textMuted, fontWeight: "600" }}>
                      {personDetail.extraTasks.filter(t => t.done).length}/{personDetail.extraTasks.length}
                    </div>
                  </div>
                </div>
                {[...personDetail.extraTasks].sort((a, b) => a.done - b.done).map(task => (
                  <div key={task.id} className="taskrow" style={{ justifyContent: "space-between" }}>
                    {editingTask?.epName === personDetail.name && editingTask?.tId === task.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                        <input className="inline-edit" value={editingTask.text} autoFocus
                          onChange={e => setEditingTask({ ...editingTask, text: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter") editExtraTask(personDetail.name, task.id, editingTask.text); if (e.key === "Escape") setEditingTask(null); }}
                        />
                        <button className="save-check" onClick={() => editExtraTask(personDetail.name, task.id, editingTask.text)} title="Guardar">✓</button>
                        <button className="cancel-edit" onClick={() => setEditingTask(null)} title="Cancelar">✕</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, cursor: "pointer" }} onClick={() => toggleExtraTask(personDetail.name, task.id)}>
                          <div className={`cb${task.done ? " on" : ""}`}>
                            {task.done && <span style={{ color: "#0f0e0c", fontSize: "0.65rem", fontWeight: "900" }}>✓</span>}
                          </div>
                          <span style={{
                            fontSize: "0.82rem", lineHeight: 1.55,
                            color: task.done ? B.textMuted : B.textSub,
                            textDecoration: task.done ? "line-through" : "none",
                          }}>{task.text}</span>
                        <RecBadge task={task} />
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>
                          <button className="edit-pencil" onClick={(e) => { e.stopPropagation(); setEditingTask({ epName: personDetail.name, tId: task.id, text: task.text }); }} title="Editar">✎</button>
                          <button className="del-x" onClick={(e) => { e.stopPropagation(); requestDeleteExtraTask(personDetail.name, task.id); }} title="Eliminar">✕</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {personDetail.extraTasks.length === 0 && <div style={{ fontSize: "0.72rem", color: B.textMuted, padding: "4px 0" }}>Sin tareas aún</div>}
                <div className="add-row">
                  <input className="add-input" placeholder="Añadir tarea..." value={inlineNewExtraTask[personDetail.name] || ""}
                    onChange={e => setInlineNewExtraTask({ ...inlineNewExtraTask, [personDetail.name]: e.target.value })}
                    onKeyDown={e => { if (e.key === "Enter" && (inlineNewExtraTask[personDetail.name] || "").trim()) { addExtraTask(personDetail.name, inlineNewExtraTask[personDetail.name], inlineNewRecurring[`ep_${personDetail.name}`] || null); setInlineNewExtraTask({ ...inlineNewExtraTask, [personDetail.name]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [`ep_${personDetail.name}`]: null }); } }}
                  />
                  <div style={{ position: "relative" }}>
                    <button className={`rec-toggle${inlineNewRecurring[`ep_${personDetail.name}`] ? " active" : ""}`} onClick={() => cycleRecurring(`ep_${personDetail.name}`)} title="Tarea recurrente">
                      {inlineNewRecurring[`ep_${personDetail.name}`] ? `🔄 ${recurringLabel[inlineNewRecurring[`ep_${personDetail.name}`]]}` : "🔄"}
                    </button>
                  </div>
                  <button className="add-btn" disabled={!(inlineNewExtraTask[personDetail.name] || "").trim()} onClick={() => { addExtraTask(personDetail.name, inlineNewExtraTask[personDetail.name], inlineNewRecurring[`ep_${personDetail.name}`] || null); setInlineNewExtraTask({ ...inlineNewExtraTask, [personDetail.name]: "" }); setInlineNewRecurring({ ...inlineNewRecurring, [`ep_${personDetail.name}`]: null }); }}>+</button>
                </div>
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

        {/* ═══════ ACTIVIDAD ═══════ */}
        {activeTab === "actividad" && (
          <div className="fi">
            <div className="label">Registro de actividad</div>

            {/* Period selector */}
            <div className="period-tabs">
              {PERIOD_OPTIONS.map(p => (
                <button key={p.id} className={`period-tab${activityPeriod === p.id ? " active" : ""}`} onClick={() => setActivityPeriod(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>

            {activityLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: B.textMuted, fontSize: "0.8rem" }}>Cargando actividad...</div>
            ) : activityData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: B.textMuted, fontSize: "0.8rem" }}>
                No hay actividad registrada en este período.
              </div>
            ) : (() => {
              // Compute per-user stats
              const userStats = {};
              activityData.forEach(a => {
                if (!userStats[a.user_name]) userStats[a.user_name] = { name: a.user_name, total: 0, tasksDone: 0, tasksAdded: 0, tasksDeleted: 0, alertsAdded: 0, eventsDone: 0, eventsAdded: 0, lastSeen: a.created_at };
                const u = userStats[a.user_name];
                u.total++;
                if (a.created_at > u.lastSeen) u.lastSeen = a.created_at;
                if (a.action === "task_done") u.tasksDone++;
                if (a.action === "task_added") u.tasksAdded++;
                if (a.action === "task_deleted") u.tasksDeleted++;
                if (a.action === "alert_added") u.alertsAdded++;
                if (a.action === "event_done") u.eventsDone++;
                if (a.action === "event_added") u.eventsAdded++;
              });
              const users = Object.values(userStats).sort((a, b) => b.total - a.total);
              const maxActions = Math.max(...users.map(u => u.total), 1);

              // Group feed by day
              const feedByDay = {};
              activityData.forEach(a => {
                const day = new Date(a.created_at).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
                if (!feedByDay[day]) feedByDay[day] = [];
                feedByDay[day].push(a);
              });

              const actionLabel = { task_done: "Tarea completada", task_undone: "Tarea desmarcada", task_added: "Tarea añadida", task_edited: "Tarea editada", task_deleted: "Tarea eliminada", alert_added: "Alerta añadida", event_done: "Evento completado", event_undone: "Evento desmarcado", event_added: "Evento añadido" };
              const actionColor = { task_done: "#5ec47a", task_undone: B.textMuted, task_added: B.orange, task_edited: "#a78bfa", task_deleted: "#f56565", alert_added: "#f56565", event_done: "#5ec47a", event_undone: B.textMuted, event_added: "#60a5fa" };

              return (
                <>
                  {/* ── Stats per person ── */}
                  <div className="card" style={{ padding: "16px 18px", marginBottom: 16 }}>
                    <div className="label">Actividad por persona</div>
                    {users.map(u => {
                      const pct = Math.round((u.total / maxActions) * 100);
                      const ago = Math.round((Date.now() - new Date(u.lastSeen).getTime()) / (1000 * 60 * 60));
                      const lastStr = ago < 1 ? "hace unos minutos" : ago < 24 ? `hace ${ago}h` : `hace ${Math.round(ago / 24)}d`;
                      return (
                        <div key={u.name} className="act-stat">
                          <div style={{ minWidth: 80 }}>
                            <div style={{ fontSize: "0.82rem", color: B.text, fontWeight: "700" }}>{u.name}</div>
                            <div style={{ fontSize: "0.55rem", color: ago < 48 ? "#5ec47a" : B.textMuted, fontWeight: "600", marginTop: 2 }}>
                              {ago < 48 ? "● " : ""}{lastStr}
                            </div>
                          </div>
                          <div className="act-bar">
                            <div className="act-bar-fill" style={{ width: `${pct}%`, background: B.orange }} />
                          </div>
                          <div style={{ minWidth: 30, textAlign: "right", fontSize: "0.75rem", color: B.orange, fontWeight: "700" }}>{u.total}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Breakdown cards ── */}
                  <div className="sg" style={{ marginBottom: 16 }}>
                    {[
                      { label: "Tareas completadas", value: activityData.filter(a => a.action === "task_done").length, color: "#5ec47a" },
                      { label: "Tareas añadidas", value: activityData.filter(a => a.action === "task_added").length, color: B.orange },
                      { label: "Tareas eliminadas", value: activityData.filter(a => a.action === "task_deleted").length, color: "#f56565" },
                      { label: "Alertas añadidas", value: activityData.filter(a => a.action === "alert_added").length, color: "#60a5fa" },
                    ].map((s, i) => (
                      <div key={i} className="card" style={{ padding: "14px 16px", borderTop: `2px solid ${s.color}` }}>
                        <div style={{ fontSize: "1.5rem", color: s.color, lineHeight: 1, fontWeight: "700" }}>{s.value}</div>
                        <div style={{ fontSize: "0.58rem", color: B.textMuted, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: "600" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── Detailed per-person breakdown ── */}
                  <div className="card" style={{ padding: "16px 18px", marginBottom: 16 }}>
                    <div className="label">Desglose por persona</div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                            <th style={{ textAlign: "left", padding: "8px 6px", color: B.textMuted, fontWeight: 600 }}>Persona</th>
                            <th style={{ textAlign: "center", padding: "8px 4px", color: "#5ec47a", fontWeight: 600 }}>✓ Hechas</th>
                            <th style={{ textAlign: "center", padding: "8px 4px", color: B.orange, fontWeight: 600 }}>+ Añadidas</th>
                            <th style={{ textAlign: "center", padding: "8px 4px", color: "#f56565", fontWeight: 600 }}>✕ Borradas</th>
                            <th style={{ textAlign: "center", padding: "8px 4px", color: "#60a5fa", fontWeight: 600 }}>⚠ Alertas</th>
                            <th style={{ textAlign: "center", padding: "8px 4px", color: B.textSub, fontWeight: 600 }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u.name} style={{ borderBottom: `1px solid ${B.border}` }}>
                              <td style={{ padding: "8px 6px", color: B.text, fontWeight: 600 }}>{u.name}</td>
                              <td style={{ textAlign: "center", padding: "8px 4px", color: "#5ec47a" }}>{u.tasksDone}</td>
                              <td style={{ textAlign: "center", padding: "8px 4px", color: B.orange }}>{u.tasksAdded}</td>
                              <td style={{ textAlign: "center", padding: "8px 4px", color: "#f56565" }}>{u.tasksDeleted}</td>
                              <td style={{ textAlign: "center", padding: "8px 4px", color: "#60a5fa" }}>{u.alertsAdded}</td>
                              <td style={{ textAlign: "center", padding: "8px 4px", color: B.textSub, fontWeight: 700 }}>{u.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ── Activity feed ── */}
                  <div className="card" style={{ padding: "16px 18px" }}>
                    <div className="label">Historial de acciones</div>
                    {Object.entries(feedByDay).map(([day, items]) => (
                      <div key={day}>
                        <div className="act-feed-day">{day}</div>
                        {items.map((a, i) => (
                          <div key={i} className="act-feed-item">
                            <span className="act-badge" style={{ background: `${actionColor[a.action] || B.textMuted}1a`, color: actionColor[a.action] || B.textMuted }}>
                              {actionLabel[a.action] || a.action}
                            </span>
                            <div style={{ flex: 1 }}>
                              <span style={{ color: B.textSub }}>{a.detail}</span>
                              <div style={{ fontSize: "0.58rem", color: B.textMuted, marginTop: 2 }}>
                                {a.user_name} · {new Date(a.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
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
