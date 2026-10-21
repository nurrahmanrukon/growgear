"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { FOOTER_GROUP_CATALOG, FOOTER_LINK_CATALOG } from "@/lib/data/footerLinks";

interface FooterSettings {
  hiddenGroups: string[];
  groupOrder: string[];
  linkOrder: Record<string, number[]>;
}

export function FooterAdmin({ initial }: { initial: FooterSettings }) {
  const router = useRouter();
  const [hidden, setHidden] = useState<Set<string>>(new Set(initial.hiddenGroups));
  const [groupOrder, setGroupOrder] = useState<string[]>(initial.groupOrder);
  const [linkOrder, setLinkOrder] = useState<Record<string, number[]>>(initial.linkOrder);
  const [dragGroupIndex, setDragGroupIndex] = useState<number | null>(null);
  const [dragLink, setDragLink] = useState<{ key: string; index: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleHidden(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSaved(false);
  }

  function moveGroup(from: number, to: number) {
    if (to < 0 || to >= groupOrder.length) return;
    setGroupOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setSaved(false);
  }

  function handleGroupDrop(targetIndex: number) {
    if (dragGroupIndex === null || dragGroupIndex === targetIndex) {
      setDragGroupIndex(null);
      return;
    }
    moveGroup(dragGroupIndex, targetIndex);
    setDragGroupIndex(null);
  }

  function moveLink(key: string, from: number, to: number) {
    const list = linkOrder[key] ?? [];
    if (to < 0 || to >= list.length) return;
    setLinkOrder((prev) => {
      const next = [...(prev[key] ?? [])];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, [key]: next };
    });
    setSaved(false);
  }

  function handleLinkDrop(key: string, targetIndex: number) {
    if (!dragLink || dragLink.key !== key || dragLink.index === targetIndex) {
      setDragLink(null);
      return;
    }
    moveLink(key, dragLink.index, targetIndex);
    setDragLink(null);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hiddenGroups: Array.from(hidden), groupOrder, linkOrder }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setHidden(new Set(data.hiddenGroups));
      setGroupOrder(data.groupOrder);
      setLinkOrder(data.linkOrder);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("সংরক্ষণ করা যায়নি — ইন্টারনেট সংযোগ চেক করুন");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const groupLabel = (key: string) => FOOTER_GROUP_CATALOG.find((g) => g.key === key)?.label ?? key;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ফুটার</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            সাইটের সবচেয়ে নিচের অংশে (ফুটার) যে ৪টা লিংকের দল দেখা যায়, তার যেকোনোটা চাইলে পুরোপুরি লুকিয়ে রাখতে
            পারবেন, দলগুলোর ক্রম বদলাতে পারবেন, আর প্রতিটা দলের ভেতরের লিংকের ক্রমও টানা-ছাড়া (ড্র্যাগ) করে সাজাতে
            পারবেন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-md space-y-3">
        {groupOrder.map((key, i) => {
          const isHidden = hidden.has(key);
          const links = (linkOrder[key] ?? []).map((idx) => FOOTER_LINK_CATALOG[key]?.[idx]).filter(Boolean);
          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDragGroupIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleGroupDrop(i)}
              onDragEnd={() => setDragGroupIndex(null)}
              className={`rounded-lg border border-border bg-surface p-3 transition ${
                dragGroupIndex === i ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                    <GripVertical size={14} />
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${isHidden ? "text-ink-faint line-through" : "text-foreground"}`}>
                      {groupLabel(key)}
                    </p>
                    {isHidden && <p className="text-[11px] font-medium text-price">লুকানো — ভিজিটররা দেখবে না</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label="উপরে সরান"
                    disabled={i === 0}
                    onClick={() => moveGroup(i, i - 1)}
                    className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label="নিচে সরান"
                    disabled={i === groupOrder.length - 1}
                    onClick={() => moveGroup(i, i + 1)}
                    className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label={isHidden ? "দেখান" : "লুকান"}
                    onClick={() => toggleHidden(key)}
                    className={`rounded-md border p-1.5 ${
                      isHidden
                        ? "border-price/40 bg-price/10 text-price"
                        : "border-border text-ink-soft hover:border-primary hover:text-primary"
                    }`}
                  >
                    {isHidden ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
                {links.map((link, li) => (
                  <div
                    key={li}
                    draggable
                    onDragStart={() => setDragLink({ key, index: li })}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleLinkDrop(key, li)}
                    onDragEnd={() => setDragLink(null)}
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-1 ${
                      dragLink?.key === key && dragLink.index === li ? "opacity-40" : ""
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                      <GripVertical size={12} className="shrink-0 cursor-grab text-ink-faint active:cursor-grabbing" />
                      {link.label}
                    </span>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        aria-label="উপরে সরান"
                        disabled={li === 0}
                        onClick={() => moveLink(key, li, li - 1)}
                        className="rounded border border-border p-1 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                      >
                        <ChevronUp size={11} />
                      </button>
                      <button
                        type="button"
                        aria-label="নিচে সরান"
                        disabled={li === links.length - 1}
                        onClick={() => moveLink(key, li, li + 1)}
                        className="rounded border border-border p-1 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                      >
                        <ChevronDown size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {error && <p className="text-sm text-price">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:bg-cta-dark disabled:opacity-60"
          >
            {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-success">
              <Check size={15} /> সংরক্ষিত হয়েছে
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
