const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Comunidad Imparables — De adentro hacia afuera</title>
<!-- AUDIENCIA: hombres Y mujeres — nunca escribir solo "mujeres" en descripciones ni textos de sección -->
<meta name="description" content="Comunidad para hombres y mujeres que quieren transformarse de adentro hacia afuera. Formación, mentoría y comunidad con Cintia Paolucci y Alejandra Cuello.">
<meta property="og:title" content="Comunidad Imparables — De adentro hacia afuera">
<meta property="og:description" content="Comunidad para hombres y mujeres que quieren transformarse de adentro hacia afuera. Formación, mentoría y propósito. Lanzamiento Octubre 2026.">
<meta property="og:image" content="https://comunidad-imparables.vercel.app/assets/client1/LOGO-comunidad-imparable.jpeg">
<meta property="og:url" content="https://comunidad-imparables.vercel.app">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/client1/LOGO-comunidad-imparable.jpeg" type="image/jpeg">
<link rel="apple-touch-icon" href="/assets/client1/LOGO-comunidad-imparable.jpeg">
<meta name="description" content="Acompañamos a hombres y mujeres a descubrir su propósito, sanar desde la raíz y construir una vida y un negocio alineados con quienes realmente son. By Alejandra Cuello & Cintia Paolucci.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=Great+Vibes&display=swap">
<style>
:root {
  --bg:        #160D28;
  --bg-card:   #1F1238;
  --bg-alt:    #2B1B3D;
  --bg-light:  #3A2254;
  --gold:      #D4AF37;
  --gold-dim:  rgba(212,175,55,0.12);
  --gold-mid:  rgba(212,175,55,0.35);
  --gold-glow: rgba(212,175,55,0.08);
  --text:      #FAF8F5;
  --text-soft: rgba(250,248,245,0.72);
  --text-dim:  rgba(250,248,245,0.45);
  --radius:    4px;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  overflow-x: hidden;
}
.container { max-width: 1060px; margin: 0 auto; padding: 0 2rem; }
.eyebrow {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem; font-weight: 600;
  letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 1.2rem; display: block;
}
.display { font-family: 'Cormorant Garamond', serif; font-weight: 300; line-height: 1.1; text-wrap: balance; }
.ornament { display: flex; align-items: center; gap: 1rem; margin: 2.5rem auto; justify-content: center; color: var(--gold); opacity: 0.55; }
.ornament::before, .ornament::after { content: ''; height: 1px; width: 60px; background: var(--gold); opacity: 0.6; }
.ornament-symbol { font-size: 1.1rem; }
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.22s; }
.reveal-delay-3 { transition-delay: 0.34s; }
.reveal-delay-4 { transition-delay: 0.46s; }
.reveal-delay-5 { transition-delay: 0.58s; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 1.2rem 2rem; display: flex; justify-content: space-between; align-items: center;
  background: rgba(22,13,40,0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gold-dim);
}
.nav-brand {
  font-family: 'Cormorant Garamond', serif; font-size: 1rem;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold);
  text-decoration: none; display: flex; align-items: center; gap: 0.7rem;
}
.nav-infinity { font-size: 1.4rem; line-height: 1; }
.nav-cta {
  font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--bg); background: var(--gold);
  padding: 0.55rem 1.4rem; border: none; border-radius: var(--radius);
  cursor: pointer; text-decoration: none; transition: opacity 0.2s;
}
.nav-cta:hover { opacity: 0.88; }
.hero {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  padding: 8rem 2rem 6rem; position: relative; overflow: hidden;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.hero-bg-infinity {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-size: clamp(20rem,50vw,42rem); line-height: 1; color: var(--gold);
  opacity: 0.04; font-family: 'Cormorant Garamond', serif;
  user-select: none; animation: slow-pulse 8s ease-in-out infinite;
}
@keyframes slow-pulse {
  0%,100% { opacity:0.04; transform:translate(-50%,-50%) scale(1); }
  50%      { opacity:0.065; transform:translate(-50%,-50%) scale(1.03); }
}
.hero-bg::after {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, var(--bg) 100%);
}
.orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.orb-1 { width:400px; height:400px; background:rgba(75,31,95,0.5); top:-10%; left:-10%; }
.orb-2 { width:350px; height:350px; background:rgba(212,175,55,0.06); bottom:0; right:-5%; }
.orb-3 { width:250px; height:250px; background:rgba(43,27,61,0.8); top:40%; left:20%; }
.hero-inner { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; }
.logo-mark {
  display: flex; flex-direction: column; align-items: center;
  gap: 0.3rem; margin-bottom: 2.5rem;
  opacity: 0; animation: fade-in 1.2s ease 0.3s forwards;
}
@keyframes fade-in { to { opacity: 1; } }
.logo-infinity-wrap {
  width: 90px; height: 90px; border: 1px solid var(--gold-mid); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 0.5rem;
}
.logo-infinity-wrap::before {
  content: ''; position: absolute; inset: 4px;
  border-radius: 50%; border: 1px solid rgba(212,175,55,0.15);
}
.logo-infinity-svg { width: 52px; height: 30px; }
.logo-dots { display:flex; flex-direction:column; align-items:center; gap:3px; position:absolute; top:6px; left:50%; transform:translateX(-50%); }
.logo-dot { background: var(--gold); border-radius: 50%; }
.logo-dot:nth-child(1) { width:7px; height:7px; }
.logo-dot:nth-child(2) { width:5px; height:5px; opacity:0.8; }
.logo-dot:nth-child(3) { width:4px; height:4px; opacity:0.6; }
.logo-line { position:absolute; bottom:8px; left:50%; transform:translateX(-50%); width:1px; height:12px; background:var(--gold); opacity:0.7; }
.logo-name { font-family:'Cormorant Garamond',serif; font-size:0.85rem; letter-spacing:0.35em; text-transform:uppercase; color:var(--text-soft); margin-top:0.5rem; }
.logo-name span { color:var(--gold); letter-spacing:0.3em; }
.hero-headline { font-size:clamp(2.8rem,6vw,5.2rem); font-weight:300; letter-spacing:0.04em; margin-bottom:1rem; opacity:0; animation:fade-in 1s ease 0.7s forwards; color:var(--text); line-height:1.08; text-wrap:balance; }
.hero-headline em { font-style:italic; color:var(--gold); white-space:nowrap; }
.hero-sub { font-size:clamp(1rem,1.8vw,1.2rem); color:var(--text-soft); max-width:560px; margin:1.5rem auto 0; opacity:0; animation:fade-in 1s ease 1s forwards; line-height:1.7; font-weight:300; }
.hero-slogan { font-family:'Great Vibes',cursive; font-size:clamp(1.6rem,3vw,2.2rem); color:var(--gold); opacity:0; animation:fade-in 1s ease 1.3s forwards; margin-top:1rem; }
.hero-cta-wrap { display:flex; flex-direction:column; align-items:center; gap:1rem; margin-top:2.8rem; opacity:0; animation:fade-in 1s ease 1.5s forwards; }
.btn-primary { font-family:'Montserrat',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:var(--bg); background:var(--gold); padding:1.1rem 3rem; border:none; border-radius:var(--radius); cursor:pointer; text-decoration:none; display:inline-block; transition:opacity 0.2s,transform 0.2s; box-shadow:0 4px 24px rgba(212,175,55,0.25); }
.btn-primary:hover { opacity:0.92; transform:translateY(-1px); }
.btn-ghost { font-family:'Montserrat',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); background:transparent; border:1px solid var(--gold-mid); padding:0.9rem 2.5rem; border-radius:var(--radius); cursor:pointer; text-decoration:none; display:inline-block; transition:background 0.2s; }
.btn-ghost:hover { background:var(--gold-dim); }
.hero-founders { font-size:0.78rem; color:var(--text-dim); font-family:'Montserrat',sans-serif; letter-spacing:0.1em; font-style:italic; }
section { padding: 7rem 0; }
section.alt  { background: var(--bg-card); }
section.alt2 { background: var(--bg-alt); }
.dolor-intro { font-family:'Cormorant Garamond',serif; font-size:clamp(1.4rem,2.5vw,1.9rem); font-weight:300; font-style:italic; color:var(--text-soft); max-width:680px; text-wrap:balance; line-height:1.5; margin-bottom:3rem; }
.dolor-list { list-style:none; display:grid; gap:1rem; margin:2rem 0 2.5rem; }
.dolor-item { display:flex; align-items:flex-start; gap:1rem; padding:1.2rem 1.5rem; background:var(--gold-glow); border:1px solid var(--gold-dim); border-left:3px solid var(--gold); border-radius:var(--radius); }
.dolor-icon { color:var(--gold); font-size:1rem; flex-shrink:0; margin-top:0.1rem; }
.dolor-text { font-size:1rem; color:var(--text-soft); line-height:1.5; }
.dolor-close { font-family:'Cormorant Garamond',serif; font-size:clamp(1.3rem,2.2vw,1.75rem); font-weight:300; line-height:1.35; margin-top:2.5rem; color:var(--text); text-wrap:balance; border-left:2px solid var(--gold); padding-left:1.5rem; }
.dolor-close strong { color:var(--gold); font-weight:400; }
.promesa-grid { display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-top:3.5rem; }
.promesa-card { padding:2rem; background:var(--gold-glow); border:1px solid var(--gold-dim); border-radius:var(--radius); position:relative; }
.promesa-card-label { font-family:'Montserrat',sans-serif; font-size:0.62rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--gold); margin-bottom:0.8rem; }
.promesa-card-text { font-size:0.98rem; color:var(--text-soft); line-height:1.7; }
.promesa-quote { font-family:'Cormorant Garamond',serif; font-size:clamp(1.5rem,2.8vw,2.3rem); font-style:italic; font-weight:300; text-align:center; margin-top:4rem; color:var(--text); line-height:1.35; max-width:700px; margin-inline:auto; }
.promesa-quote strong { color:var(--gold); font-style:normal; }
.incluye-heading { font-size:clamp(2rem,4vw,3.5rem); letter-spacing:0.05em; text-align:center; margin-bottom:0.5rem; text-transform:uppercase; }
.incluye-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:3.5rem; }
.incluye-card { padding:2.2rem 2rem; border:1px solid var(--gold-dim); border-radius:var(--radius); background:var(--bg); position:relative; overflow:hidden; transition:border-color 0.3s; }
.incluye-card:hover { border-color:var(--gold-mid); }
.incluye-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--gold),transparent); opacity:0; transition:opacity 0.3s; }
.incluye-card:hover::before { opacity:1; }
.incluye-mark { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:300; color:var(--gold); margin-bottom:1.1rem; display:block; letter-spacing:0.1em; line-height:1; opacity:0.9; }
.incluye-title { font-family:'Cormorant Garamond',serif; font-size:1.35rem; font-weight:400; margin-bottom:0.6rem; color:var(--text); }
.incluye-desc { font-size:0.92rem; color:var(--text-soft); line-height:1.65; }
.incluye-tag { display:inline-block; margin-top:1rem; font-family:'Montserrat',sans-serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); border:1px solid var(--gold-mid); padding:0.25rem 0.7rem; border-radius:20px; }
.grabado-note { margin-top:2rem; padding:1.2rem 1.8rem; background:var(--gold-glow); border:1px solid var(--gold-dim); border-radius:var(--radius); display:flex; align-items:center; gap:1rem; font-size:0.88rem; color:var(--text-soft); }
.grabado-note-mark { font-family:'Cormorant Garamond',serif; font-size:1.3rem; color:var(--gold); flex-shrink:0; }
.horarios { margin-top:1.5rem; padding:2rem; background:var(--gold-dim); border:1px solid var(--gold-mid); border-radius:var(--radius); display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center; justify-content:center; }
.horario-item { text-align:center; }
.horario-flag { font-size:1.5rem; display:block; margin-bottom:0.3rem; line-height:1; }
.horario-pais { font-family:'Montserrat',sans-serif; font-size:0.62rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-dim); }
.horario-hora { font-family:'Cormorant Garamond',serif; font-size:1.4rem; color:var(--gold); display:block; margin-top:0.1rem; line-height:1.2; }
.horario-hora small { font-size:0.75rem; color:var(--text-dim); display:block; font-family:'Montserrat',sans-serif; letter-spacing:0; margin-top:0.1rem; }
.horario-sep { color:var(--gold-mid); font-size:1.5rem; }
.horarios-note { width:100%; text-align:center; font-size:0.7rem; color:var(--text-dim); font-family:'Montserrat',sans-serif; letter-spacing:0.05em; margin-top:0.5rem; }
.pilares-section { padding:7rem 0; text-align:center; position:relative; overflow:hidden; }
.pilares-bg-text { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Cormorant Garamond',serif; font-size:18rem; color:var(--gold); opacity:0.025; white-space:nowrap; pointer-events:none; user-select:none; }
.pilares-list { display:flex; flex-wrap:wrap; justify-content:center; gap:0; margin-top:4rem; position:relative; z-index:1; }
.pilar { padding:3rem 2.5rem; flex:1 1 180px; max-width:220px; text-align:center; border-right:1px solid var(--gold-dim); transition:background 0.3s; }
.pilar:last-child { border-right:none; }
.pilar:hover { background:var(--gold-glow); }
.pilar-num { font-family:'Cormorant Garamond',serif; font-size:2.8rem; color:var(--gold); opacity:0.4; line-height:1; margin-bottom:0.5rem; }
.pilar-name { font-family:'Cormorant Garamond',serif; font-size:1.05rem; font-weight:400; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:0.8rem; display:block; }
.pilar-desc { font-size:0.83rem; color:var(--text-dim); line-height:1.6; }
.founders-grid { display:grid; grid-template-columns:1fr 1fr; gap:3rem; margin-top:4rem; }
.founder-card { border:1px solid var(--gold-dim); border-radius:var(--radius); background:var(--bg-card); position:relative; overflow:hidden; }
.founder-card::after { content:'∞'; position:absolute; top:1.5rem; right:2rem; font-size:1.8rem; color:var(--gold); opacity:0.12; font-family:'Cormorant Garamond',serif; }
.founder-photo { width:100%; background:var(--bg-alt); overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center; min-height:340px; }
.founder-photo img { width:100%; height:auto; max-height:500px; object-fit:contain; object-position:center; display:block; transition:transform 0.5s ease; }
.founder-card:hover .founder-photo img { transform:scale(1.03); }
.founder-photo-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:0.8rem; background:linear-gradient(160deg,var(--bg-alt) 0%,#1a0d30 100%); }
.founder-photo-placeholder span { font-family:'Cormorant Garamond',serif; font-size:4rem; color:var(--gold); opacity:0.2; }
.founder-photo-placeholder p { font-family:'Montserrat',sans-serif; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--text-dim); }
.founder-body { padding:2.2rem 2.2rem 2.5rem; }
.founder-role { font-family:'Montserrat',sans-serif; font-size:0.6rem; letter-spacing:0.28em; text-transform:uppercase; color:var(--gold); margin-bottom:0.5rem; }
.founder-name { font-family:'Cormorant Garamond',serif; font-size:1.9rem; font-weight:300; margin-bottom:0.3rem; line-height:1.2; }
.founder-subtitle { font-family:'Great Vibes',cursive; font-size:1.3rem; color:var(--gold); margin-bottom:1.5rem; display:block; }
.founder-story { font-size:0.93rem; color:var(--text-soft); line-height:1.75; border-top:1px solid var(--gold-dim); padding-top:1.5rem; margin-top:0.5rem; }
.founder-values { display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:1.5rem; }
.founder-val { font-family:'Montserrat',sans-serif; font-size:0.58rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold); border:1px solid var(--gold-mid); padding:0.2rem 0.6rem; border-radius:20px; }
.founder-social { margin-top:1.2rem; display:flex; gap:0.8rem; align-items:center; }
.founder-social a { font-family:'Montserrat',sans-serif; font-size:0.6rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-dim); text-decoration:none; display:flex; align-items:center; gap:0.3rem; transition:color 0.2s; }
.founder-social a:hover { color:var(--gold); }
.founder-social a::before { content:'◆'; font-size:0.4rem; color:var(--gold); opacity:0.5; }
.redes-strip { background:var(--bg-card); border-top:1px solid var(--gold-dim); border-bottom:1px solid var(--gold-dim); padding:2rem 0; }
.redes-inner { display:flex; justify-content:center; align-items:center; gap:3rem; flex-wrap:wrap; }
.red-link { display:flex; flex-direction:column; align-items:center; gap:0.4rem; text-decoration:none; transition:opacity 0.2s; }
.red-link:hover { opacity:0.75; }
.red-label { font-family:'Montserrat',sans-serif; font-size:0.58rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--text-dim); }
.red-name { font-family:'Cormorant Garamond',serif; font-size:1.05rem; color:var(--gold); letter-spacing:0.08em; }
.red-sep { width:1px; height:36px; background:var(--gold-dim); }
.testimonios-placeholder { text-align:center; padding:4rem 2rem; border:1px dashed var(--gold-mid); border-radius:var(--radius); margin-top:3rem; }
.testimonios-placeholder p { color:var(--text-dim); font-style:italic; font-size:0.95rem; }
.manifiesto-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem 3rem; margin-top:3rem; }
.manifiesto-item { display:flex; gap:1rem; align-items:flex-start; }
.m-diamond { color:var(--gold); flex-shrink:0; margin-top:0.25rem; font-size:0.7rem; }
.m-text { font-size:0.95rem; color:var(--text-soft); line-height:1.6; }
.nunca-title { font-family:'Montserrat',sans-serif; font-size:0.65rem; letter-spacing:0.25em; text-transform:uppercase; color:rgba(212,175,55,0.5); margin-top:3rem; margin-bottom:1.5rem; }
.nunca-list { display:flex; flex-direction:column; gap:1rem; }
.nunca-item { padding:1rem 1.5rem; background:rgba(212,175,55,0.04); border-left:2px solid rgba(212,175,55,0.3); font-size:0.92rem; color:var(--text-dim); }
.cta-final { padding:8rem 0; text-align:center; position:relative; overflow:hidden; }
.cta-bg { position:absolute; inset:0; background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(212,175,55,0.07) 0%,transparent 70%); pointer-events:none; }
.cta-price-block { margin:3rem auto; max-width:480px; padding:2.5rem; border:1px solid var(--gold-mid); border-radius:var(--radius); background:var(--bg-card); box-shadow:0 0 60px rgba(212,175,55,0.08); }
.cta-price-label { font-family:'Montserrat',sans-serif; font-size:0.62rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.5rem; }
.cta-price { font-family:'Cormorant Garamond',serif; font-size:3.5rem; font-weight:300; color:var(--gold); line-height:1; }
.cta-price-note { font-size:0.85rem; color:var(--text-dim); margin-top:0.4rem; }
.cta-divider { border:none; border-top:1px solid var(--gold-dim); margin:1.5rem 0; }
.cta-includes { list-style:none; text-align:left; display:flex; flex-direction:column; gap:0.7rem; margin-bottom:2rem; }
.cta-includes li { font-size:0.9rem; color:var(--text-soft); display:flex; gap:0.7rem; align-items:flex-start; }
.cta-includes li::before { content:'✦'; color:var(--gold); flex-shrink:0; font-size:0.7rem; margin-top:0.2rem; }
.cta-guarantee { margin-top:1.5rem; font-size:0.82rem; color:var(--text-dim); font-style:italic; }
footer { padding:3rem 2rem; border-top:1px solid var(--gold-dim); text-align:center; background:var(--bg); }
.footer-brand { font-family:'Cormorant Garamond',serif; font-size:0.9rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--gold); margin-bottom:0.3rem; }
.footer-founders { font-family:'Great Vibes',cursive; font-size:1.4rem; color:var(--text-dim); margin-bottom:1rem; }
.footer-copy { font-size:0.78rem; color:var(--text-dim); }
@media (max-width:768px) {
  .promesa-grid,.incluye-grid,.founders-grid,.manifiesto-grid { grid-template-columns:1fr; }
  .pilares-list { flex-direction:column; align-items:center; }
  .pilar { border-right:none; border-bottom:1px solid var(--gold-dim); max-width:100%; width:100%; }
  .pilar:last-child { border-bottom:none; }
  .horarios { flex-direction:column; }
  nav { padding:1rem; }
  .nav-brand span:not(.nav-infinity) { display:none; }
}
</style>
</head>
<body>

