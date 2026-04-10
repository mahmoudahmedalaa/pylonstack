'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface RawResponse {
  inputContext?: {
    projectName?: string;
    projectType?: string;
    teamSize?: string;
    requirements?: string[];
    priorities?: string[];
  };
  summary?: string;
  estimatedMonthlyCost?: number;
  source?: string;
  correctionAttempts?: number;
  validationPassed?: boolean;
  validationWarnings?: string[];
  generationTimeMs?: number;
  qualityGrade?: number | null;
  adminNotes?: string | null;
  gradedAt?: string;
  gradedBy?: string;
}

interface Generation {
  id: string;
  projectId: string;
  userId: string;
  modelUsed: string;
  promptHash: string | null;
  generationTimeMs: number | null;
  rawResponse: RawResponse;
  recommendations: Array<{
    category_slug: string;
    tool_slug: string;
    confidence: number;
    reasoning: string;
  }>;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const GRADE_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Poor', color: '#ef4444' },
  2: { label: 'Fair', color: '#f97316' },
  3: { label: 'Good', color: '#eab308' },
  4: { label: 'Great', color: '#22c55e' },
  5: { label: 'Excellent', color: '#3b82f6' },
};

export default function AdminGenerationsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Generation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [grading, setGrading] = useState<Record<string, { grade: number; notes: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/generations?page=${page}&limit=20`);
      if (res.status === 401) { router.push('/auth/login'); return; }
      if (res.status === 403) { setError('Access denied. Admin-only area.'); setLoading(false); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRows(json.data);
      setPagination(json.pagination);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGrade = async (id: string) => {
    const g = grading[id];
    if (!g?.grade) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/generations/${id}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qualityGrade: g.grade, adminNotes: g.notes }),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchData();
    } catch (e) {
      alert(`Grade failed: ${e}`);
    } finally {
      setSaving(null);
    }
  };

  // Stats
  const total = pagination?.total ?? 0;
  const corrected = rows.filter((r) => (r.rawResponse?.correctionAttempts ?? 0) > 0).length;
  const failed = rows.filter((r) => r.rawResponse?.validationPassed === false).length;
  const avgRt = rows.length
    ? Math.round(rows.reduce((a, r) => a + (r.rawResponse?.generationTimeMs ?? 0), 0) / rows.length)
    : 0;
  const graded = rows.filter((r) => r.rawResponse?.qualityGrade != null).length;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e4e4e7', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #27272a', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: 'none', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13 }}
        >
          ← Dashboard
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#fafafa' }}>Generation Logs</h1>
          <p style={{ margin: 0, fontSize: 12, color: '#71717a' }}>Data flywheel · Review and grade AI outputs</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, borderBottom: '1px solid #27272a', background: '#27272a' }}>
        {[
          { label: 'Total Generations', value: total },
          { label: 'Self-Corrected', value: corrected, unit: `/ ${rows.length}`, accent: '#f59e0b' },
          { label: 'Validation Failed', value: failed, accent: failed > 0 ? '#ef4444' : '#22c55e' },
          { label: 'Avg Response Time', value: avgRt, unit: 'ms', accent: avgRt > 8000 ? '#f97316' : '#71717a' },
          { label: 'Graded', value: graded, unit: `/ ${rows.length}`, accent: '#3b82f6' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#09090b', padding: '16px 24px' }}>
            <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.accent || '#fafafa', display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {s.value}
              {s.unit && <span style={{ fontSize: 12, color: '#71717a', fontWeight: 400 }}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px' }}>
        {error && (
          <div style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '12px 16px', color: '#fca5a5', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#52525b' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
            Loading generations...
          </div>
        ) : rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#52525b' }}>
            No generations yet. Generate your first tech stack to start the flywheel.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid #27272a', borderRadius: 8, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 80px 90px', gap: 0, background: '#18181b', padding: '10px 16px', fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Project</span>
              <span>Model</span>
              <span>Corrections</span>
              <span>Validity</span>
              <span>Grade</span>
              <span>Generated</span>
            </div>

            {rows.map((row) => {
              const raw = row.rawResponse ?? {};
              const isExpanded = expanded === row.id;
              const gradeInfo = raw.qualityGrade != null ? GRADE_LABELS[raw.qualityGrade] : null;
              const localGrade = grading[row.id]?.grade ?? raw.qualityGrade ?? 0;
              const localNotes = grading[row.id]?.notes ?? raw.adminNotes ?? '';
              const date = new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

              return (
                <div key={row.id} style={{ borderTop: '1px solid #27272a' }}>
                  {/* Row */}
                  <div
                    onClick={() => setExpanded(isExpanded ? null : row.id)}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px 80px 90px', gap: 0, padding: '12px 16px', cursor: 'pointer', background: isExpanded ? '#18181b' : '#09090b', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#fafafa', marginBottom: 2 }}>
                        {raw.inputContext?.projectName || 'Unnamed Project'}
                      </div>
                      <div style={{ fontSize: 11, color: '#52525b' }}>
                        {raw.inputContext?.projectType?.replace(/_/g, ' ')} · {row.id.slice(0, 8)}…
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#71717a' }}>{row.modelUsed ?? '—'}</span>
                    <span style={{ fontSize: 13, color: (raw.correctionAttempts ?? 0) > 0 ? '#f59e0b' : '#52525b' }}>
                      {raw.correctionAttempts ?? 0}×
                    </span>
                    <span>
                      <span style={{
                        fontSize: 10, padding: '2px 6px', borderRadius: 4,
                        background: raw.validationPassed === false ? '#1c0a0a' : '#0a1c0a',
                        color: raw.validationPassed === false ? '#f87171' : '#4ade80',
                        border: `1px solid ${raw.validationPassed === false ? '#7f1d1d' : '#14532d'}`,
                      }}>
                        {raw.validationPassed === false ? 'FAIL' : 'PASS'}
                      </span>
                    </span>
                    <span>
                      {gradeInfo ? (
                        <span style={{ fontSize: 12, fontWeight: 600, color: gradeInfo.color }}>{gradeInfo.label}</span>
                      ) : (
                        <span style={{ fontSize: 11, color: '#3f3f46' }}>—</span>
                      )}
                    </span>
                    <span style={{ fontSize: 11, color: '#52525b' }}>{date}</span>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px', background: '#111111', borderTop: '1px solid #27272a' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                        {/* Input Context */}
                        <div>
                          <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Input Context</div>
                          <div style={{ background: '#18181b', borderRadius: 6, padding: 12, fontSize: 12, color: '#a1a1aa', lineHeight: 1.7 }}>
                            <div><strong style={{ color: '#e4e4e7' }}>Team:</strong> {raw.inputContext?.teamSize}</div>
                            <div><strong style={{ color: '#e4e4e7' }}>Requirements:</strong> {raw.inputContext?.requirements?.join(', ')}</div>
                            <div><strong style={{ color: '#e4e4e7' }}>Priorities:</strong> {raw.inputContext?.priorities?.join(', ')}</div>
                            <div><strong style={{ color: '#e4e4e7' }}>Response time:</strong> {raw.generationTimeMs}ms</div>
                          </div>
                          {raw.validationWarnings && raw.validationWarnings.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize: 11, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Validation Warnings</div>
                              {raw.validationWarnings.map((w, i) => (
                                <div key={i} style={{ fontSize: 11, color: '#fbbf24', padding: '2px 0' }}>· {w}</div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recommendations */}
                        <div>
                          <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                            Recommendations ({row.recommendations?.length ?? 0} tools)
                          </div>
                          <div style={{ background: '#18181b', borderRadius: 6, padding: 12, maxHeight: 160, overflowY: 'auto' }}>
                            {row.recommendations?.map((r, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #27272a', fontSize: 12 }}>
                                <span style={{ color: '#e4e4e7' }}>{r.tool_slug}</span>
                                <span style={{ color: '#71717a', fontSize: 11 }}>{r.category_slug}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12, color: '#71717a' }}>
                            <strong style={{ color: '#a1a1aa' }}>Summary:</strong> {raw.summary?.slice(0, 120)}…
                          </div>
                        </div>
                      </div>

                      {/* Grade control */}
                      <div style={{ borderTop: '1px solid #27272a', paddingTop: 16 }}>
                        <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Quality Grade</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {[1, 2, 3, 4, 5].map((g) => {
                              const info = GRADE_LABELS[g];
                              const selected = localGrade === g;
                              return (
                                <button
                                  key={g}
                                  onClick={(e) => { e.stopPropagation(); setGrading((prev) => ({ ...prev, [row.id]: { grade: g, notes: localNotes } })); }}
                                  style={{
                                    width: 36, height: 36, borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                                    background: selected ? info.color : 'transparent',
                                    border: `1px solid ${selected ? info.color : '#3f3f46'}`,
                                    color: selected ? '#fff' : '#71717a',
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  {g}
                                </button>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: 12, color: '#71717a', minWidth: 60 }}>
                            {localGrade ? GRADE_LABELS[localGrade]?.label : 'Select grade'}
                          </div>
                          <input
                            value={localNotes}
                            onChange={(e) => { e.stopPropagation(); setGrading((prev) => ({ ...prev, [row.id]: { grade: localGrade, notes: e.target.value } })); }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Optional admin notes..."
                            style={{ flex: 1, background: '#18181b', border: '1px solid #3f3f46', borderRadius: 6, padding: '7px 10px', color: '#e4e4e7', fontSize: 12 }}
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGrade(row.id); }}
                            disabled={!localGrade || saving === row.id}
                            style={{
                              padding: '7px 16px', borderRadius: 6, border: 'none', cursor: localGrade ? 'pointer' : 'not-allowed',
                              background: localGrade ? '#3b82f6' : '#1e1e2e', color: localGrade ? '#fff' : '#52525b',
                              fontSize: 12, fontWeight: 500,
                            }}
                          >
                            {saving === row.id ? 'Saving…' : raw.qualityGrade != null ? 'Update Grade' : 'Save Grade'}
                          </button>
                        </div>
                        {raw.gradedAt && (
                          <div style={{ marginTop: 8, fontSize: 11, color: '#52525b' }}>
                            Last graded {new Date(raw.gradedAt).toLocaleString()} by {raw.gradedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24, fontSize: 13, color: '#71717a' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #27272a', background: 'transparent', color: '#a1a1aa', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span>Page {page} of {pagination.totalPages} · {pagination.total} total</span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #27272a', background: 'transparent', color: '#a1a1aa', cursor: page === pagination.totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
