'use client';

import { useCallback } from 'react';
import QRCode from 'qrcode';

type PrintRoom = {
  room_number: string;
  qr_token: string;
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function zelligeDef(idx: number): string {
  return `<svg viewBox="0 0 400 400" style="width:100%;height:100%">
<defs>
<pattern id="z-${idx}" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
<rect width="80" height="80" fill="none"/>
<polygon points="40,0 80,40 40,80 0,40" fill="#8B7355" opacity="0.5"/>
<rect x="15" y="15" width="10" height="10" rx="2" fill="#8B7355" opacity="0.3"/>
<rect x="55" y="15" width="10" height="10" rx="2" fill="#8B7355" opacity="0.3"/>
<rect x="15" y="55" width="10" height="10" rx="2" fill="#8B7355" opacity="0.3"/>
<rect x="55" y="55" width="10" height="10" rx="2" fill="#8B7355" opacity="0.3"/>
<line x1="0" y1="40" x2="80" y2="40" stroke="#8B7355" stroke-width="0.3" opacity="0.2"/>
<line x1="40" y1="0" x2="40" y2="80" stroke="#8B7355" stroke-width="0.3" opacity="0.2"/>
</pattern>
</defs>
<rect width="400" height="400" fill="url(#z-${idx})"/>
</svg>`;
}

function cardHtml(svg: string, riadName: string, roomName: string, idx: number): string {
  return `<div class="card">
  <div class="card-watermark">${zelligeDef(idx)}</div>
  <div class="card-content">
    <p class="welcome">Welcome</p>
    <p class="message">Scan this QR code to discover our services, dining menu, local experiences, and everything your stay has to offer.</p>
    <div class="qr-wrap">${svg}</div>
    <div class="divider"></div>
    <h1 class="riad-name">${esc(riadName)}</h1>
    <p class="room-name">${esc(roomName)}</p>
  </div>
</div>`;
}

const PRINT_CSS = `
*{margin:0;padding:0;box-sizing:border-box;}

body{
  background:#fff;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
  font-family:system-ui,-apple-system,sans-serif;
}

/* ── single card page ──────────────── */
.single-page{
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:100vh;
  padding:24px;
}
.single-page .card{
  max-width:460px;
  width:100%;
}

/* ── multi‑card page ───────────────── */
.page{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8mm;
  padding:12mm;
  min-height:297mm;
  page-break-after:always;
  align-content:start;
}
.page:last-child{page-break-after:auto;}

.page .card{width:100%;}

/* ── card ──────────────────────────── */
.card{
  position:relative;
  background:#FBF6EF;
  border:1px solid rgba(139,115,85,0.18);
  border-radius:10px;
  padding:28px 22px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  box-shadow:0 4px 20px rgba(0,0,0,0.06);
  break-inside:avoid;
  page-break-inside:avoid;
  overflow:hidden;
}

.card-watermark{
  position:absolute;
  pointer-events:none;
  inset:0;
  opacity:0.03;
}

.card-content{
  position:relative;
  z-index:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  width:100%;
}

.welcome{
  font-family:'Playfair Display',Georgia,serif;
  font-size:10px;
  font-weight:400;
  letter-spacing:4px;
  text-transform:uppercase;
  color:#8B7355;
  margin-bottom:10px;
}

.message{
  font-family:system-ui,-apple-system,sans-serif;
  font-size:8.5px;
  font-weight:400;
  line-height:1.6;
  letter-spacing:0.2px;
  color:#6B5B4B;
  max-width:260px;
  margin-bottom:20px;
}

.qr-wrap{
  border-radius:8px;
  background:#fff;
  padding:14px;
  margin-bottom:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 1px 4px rgba(0,0,0,0.04);
}
.qr-wrap svg{display:block;width:130px;height:130px;}

.divider{
  width:36px;
  height:1px;
  background:rgba(139,115,85,0.2);
  margin-bottom:16px;
}

.riad-name{
  font-family:'Playfair Display',Georgia,serif;
  font-size:16px;
  font-weight:500;
  letter-spacing:1.2px;
  color:#2B2B2B;
  margin-bottom:4px;
}

.room-name{
  font-family:system-ui,-apple-system,sans-serif;
  font-size:10px;
  font-weight:500;
  letter-spacing:1.5px;
  text-transform:uppercase;
  color:#8B7355;
}

/* ── print ─────────────────────────── */
@media print{
  @page{margin:0;}
  body{background:#fff;}
  .card{box-shadow:none;border:1px solid rgba(139,115,85,0.25);}
  .single-page{padding:0;}
  .page{padding:10mm;}
}
`;

function pageHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>${PRINT_CSS}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function useQRPrint() {
  const generate = useCallback(async (url: string): Promise<string> => {
    return QRCode.toString(url, {
      type: 'svg',
      color: { dark: '#2B2B2B', light: '#FFFFFF' },
    });
  }, []);

  const printSingle = useCallback(async (riadName: string, room: PrintRoom) => {
    const portalUrl = `${window.location.origin}/room/${room.qr_token}`;
    const svg = await generate(portalUrl);
    const body = `<div class="single-page">${cardHtml(svg, riadName, room.room_number, 0)}</div>`;
    openPrint(pageHtml(body));
  }, [generate]);

  const printAll = useCallback(async (riadName: string, rooms: PrintRoom[]) => {
    const cards = await Promise.all(
      rooms.map(async (room, idx) => {
        const portalUrl = `${window.location.origin}/room/${room.qr_token}`;
        const svg = await generate(portalUrl);
        return cardHtml(svg, riadName, room.room_number, idx);
      })
    );
    const pages = chunk(cards, 4).map((group) => `<div class="page">${group.join('\n')}</div>`).join('\n');
    openPrint(pageHtml(pages));
  }, [generate]);

  return { printSingle, printAll };
}

function openPrint(html: string) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to print QR cards.');
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}
