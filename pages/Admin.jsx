import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  Newspaper, ShoppingBag, Users, MessageSquare, 
  CheckCircle, XCircle, Star, ChevronRight, 
  TrendingUp, Zap, RefreshCw, Plus, Database, CheckCircle2
} from 'lucide-react';

const NAV = [
  { id: 'analytics', label: 'Analytics',  icon: TrendingUp },
  { id: 'news',      label: 'News',        icon: Newspaper },
  { id: 'market',    label: 'Market',      icon: ShoppingBag },
  { id: 'users',     label: 'Users',       icon: Users },
  { id: 'feedback',  label: 'Feedback',    icon: MessageSquare },
  { id: 'vault',     label: 'Data Vault',  icon: Database },
];

const STAT_CARDS = [
  { label: 'Daily Active Users', value: '1,284', delta: '+12%', color: '#00E5FF' },
  { label: 'Monthly Active Users', value: '18,450', delta: '+8%', color: '#39FF14' },
  { label: 'Listings Pending', value: '23', delta: 'Review', color: '#FFB300' },
  { label: 'News Staged', value: '7', delta: 'Pending', color: '#FF3366' },
];

function StatCard({ card }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-xs text-white/40 uppercase tracking-wider">{card.label}</p>
      <p className="font-space font-bold text-3xl" style={{ color: card.color }}>{card.value}</p>
      <span className="text-xs font-semibold" style={{ color: card.color }}>{card.delta}</span>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsModule() {
  const featureUsage = [
    { label: 'AI Mechanic Queries', count: 3847, pct: 85, color: '#00E5FF' },
    { label: 'Garage API Refreshes', count: 2910, pct: 64, color: '#39FF14' },
    { label: 'Market Listings Viewed', count: 5120, pct: 100, color: '#FFB300' },
    { label: 'SOS Activations', count: 312, pct: 10, color: '#FF3366' },
    { label: 'Update Logs Saved', count: 1248, pct: 27, color: '#A78BFA' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map((c) => <StatCard key={c.label} card={c} />)}
      </div>
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="font-space font-bold text-white mb-5">Feature Usage Breakdown</h3>
        <div className="space-y-4">
          {featureUsage.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/70">{f.label}</span>
                <span className="text-sm font-bold font-space" style={{ color: f.color }}>{f.count.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-white/5">
                <motion.div className="h-full rounded-full" style={{ background: f.color, width: `${f.pct}%` }}
                  initial={{ width: 0 }} animate={{ width: `${f.pct}%` }} transition={{ duration: 1, delay: 0.2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NEWS MANAGER ─────────────────────────────────────────────────────────────
function NewsModule() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', source: '', image_url: '', article_url: '', body: '' });

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.NewsArticle.list('-created_date', 50);
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const publish = async (id) => {
    await base44.entities.NewsArticle.update(id, { status: 'published', published_at: new Date().toISOString() });
    load();
  };
  const reject = async (id) => {
    await base44.entities.NewsArticle.update(id, { status: 'rejected' });
    load();
  };
  const create = async () => {
    await base44.entities.NewsArticle.create({ ...form, status: 'pending' });
    setForm({ title: '', source: '', image_url: '', article_url: '', body: '' });
    setShowForm(false);
    load();
  };

  const statusColor = { pending: '#FFB300', published: '#39FF14', rejected: '#FF3366' };
  const statusLabel = { pending: 'Pending', published: 'Published', rejected: 'Rejected' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-space font-bold text-white text-lg">News Manager</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-black"
          style={{ background: '#00E5FF' }}>
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)' }}>
          {[
            { key: 'title', label: 'Title', ph: 'Article title...' },
            { key: 'source', label: 'Source', ph: 'e.g. AutoCarIndia' },
            { key: 'image_url', label: 'Image URL', ph: 'https://...' },
            { key: 'article_url', label: 'Article URL', ph: 'https://...' },
          ].map((f) => (
            <input key={f.key} value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.ph}
              className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none border border-white/8" />
          ))}
          <textarea value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            placeholder="Article summary..."
            className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none border border-white/8 resize-none" rows={3} />
          <div className="flex gap-2">
            <button onClick={create} className="px-5 py-2 rounded-xl text-sm font-bold text-black" style={{ background: '#00E5FF' }}>Publish Now</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-sm font-medium text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-white/40 text-sm">Loading...</p> : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {a.image_url && <img src={a.image_url} alt="" className="w-16 h-12 rounded-xl object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{a.source} · {new Date(a.created_date).toLocaleDateString()}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                style={{ background: `${statusColor[a.status]}18`, color: statusColor[a.status] }}>
                {statusLabel[a.status]}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {a.status !== 'published' && (
                  <button onClick={() => publish(a.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                    <CheckCircle className="w-4 h-4 text-apex-green" />
                  </button>
                )}
                {a.status !== 'rejected' && (
                  <button onClick={() => reject(a.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                    <XCircle className="w-4 h-4 text-brake-red" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {articles.length === 0 && <p className="text-white/30 text-sm text-center py-8">No articles yet. Add one above.</p>}
        </div>
      )}
    </div>
  );
}

// ─── MARKET CONTROL ───────────────────────────────────────────────────────────
function MarketModule() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending_approval');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.MarketListing.list('-created_date', 100);
    setListings(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await base44.entities.MarketListing.update(id, { status });
    load();
  };

  const statusColor = { pending_approval: '#FFB300', live: '#39FF14', suspended: '#FF3366', featured: '#00E5FF' };
  const filtered = listings.filter((l) => filter === 'all' || l.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-space font-bold text-white text-lg">Market Control</h3>
        <button onClick={load} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
          <RefreshCw className="w-4 h-4 text-white/40" />
        </button>
      </div>
      <div className="flex gap-2">
        {['pending_approval', 'live', 'featured', 'suspended', 'all'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${filter === s ? 'text-black' : 'text-white/50 bg-white/5'}`}
            style={filter === s ? { background: '#00E5FF' } : {}}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>
      {loading ? <p className="text-white/40 text-sm">Loading...</p> : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {l.image_url && <img src={l.image_url} alt="" className="w-16 h-12 rounded-xl object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{l.title}</p>
                <p className="text-xs text-white/40 mt-0.5">₹{(l.price || 0).toLocaleString('en-IN')} · {l.seller_name || l.seller_email} · {l.condition}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                style={{ background: `${statusColor[l.status]}18`, color: statusColor[l.status] }}>
                {l.status.replace('_', ' ')}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => setStatus(l.id, 'live')} title="Approve"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <CheckCircle className="w-4 h-4 text-apex-green" />
                </button>
                <button onClick={() => setStatus(l.id, 'featured')} title="Feature"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Star className="w-4 h-4 text-amber-warning" />
                </button>
                <button onClick={() => setStatus(l.id, 'suspended')} title="Suspend"
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                  <XCircle className="w-4 h-4 text-brake-red" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-white/30 text-sm text-center py-8">No listings in this category.</p>}
        </div>
      )}
    </div>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function UsersModule() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.User.list('-created_date', 50).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-space font-bold text-white text-lg">User Management</h3>
      {loading ? <p className="text-white/40 text-sm">Loading...</p> : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['User', 'Email', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{(u.full_name || u.email || '?').charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-white">{u.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: u.role === 'admin' ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#00E5FF' : '#888' }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/40">{new Date(u.created_date).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30 text-sm">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
const FB_STATUSES = ['new', 'reviewing', 'fixing', 'resolved'];
const FB_COLORS = { new: '#00E5FF', reviewing: '#FFB300', fixing: '#FF3366', resolved: '#39FF14' };

function FeedbackModule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('new');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Feedback.list('-created_date', 100);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const advance = async (item) => {
    const idx = FB_STATUSES.indexOf(item.status);
    if (idx < FB_STATUSES.length - 1) {
      await base44.entities.Feedback.update(item.id, { status: FB_STATUSES[idx + 1] });
      load();
    }
  };

  const filtered = items.filter((i) => i.status === activeStatus);

  return (
    <div className="space-y-4">
      <h3 className="font-space font-bold text-white text-lg">Feedback Pipeline</h3>
      {/* Kanban column tabs */}
      <div className="flex gap-2">
        {FB_STATUSES.map((s) => (
          <button key={s} onClick={() => setActiveStatus(s)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${activeStatus === s ? 'text-black' : 'text-white/40 bg-white/5'}`}
            style={activeStatus === s ? { background: FB_COLORS[s] } : {}}>
            {s}
          </button>
        ))}
      </div>
      {loading ? <p className="text-white/40 text-sm">Loading...</p> : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${FB_COLORS[item.status]}20` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 inline-block`}
                    style={{ background: `${FB_COLORS[item.status]}18`, color: FB_COLORS[item.status] }}>
                    {item.type}
                  </span>
                  <p className="text-sm text-white mt-1">{item.message}</p>
                  <p className="text-xs text-white/30 mt-1">{item.user_email} · {new Date(item.created_date).toLocaleDateString()}</p>
                </div>
                {item.status !== 'resolved' && (
                  <button onClick={() => advance(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-colors hover:opacity-80"
                    style={{ background: `${FB_COLORS[item.status]}18`, color: FB_COLORS[item.status] }}>
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-white/30 text-sm text-center py-8">No {activeStatus} items.</p>}
        </div>
      )}
    </div>
  );
}

// ─── DATA VAULT ───────────────────────────────────────────────────────────────
function VaultModule() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pull all vehicle records from the User entity's custom data (stored via garageContext / auth.updateMe)
    // We surface this as a simple read of all users and their stored garage data
    base44.entities.User.list('-created_date', 100).then((users) => {
      const vList = [];
      users.forEach((u) => {
        const garage = u.garage || [];
        garage.forEach((v) => {
          vList.push({ ...v, owner_email: u.email, owner_name: u.full_name });
        });
      });
      setVehicles(vList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-space font-bold text-white text-lg">Data Vault</h3>
        <span className="text-xs text-white/30 font-medium">{vehicles.length} vehicle records</span>
      </div>

      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)' }}>
        <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-white/50 leading-relaxed">
          This vault surfaces all vehicle RC data scanned by users. Each row represents a vehicle registered via OCR scan or manual entry, including plate numbers, make, model, and document metadata.
        </p>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : vehicles.length === 0 ? (
        <div className="rounded-2xl p-10 flex flex-col items-center gap-3 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Database className="w-10 h-10 text-white/10" />
          <p className="text-white/30 text-sm">No vehicle data yet. Users who scan an RC will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['Plate', 'Make / Model', 'Year', 'Owner', 'Completion'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={`${v.id}-${i}`} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{v.plate || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{v.brand} {v.model}</td>
                  <td className="px-4 py-3 text-sm text-white/50">{v.year || '—'}</td>
                  <td className="px-4 py-3 text-xs text-white/40">{v.owner_email || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 w-20">
                        <div className="h-full rounded-full" style={{ background: '#00E5FF', width: `${v.completion || 0}%` }} />
                      </div>
                      <span className="text-xs text-white/40">{v.completion || 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState('analytics');
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.me().then((u) => { setUser(u); setChecking(false); }).catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-space font-bold text-white text-2xl">Admin Access Only</h1>
        <p className="text-white/40 text-sm text-center">You need admin privileges to view this dashboard.</p>
      </div>
    );
  }

  const MODULES = { analytics: AnalyticsModule, news: NewsModule, market: MarketModule, users: UsersModule, feedback: FeedbackModule, vault: VaultModule };
  const ActiveModule = MODULES[tab];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col border-r border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <img src="https://media.base44.com/images/public/69f1a9f43003ef2e33d154e7/04eec8872_LOGO-copy.png" alt="DS" className="h-7 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <div>
              <p className="font-space font-bold text-white text-sm">DownShift</p>
              <p className="text-[10px] text-primary">Admin CMS</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${tab === id ? 'text-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              style={tab === id ? { background: '#00E5FF', color: '#000' } : {}}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <p className="text-xs text-white/30">{user.full_name || user.email}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <ActiveModule />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}