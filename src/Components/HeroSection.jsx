import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { id: "box1", num: "58%", label: "Increase in pick up point use",      bg: "#def54f", color: "#111", pos: { top: "6%",    right: "35%" } },
  { id: "box2", num: "23%", label: "Decrease in customer phone calls",   bg: "#6ac9ff", color: "#111", pos: { bottom: "6%", right: "40%" } },
  { id: "box3", num: "27%", label: "Increase in pick up point use",      bg: "#222",    color: "#fff", pos: { top: "6%",    right: "10%" } },
  { id: "box4", num: "40%", label: "Decrease in customer phone calls",   bg: "#fa7328", color: "#111", pos: { bottom: "6%", right: "13%" } },
];

const HEADLINE = "WELCOME ITZFIZZ".split("");

export default function HeroSection() {
  const mainRef    = useRef(null);
  const carRef     = useRef(null);
  const trailRef   = useRef(null);
  const letterRefs = useRef([]);
  const headlineRef= useRef(null);
  const boxRefs    = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        letterRefs.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        boxRefs.current,
        { y: 20 },
        { y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.5 }
      );
    }, mainRef);

    return () => ctx.revert();
  }, []);

  /* Scroll-driven animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const car   = carRef.current;
      const trail = trailRef.current;
      if (!car || !trail) return;

      const roadWidth = window.innerWidth;
      const carWidth  = car.offsetWidth || 150;
      const endX      = roadWidth - carWidth;

      // Car drive
      gsap.to(car, {
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          pin: ".track",
        },
        x: endX,
        ease: "none",
        onUpdate() {
          const carX = gsap.getProperty(car, "x") + carWidth / 2;

          gsap.set(trail, { width: Math.max(0, carX) });

          letterRefs.current.forEach((letter) => {
            if (!letter) return;
            const rect  = letter.getBoundingClientRect();
            const midX  = rect.left + rect.width / 2;
            const carAbs = car.getBoundingClientRect().left + carWidth / 2;
            letter.style.opacity = carAbs >= midX ? "1" : "0";
          });
        },
      });

      // Stat boxes fade in at scroll milestones
      const milestones = [400, 600, 800, 1000];
      boxRefs.current.forEach((box, i) => {
        if (!box) return;
        gsap.to(box, {
          scrollTrigger: {
            trigger: mainRef.current,
            start: `top+=${milestones[i]} top`,
            end:   `top+=${milestones[i] + 200} top`,
            scrub: true,
          },
          opacity: 1,
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="main-section" ref={mainRef}>
        <div className="track">

          {/* ── Stat boxes ── */}
          {stats.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className="text-box"
              ref={(el) => (boxRefs.current[i] = el)}
              style={{
                background: s.bg,
                color: s.color,
                ...s.pos,
              }}
            >
              <span className="num-box">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}

          {/* ── Road ── */}
          <div className="road" id="road">
            <img src="car.png" alt="car" className="car" id="car" ref={carRef} />
            <div className="trail" id="trail" ref={trailRef} />

            {/* ── Scroll headline ── */}
            <div className="scroll-headline" ref={headlineRef}>
              {HEADLINE.map((ch, i) => (
                <span
                  key={i}
                  className={`scroll-letter${ch === " " ? " space" : ""}`}
                  ref={(el) => (letterRefs.current[i] = el)}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}