<nav>
  <a class="nav-brand" href="#">
    <span class="nav-infinity">∞</span>
    <span>Comunidad Imparables</span>
  </a>
  <a class="nav-cta" href="#unirme">Quiero unirme</a>
</nav>

<section class="hero">
  <div class="hero-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="hero-bg-infinity">∞</div>
  </div>
  <div class="hero-inner">
    <div class="logo-mark">
      <img src="/assets/client1/LOGO-comunidad-imparable.jpeg"
           alt="Comunidad Imparables"
           style="width:160px;height:160px;object-fit:cover;border-radius:50%;border:2px solid rgba(212,175,55,0.5);box-shadow:0 0 32px rgba(212,175,55,0.18),0 0 0 6px rgba(212,175,55,0.07);display:block;"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div style="display:none;flex-direction:column;align-items:center;">
        <div class="logo-infinity-wrap">
          <svg class="logo-infinity-svg" viewBox="0 0 100 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50,27.5 C50,15 62,6 73,12 C84,18 84,37 73,43 C62,49 50,40 50,27.5 C50,15 38,6 27,12 C16,18 16,37 27,43 C38,49 50,40 50,27.5 Z" stroke="#D4AF37" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
          <div class="logo-line"></div>
        </div>
        <div class="logo-name"><span>Comunidad</span><br><span style="letter-spacing:0.4em;font-size:1.1em;display:block;margin-top:0.1rem">Imparables</span></div>
      </div>
    </div>
    <h1 class="hero-headline display">No viniste a encajar<br><em>Viniste a recordar quién sos</em></h1>
    <p class="hero-slogan">De adentro hacia afuera</p>
    <p class="hero-sub">Acompañamos a personas a descubrir su propósito, sanar desde la raíz y construir una vida — y un negocio — alineados con quienes realmente son.</p>
    <div class="hero-cta-wrap">
      <a href="#unirme" class="btn-primary">Quiero ser parte</a>
      <a href="#academia" class="btn-ghost">¿Qué incluye?</a>
      <p class="hero-founders">By Alejandra Cuello &amp; Cintia Paolucci</p>
    </div>
  </div>
