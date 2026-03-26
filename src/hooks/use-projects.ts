import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ── Types ───────────────────────────────────────
export interface StackLayerTool {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface StackLayer {
  category: string;
  tools: StackLayerTool[];
}

export interface ProjectRow {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  projectType: string | null;
  status: string;
  totalMonthlyCost: string | null;
  stackData: StackLayer[] | null;
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

export interface CreateProjectPayload {
  name: string;
  description?: string;
  projectType?: string;
  status?: string;
  stackData?: Record<string, unknown>;
}

export interface SaveToolsPayload {
  projectId: string;
  tools: {
    toolId?: string;
    toolSlug?: string;
    categoryId?: string;
    categorySlug?: string;
    monthlyCost?: string;
    position?: number;
    notes?: string;
    aiRecommended?: boolean;
  }[];
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

async function createProject(payload: CreateProjectPayload): Promise<ProjectRow> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

async function saveProjectTools({ projectId, tools }: SaveToolsPayload): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/tools`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tools }),
  });
  if (!res.ok) throw new Error('Failed to save project tools');
}

async function updateProject({
  id,
  ...payload
}: { id: string } & Partial<CreateProjectPayload>): Promise<ProjectRow> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update project');
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

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useSaveProjectTools() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveProjectTools,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
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

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
