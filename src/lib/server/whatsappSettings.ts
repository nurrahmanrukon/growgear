import fs from "fs";
import path from "path";
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/siteConfig";

export interface WhatsAppSettings {
  enabled: boolean;
  number: string;
  message: string;
}

const FILE_PATH = path.join(process.cwd(), "data", "whatsapp-settings.json");
const DEFAULTS: WhatsAppSettings = {
  enabled: true,
  number: WHATSAPP_NUMBER,
  message: WHATSAPP_DEFAULT_MESSAGE,
};

export function getWhatsAppSettings(): WhatsAppSettings {
  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<WhatsAppSettings>;
    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULTS.enabled,
      number: typeof parsed.number === "string" && parsed.number.trim() ? parsed.number.trim() : DEFAULTS.number,
      message:
        typeof parsed.message === "string" && parsed.message.trim() ? parsed.message : DEFAULTS.message,
    };
  } catch {
    return DEFAULTS;
  }
}

export function setWhatsAppSettings(update: Partial<WhatsAppSettings>): WhatsAppSettings {
  const current = getWhatsAppSettings();
  const number = update.number !== undefined ? update.number.replace(/[^\d]/g, "") : current.number;
  if (!number) {
    throw new Error("হোয়াটসঅ্যাপ নম্বর আবশ্যক");
  }

  const next: WhatsAppSettings = {
    enabled: update.enabled ?? current.enabled,
    number,
    message: update.message !== undefined && update.message.trim() ? update.message : current.message,
  };

  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2));
  return next;
}