</section>

<section class="alt">
  <div class="container">
    <span class="eyebrow reveal">¿Te suena familiar?</span>
    <p class="dolor-intro reveal reveal-delay-1">"Sé que puedo dar mucho más. Pero algo siempre me frena."</p>
    <ul class="dolor-list">
      <li class="dolor-item reveal reveal-delay-1"><span class="dolor-icon">◆</span><span class="dolor-text">Consumís contenido, hacés cursos, guardás Reels… pero seguís en el mismo lugar.</span></li>
      <li class="dolor-item reveal reveal-delay-2"><span class="dolor-icon">◆</span><span class="dolor-text">Empezás con todo. Te entusiasmás. Y después volvés a los mismos patrones de siempre.</span></li>
      <li class="dolor-item reveal reveal-delay-3"><span class="dolor-icon">◆</span><span class="dolor-text">Ves a otras personas creando, creciendo, mostrándose — y pensás: "Yo también podría hacerlo."</span></li>
      <li class="dolor-item reveal reveal-delay-4"><span class="dolor-icon">◆</span><span class="dolor-text">Querés libertad. Querés propósito. Querés ganar dinero sin sacrificar tu paz. Pero no sabés por dónde empezar.</span></li>
      <li class="dolor-item reveal reveal-delay-5"><span class="dolor-icon">◆</span><span class="dolor-text">"Cuando esté lista/o." "Cuando tenga tiempo." "Cuando aprenda un poco más." Y el tiempo pasa.</span></li>
    </ul>
    <p class="dolor-close reveal">Eso no es falta de voluntad. No es falta de capacidad.<br>Es falta de <strong>acompañamiento real</strong> y de claridad sobre quién sos y a dónde vas.<br><br>Tu frustración nace de la <strong>incoherencia</strong> entre quien sos y quien sabés que podés ser.</p>
  </div>
