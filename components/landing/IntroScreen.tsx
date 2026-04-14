"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

export default function IntroScreen({ children }: PropsWithChildren) {
  const [showIntro, setShowIntro] = useState(true); // <── state điều khiển render
  const introRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!showIntro) return;

    const tl = gsap.timeline({
      onComplete: () => {
        // khi animation xong, gỡ intro khỏi DOM
        setShowIntro(false);
      },
    });

    // 1. Draw logo
    tl.from(".logo-path", {
      duration: 1.5,
      drawSVG: 0,
      ease: "power1.out",
    });

    // 2. Curtain slide up
    tl.to(introRef.current, {
      y: "-100%",
      duration: 1.5,
      ease: "power4.in",
      delay: 0.5,
    }).to(
      svgRef.current,
      {
        scale: 3.5,
        yPercent: 290,
        transformOrigin: "center center",
        duration: 1,
        ease: "power4.in",
      },
      "-=1"
    );

    // 3. Fade in main content
    tl.to(contentRef.current, { opacity: 1, duration: 0.5 }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, [showIntro]);

  return (
    <>
      {showIntro && (
        <div
          ref={introRef}
          className='intro-container fixed inset-0 w-screen h-screen bg-[#151515] flex items-center justify-center z-50'
        >
          <svg
            ref={svgRef}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 200 200'
            className='w-32 h-32'
          >
            <path
              d='M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80'
              stroke='white'
              strokeWidth='4'
              fill='transparent'
              className='logo-path'
            />
          </svg>
        </div>
      )}

      <div ref={contentRef} className='opacity-0'>
        {children}
      </div>
    </>
  );
}
