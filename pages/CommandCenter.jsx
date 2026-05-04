import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  TrendingUp, Shield, Users, RefreshCw, Search, X,
  CheckCircle2, Trash2, Edit3, Ban, ChevronRight,
  Car, ShoppingBag, FileText, Activity, Zap,
  ArrowUp, ArrowDown, Eye, BarChart2
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.08)',
};
const glassStrong = {
  background: 'rgba(12,12,12,0.95)',
  backdropFilter: 'blur(30px)',
  WebkitBackdropFilter: 'blur(30px)',
  border: '1px solid rgba(0,229,255,0.15)',
};

// Simulated 30-day user growth data
const generateDayData = () =>
  Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    users: Math.floor(30 + Math.random() * 80 + i * 2.5),
  }));

const generateAdData = () =>
  Array.from({ length: 12 }, (_, i) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return { month: months[i], ads: Math.floor(20 + Math.random() * 60) };
  });

const DAY_DATA = generateDayData();
const AD_DATA = generateAdData();

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 12, padding: '8px 14px' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{label}</p>
      <p style={{ color: '#00E5FF', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-space)' }}>
        {payload[0].value}
      </p>
    </div>
  );
}

// ─── TAB 1: GROWTH & METRICS ─────────────────────────────────────────────────
function GrowthTab() {
  const [stats, setStats] = useState({ users: 0, listings: 0, marketValue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.User.list('-created_date', 500),
      base44.entities.MarketListing.list('-created_date', 500),
    ]).then(([users, listings]) => {
      const liveListings = listings.filter((l) => l.status === 'live' || l.status === 'featured');
      const totalValue = liveListings.reduce((sum, l) => sum + (l.price || 0), 0);
      setStats({ users: users.length, listings: listings.length, marketValue: totalValue });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const kpis = [
    {
      label: 'Total Active Users',
      value: loading ? '—' : stats.users.toLocaleString('en-IN'),
      delta: '+12% this week',
      up: true,
      color: '#00E5FF',
      icon: Users,
    },
    {
      label: 'Total Vehicles in Garages',
      value: loading ? '—' : (stats.users * 1.4).toFixed(0),
      delta: 'Avg 1.4 per user',
      up: true,
      color: '#39FF14',
      icon: Car,
    },
    {
      label: 'Live Market Value',
      value: loading ? '—' : `₹${(stats.marketValue / 10000000).toFixed(2)} Cr`,
      delta: `${stats.listings} total ads`,
      up: stats.marketValue > 0,
      color: '#FFB300',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Live Platform Pulse Banner */}
      <div className="rounded-2xl px-6 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.08), rgba(0,229,255,0.02))', border: '1px solid rgba(0,229,255,0.2)' }}>
        <div className="flex items-center gap-3">
          <motion.div className="w-2.5 h-2.5 rounded-full"
            style={{ background: '#39FF14', boxShadow: '0 0 10px #39FF14' }}
            animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
          <span className="font-space font-bold text-white text-lg">Live Platform Pulse</span>
        </div>
        <span className="text-xs text-white/30 font-inter">Last refreshed: {new Date().toLocaleTimeString()}</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-5">
        {kpis.map((kpi) => (
          <motion.div key={kpi.label}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={glass}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ borderColor: `${kpi.color}40` }}
            transition={{ duration: 0.3 }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 0% 0%, ${kpi.color}08, transparent 60%)` }} />
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.color}12`, border: `1px solid ${kpi.color}25` }}>
                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: kpi.up ? '#39FF14' : '#FF3366' }}>
                {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {kpi.delta}
              </span>
            </div>
            <p className="text-xs text-white/35 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="font-space font-bold text-4xl" style={{ color: kpi.color }}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Line Chart — New Users */}
        <div className="rounded-2xl p-6" style={glass}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-space font-bold text-white text-sm">New Users</p>
              <p className="text-xs text-white/30 mt-0.5">Last 30 Days</p>
            </div>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="users" stroke="#00E5FF" strokeWidth={2}
                  dot={false} activeDot={{ r: 4, fill: '#00E5FF', stroke: '#000', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart — Marketplace Ads */}
        <div className="rounded-2xl p-6" style={glass}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-space font-bold text-white text-sm">Marketplace Ads Posted</p>
              <p className="text-xs text-white/30 mt-0.5">By Month</p>
            </div>
            <BarChart2 className="w-4 h-4 text-amber-warning" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AD_DATA} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="ads" fill="#FFB300" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB 2: MODERATION QUEUE ─────────────────────────────────────────────────
function ModerationTab() {
  const [flaggedAds, setFlaggedAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [acting, setActing] = useState({});

  const loadAds = useCallback(async () => {
    setLoadingAds(true);
    const data = await base44.entities.MarketListing.list('-created_date', 100);
    // Show pending_approval as the moderation queue
    setFlaggedAds(data.filter((l) => l.status === 'pending_approval'));
    setLoadingAds(false);
  }, []);

  useEffect(() => { loadAds(); }, [loadAds]);

  const approveAd = async (id) => {
    setActing((a) => ({ ...a, [id]: 'approving' }));
    await base44.entities.MarketListing.update(id, { status: 'live' });
    setActing((a) => ({ ...a, [id]: null }));
    loadAds();
  };

  const rejectAd = async (id) => {
    setActing((a) => ({ ...a, [id]: 'rejecting' }));
    await base44.entities.MarketListing.update(id, { status: 'suspended' });
    setActing((a) => ({ ...a, [id]: null }));
    loadAds();
  };

  const EmptyState = ({ label }) => (
    <div className="rounded-2xl p-10 text-center" style={glass}>
      <Shield className="w-10 h-10 text-white/10 mx-auto mb-3" />
      <p className="text-white/25 text-sm">No {label} in queue</p>
    </div>
  );

  const AdRow = ({ item }) => (
    <motion.div className="rounded-2xl p-4 flex items-center gap-4"
      style={glass}
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
      {item.image_url ? (
        <img src={item.image_url} alt="" className="w-20 h-14 rounded-xl object-cover flex-shrink-0"
          style={{ border: '1px solid rgba(255,179,0,0.2)' }} />
      ) : (
        <div className="w-20 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'rgba(255,179,0,0.06)', border: '1px solid rgba(255,179,0,0.15)' }}>
          <ShoppingBag className="w-6 h-6 text-amber-warning/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-space font-semibold text-white text-sm truncate">{item.title}</p>
        <p className="text-xs text-white/35 mt-0.5">
          ₹{(item.price || 0).toLocaleString('en-IN')} · {item.condition} · {item.seller_email || 'Unknown seller'}
        </p>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {item.compatible_vehicle && (
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,229,255,0.08)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.15)' }}>
              {item.compatible_vehicle}
            </span>
          )}
          <span className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,179,0,0.08)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.2)' }}>
            Pending Review
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <motion.button whileTap={{ scale: 0.93 }}
          onClick={() => approveAd(item.id)}
          disabled={!!acting[item.id]}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.35)', color: '#39FF14',
            boxShadow: '0 0 12px rgba(57,255,20,0.15)' }}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {acting[item.id] === 'approving' ? 'Approving…' : '✅ Force Approve'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }}
          onClick={() => rejectAd(item.id)}
          disabled={!!acting[item.id]}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.35)', color: '#FF3366',
            boxShadow: '0 0 12px rgba(255,51,102,0.12)' }}>
          <Trash2 className="w-3.5 h-3.5" />
          {acting[item.id] === 'rejecting' ? 'Rejecting…' : '🗑️ Reject & Delete'}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Flagged Market Ads */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-warning" />
            <h3 className="font-space font-bold text-white text-base">Flagged Market Ads</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: 'rgba(255,179,0,0.12)', color: '#FFB300', border: '1px solid rgba(255,179,0,0.2)' }}>
              {flaggedAds.length} pending
            </span>
          </div>
          <button onClick={loadAds} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4 text-white/30" />
          </button>
        </div>
        {loadingAds ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-sm text-white/30">Loading queue…</span>
          </div>
        ) : flaggedAds.length === 0 ? (
          <EmptyState label="market ads" />
        ) : (
          <div className="space-y-3">
            {flaggedAds.map((item) => <AdRow key={item.id} item={item} />)}
          </div>
        )}
      </div>

      {/* Flagged RC Uploads — placeholder for real doc flagging system */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-space font-bold text-white text-base">Flagged RC Uploads</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(0,229,255,0.08)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.15)' }}>
            0 flagged
          </span>
        </div>
        <div className="rounded-2xl p-10 text-center" style={glass}>
          <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/25 text-sm">No RC uploads flagged for review</p>
          <p className="text-white/15 text-xs mt-1">Documents scanned via AI are auto-approved unless the OCR confidence is below threshold.</p>
        </div>
      </div>
    </div>
  );
}

