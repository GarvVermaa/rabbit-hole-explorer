import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Navbar from '../components/ui/Navbar';
import LeftSidebar from '../components/ui/LeftSidebar';
import RightPanel from '../components/ui/RightPanel';
import FavouritesView from '../components/ui/FavouritesView';
import ActiveNodeCard from '../components/graph/ActiveNodeCard';
import NodeTooltip from '../components/graph/NodeTooltip';
import { searchTopic, getRelatedTopics, apiSaveFavourite } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';


const KnowledgeGraph = dynamic(
  () => import('../components/graph/KnowledgeGraph'),
  { ssr: false, loading: () => <Loader /> }
);

function Loader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#00f5ff', animation: 'spin 1s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 7, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#bf5fff', animation: 'spin 1.4s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#39ff8f', animation: 'spin 1.8s linear infinite' }} />
      </div>
      <span style={{ fontSize: 11, color: '#2a3460', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>Mapping cosmos…</span>
    </div>
  );
}

function EmptyState({ onSearch }) {
  const examples = ['Artificial Intelligence', 'Black Holes', 'Consciousness', 'Chaos Theory', 'Evolution', 'String Theory'];
  const col = '#00f5ff';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 40px' }}>
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', fontSize: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 30%, rgba(0,245,255,0.15), rgba(191,95,255,0.08))',
          border: `1px solid ${col}30`,
          boxShadow: `0 0 60px ${col}15, 0 0 120px rgba(191,95,255,0.08)`,
          animation: 'float 4s ease-in-out infinite',
        }}>🐇</div>
        {[58, 80, 110].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${(90 - s) / 2}px`, left: `${(90 - s) / 2}px`,
            width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(0,245,255,${0.12 - i * 0.04})`,
            animation: `spin ${12 + i * 5}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }} />
        ))}
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e8f0ff', marginBottom: 12, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        Internet<br /><span style={{ color: col, textShadow: `0 0 30px ${col}` }}>Rabbit Hole</span><br />Explorer
      </h1>
      <p style={{ fontSize: 13, color: '#3a4870', lineHeight: 1.8, maxWidth: 360, marginBottom: 32, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
        Search any topic. Click nodes to dive deeper into connected knowledge. Every click reveals a new universe.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 420 }}>
        {examples.map(t => (
          <button key={t} onClick={() => onSearch(t)}
            style={{ padding: '7px 16px', borderRadius: 24, fontSize: 11, fontWeight: 700, background: `${col}08`, border: `1px solid ${col}20`, color: '#4a5880', cursor: 'pointer', transition: 'all 0.18s', fontFamily: "'Space Mono',monospace" }}
            onMouseEnter={e => { e.currentTarget.style.color = col; e.currentTarget.style.borderColor = `${col}50`; e.currentTarget.style.background = `${col}12`; e.currentTarget.style.boxShadow = `0 0 20px ${col}15`; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4a5880'; e.currentTarget.style.borderColor = `${col}20`; e.currentTarget.style.background = `${col}08`; e.currentTarget.style.boxShadow = 'none'; }}
          >{t}</button>
        ))}
      </div>
    </div>
  );
}

function BackButton({ history, onBack }) {
  if (history.length < 2) return null;
  const prev = history[history.length - 2];
  const col = prev.color || '#00f5ff';
  return (
    <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 20, animation: 'fadeUp 0.3s ease' }}>
      <button onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'rgba(6,7,14,0.95)', border: `1px solid ${col}35`, color: col, fontSize: 10, cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontWeight: 700, backdropFilter: 'blur(16px)', boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 20px ${col}10`, transition: 'all 0.18s', letterSpacing: '0.06em' }}
        onMouseEnter={e => { e.currentTarget.style.background = `${col}15`; e.currentTarget.style.boxShadow = `0 4px 28px rgba(0,0,0,0.6), 0 0 28px ${col}25`; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,7,14,0.95)'; e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.5), 0 0 20px ${col}10`; }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        <div>
          <div style={{ fontSize: 8, color: `${col}60`, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 1, fontWeight: 700 }}>Retrieve</div>
          <div style={{ fontWeight: 700, fontSize: 10, color: '#a0b8d0' }}>{prev.name.length > 22 ? prev.name.slice(0, 20) + '…' : prev.name}</div>
        </div>
      </button>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [activeParent, setParent] = useState(null);
  const [selectedNode, setSel] = useState(null);
  const [hoveredNode, setHov] = useState(null);
  const [tooltipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState([]);
  const [navHistory, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebar] = useState(true);
  const [view, setView] = useState('explore'); // 'explore' | 'favourites'
  const expanded = useRef(new Set());
  const { token, isLoggedIn } = useAuth();

  const pathNodeIds = path.map(p => p.id);

  // connected nodes for right panel (direct children of active parent)
  const connectedNodes = activeParent
    ? graph.edges
      .filter(e => e.source === activeParent)
      .map(e => graph.nodes.find(n => n.id === e.target))
      .filter(Boolean)
    : [];

  const handleSearch = useCallback(async (q) => {
    setLoading(true); setError(null); setSel(null);
    expanded.current = new Set(); setHistory([]);
    try {
      const d = await searchTopic(q);
      setGraph(d.graph);
      setParent(d.centralTopic.id);
      const root = { id: d.centralTopic.id, name: d.centralTopic.name, color: d.centralTopic.color || '#00f5ff' };
      setPath([root]); setHistory([root]);
    } catch { setError('Could not fetch data. Check your connection.'); }
    finally { setLoading(false); }
  }, []);

  const handleNodeClick = useCallback(async (node) => {
    setSel(node);
    const entry = { id: node.id, name: node.name, color: node.color || '#00f5ff' };
    setPath(prev => { const i = prev.findIndex(p => p.id === node.id); return i >= 0 ? prev.slice(0, i + 1) : [...prev, entry]; });
    setHistory(prev => { const i = prev.findIndex(p => p.id === node.id); return i >= 0 ? prev.slice(0, i + 1) : [...prev, entry]; });
    setParent(node.id);
    if (!expanded.current.has(node.id)) {
      expanded.current.add(node.id); setExpanding(true);
      try {
        const d = await getRelatedTopics(node.id);
        setGraph(prev => {
          const eIds = new Set(prev.nodes.map(n => n.id));
          const eeIds = new Set(prev.edges.map(e => e.id));
          return { nodes: [...prev.nodes, ...d.nodes.filter(n => !eIds.has(n.id))], edges: [...prev.edges, ...d.edges.filter(e => !eeIds.has(e.id))] };
        });
      } catch { expanded.current.delete(node.id); }
      finally { setExpanding(false); }
    }
  }, []);

  const handleBack = useCallback(() => {
    if (navHistory.length < 2) return;
    const prev = navHistory[navHistory.length - 2];
    const node = graph.nodes.find(n => n.id === prev.id);
    if (!node) return;
    setHistory(h => h.slice(0, -1));
    setPath(p => { const i = p.findIndex(x => x.id === prev.id); return i >= 0 ? p.slice(0, i + 1) : p; });
    setParent(prev.id); setSel(node);
  }, [navHistory, graph.nodes]);

  const handlePathNav = useCallback((item) => {
    if (!item) { setPath(p => p.slice(0, 1)); setHistory(h => h.slice(0, 1)); setParent(path[0]?.id || null); setSel(null); return; }
    const n = graph.nodes.find(n => n.id === item.id);
    if (n) handleNodeClick(n);
  }, [graph.nodes, handleNodeClick, path]);

  const handleSave = useCallback(async () => {
    if (!isLoggedIn || path.length === 0) return;
    try {
      const title = path[0]?.name || 'Untitled';
      const savePath = path.map(p => ({
        id: p.id, name: p.name,
        category: graph.nodes.find(n => n.id === p.id)?.category || 'other',
        color: p.color || '#4a9eff',
        icon: graph.nodes.find(n => n.id === p.id)?.icon || '🔵',
      }));
      await apiSaveFavourite(token, { title, path: savePath });
    } catch (err) {
      setError(err.message || 'Could not save');
    }
  }, [isLoggedIn, path, graph.nodes, token]);

  const handleLoadFavourite = useCallback(async (fav) => {
    if (!fav.path?.length) return;
    setView('explore');
    setLoading(true);
    setError(null);
    setSel(null);
    expanded.current = new Set();

    try {
      // Restore the full saved path by replaying each node
      const restoredPath = fav.path.map(p => ({
        id: p.id, name: p.name, color: p.color || '#00f5ff',
      }));

      // Search the root topic to get the initial graph
      const d = await searchTopic(fav.path[0].name);
      let currentGraph = d.graph;

      // Re-expand each node in the path beyond depth 0
      for (let i = 1; i < fav.path.length; i++) {
        const nodeId = fav.path[i].id;
        expanded.current.add(nodeId);
        try {
          const { nodes: newNodes, edges: newEdges } = await getRelatedTopics(nodeId);
          currentGraph = {
            nodes: [
              ...currentGraph.nodes.filter(n => !newNodes.find(nn => nn.id === n.id)),
              ...newNodes,
            ],
            edges: [
              ...currentGraph.edges,
              ...newEdges.filter(e => !currentGraph.edges.find(ce => ce.id === e.id)),
            ],
          };
        } catch {
          // if a node fails to expand, continue with what we have
        }
      }

      setGraph(currentGraph);
      setPath(restoredPath);
      setHistory(restoredPath);
      setParent(restoredPath[restoredPath.length - 1].id);
      setSel(currentGraph.nodes.find(n => n.id === restoredPath[restoredPath.length - 1].id) || null);
    } catch {
      setError('Could not restore this rabbit hole.');
    } finally {
      setLoading(false);
    }
  }, [handleSearch]);


  const hasGraph = graph.nodes.length > 0;
  const activeNode = activeParent ? graph.nodes.find(n => n.id === activeParent) : null;

  return (
    <>
      <Head>
        <title>Rabbit Hole Explorer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐇</text></svg>" />
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#050508', overflow: 'hidden' }}>

        {/* ── navbar ── */}
        <Navbar
          view={view}
          onViewChange={setView}
          onSearch={handleSearch}
          isLoading={loading}
          onSave={handleSave}
          canSave={hasGraph && path.length > 0}
          error={error}
        />

        {/* ── body ── */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {view === 'favourites' ? (
            <FavouritesView onLoadFavourite={handleLoadFavourite} />
          ) : (
            <>
              {/* left sidebar */}
              <LeftSidebar
                collapsed={!sidebarOpen}
                onToggle={() => setSidebar(x => !x)}
                path={path}
                onNavigate={handlePathNav}
                graphStats={hasGraph ? { nodes: graph.nodes.length, edges: graph.edges.length, depth: Math.max(0, path.length - 1) } : null}
              />

              {/* centre — graph */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#050508' }}>
                {!hasGraph && !loading ? (
                  <EmptyState onSearch={handleSearch} />
                ) : loading ? (
                  <Loader />
                ) : (
                  <KnowledgeGraph
                    nodes={graph.nodes}
                    edges={graph.edges}
                    onNodeClick={handleNodeClick}
                    onNodeHover={(node, pos) => { setHov(node); if (pos) setTipPos(pos); }}
                    selectedNodeId={selectedNode?.id}
                    activeParentId={activeParent}
                    pathNodeIds={pathNodeIds}
                  />
                )}

                {/* back button */}
                {hasGraph && <BackButton history={navHistory} onBack={handleBack} />}

                {/* expanding indicator */}
                {expanding && (
                  <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: 'rgba(5,5,8,0.95)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 20, fontSize: 10, fontWeight: 700, color: '#00f5ff', fontFamily: "'Space Mono',monospace", backdropFilter: 'blur(12px)', zIndex: 20 }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#00f5ff', animation: `ld 1.2s ${i * .2}s ease-in-out infinite` }} />)}
                    Fetching connections…
                  </div>
                )}

                {/* active node card — bottom centre */}
                {hasGraph && <ActiveNodeCard nodeData={activeNode} />}

                {/* legend */}
                {hasGraph && (
                  <div style={{ position: 'absolute', bottom: 20, left: 16, padding: '8px 12px', background: 'rgba(5,5,8,0.88)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 9, fontSize: 9, fontWeight: 700, color: '#2a3460', fontFamily: "'Space Mono',monospace", lineHeight: 2, pointerEvents: 'none', backdropFilter: 'blur(8px)' }}>
                    {[{ col: '#00f5ff', label: 'path tubes', dash: true }, { col: 'rgba(120,160,255,0.5)', label: 'connections' }, { col: 'rgba(255,255,255,0.12)', label: 'distant links' }].map(({ col, label, dash }, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 18, height: 2, borderRadius: 1, background: dash ? 'transparent' : '', borderTop: dash ? `2px dashed ${col}` : `2px solid ${col}` }} />
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* right panel */}
              <RightPanel
                activeNode={activeNode}
                connectedNodes={connectedNodes}
                onNodeClick={handleNodeClick}
              />
            </>
          )}
        </div>
      </div>

      <NodeTooltip nodeData={hoveredNode} position={tooltipPos} />
      <style>{`@keyframes ld{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}`}</style>
    </>
  );
}
