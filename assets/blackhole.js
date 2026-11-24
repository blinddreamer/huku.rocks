// Hero background: ray-marched black hole (Schwarzschild lensing + Keplerian accretion disk).
// Software renderers (RDP/VMs) and reduced-motion users get a single still frame.
(() => {
  const cv = document.getElementById('bh');
  const gl = cv && cv.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: true });
  if (!gl) return; // page background stays black

  const FS = `precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform vec2 OFF;

float h3(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n3(p);p*=2.13;a*=.5;}return v;}

vec3 sky(vec3 d){
  vec3 c=vec3(.02)*fbm(d*2.5+7.);
  for(int i=0;i<2;i++){
    vec3 p=d*(160.+float(i)*110.), id=floor(p), f=fract(p)-.5;
    float r=h3(id+float(i)*13.);
    vec3 o=(vec3(h3(id+1.),h3(id+2.),h3(id+3.))-.5)*.7;
    c+=smoothstep(.16,0.,length(f-o))*step(.9,r)*(r-.9)*14.;
  }
  return c;
}

void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y-OFF;
  float az=.55+M.x*.14+.04*sin(T*.07);
  float el=.11-M.y*.045;
  vec3 ro=13.*vec3(cos(el)*sin(az),sin(el),cos(el)*cos(az));
  vec3 fw=normalize(-ro), rt=normalize(cross(vec3(0,1,0),fw)), up=cross(fw,rt);
  float rl=-.12; vec2 u=mat2(cos(rl),-sin(rl),sin(rl),cos(rl))*uv;
  vec3 vel=normalize(fw*1.5+u.x*rt+u.y*up), pos=ro;
  float h2=dot(cross(pos,vel),cross(pos,vel));

  vec3 col=vec3(0.); float al=0., rmin=99., glow=0.; bool hole=false;
  for(int i=0;i<180;i++){
    float r2=dot(pos,pos), r=sqrt(r2);
    float dt=clamp(.07*r,.04,1.);
    vel+=-1.5*h2*pos/(r2*r2*r)*dt;                         // light bending (Rs = 1)
    vec3 np=pos+vel*dt;
    if(pos.y*np.y<0.){                                     // crossed the disk plane
      vec3 c=mix(pos,np,pos.y/(pos.y-np.y)); float cr=length(c.xz);
      if(cr>2.2&&cr<10.){
        float a=atan(c.z,c.x)-T*.9/pow(cr,1.5);            // inner edge spins faster
        vec3 q=vec3(cos(a),sin(a),0.);
        float d=(.35+fbm(vec3(cr*1.6,q.xy*2.6)))*(.3+fbm(vec3(cr*7.,q.xy*.9)+3.));
        d*=smoothstep(2.2,3.,cr)*smoothstep(10.,4.,cr)*2.2;
        float dop=1.+.55*dot(normalize(vec3(-c.z,0.,c.x)),-normalize(vel));  // approaching side brighter
        float b=d*d*dop*dop*(5./cr);
        float da=clamp(d*1.1,0.,1.);
        col+=(1.-al)*da*b*mix(vec3(.72,.76,.84),vec3(1.,.99,.97),clamp(b*.6,0.,1.));
        al+=(1.-al)*da;
      }
    }
    float gr=length(pos.xz);                               // soft glow around the disk plane
    glow+=(1.-al)*exp(-pos.y*pos.y*30.)*smoothstep(2.,3.2,gr)*smoothstep(8.,3.,gr)*dt*.035*(3./gr);
    pos=np; rmin=min(rmin,r);
    if(r<1.){hole=true;break;}
    if(r>32.)break;
  }
  if(!hole){
    col+=(1.-al)*sky(normalize(vel));
    col+=(1.-al)*vec3(.9,.92,1.)*exp(-(rmin-1.5)*7.)*1.2;  // photon ring
  }
  col+=glow*vec3(.85,.88,.95);
  col=1.-exp(-col*1.3);
  col+=(h3(vec3(gl_FragCoord.xy,T))-.5)*.025;               // grain, kills banding
  gl_FragColor=vec4(col,1.);
}`;

  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}'));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
  gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  for (const k of ['R', 'T', 'M', 'OFF']) U[k] = gl.getUniformLocation(p, k);

  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const software = dbg && /swiftshader|basic render|llvmpipe|software/i.test(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const animate = !software && !reduce.matches;

  // Resolution scale; drops if frames are slow (weak GPUs, phones).
  let res = Math.min(devicePixelRatio || 1, 1) * (animate ? 0.75 : 1);
  let tx = 0, ty = 0, x = 0, y = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    tx = e.clientX / innerWidth * 2 - 1;
    ty = e.clientY / innerHeight * 2 - 1;
  });

  function draw(t) {
    const w = Math.round(cv.clientWidth * res), h = Math.round(cv.clientHeight * res);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const wide = w / h > 1.2;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.R, w, h);
    gl.uniform1f(U.T, 20 + t);
    gl.uniform2f(U.M, x, y);
    gl.uniform2f(U.OFF, wide ? 0.32 : 0, wide ? 0.02 : 0.16); // right of the text; higher on phones
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let frames = 0, acc = 0, last = 0;
  function tick(ms) {
    x += (tx - x) * 0.04;
    y += (ty - y) * 0.04;
    draw(ms / 1000);
    acc += Math.min(ms - last, 200); last = ms;
    if (++frames === 30) {
      if (acc / frames > 24 && res > 0.4) res *= 0.8; // slower than ~40fps → render smaller
      frames = 0; acc = 0;
    }
    requestAnimationFrame(tick);
  }

  if (animate) requestAnimationFrame(tick);
  else { draw(0); addEventListener('resize', () => draw(0)); }
  cv.classList.add('loaded');
})();
