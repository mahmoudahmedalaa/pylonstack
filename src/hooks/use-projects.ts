import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ── Types ───────────────────────────────────────
export interface ProjectRow {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  projectType: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends ProjectRow {
  tools: {
    id: string;
    toolId: string;
    categoryId: string;
    toolName: string;
    toolSlug: string;
    toolLogo: string | null;
    categoryName: string | null;
    notes: string | null;
  }[];
  aiRecommendation: Record<string, unknown> | null;
}

// ── Fetchers ────────────────────────────────────
async function fetchProjects(): Promise<ProjectRow[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  const json = await res.json();
  return json.data;
}

async function fetchProject(id: string): Promise<ProjectDetail> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
}

// ── Hooks ───────────────────────────────────────
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => fetchProject(id),
    enabled: !!id,
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