</section>

<div class="ornament"><span class="ornament-symbol">∞</span></div>

<section>
  <div class="container">
    <span class="eyebrow reveal">La transformación que buscás</span>
    <h2 class="display reveal reveal-delay-1" style="font-size:clamp(2rem,4vw,3.8rem);max-width:700px;letter-spacing:0.03em;">La claridad llega después<br>de la acción.</h2>
    <p class="reveal reveal-delay-2" style="color:var(--text-soft);max-width:600px;margin-top:1.2rem;font-size:1.05rem;">Comunidad Imparables no es un curso más. Es un proceso de transformación que empieza adentro tuyo y se expande hacia afuera. No prometemos milagros. Prometemos acompañamiento genuino, herramientas concretas y una comunidad que celebra tu proceso.</p>
    <div class="promesa-grid">
      <div class="promesa-card reveal reveal-delay-1"><div class="promesa-card-label">Lo que vas a descubrir</div><p class="promesa-card-text">Tus dones, talentos y propósito. La versión de vos misma/o que ya existe adentro tuyo y está esperando que le des permiso de existir.</p></div>
      <div class="promesa-card reveal reveal-delay-2"><div class="promesa-card-label">Lo que vas a construir</div><p class="promesa-card-text">Confianza en vos. Coherencia entre lo que pensás, decís y hacés. Y un negocio que sea extensión de tu ser — no una jaula disfrazada de libertad.</p></div>
      <div class="promesa-card reveal reveal-delay-3"><div class="promesa-card-label">Lo que vas a soltar</div><p class="promesa-card-text">La necesidad de aprobación. El miedo a mostrarte. Las creencias que te dicen que no podés. El sacrificio como único camino al éxito.</p></div>
      <div class="promesa-card reveal reveal-delay-4"><div class="promesa-card-label">Lo que vas a vivir</div><p class="promesa-card-text">Claridad, dirección, pertenencia. La sensación de mirarte y sentir: "Esta persona soy yo y confío en ella."</p></div>
    </div>
    <p class="promesa-quote reveal">"No te falta potencial.<br>Te falta <strong>confianza en vos misma/o</strong>."</p>
  </div>
