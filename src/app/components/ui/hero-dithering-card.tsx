import { Loader2, StopCircle } from "lucide-react";
import { useRef, useEffect } from "react";
import VoiceWave from "../../../assets/hana-orb.webp";
import { useTranslations } from "../../../lib/i18n";

// ── WebGL aurora shader ────────────────────────────────────────────────────
// Ported from unozensitemain/aurora-test. Tuned for Hana's blue/teal/indigo
// palette. Bottom 30% of the canvas fades to #00122F so it blends seamlessly
// into the dark loop section below — no gradient overlay needed.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`

const FRAG = `
precision highp float;
uniform vec2 R;
uniform float T;
uniform vec2 M;

float h(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
float fbm(vec3 p){
  float f=0.;float a=.5;
  for(int i=0;i<6;i++){f+=a*h(p.xy);p*=2.;a*=.5;}
  return f;
}
float map(vec3 p){
  vec3 q=p;
  q.z+=T*.22;
  vec2 m=(M/R-.5)*2.;
  q.xy+=m*.3;
  float f=fbm(q*2.);
  f*=sin(p.y*2.+T*.35)*.5+.5;
  return clamp(f,0.,1.);
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
  vec3 ro=vec3(0,-1,0);
  vec3 rd=normalize(vec3(uv,1));
  vec3 col=vec3(0);
  float t=0.;
  for(int i=0;i<40;i++){
    vec3 p=ro+rd*t;
    float d=map(p);
    if(d>0.){
      // blue → teal → indigo cycling palette
      vec3 c=.5+.5*cos(T*.28+p.y*1.4+vec3(0.,.85,1.75));
      col+=c*d*.42;
    }
    t+=.08;
  }
  // #00122F = vec3(0, 18/255, 47/255)
  vec3 navy=vec3(0.,.071,.184);
  col=mix(navy,col+navy*.25,min(length(col)*1.9,1.));
  col=pow(clamp(col,0.,1.),vec3(.82));
  // fade bottom 30% to navy — seamless blend into the loop section
  float yf=gl_FragCoord.y/R.y;
  col=mix(navy,col,smoothstep(0.,.30,yf));
  gl_FragColor=vec4(col,1);
}
`

function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl")
    if (!gl) return

    const mkShader = (src: string, type: number) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, mkShader(VERT, gl.VERTEX_SHADER))
    gl.attachShader(prog, mkShader(FRAG, gl.FRAGMENT_SHADER))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uR = gl.getUniformLocation(prog, "R")
    const uT = gl.getUniformLocation(prog, "T")
    const uM = gl.getUniformLocation(prog, "M")

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uR, canvas.width, canvas.height)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener("mousemove", onMove)

    const t0 = performance.now()
    let raf: number
    const loop = () => {
      const t = (performance.now() - t0) / 1000
      gl.uniform1f(uT, t)
      gl.uniform2f(uM, mouse.current.x, canvas.height - mouse.current.y)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener("mousemove", onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
}

// ── Hero section ───────────────────────────────────────────────────────────

interface CTASectionProps {
  onStartCall?: () => void;
  isConnecting?: boolean;
  isActive?: boolean;
  disabled?: boolean;
}

export function CTASection({ onStartCall, isConnecting = false, isActive = false, disabled = false }: CTASectionProps) {
  const t = useTranslations()

  const handleDemoClick = () => {
    if (!isActive && !isConnecting) {
      const el = document.getElementById("live-demo-section")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      else if (onStartCall) onStartCall()
    } else if (onStartCall) {
      onStartCall()
    }
  }

  return (
    <section className="relative w-full">
      <div className="w-full relative overflow-hidden min-h-[90dvh] md:min-h-[850px] flex flex-col items-center justify-center pt-10 pb-20 md:py-0">

        <AuroraCanvas />

        <div className="relative z-10 container mx-auto px-6 flex flex-col justify-center pointer-events-none">
          <div className="flex flex-col items-center text-center z-20 pointer-events-auto max-w-5xl mx-auto">

            {/* Peel badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="text-sm font-medium text-white/70 tracking-wide">{t.hero.builtByClinicians}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-normal text-white mb-6 md:mb-8 leading-[1.1]">
              {t.hero.headline} <br className="hidden md:block" /><span className="text-blue-300">{t.hero.headlineCantMake}</span>.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-2xl text-blue-100/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-normal">
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-auto mx-auto">
              <button
                onClick={handleDemoClick}
                disabled={isConnecting || disabled}
                className="group relative flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-full p-2 pr-6 transition-all duration-300 w-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5 backdrop-blur-sm"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
                  <img src={VoiceWave} alt="Voice Wave" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  {(isConnecting || isActive) && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                      {isConnecting
                        ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                        : <StopCircle className="w-5 h-5 text-red-400 fill-current" />}
                    </div>
                  )}
                </div>
                <span className="text-blue-300 text-lg font-medium whitespace-nowrap leading-none">
                  {isActive ? t.hero.endDemo : isConnecting ? t.hero.connecting : t.hero.talkToHana}
                </span>
              </button>

              <a
                href="https://calendly.com/matteowastaken/discoverycall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 py-4 bg-white text-slate-900 rounded-full font-medium text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center whitespace-nowrap"
              >
                {t.hero.bookDemo}
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
