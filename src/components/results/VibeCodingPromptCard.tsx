'use client';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Copy, Terminal, Check } from 'lucide-react';
import type { StackLayerData } from '@/components/stack-builder/StackLayer';
import type { ProjectPhase } from '@/lib/ai/ai-client';

interface VibeCodingPromptCardProps {
  project: {
    name: string;
    description: string | null;
  };
  layers: StackLayerData[];
  phases: ProjectPhase[];
}

export function VibeCodingPromptCard({ project, layers, phases }: VibeCodingPromptCardProps) {
  const [copied, setCopied] = useState(false);

  // Generate the prompt based on the stack and phases
  const generatePrompt = () => {
    let prompt = `You are an expert full-stack developer and software architect. I am using an AI coding assistant to "vibe code" a new project called "${project.name}".\n\n`;

    if (project.description) {
      prompt += `### Project Overview\n${project.description}\n\n`;
    }

    prompt += `### Tech Stack Architecture\nHere are the specific tools and technologies we will use:\n`;
    layers.forEach((layer) => {
      // Find the name of the tool(s) in this layer
      const tools = layer.tools.map((t) => t.name).join(', ');
      if (tools) {
        prompt += `- **${layer.category.charAt(0).toUpperCase() + layer.category.slice(1).replace('-', ' ')}**: ${tools}\n`;
      }
    });

    if (phases.length > 0) {
      prompt += `\n### Phased Rollout Plan\nPlease follow this phased implementation plan:\n`;
      phases.forEach((phase) => {
        prompt += `- **${phase.name.replace('Phase ', '')}**: ${phase.description}\n`;
        phase.tools.forEach((tool) => {
          prompt += `  - ${tool.toolName}: ${tool.reason || 'Implement core functionality'}\n`;
        });
      });
    }

    prompt += `\n### Instructions\n`;
    prompt += `1. **Initial Setup**: Please initialize the repository based on the frontend and backend frameworks listed above. Generate all the necessary boilerplate.\n`;
    prompt += `2. **Configuration**: Set up necessary database environments, auth integrations, and UI libraries.\n`;
    prompt += `3. **Step-by-Step**: Do not try to write the entire app at once. Start by giving me the shell commands to initialize the project, then build out the UI shell, then connect the data layer, and finally integrate third-party APIs.\n`;
    prompt += `4. **Best Practices**: Ensure all code is production-ready, type-safe, and follows the official documentation of the chosen tools.\n\n`;
    prompt += `Let's begin with Step 1. Please give me the exact commands to run to bootstrap this stack.`;

    return prompt;
  };

  const promptText = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-16 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-[#111] to-black shadow-xl">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-black/40 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Terminal className="h-5 w-5 text-[#FF3E6C]" />
          Vibe Coding Prompt
        </h2>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-[#333] hover:bg-[#222] hover:text-white"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? 'Copied to Clipboard' : 'Copy Prompt'}
        </Button>
      </div>

      <div className="relative p-6">
        <div className="mb-4 text-sm text-[var(--muted-foreground)]">
          Paste this prompt into Cline, Cursor, or your favorite AI coding assistant to jumpstart
          your development perfectly aligned with this stack architecture.
        </div>

        <div className="relative overflow-hidden rounded-lg border border-[#333] bg-[#0a0a0a]">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 border-b border-[#333] bg-[#111] px-4 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
          </div>

          <pre className="max-h-[400px] w-full overflow-y-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-blue-300 select-all">
            {promptText}
          </pre>
        </div>
      </div>
    </div>
  );
}