</section>

<section class="alt" id="academia">
  <div class="container">
    <span class="eyebrow reveal" style="text-align:center;display:block;">La Academia Digital</span>
    <h2 class="display incluye-heading reveal reveal-delay-1">Tu espacio de transformación</h2>
    <p class="reveal reveal-delay-2" style="text-align:center;color:var(--text-soft);max-width:560px;margin:0 auto;">Dentro de Comunidad Imparables encontrás un proceso integral diseñado para que nunca más estés sola/o en tu camino.</p>
    <div class="incluye-grid">
      <div class="incluye-card reveal reveal-delay-1"><span class="incluye-mark">◆ I</span><h3 class="incluye-title">Clases semanales con Alejandra</h3><p class="incluye-desc">Espiritualidad, sanación desde la raíz, expansión de consciencia y propósito de vida. Para ir más profundo — al origen de tus patrones y bloqueos.</p><span class="incluye-tag">Semanal · Grabadas</span></div>
      <div class="incluye-card reveal reveal-delay-2"><span class="incluye-mark">◆ II</span><h3 class="incluye-title">Clases semanales con Cintia</h3><p class="incluye-desc">Mentalidad, identidad, marca personal y acción concreta. Para transformar lo que aprendés adentro en resultados reales afuera — en tu negocio y en tu vida.</p><span class="incluye-tag">Semanal · Grabadas</span></div>
      <div class="incluye-card reveal reveal-delay-3" style="border-color:var(--gold-mid);"><span class="incluye-mark">◆ III</span><h3 class="incluye-title">Mentoría grupal en vivo</h3><p class="incluye-desc">Una vez por semana, en vivo, para trabajar en tiempo real los bloqueos, las dudas y los próximos pasos. Acompañamiento real, no contenido pregrabado.</p><span class="incluye-tag" style="background:var(--gold-dim);border-color:var(--gold);">✦ Martes en vivo · Grabada</span></div>
      <div class="incluye-card reveal reveal-delay-4"><span class="incluye-mark">◆ IV</span><h3 class="incluye-title">Comunidad que te sostiene</h3><p class="incluye-desc">Un espacio donde celebramos tus avances como propios. Porque acá somos espejo — y crecer rodeada/o de personas que también crecen lo cambia todo.</p><span class="incluye-tag">Siempre activa</span></div>
    </div>
    <div class="grabado-note reveal"><span class="grabado-note-mark">∞</span><span>Todo el contenido — clases y mentorías — queda grabado y disponible dentro de la academia digital para que puedas verlo cuando quieras, a tu ritmo.</span></div>
    <div class="horarios reveal">
      <div style="width:100%;text-align:center;"><span style="font-family:'Montserrat',sans-serif;font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-dim);">Mentoría en vivo — cada martes</span></div>
      <div class="horario-item"><span class="horario-flag">🇦🇷</span><span class="horario-pais">Argentina</span><span class="horario-hora">20:00 hs</span></div>
      <span class="horario-sep">·</span>
      <div class="horario-item"><span class="horario-flag">🇨🇴</span><span class="horario-pais">Colombia</span><span class="horario-hora">18:00 hs</span></div>
      <span class="horario-sep">·</span>
      <div class="horario-item"><span class="horario-flag">🇪🇸</span><span class="horario-pais">España</span><span class="horario-hora">00:00 hs<small>siguiente día</small></span></div>
      <span class="horario-sep">·</span>
      <div class="horario-item"><span class="horario-flag">🇺🇸</span><span class="horario-pais">EEUU Este</span><span class="horario-hora">18:00 hs</span></div>
      <p class="horarios-note">* Puede variar ±1 h según cambio de horario estacional</p>
    </div>
  </div>
