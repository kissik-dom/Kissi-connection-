import { Bot, Upload, Cpu, Eye, Mic, Monitor, AlertTriangle, Check, Zap } from 'lucide-react'

export default function AIAvatar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Avatar Mode</h1>
        <p className="text-gray-500 text-sm mt-1">Phase 2 — Realistic avatar with face swap, lip sync, and gaze correction</p>
      </div>

      {/* Status banner */}
      <div className="card bg-purple-500/5 border-purple-500/20">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-purple-400 font-medium">Phase 2 — Advanced AI Avatar</p>
            <p className="text-gray-400 mt-1">
              When active, your video feed is processed through three AI models in real-time:
              DeepFaceLive for face swap, MuseTalk for lip synchronization, and gaze correction
              for eye contact. The result is indistinguishable from a live camera feed.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4">Processing Pipeline</h3>
        <div className="flex items-center justify-between gap-2">
          {[
            { icon: Monitor, label: 'Camera Feed', desc: 'Your raw video', color: 'blue' },
            { icon: Bot, label: 'DeepFaceLive', desc: 'Face swap', color: 'purple' },
            { icon: Mic, label: 'MuseTalk', desc: 'Lip sync', color: 'pink' },
            { icon: Eye, label: 'Gaze Correction', desc: 'Eye contact', color: 'emerald' },
            { icon: Zap, label: 'Output', desc: 'Final feed', color: 'gold' },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="text-center">
                <div className={`w-14 h-14 rounded-xl bg-${step.color}-500/10 border border-${step.color}-500/20 flex items-center justify-center mx-auto mb-2`}>
                  <step.icon className={`w-6 h-6 text-${step.color}-400`} />
                </div>
                <p className="text-xs font-medium text-white">{step.label}</p>
                <p className="text-[10px] text-gray-500">{step.desc}</p>
              </div>
              {i < 4 && <span className="text-gold-500 text-lg mt-[-20px]">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Upload avatar training data */}
      <div className="card">
        <h3 className="font-semibold text-white mb-3">Avatar Training</h3>
        <p className="text-sm text-gray-400 mb-4">Upload photos and short video clips to train your AI avatar. The more data, the more realistic the result.</p>
        <div className="border-2 border-dashed border-gold-500/20 rounded-xl p-8 text-center">
          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Drop photos/videos or click to upload</p>
          <p className="text-xs text-gray-500 mt-1">Recommend: 10+ photos, 2+ minutes of video from different angles</p>
          <button className="btn-outline text-xs mt-4">Select Files</button>
        </div>
      </div>

      {/* GPU Requirements */}
      <div className="card">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Cpu className="w-4 h-4 text-gold-400" /> GPU Requirements</h3>
        <div className="space-y-2 text-sm">
          {[
            { requirement: 'DeepFaceLive', gpu: 'NVIDIA RTX 3060+ (8GB VRAM)', note: 'Real-time face swap' },
            { requirement: 'MuseTalk', gpu: 'NVIDIA RTX 3060+ (8GB VRAM)', note: 'Audio-driven lip sync' },
            { requirement: 'Gaze Correction', gpu: 'Any GPU (2GB VRAM)', note: 'Eye contact correction' },
            { requirement: 'Combined Pipeline', gpu: 'RTX 4090 or Cloud A100', note: 'All three models at 30fps' },
          ].map(req => (
            <div key={req.requirement} className="flex items-center justify-between p-3 rounded-lg bg-royal-800/30">
              <div>
                <span className="text-white">{req.requirement}</span>
                <span className="text-gray-500 text-xs ml-2">— {req.note}</span>
              </div>
              <span className="text-xs text-gray-400 font-mono">{req.gpu}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gold-500/5 border-gold-500/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-400">
            <p className="text-gold-400 font-medium mb-1">Cloud GPU Required</p>
            <p>AI Avatar mode requires a cloud GPU server running the processing pipeline. Estimated cost: $50-200/month depending on usage. Configure your GPU provider in the Automation Hub.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
