import React, { useState } from 'react';
import { DesignProject } from '../../types';
import { store } from '../../services/store';
import { Palette, CheckCircle2, Clock, Upload, Send, MessageCircle, Sparkles } from 'lucide-react';
import { Bottle3DCanvas } from '../3d/Bottle3DCanvas';
import { showToast } from '../../utils/toast';

export const DesignManagement: React.FC = () => {
  const [projects, setProjects] = useState<DesignProject[]>(store.getState().designProjects);
  const [selectedProject, setSelectedProject] = useState<DesignProject | null>(
    projects[0] || null
  );
  const [revisionNotes, setRevisionNotes] = useState('');

  const handleAddRevision = (projectId: string) => {
    if (!revisionNotes.trim()) {
      showToast('Please enter revision notes (e.g. Adjusted FSSAI license font and barcode alignment).', 'error');
      return;
    }

    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const nextVer = `V${proj.versions.length + 1}`;
    store.addDesignVersion(projectId, {
      versionNumber: nextVer,
      fileUrl: `/proofs/${proj.customerName.toLowerCase().replace(/\s+/g, '-')}-${nextVer}.pdf`,
      uploadedBy: 'Lead Packaging Designer',
      feedback: revisionNotes,
      status: 'PENDING_CLIENT_REVIEW',
    });

    setProjects([...store.getState().designProjects]);
    const updated = store.getState().designProjects.find((p) => p.id === projectId);
    if (updated) setSelectedProject(updated);
    setRevisionNotes('');
    showToast(`Revision ${nextVer} published and queued for client approval!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E5DDD0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#1A1817]">
            Packaging Design Studio & Label Proofing
          </h2>
          <p className="text-xs text-[#7A6E5E]">
            Collaborate on cylinder plate layouts, FSSAI regulatory text placement, and client digital sign-offs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Projects List */}
        <div className="lg:col-span-5 space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                selectedProject?.id === proj.id
                  ? 'bg-white border-[#D92365] shadow-sm'
                  : 'bg-white border-[#E5DDD0] hover:border-stone-400'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A1817]">
                    {proj.customerName}
                  </h3>
                  <span className="text-xs text-stone-500">
                    Lead Designer: <strong>{proj.designerName}</strong>
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    proj.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {proj.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-stone-600 pt-1 border-t border-[#F4EFE6]">
                <span>Revisions: {proj.versions.length} versions</span>
                <span className="font-mono text-stone-500">
                  Active: {proj.versions[proj.versions.length - 1]?.versionNumber}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active Project Workspace */}
        {selectedProject && (
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-xs space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-[#F4EFE6]">
              <div>
                <span className="text-xs font-mono text-[#D92365] font-bold">
                  {selectedProject.id}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#1A1817]">
                  {selectedProject.customerName} Artwork Studio
                </h3>
              </div>

              <a
                href={`https://wa.me/918827275367?text=Hello,%20please%20review%20your%20latest%20MLUE%20label%20proof%20for%20${encodeURIComponent(
                  selectedProject.customerName
                )}.`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send Proof Link</span>
              </a>
            </div>

            {/* 3D Bottle Real-time Preview */}
            <div className="h-64 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] overflow-hidden relative">
              <Bottle3DCanvas
                customization={{
                  bottleSize: '500ml',
                  bottleStyle: 'Square',
                  capColor: '#111118',
                  labelColor: '#181824',
                  labelStyle: 'Custom Full-Wrap',
                  brandName: selectedProject.customerName,
                  tagline: 'Turn Every Bottle Into a Brand Touchpoint',
                  finish: 'Gloss',
                }}
                interactive={true}
                className="w-full h-full"
              />
            </div>

            {/* Versions History */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Artwork Revision History
              </h4>

              <div className="space-y-2">
                {selectedProject.versions.map((ver, idx) => (
                  <div
                    key={ver.id || ver.version || idx}
                    className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] flex justify-between items-center text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-stone-900">
                          {ver.versionNumber || ver.version || `V${idx + 1}`}
                        </strong>
                        <span className="text-[10px] text-stone-400">
                          Uploaded: {ver.uploadedAt ? new Date(ver.uploadedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        {ver.feedback || ver.notes || ver.clientFeedback || 'Original proof generated'}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ver.approved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {ver.approved ? 'APPROVED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Revision Form */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD0] space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Upload New Artwork Proof
              </h4>
              <textarea
                rows={2}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Specify changes made (e.g. Updated BIS ISI licence code, changed background Pantone)..."
                className="w-full p-2.5 rounded-lg bg-white border border-[#D8CEBE] text-xs focus:outline-none focus:border-[#D92365]"
              />
              <button
                onClick={() => handleAddRevision(selectedProject.id)}
                className="px-4 py-2 rounded-lg bg-[#1A1817] hover:bg-[#D92365] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Publish New Version for Client Review</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