</section>

<section class="pilares-section alt2">
  <div class="container" style="position:relative;z-index:1;">
    <div class="pilares-bg-text" aria-hidden="true">∞</div>
    <span class="eyebrow reveal" style="display:block;text-align:center;">Los cinco pilares</span>
    <h2 class="display reveal reveal-delay-1" style="font-size:clamp(2rem,4vw,3.5rem);text-align:center;letter-spacing:0.05em;text-transform:uppercase;">El camino<br>de adentro hacia afuera</h2>
    <div class="pilares-list">
      <div class="pilar reveal reveal-delay-1"><div class="pilar-num">I</div><span class="pilar-name">Claridad</span><p class="pilar-desc">Ordenamos lo que sabés y sentís. Porque la confusión es el primer obstáculo.</p></div>
      <div class="pilar reveal reveal-delay-2"><div class="pilar-num">II</div><span class="pilar-name">Consciencia</span><p class="pilar-desc">El cambio real empieza cuando te ves sin filtros. Sin juicio. Con verdad.</p></div>
      <div class="pilar reveal reveal-delay-3"><div class="pilar-num">III</div><span class="pilar-name">Acción</span><p class="pilar-desc">La claridad llega después de actuar. No antes. Acá se actúa acompañada/o.</p></div>
      <div class="pilar reveal reveal-delay-4"><div class="pilar-num">IV</div><span class="pilar-name">Libertad</span><p class="pilar-desc">Económica, emocional, de expresión. Las tres juntas. No una sin las otras.</p></div>
      <div class="pilar reveal reveal-delay-5"><div class="pilar-num">V</div><span class="pilar-name">Abundancia</span><p class="pilar-desc">Como consecuencia de ser coherente con quien sos. No como promesa vacía.</p></div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <span class="eyebrow reveal" style="display:block;text-align:center;">Quiénes somos</span>
    <h2 class="display reveal reveal-delay-1" style="font-size:clamp(2rem,4vw,3.5rem);text-align:center;letter-spacing:0.04em;text-transform:uppercase;">Dos historias.<br>Una misión.</h2>
    <p class="reveal reveal-delay-2" style="text-align:center;color:var(--text-soft);max-width:520px;margin:1rem auto 0;font-size:0.98rem;">No te enseñamos desde un manual. Te acompañamos desde lo vivido.</p>
    <div class="founders-grid">
      <div class="founder-card reveal reveal-delay-2">
        <div class="founder-photo">
          <img src="/assets/client1/cintia0.jpeg" alt="Cintia Paolucci" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'founder-photo-placeholder\\'><span>∞</span><p>foto · Cintia Paolucci</p></div>'">
        </div>
        <div class="founder-body">
          <div class="founder-role">Co-fundadora</div>
          <h3 class="founder-name display">Cintia<br>Paolucci</h3>
          <span class="founder-subtitle">La que despertó y no volvió atrás</span>
          <p class="founder-story">Mamá joven, tres hijos, trabajos sin rumbo fijo, y una sensación constante de que algo faltaba — aunque tenía todo. Hasta que llegó su despertar espiritual y eligió escuchar esa voz que siempre supo que estaba llamada a algo más.<br><br>Hoy acompaña a personas a recordar quiénes son, a sacar sus dones al mundo y a ganar dinero sin sacrificarse. Motivadora por naturaleza. Auténtica y firme, porque el amor es firme y acogedor al mismo tiempo.<br><br><em style="color:var(--gold);font-style:normal;">"No me guardo nada de lo que aprendo."</em></p>
          <div class="founder-values"><span class="founder-val">Mentalidad</span><span class="founder-val">Marca Personal</span><span class="founder-val">Acción</span><span class="founder-val">Identidad</span></div>
          <div class="founder-social"><a href="https://www.instagram.com/cin.paolucci" target="_blank" rel="noopener">Instagram</a></div>
        </div>
      </div>
      <div class="founder-card reveal reveal-delay-3">
        <div class="founder-photo">
          <img src="/assets/client1/alenajdra0.jpeg" alt="Alejandra Cuello" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'founder-photo-placeholder\\'><span>∞</span><p>foto · Alejandra Cuello</p></div>'">
        </div>
        <div class="founder-body">
          <div class="founder-role">Co-fundadora</div>
          <h3 class="founder-name display">Alejandra<br>Cuello</h3>
          <span class="founder-subtitle">La que sanó desde adentro y enseña el camino</span>
          <p class="founder-story">Creció mirando el cielo, conectada con algo más grande. Conoció el abandono, la inseguridad económica y la sensación de que quería algo que no sabía cómo nombrar. Se formó en Metafísica, Reiki, Gemoterapia y Biodescodificación — no para ser otra persona, sino para sanar desde la raíz y expandir su consciencia.<br><br>Hoy acompaña a profesionales y emprendedores a construir negocios que reflejen su libertad interior. Sin sacrificar la paz. Sin vender milagros. Con disciplina, empatía y escucha activa.<br><br><em style="color:var(--gold);font-style:normal;">"La gratitud es la puerta de la abundancia."</em></p>
          <div class="founder-values"><span class="founder-val">Espiritualidad</span><span class="founder-val">Sanación</span><span class="founder-val">Propósito</span><span class="founder-val">Consciencia</span></div>
          <div class="founder-social"><a href="https://www.instagram.com/alejandra.cuello28" target="_blank" rel="noopener">Instagram</a></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="redes-strip">
  <div class="redes-inner container">
    <a class="red-link" href="https://chat.whatsapp.com/ELk2u2CdgaJ1pqMeUhrTVg" target="_blank" rel="noopener"><span class="red-label">Comunidad gratuita</span><span class="red-name">Grupo de WhatsApp</span></a>
    <div class="red-sep"></div>
    <a class="red-link" href="https://www.instagram.com/cin.paolucci" target="_blank" rel="noopener"><span class="red-label">Seguinos</span><span class="red-name">@cin.paolucci</span></a>
    <div class="red-sep"></div>
    <a class="red-link" href="https://youtube.com/@comunidad.imparables" target="_blank" rel="noopener"><span class="red-label">Contenido gratuito</span><span class="red-name">YouTube</span></a>
  </div>
