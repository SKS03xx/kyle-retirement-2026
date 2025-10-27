"""// Utility: pad to 2 digits
const pad = (n) => String(n).padStart(2,'0');

function toGoogleUTC(dateStr){
  const d = new Date(dateStr);
  const utc = new Date(d.getTime() - d.getTimezoneOffset()*60000);
  const y = utc.getUTCFullYear();
  const m = pad(utc.getUTCMonth()+1);
  const d2 = pad(utc.getUTCDate());
  const H = pad(utc.getUTCHours());
  const M = pad(utc.getUTCMinutes());
  const S = pad(utc.getUTCSeconds());
  return `${y}${m}${d2}T${H}${M}${S}Z`;
}

function googleCalUrl({title,start,end,location,details}){
  const dates = `${toGoogleUTC(start)}/${toGoogleUTC(end)}`;
  const u = new URL('https://calendar.google.com/calendar/u/0/r/eventedit');
  u.searchParams.set('text', title);
  u.searchParams.set('dates', dates);
  u.searchParams.set('location', location);
  u.searchParams.set('details', details || '');
  return u.toString();
}

function icsContent({title,start,end,location,details}){
  const dtstamp = toGoogleUTC(new Date().toISOString());
  const dtstart = toGoogleUTC(start);
  const dtend   = toGoogleUTC(end);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kyle Sugg Retirement//EN',
    'BEGIN:VEVENT',
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${details || ''}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\\r\\n');
}

function downloadICS(evt){
  const text = icsContent(window.SITE);
  const blob = new Blob([text], {type:'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kyle-sugg-retirement.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function initButtons(){
  document.getElementById('y').textContent = new Date().getFullYear();
  const maps = document.getElementById('btnMaps');
  maps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(window.SITE.location)}`;
  document.getElementById('btnGoogleCal').addEventListener('click', ()=>{
    window.open(googleCalUrl(window.SITE), '_blank');
  });
  document.getElementById('btnICS').addEventListener('click', downloadICS);
}

document.addEventListener('DOMContentLoaded', initButtons);
"""
