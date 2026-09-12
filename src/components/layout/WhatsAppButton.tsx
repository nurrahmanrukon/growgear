"use client";

import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/siteConfig";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="হোয়াটসঅ্যাপে আমাদের সাথে কথা বলুন"
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105 lg:bottom-5"
      style={{ backgroundColor: "#25D366" }}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-30" style={{ backgroundColor: "#25D366" }} />
      <svg viewBox="0 0 32 32" width={30} height={30} fill="white" className="relative">
        <path d="M16.004 3C9.377 3 4.001 8.373 4.001 15c0 2.386.7 4.6 1.902 6.463L3.999 29l7.72-1.858A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.945-1.357l-.355-.21-4.583 1.103 1.13-4.472-.232-.366A9.7 9.7 0 0 1 5.25 15c0-5.93 4.823-10.75 10.754-10.75S26.758 9.07 26.758 15 21.935 24.75 16.004 24.75Zm5.842-7.868c-.32-.16-1.892-.933-2.185-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.014 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.497-2.572-1.587-.951-.848-1.594-1.895-1.78-2.215-.187-.32-.02-.493.14-.653.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.623-.524-.539-.72-.549-.187-.009-.4-.011-.613-.011-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.146 3.093 1.306 3.307c.16.213 2.253 3.44 5.459 4.827.763.33 1.358.527 1.822.674.766.244 1.463.21 2.014.127.614-.092 1.892-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373Z" />
      </svg>
    </a>
  );
}