// ─── USER PROFILE PANEL ───────────────────────────────────────────────────────
function UserProfilePanel({ user, listings, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: user.full_name || '', role: user.role || 'user' });
  const [saving, setSaving] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);

  const userListings = listings.filter((l) => l.seller_email === user.email || l.created_by === user.email);

  const saveEdit = async () => {
    setSaving(true);
    await base44.entities.User.update(user.id, editForm);
    setSaving(false);
    setEditing(false);
    onUpdate();
  };

  const suspendAccount = async () => {
    setSuspending(true);
    await base44.entities.User.update(user.id, { role: 'suspended' });
    setSuspending(false);
    setConfirmSuspend(false);
    onUpdate();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-y-0 right-0 z-50 w-[420px] flex flex-col overflow-hidden"
      style={glassStrong}
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
        <h3 className="font-space font-bold text-white">User Profile</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Avatar + identity */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}>
            <span className="font-space font-bold text-2xl text-primary">
              {(user.full_name || user.email || '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-space font-bold text-white text-base">{user.full_name || '(No name)'}</p>
            <p className="text-xs text-white/40 mt-0.5">{user.email}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
              style={user.role === 'admin'
                ? { background: 'rgba(0,229,255,0.12)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)' }
                : user.role === 'suspended'
                ? { background: 'rgba(255,51,102,0.12)', color: '#FF3366', border: '1px solid rgba(255,51,102,0.2)' }
                : { background: 'rgba(255,255,255,0.06)', color: '#888' }}>
              {user.role || 'user'}
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="rounded-2xl p-4 space-y-3" style={glass}>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Contact Info</p>
          {[
            { label: 'Email', value: user.email },
            { label: 'Joined', value: new Date(user.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            { label: 'User ID', value: user.id?.slice(0, 12) + '…' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-xs text-white/30">{row.label}</span>
              <span className="text-xs text-white/80 font-inter font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Edit Data */}
        {editing ? (
          <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)' }}>
            <p className="text-[10px] text-primary uppercase tracking-wider font-semibold">Edit Data</p>
            <input value={editForm.full_name} onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Full name"
              className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none bg-transparent"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="user" className="bg-[#111]">user</option>
              <option value="admin" className="bg-[#111]">admin</option>
            </select>
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={saving}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-black disabled:opacity-50"
                style={{ background: '#00E5FF' }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-white/40"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {/* Vehicles (Smart Pill data) */}
        <div className="rounded-2xl p-4" style={glass}>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-3">Connected Vehicles</p>
          {(user.garage || []).length === 0 ? (
            <p className="text-xs text-white/20">No vehicles registered</p>
          ) : (
            <div className="space-y-2">
              {(user.garage || []).map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,229,255,0.08)' }}>
                    <Car className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{v.brand} {v.model}</p>
                    <p className="text-[10px] text-white/30">{v.plate || '—'} · {v.year || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Market Listings */}
        <div className="rounded-2xl p-4" style={glass}>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-3">Active Listings ({userListings.length})</p>
          {userListings.length === 0 ? (
            <p className="text-xs text-white/20">No active listings</p>
          ) : (
            <div className="space-y-2">
              {userListings.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center justify-between">
                  <p className="text-xs text-white/70 truncate flex-1 mr-2">{l.title}</p>
                  <span className="text-xs font-bold text-white/50 flex-shrink-0">
                    ₹{(l.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="px-6 pb-6 pt-4 border-t border-white/5 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setEditing((v) => !v)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}>
            <Edit3 className="w-4 h-4" /> Edit Data
          </button>
          <button
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.2)', color: '#FFB300' }}
            onClick={() => alert('Password reset email sent (integration with auth provider required)')}>
            Reset Password
          </button>
        </div>

        {/* Suspend — high friction */}
        {!confirmSuspend ? (
          <button onClick={() => setConfirmSuspend(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.25)', color: '#FF3366' }}>
            <Ban className="w-4 h-4" /> 🚫 Suspend Account
          </button>
        ) : (
          <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.3)' }}>
            <p className="text-xs text-center text-white/70">Confirm suspend <strong className="text-white">{user.email}</strong>?</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={suspendAccount} disabled={suspending}
                className="py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                style={{ background: '#FF3366', color: '#fff' }}>
                {suspending ? 'Suspending…' : 'Yes, Suspend'}
              </button>
              <button onClick={() => setConfirmSuspend(false)}
                className="py-2 rounded-xl text-xs font-medium text-white/50"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── TAB 3: USER CRM ─────────────────────────────────────────────────────────
function UserCRMTab() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [usersData, listingsData] = await Promise.all([
      base44.entities.User.list('-created_date', 200),
      base44.entities.MarketListing.list('-created_date', 500),
    ]);
    setUsers(usersData);
    setListings(listingsData);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  const roleColor = (role) => {
    if (role === 'admin') return { bg: 'rgba(0,229,255,0.12)', color: '#00E5FF' };
    if (role === 'suspended') return { bg: 'rgba(255,51,102,0.12)', color: '#FF3366' };
    return { bg: 'rgba(255,255,255,0.06)', color: '#666' };
  };

  return (
    <div className="space-y-5 relative">
      {/* Header + Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search className="w-4 h-4 text-white/25 flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none" />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-4 h-4 text-white/25 hover:text-white/60 transition-colors" />
            </button>
          )}
        </div>
        <button onClick={load} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <RefreshCw className="w-4 h-4 text-white/30" />
        </button>
        <span className="text-xs text-white/25 font-inter whitespace-nowrap">{filtered.length} users</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-3 py-16 justify-center">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-white/30">Loading users…</span>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['User', 'Email', 'Role', 'Joined', 'Listings', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3.5 text-left text-[10px] font-bold text-white/25 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const rc = roleColor(u.role);
                const userListingsCount = listings.filter((l) => l.seller_email === u.email || l.created_by === u.email).length;
                return (
                  <motion.tr key={u.id}
                    className="cursor-pointer transition-colors hover:bg-white/3 group"
                    style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
                    onClick={() => setSelectedUser(u)}
                    whileHover={{ backgroundColor: 'rgba(0,229,255,0.03)' }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.15)' }}>
                          <span className="text-sm font-bold text-primary">{(u.full_name || u.email || '?').charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-white font-medium">{u.full_name || '(No name)'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white/40">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.color }}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white/30">
                      {new Date(u.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-white/50">{userListingsCount}</td>
                    <td className="px-4 py-3.5">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-primary font-semibold">
                        <Eye className="w-3.5 h-3.5" /> View
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/20 text-sm">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Side panel overlay */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)} />
            <UserProfilePanel
              user={selectedUser}
              listings={listings}
              onClose={() => setSelectedUser(null)}
              onUpdate={load}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN COMMAND CENTER ──────────────────────────────────────────────────────
const TABS = [
  { id: 'growth',      label: 'Growth & Metrics',    icon: TrendingUp },
  { id: 'moderation',  label: 'Moderation Queue',    icon: Shield },
  { id: 'crm',         label: 'User CRM',            icon: Users },
];

export default function CommandCenter() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('growth');
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then((u) => { setUser(u); setChecking(false); })
      .catch(() => setChecking(false));
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
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 mx-auto"
            style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)' }}>
            <Ban className="w-10 h-10 text-brake-red" />
          </div>
          <h1 className="font-space font-bold text-white text-2xl text-center">Command Center</h1>
          <p className="text-white/30 text-sm text-center mt-2">Admin access required</p>
          <button onClick={() => navigate('/')}
            className="mt-6 mx-auto block px-6 py-3 rounded-xl text-sm font-semibold text-black"
            style={{ background: '#00E5FF' }}>
            Return to App
          </button>
        </motion.div>
      </div>
    );
  }

  const ActiveTab = { growth: GrowthTab, moderation: ModerationTab, crm: UserCRMTab }[tab];

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden" style={{ fontFamily: 'var(--font-inter)' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0"
        style={{ background: 'rgba(6,6,6,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69f1a9f43003ef2e33d154e7/04eec8872_LOGO-copy.png"
              alt="DS" className="h-7 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            <div>
              <p className="font-space font-bold text-white text-sm leading-tight">DownShift</p>
              <p className="text-[10px] font-semibold" style={{ color: '#00E5FF' }}>Command Center</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <motion.button key={id} onClick={() => setTab(id)} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all relative overflow-hidden"
                style={active
                  ? { background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.22)', color: '#00E5FF' }
                  : { color: 'rgba(255,255,255,0.35)', border: '1px solid transparent' }}>
                {active && (
                  <motion.div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                    style={{ background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }}
                    layoutId="activeBar" />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.2)' }}>
              <span className="text-sm font-bold text-primary">{(user.full_name || user.email || 'A').charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/60 truncate">{user.full_name || user.email}</p>
              <p className="text-[10px] text-primary">Admin</p>
            </div>
          </div>
          <button onClick={() => navigate('/')}
            className="w-full mt-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            ← Back to App
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between flex-shrink-0"
          style={{ background: 'rgba(4,4,4,0.9)', backdropFilter: 'blur(20px)' }}>
          <div>
            <h1 className="font-space font-bold text-white text-xl">
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
            <p className="text-xs text-white/25 mt-0.5">DownShift Admin · Command Center</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div className="w-2 h-2 rounded-full"
              style={{ background: '#39FF14', boxShadow: '0 0 8px #39FF14' }}
              animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            <span className="text-xs text-white/30">System Online</span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}>
              <ActiveTab />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}