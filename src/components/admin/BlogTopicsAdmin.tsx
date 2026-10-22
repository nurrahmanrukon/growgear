"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Check, Eye, EyeOff, GripVertical, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { TOPICS, SEGMENTS } from "@/lib/data/blog";
import { BlogTopicSlug } from "@/lib/types";

interface BlogTopicSettings {
  order: BlogTopicSlug[];
  hiddenTopics: BlogTopicSlug[];
  topicLabelOverrides: Partial<Record<BlogTopicSlug, string>>;
  topicDescriptionOverrides: Partial<Record<BlogTopicSlug, string>>;
  hiddenSegments: string[];
  segmentLabelOverrides: Record<string, string>;
}

const fieldClass =
  "w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary";

const LABEL_BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t.label]));
const DESCRIPTION_BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t.description]));

export function BlogTopicsAdmin({ initial }: { initial: BlogTopicSettings }) {
  const router = useRouter();
  const [order, setOrder] = useState<BlogTopicSlug[]>(initial.order);
  const [hiddenTopics, setHiddenTopics] = useState<Set<BlogTopicSlug>>(new Set(initial.hiddenTopics));
  const [topicLabels, setTopicLabels] = useState<Partial<Record<BlogTopicSlug, string>>>(initial.topicLabelOverrides);
  const [topicDescriptions, setTopicDescriptions] = useState<Partial<Record<BlogTopicSlug, string>>>(
    initial.topicDescriptionOverrides
  );
  const [hiddenSegments, setHiddenSegments] = useState<Set<string>>(new Set(initial.hiddenSegments));
  const [segmentLabels, setSegmentLabels] = useState<Record<string, string>>(initial.segmentLabelOverrides);
  const [expanded, setExpanded] = useState<Set<BlogTopicSlug>>(new Set());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setSaved(false);
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    move(dragIndex, targetIndex);
    setDragIndex(null);
  }

  function toggleTopicHidden(slug: BlogTopicSlug) {
    setHiddenTopics((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setSaved(false);
  }

  function toggleExpanded(slug: BlogTopicSlug) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleSegmentHidden(slug: string) {
    setHiddenSegments((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog-topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          hiddenTopics: Array.from(hiddenTopics),
          topicLabelOverrides: topicLabels,
          topicDescriptionOverrides: topicDescriptions,
          hiddenSegments: Array.from(hiddenSegments),
          segmentLabelOverrides: segmentLabels,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "সংরক্ষণ করা যায়নি");
        return;
      }
      setOrder(data.order);
      setHiddenTopics(new Set(data.hiddenTopics));
      setTopicLabels(data.topicLabelOverrides);
      setTopicDescriptions(data.topicDescriptionOverrides);
      setHiddenSegments(new Set(data.hiddenSegments));
      setSegmentLabels(data.segmentLabelOverrides);
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

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">ব্লগ বিষয় ও সেগমেন্ট</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            হোমপেজের বিষয়ভিত্তিক টাইলস, ব্লগ পেজের টপ নেভিগেশন ও বিষয়ভিত্তিক সেকশনগুলোর ক্রম, দেখা/না-দেখা এবং
            নাম-বর্ণনা এখান থেকে ঠিক করতে পারবেন। প্রতিটা বিষয়ের ভেতরের উপ-বিষয় (সেগমেন্ট)-ও লুকাতে বা নাম বদলাতে
            পারবেন — তীরচিহ্নে ক্লিক করে খুলুন।
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-ink-soft hover:bg-surface-muted"
        >
          <LogOut size={14} /> লগআউট
        </button>
      </div>

      <div className="mt-6 max-w-2xl space-y-2">
        {order.map((slug, i) => {
          const isHidden = hiddenTopics.has(slug);
          const isExpanded = expanded.has(slug);
          const segments = SEGMENTS[slug] ?? [];
          return (
            <div
              key={slug}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
              className={`rounded-lg border border-border bg-surface p-3 transition ${dragIndex === i ? "opacity-40" : ""}`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-2 shrink-0 cursor-grab text-ink-faint active:cursor-grabbing" aria-hidden="true">
                  <GripVertical size={14} />
                </span>
                <button
                  type="button"
                  onClick={() => toggleExpanded(slug)}
                  className="mt-1.5 shrink-0 text-ink-soft hover:text-primary"
                  aria-label="উপ-বিষয় দেখান"
                >
                  <ChevronRight size={15} className={`transition ${isExpanded ? "rotate-90" : ""}`} />
                </button>
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    className={`${fieldClass} ${isHidden ? "opacity-50" : ""}`}
                    value={topicLabels[slug] ?? LABEL_BY_SLUG.get(slug) ?? slug}
                    onChange={(e) => {
                      setTopicLabels((prev) => ({ ...prev, [slug]: e.target.value }));
                      setSaved(false);
                    }}
                    disabled={isHidden}
                  />
                  <textarea
                    rows={2}
                    className={`${fieldClass} ${isHidden ? "opacity-50" : ""}`}
                    value={topicDescriptions[slug] ?? DESCRIPTION_BY_SLUG.get(slug) ?? ""}
                    onChange={(e) => {
                      setTopicDescriptions((prev) => ({ ...prev, [slug]: e.target.value }));
                      setSaved(false);
                    }}
                    disabled={isHidden}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label="উপরে সরান"
                    disabled={i === 0}
                    onClick={() => move(i, i - 1)}
                    className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label="নিচে সরান"
                    disabled={i === order.length - 1}
                    onClick={() => move(i, i + 1)}
                    className="rounded-md border border-border p-1.5 text-ink-soft hover:border-primary hover:text-primary disabled:opacity-30"
                  >
                    <ChevronDown size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label={isHidden ? "দেখান" : "লুকান"}
                    onClick={() => toggleTopicHidden(slug)}
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

              {isExpanded && segments.length > 0 && (
                <div className="ml-9 mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                  {segments.map((seg) => {
                    const segHidden = hiddenSegments.has(seg.slug);
                    return (
                      <div key={seg.slug} className="flex items-center gap-2">
                        <input
                          className={`flex-1 ${fieldClass} ${segHidden ? "opacity-50" : ""}`}
                          value={segmentLabels[seg.slug] ?? seg.label}
                          onChange={(e) => {
                            setSegmentLabels((prev) => ({ ...prev, [seg.slug]: e.target.value }));
                            setSaved(false);
                          }}
                          disabled={segHidden}
                        />
                        <button
                          type="button"
                          aria-label={segHidden ? "দেখান" : "লুকান"}
                          onClick={() => toggleSegmentHidden(seg.slug)}
                          className={`shrink-0 rounded-md border p-1.5 ${
                            segHidden
                              ? "border-price/40 bg-price/10 text-price"
                              : "border-border text-ink-soft hover:border-primary hover:text-primary"
                          }`}
                        >
                          {segHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