</div>

<section class="alt">
  <div class="container">
    <span class="eyebrow reveal" style="display:block;text-align:center;">Lo que dice la comunidad</span>
    <h2 class="display reveal reveal-delay-1" style="font-size:clamp(1.8rem,3.5vw,3rem);text-align:center;letter-spacing:0.04em;text-transform:uppercase;">Personas reales.<br>Resultados reales.</h2>
    <div class="testimonios-placeholder reveal reveal-delay-2"><p>✦ &nbsp; Los testimonios de nuestra comunidad llegan pronto. &nbsp; ✦</p></div>
  </div>
</section>

<div class="ornament"><span class="ornament-symbol">∞</span></div>

<section>
  <div class="container">
    <span class="eyebrow reveal">Nuestro manifiesto</span>
    <h2 class="display reveal reveal-delay-1" style="font-size:clamp(1.8rem,3.5vw,3rem);letter-spacing:0.04em;text-transform:uppercase;max-width:600px;">Lo que nunca negociamos</h2>
    <div class="manifiesto-grid">
      <div class="manifiesto-item reveal reveal-delay-1"><span class="m-diamond">◆</span><p class="m-text">Nuestros valores no están en venta. Ni por el cliente más difícil, ni por la plata más grande.</p></div>
      <div class="manifiesto-item reveal reveal-delay-2"><span class="m-diamond">◆</span><p class="m-text">La claridad, el compromiso y la acción los ponemos nosotras — y los pedimos de vuelta. Es un 50/50.</p></div>
      <div class="manifiesto-item reveal reveal-delay-3"><span class="m-diamond">◆</span><p class="m-text">No apuramos los procesos. Cada persona tiene su tiempo. No prometemos milagros ni mentimos para quedar bien.</p></div>
      <div class="manifiesto-item reveal reveal-delay-4"><span class="m-diamond">◆</span><p class="m-text">Sos tratada/o con amor, comprensión y escucha activa. Respondemos en 24 hs, máximo 48 hs.</p></div>
      <div class="manifiesto-item reveal reveal-delay-1"><span class="m-diamond">◆</span><p class="m-text">Somos genuinas y damos todo lo que tenemos. Mientras más se trabaja lo interno, más se refleja en lo externo.</p></div>
      <div class="manifiesto-item reveal reveal-delay-2"><span class="m-diamond">◆</span><p class="m-text">Priorizamos calidad sobre cantidad. Menos personas, mejor atención. Tu proceso importa.</p></div>
    </div>
    <p class="nunca-title reveal">Lo que nunca haríamos</p>
    <div class="nunca-list">
      <div class="nunca-item reveal reveal-delay-1">No vendemos apurando ni usando urgencia falsa para convencerte.</div>
      <div class="nunca-item reveal reveal-delay-2">No aceptamos que nos traten con desprecio — y exigimos lo mismo hacia cada persona de la comunidad.</div>
      <div class="nunca-item reveal reveal-delay-3">No decimos que sabemos algo que no sabemos. Ni aunque eso nos cueste una venta importante.</div>
    </div>
  </div>
