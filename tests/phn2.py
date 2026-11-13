# v3.3 multijugador (Photon simulado): buscar grupo, monstruos sincronizados en cueva, hijos visibles, invitación de boda, gestos
# usage: python3 tests/phn.py file://.../dist/test.html out.png
import sys, json
from playwright.sync_api import sync_playwright
url = sys.argv[1]; out = sys.argv[2]

MOCK = r"""(()=>{ const R=Photon.LoadBalancing.LoadBalancingClient, S=R.State;
function M(p,a,v){ this.st=0; M.inst=this; this.app=a; this.ver=v; this.room=null; this.actor=null; this.rooms=[]; this.cnt=1; this.master=0; window.__sent=0; }
M.State=S;
const send=o=>window.__q.push(JSON.stringify(o));
M.prototype.setLogLevel=function(){};
M.prototype.state=function(){return this.st};
M.prototype._set=function(s){this.st=s; this.onStateChange(s)};
M.prototype.connectToRegionMaster=function(r){ this._set(S.ConnectingToNameServer); send({op:'connect',region:r,app:this.app}); return true; };
M.prototype.availableRooms=function(){return this.rooms};
M.prototype.createRoom=function(n,o){ send({op:'create',n,o}); };
M.prototype.joinRoom=function(n,jo,co){ send({op:'join',n,jo:jo||{},co:co||{}}); };
M.prototype.leaveRoom=function(){ send({op:'leave'}); this.room=null; this._set(S.ConnectingToMasterserver); setTimeout(()=>this._set(S.JoinedLobby),50); };
M.prototype.disconnect=function(){ send({op:'disc'}); this._set(S.Disconnected); };
M.prototype.raiseEvent=function(c,d,o){ window.__sent++; send({op:'ev',c,d,g:(o&&o.interestGroup)||0}); };
M.prototype.changeGroups=function(r,a){ send({op:'grp',r,a}); };
M.prototype.myRoom=function(){return this.room||{}};
M.prototype.myActor=function(){return this.actor||{}};
M.prototype.myRoomActorCount=function(){return this.cnt};
M.prototype.myRoomMasterActorNr=function(){return this.master};
for (const k of ['onStateChange','onError','onOperationResponse','onRoomList','onRoomListUpdate','onJoinRoom','onActorJoin','onActorLeave','onEvent']) M.prototype[k]=function(){};
window.__q=[];
window.__mockIn=function(s){ const m=JSON.parse(s), c=M.inst; if(!c) return;
  if(m.t==='lobby'){ c.rooms=m.rooms; c._set(S.ConnectedToMaster); c._set(S.JoinedLobby); c.onRoomList(m.rooms); }
  else if(m.t==='rooms'){ c.rooms=m.rooms; c.onRoomListUpdate(m.rooms); }
  else if(m.t==='joined'){ c.room={name:m.n}; c.actor={actorNr:m.nr,isLocal:true}; c.cnt=m.cnt; c.master=m.master; c._set(S.ConnectingToGameserver); c._set(S.Joined); c.onJoinRoom(m.created); }
  else if(m.t==='err'){ c.onOperationResponse(m.err,'x',m.code); }
  else if(m.t==='ajoin'){ c.cnt=m.cnt; c.onActorJoin({actorNr:m.nr}); }
  else if(m.t==='aleave'){ c.cnt=m.cnt; c.master=m.master; c.onActorLeave({actorNr:m.nr},false); }
  else if(m.t==='ev'){ c.onEvent(m.c,m.d,m.frm); } };
Photon.LoadBalancing.LoadBalancingClient=M; return 1; })()"""

