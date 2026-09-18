"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LogOut, Search, UploadCloud, Music, Mic, Trash2, Check, Play, Pause } from "lucide-react";

type AudioMode = "tts" | "file";

interface AudioEntry {
  mode: AudioMode;
  fileName: string | null;
  mimeType: string | null;
  ext: string | null;
  sizeBytes: number | null;
  uploadedAt: string | null;
}

interface PostRow {
  slug: string;
  title: string;
  entry: AudioEntry;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} কেবি`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} এমবি`;
}

export function BlogAudioAdmin({ initialPosts }: { initialPosts: PostRow[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PostRow | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingMode, setSavingMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredPosts = posts.filter(
    (p) => !search.trim() || p.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  function selectPost(p: PostRow) {
    setSelected(p);
    setSaved(false);
    setError(null);
    setPlaying(false);
  }

  function updateEntry(slug: string, entry: AudioEntry) {
    setPosts((prev) => prev.map((p) => (p.slug === slug ? { ...p, entry } : p)));
    setSelected((prev) => (prev && prev.slug === slug ? { ...prev, entry } : prev));
  }

  async function uploadFile(file: File) {
    if (!selected) return;
    setError(null);
    setUploading(true);
    setPlaying(false);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/blog-audio/${selected.slug}`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "আপলোড করা যায়নি");
        return;
      }
      updateEntry(selected.slug, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("আপলোড করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function setMode(mode: AudioMode) {
    if (!selected) return;
    setSavingMode(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog-audio/${selected.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "পরিবর্তন করা যায়নি");
        return;
      }
      updateEntry(selected.slug, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("পরিবর্তন করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSavingMode(false);
    }
  }

  async function removeFile() {
    if (!selected) return;
    setSavingMode(true);
    setError(null);
    setPlaying(false);
    try {
      const res = await fetch(`/api/admin/blog-audio/${selected.slug}`, { method: "DELETE" });
      if (!res.ok) {
        setError("মুছে ফেলা যায়নি");
        return;
      }
      updateEntry(selected.slug, { mode: "tts", fileName: null, mimeType: null, ext: null, sizeBytes: null, uploadedAt: null });
    } catch {
      setError("মুছে ফেলা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSavingMode(false);
    }
  }

  function togglePreview() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const entry = selected ? posts.find((p) => p.slug === selected.slug)?.entry ?? selected.entry : null;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ব্লগ অডিও নিয়ন্ত্রণ</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            বামের লিস্ট থেকে একটা লেখা বেছে নিন। প্রতিটা লেখার জন্য দুটো অপশন আছে — ব্রাউজার নিজে থেকে লেখাটা পড়ে
            শোনাবে (টিটিএস), অথবা আপনি নিজে একটা রেকর্ড করা অডিও ফাইল (mp3/wav/m4a) ড্র্যাগ করে আপলোড করে দিতে
            পারবেন। দুটোই একসাথে রাখা যায় — যেকোনো সময় সুইচ করে যেটা ভালো লাগে সেটা চালু করে দিতে পারবেন। এটা শুধু
            সেই একটা লেখার জন্যই প্রযোজ্য হবে।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Post picker */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="লেখার শিরোনাম খুঁজুন..."
                className="w-full rounded-md border border-border py-1.5 pl-8 pr-2.5 text-xs outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {filteredPosts.length === 0 && (
              <p className="p-4 text-center text-xs text-ink-faint">কোনো লেখা পাওয়া যায়নি</p>
            )}
            {filteredPosts.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => selectPost(p)}
                className={`flex w-full items-center gap-2 border-b border-border px-3 py-2.5 text-left text-xs transition last:border-b-0 hover:bg-surface-muted ${
                  selected?.slug === p.slug ? "bg-primary-light/60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.title}</p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                    p.entry.mode === "file"
                      ? "bg-cta-light text-cta-dark"
                      : "bg-surface-muted text-ink-faint"
                  }`}
                >
                  {p.entry.mode === "file" ? <Music size={9} /> : <Mic size={9} />}
                  {p.entry.mode === "file" ? "ফাইল" : "টিটিএস"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {!selected && (
            <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-faint">
              বাম থেকে একটা লেখা বেছে নিন
            </div>
          )}

          {selected && entry && (
            <div>
              <div className="rounded-lg border border-border bg-surface-muted px-4 py-3">
                <p className="text-sm font-bold text-foreground">{selected.title}</p>
                <p className="text-[11px] text-ink-faint">
                  <a
                    href={`/blog/${selected.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    লাইভ পেজ দেখুন →
                  </a>
                </p>
              </div>

              <div className="mt-4">
                <span className="mb-1.5 block text-xs font-medium text-ink-soft">অডিও কোথা থেকে আসবে</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={savingMode}
                    onClick={() => setMode("tts")}
                    className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2.5 text-xs font-medium transition disabled:opacity-50 ${
                      entry.mode === "tts"
                        ? "border-primary bg-primary-light text-primary-dark"
                        : "border-border text-ink-soft hover:border-primary/50"
                    }`}
                  >
                    <Mic size={14} /> টিটিএস (স্বয়ংক্রিয়)
                  </button>
                  <button
                    type="button"
                    disabled={savingMode || !entry.ext}
                    onClick={() => setMode("file")}
                    className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      entry.mode === "file"
                        ? "border-primary bg-primary-light text-primary-dark"
                        : "border-border text-ink-soft hover:border-primary/50"
                    }`}
                  >
                    <Music size={14} /> কাস্টম অডিও ফাইল
                  </button>
                </div>
                {!entry.ext && (
                  <p className="mt-1.5 text-[11px] text-ink-faint">
                    কাস্টম অডিও ফাইল ব্যবহার করতে চাইলে নিচে একটা ফাইল আপলোড করুন
                  </p>
                )}
              </div>

              <div className="mt-4">
                <span className="mb-1.5 block text-xs font-medium text-ink-soft">অডিও ফাইল আপলোড করুন</span>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition ${
                    dragOver ? "border-primary bg-primary-light" : "border-border bg-surface hover:border-primary/50"
                  }`}
                >
                  <UploadCloud size={26} className="text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    {uploading ? "আপলোড হচ্ছে..." : "ফাইল এখানে ড্র্যাগ করে ছাড়ুন, অথবা ক্লিক করে বেছে নিন"}
                  </p>
                  <p className="text-[10px] text-ink-faint">mp3, wav, m4a, ogg, aac — সর্বোচ্চ ২৫ এমবি</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.webm"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>

              {entry.ext && (
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark"
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" fill="currentColor" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{entry.fileName}</p>
                    <p className="text-[11px] text-ink-faint">{formatSize(entry.sizeBytes)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    disabled={savingMode}
                    aria-label="ফাইল মুছে ফেলুন"
                    className="shrink-0 rounded-md border border-price/40 bg-price/10 p-1.5 text-price hover:bg-price/20 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                  <audio
                    ref={audioRef}
                    src={`/api/blog-audio/${selected.slug}`}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              {error && <p className="mt-3 text-sm text-price">{error}</p>}
              {saved && (
                <span className="mt-3 flex items-center gap-1 text-sm font-medium text-success">
                  <Check size={15} /> সংরক্ষিত হয়েছে
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