</section>

<section class="cta-final alt2" id="unirme">
  <div class="cta-bg"></div>
  <div class="container" style="position:relative;z-index:1;">
    <span class="eyebrow reveal" style="display:block;text-align:center;">¿Estás lista/o?</span>
    <h2 class="display reveal reveal-delay-1" style="font-size:clamp(2.2rem,5vw,4.5rem);text-align:center;letter-spacing:0.04em;text-transform:uppercase;max-width:700px;margin:0 auto;">El proceso empieza adentro.<br><em style="color:var(--gold);font-style:italic;">La transformación se ve afuera.</em></h2>
    <p class="reveal reveal-delay-2" style="text-align:center;color:var(--text-soft);max-width:520px;margin:1.5rem auto 0;font-size:1rem;">Cada martes que pasa sin decidir es otro martes postergándote. La pregunta no es si podés. La pregunta es cuándo le vas a dar el permiso.</p>
    <div class="cta-price-block reveal reveal-delay-3">
      <p class="cta-price-label">LANZAMIENTO</p>
      <p class="cta-price">OCTUBRE 2026</p>
      <p class="cta-price-note">Anotate para recibir toda la información antes que nadie</p>
      <hr class="cta-divider">
      <ul class="cta-includes">
        <li>Clases semanales con Alejandra Cuello — espiritualidad y sanación</li>
        <li>Clases semanales con Cintia Paolucci — mentalidad y marca personal</li>
        <li>Mentoría grupal en vivo cada martes (20:00 hs Argentina)</li>
        <li>Comunidad privada de acompañamiento y crecimiento</li>
        <li>Acceso a todo el contenido grabado desde el inicio</li>
      </ul>
      <a href="#" class="btn-primary" style="width:100%;text-align:center;display:block;padding:1.2rem;">Quiero anotarme en la lista de espera</a>
      <p class="cta-guarantee">Sin presión. Sin urgencia fabricada. Cuando estés lista/o, acá estamos.</p>
    </div>
    <p class="reveal" style="text-align:center;margin-top:2rem;"><span style="font-family:'Great Vibes',cursive;font-size:1.8rem;color:var(--gold);opacity:0.7;">Imparables hasta el final</span></p>
  </div>
</section>

<footer>
  <div class="footer-brand">Comunidad Imparables</div>
  <div class="footer-founders">Alejandra Cuello &amp; Cintia Paolucci</div>
  <div style="display:flex;justify-content:center;gap:2rem;margin:1rem 0;flex-wrap:wrap;">
    <a href="https://chat.whatsapp.com/ELk2u2CdgaJ1pqMeUhrTVg" target="_blank" rel="noopener" style="color:var(--text-dim);font-family:'Montserrat',sans-serif;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">WhatsApp</a>
    <a href="https://www.instagram.com/cin.paolucci" target="_blank" rel="noopener" style="color:var(--text-dim);font-family:'Montserrat',sans-serif;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">Instagram</a>
    <a href="https://youtube.com/@comunidad.imparables" target="_blank" rel="noopener" style="color:var(--text-dim);font-family:'Montserrat',sans-serif;font-size:0.62rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">YouTube</a>
  </div>
  <p class="footer-copy"><em>"De adentro hacia afuera"</em> &nbsp;·&nbsp; <a href="/terminos" style="color:var(--text-dim);">Términos</a> &nbsp;·&nbsp; <a href="/privacidad" style="color:var(--text-dim);">Privacidad</a></p>
</footer>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
</body>
</html>`

export async function GET() {
  return new Response(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  })
}