class Srv:
    def __init__(s, n): s.cli = [dict(region=None, room=None, nr=0, grp=set(), lobby=False) for _ in range(n)]; s.rooms = {}; s.outq = [[] for _ in range(n)]; s.evs = 0
    def roomlist(s): return [dict(name=k, playerCount=len(r['mem']), maxPlayers=r['max']) for k, r in s.rooms.items() if r['vis']]
    def push(s, i, o): s.outq[i].append(json.dumps(o))
    def lobby_update(s):
        for i, c in enumerate(s.cli):
            if c['lobby'] and not c['room']: s.push(i, dict(t='rooms', rooms=s.roomlist()))
    def enter(s, i, n, created):
        r = s.rooms[n]; c = s.cli[i]; r['nr'] += 1; c['nr'] = r['nr']; c['room'] = n; c['grp'] = set(); r['mem'].append(i)
        if r['master'] is None: r['master'] = i
        s.push(i, dict(t='joined', n=n, nr=c['nr'], cnt=len(r['mem']), master=s.cli[r['master']]['nr'], created=created))
        for j in r['mem']:
            if j != i: s.push(j, dict(t='ajoin', nr=c['nr'], cnt=len(r['mem'])))
        s.lobby_update()
    def exit(s, i):
        c = s.cli[i]; n = c['room']
        if not n: return
        r = s.rooms[n]; r['mem'].remove(i); c['room'] = None
        if r['master'] == i: r['master'] = r['mem'][0] if r['mem'] else None
        for j in r['mem']: s.push(j, dict(t='aleave', nr=c['nr'], cnt=len(r['mem']), master=s.cli[r['master']]['nr']))
        if not r['mem']: del s.rooms[n]
        s.lobby_update()
    def handle(s, i, raw):
        m = json.loads(raw); c = s.cli[i]; op = m['op']
        if op == 'connect': c['region'] = m['region']; c['lobby'] = True; s.push(i, dict(t='lobby', rooms=s.roomlist()))
        elif op == 'create':
            if m['n'] in s.rooms: s.push(i, dict(t='err', err=32766, code=227)); return
            o = m['o']; s.rooms[m['n']] = dict(vis=o.get('isVisible', True), max=o.get('maxPlayers', 0), mem=[], nr=0, master=None); s.enter(i, m['n'], True)
        elif op == 'join':
            n = m['n']
            if n not in s.rooms:
                if m['jo'].get('createIfNotExists'): o = m['co']; s.rooms[n] = dict(vis=o.get('isVisible', True), max=o.get('maxPlayers', 0), mem=[], nr=0, master=None); s.enter(i, n, True)
                else: s.push(i, dict(t='err', err=32758, code=226))
                return
            r = s.rooms[n]
            if r['max'] and len(r['mem']) >= r['max']: s.push(i, dict(t='err', err=32765, code=226)); return
            s.enter(i, n, False)
        elif op == 'leave': s.exit(i)
        elif op == 'disc': s.exit(i); c['lobby'] = False
        elif op == 'grp':
            for g in (m['r'] or []): c['grp'].discard(g)
            for g in (m['a'] or []): c['grp'].add(g)
        elif op == 'ev':
            n = c['room']
            if not n: return
            for j in s.rooms[n]['mem']:
                if j == i: continue
                if m['g'] == 0 or m['g'] in s.cli[j]['grp']: s.push(j, dict(t='ev', c=m['c'], d=m['d'], frm=c['nr'])); s.evs += 1

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'])
    pages = []; logs = []
    for i, (nm, cl) in enumerate([('Ana', 'invocador'), ('Beto', 'bardo')]):
        ctx = b.new_context(viewport={'width': 844, 'height': 390}, device_scale_factor=1, has_touch=True)
        pg = ctx.new_page(); pg.on('pageerror', lambda e, i=i: logs.append(f'{i} PAGEERROR: {e}'))
        pg.goto(url); pg.wait_for_timeout(2500)
        pg.click('#tNew'); pg.wait_for_timeout(400); pg.click(f'[data-c="{cl}"]'); pg.wait_for_timeout(200); pg.fill('#ccName', nm); pg.click('#ccGo'); pg.wait_for_timeout(1300); pg.click('#introOk'); pg.wait_for_timeout(300)
        pg.evaluate(MOCK); pg.evaluate("(window._errs=[], window.addEventListener('error', e=>window._errs.push(e.message)), window.hurtPlayer=()=>{}, 1)")
        pages.append(pg)
    A, B = pages; srv = Srv(2)
    def pump(ms):
        for _ in range(max(1, ms // 50)):
            for i, pg in enumerate(pages):
                for raw in pg.evaluate("window.__q.splice(0)"): srv.handle(i, raw)
            for i, pg in enumerate(pages):
                q = srv.outq[i]; srv.outq[i] = []
                for o in q: pg.evaluate("s=>__mockIn(s)", o)
            pages[0].wait_for_timeout(50)
    # --- mundo público, grupo abierto
    for pg in (A, B): pg.evaluate("(G.P.lv=60, calcStats(G.P), 1)")
    A.evaluate("openParty()"); A.click('[data-phnw="1"]'); pump(500); B.evaluate("openParty()"); B.click('[data-phnw="1"]'); pump(500)
    for pg in (A, B): pg.evaluate("closeModal()")
    pump(1200)
    A.evaluate("openParty()"); A.click('#gNew'); A.evaluate("closeModal()"); pump(1200)
    B.evaluate("openParty()"); pump(200); B.screenshot(path=out.replace('.png', '_groups.png'))
    print('groups B sees:', B.evaluate("openGroups().map(g=>g.lead.name+':'+g.n)"))
    B.click('[data-gjoin]'); B.evaluate("closeModal()"); pump(1500)
    print('party:', A.evaluate("partyMembers().map(r=>r.name)"), B.evaluate("[PARTY.id===partyLeader().id, partyLeader().name]"))
    # --- cueva: monstruos del líder sincronizados, los del miembro dormidos
    cave = A.evaluate("Object.keys(CAVES)[0]")
    for pg in (A, B): pg.evaluate("(id=>{ const M=G.maps[id]||(G.maps[id]=makeCave(id)); const c=M.camps[0]; G.P.inside=id; G.P.retX=G.P.x; G.P.retY=G.P.y; setMap(M, c.x*16+8, (c.y+3)*16+8, 'up'); window.hurtPlayer=()=>{}; return 1; })(%s)" % json.dumps(cave))
    pump(4000)
    print('cave', cave, 'A mobs:', A.evaluate("G.ents.filter(e=>e.type==='mob'&&e.map===G.map.id&&!e.ghost).length"), '| B ghosts:', B.evaluate("G.ents.filter(e=>e.type==='mob'&&e.ghost&&e.map===G.map.id).length"), 'B own visible:', B.evaluate("G.ents.filter(e=>e.type==='mob'&&!e.ghost&&e.map===G.map.id&&!e.boss).length"), 'B dormidos:', B.evaluate("G.ents.filter(e=>e.type==='mob'&&e.map==='_sync').length"))
    B.screenshot(path=out.replace('.png', '_cave_B.png')); A.screenshot(path=out.replace('.png', '_cave_A.png'))
    # B golpea a un fantasma -> el daño llega al líder
    hp0 = B.evaluate("(()=>{ const m=G.ents.find(e=>e.type==='mob'&&e.ghost&&e.map===G.map.id); if(!m) return null; window._gn=m.nid; G.P.x=m.x; G.P.y=m.y+14; G.P.dir='up'; for(let i=0;i<3;i++) hitMob(m, G.P.S.atk*3, {}); return m.nid; })()")
    pump(1500)
    print('ghost nid', hp0, 'A mob hp%:', A.evaluate("(n=>{ const m=G.ents.find(e=>e.nid===n); return m ? Math.round(m.hp/m.maxhp*100) : 'muerto'; })(%s)" % json.dumps(hp0)))
    # --- vuelta al mundo, hijo que acompaña y gesto
    for pg in (A, B): pg.evaluate("(()=>{ const P=G.P; P.inside=null; setMap(G.world, P.retX, P.retY, 'down'); return 1; })()")
    pump(800)
    A.evaluate("(()=>{ const P=G.P; P.kids=[{id:7,name:'Luz',born:calDay()-60,app:normApp({g:'f',hair:'rosa',hs:3}),cls:'bardo',follow:true}]; familyOnMap(G.map, P.x, P.y); doEmote('wave'); return FOLLOW_KIDS.length; })()")
    pump(2000)
    print('B sees kids:', B.evaluate("G.ents.filter(e=>e.type==='rkid'&&!e.remove).map(e=>e.name)"), 'A anim seen by B:', B.evaluate("[...G.remote.values()].map(r=>r.anim)"))
    B.screenshot(path=out.replace('.png', '_kid_B.png'))
    # --- pareja en brazos y vida del hijo vistas por el otro jugador
    A.evaluate("(()=>{ const P=G.P; const e=G.ents.find(q=>q.type==='npc'&&q.id==='greta'); P.partner='greta'; e.x=P.x+14; e.y=P.y; e.map=P.map; startComp(e,true); startCarry(); P.kids[0].hp=kidMaxHp(P.kids[0])*0.5; return carryActive(); })()")
    pump(1500)
    print('B sees carry:', B.evaluate("(()=>{ const r=[...G.remote.values()][0]; return [!!(r.rcp&&r.rcp.carriedBy), r.anim]; })()"), 'kid hp% seen:', B.evaluate("G.ents.filter(e=>e.type==='rkid'&&!e.remove).map(e=>e.hpp)"))
    B.screenshot(path=out.replace('.png', '_carry_B.png'))
    A.evaluate("stopCarry()")
    # --- invitación a la boda
    B.evaluate("(()=>{ const r=[...G.remote.values()][0]; socialRecv(r, {wd:{tk:'albor',k:'lia',t0:4242,s:1}}); return 1; })()"); pump(200)
    print('invite:', B.evaluate("!document.querySelector('#invbox').hidden && !!document.querySelector('#wiGo')"))
    B.screenshot(path=out.replace('.png', '_wed_B.png'))
    B.click('#wiGo'); B.wait_for_timeout(1500)
    print('B at albor plaza:', B.evaluate("(()=>{ const D=wedDecor('albor'); return Math.abs(G.P.x/16-D.px)<3 && Math.abs(G.P.y/16-D.py)<6; })()"))
    print('errs', A.evaluate("window._errs"), B.evaluate("window._errs"))
    for l in logs[:30]: print(l)
    b.close()
