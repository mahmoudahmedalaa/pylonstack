'use client';

import { useState } from 'react';
import { FileDown, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { StackLayerData } from '@/components/stack-builder/StackLayer';

interface ExportResultsButtonsProps {
  projectName: string;
  projectDescription: string;
  projectStatus: string;
  createdAt: string;
  layers: StackLayerData[];
}

export function ExportResultsButtons({
  projectName,
  projectDescription,
  projectStatus,
  createdAt,
  layers,
}: ExportResultsButtonsProps) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportMarkdown = async () => {
    let md = `# ${projectName || 'Stack Export'}\n\n`;
    md += `${projectDescription || ''}\n\n`;
    if (projectStatus) md += `**Status:** ${projectStatus}\n`;
    if (createdAt) md += `**Created At:** ${new Date(createdAt).toLocaleDateString()}\n\n`;
    md += `## Architecture Layers\n\n`;

    layers.forEach((layer) => {
      md += `### ${layer.category}\n`;
      layer.tools.forEach((tool) => {
        md += `- **${tool.name}**: ${tool.description} (Pricing: ${tool.costIndicator})\n`;
      });
      md += '\n';
    });

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(md);
        alert('Markdown copied to clipboard!');
      } else {
        // Fallback to downloading
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/\s+/g, '-').toLowerCase() || 'stack'}-export.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      // Attempt to capture the closest main container or body
      const element = document.getElementById('results-content-area') || document.body;
      
      // Short delay to ensure any layout shifts settle
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Use html2canvas with specific settings to improve reliability
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff', // Ensure a solid background
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG for smaller file sizes
      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'px', 
        format: [canvas.width, canvas.height] 
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${projectName.replace(/\s+/g, '-').toLowerCase() || 'stack'}-export.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Failed to generate PDF. You can try copying as Markdown instead.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        variant="outline"
        onClick={handleExportPdf}
        disabled={isExportingPdf}
        className="group w-full justify-between"
      >
        {isExportingPdf ? 'Generating PDF...' : 'Download PDF'}
        {isExportingPdf ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={handleExportMarkdown}
        className="group w-full justify-between"
      >
        Copy as Markdown
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
}
