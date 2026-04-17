"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "../../../lib/utils";
import centerOrbImage from "figma:asset/bd4bf20dbede33bcbcec4f5e7a3b05a23ea78cf4.png";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  title?: string;
  description?: string;
  label?: string;
}

export default function RadialOrbitalTimeline({
  timelineData = [],
  title,
  description,
  label,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  
  // Safe initialization of activeNodeId
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);

  // Initialize state based on props in effect to be safe
  useEffect(() => {
    if (timelineData && timelineData.length > 0) {
       setExpandedItems({ [timelineData[0].id]: true });
       setActiveNodeId(timelineData[0].id);
    }
  }, [timelineData]);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex === -1) return;
    
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = isMobile ? 150 : 300; 
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  if (!timelineData || timelineData.length === 0) {
    return <div className="py-24 text-center">No timeline data available</div>;
  }

  return (
    <div
      className="w-full min-h-screen py-12 md:py-24 flex flex-col items-center justify-start bg-[#00122F] overflow-hidden relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Ambient glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header Section */}
      {(title || description || label) && (
        <div className="relative z-20 text-center px-4 mb-8 md:mb-16 pointer-events-auto max-w-7xl mx-auto">
          {label && (
            <div className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.08em] uppercase text-blue-400 mb-6
              before:content-[''] before:w-6 before:h-px before:bg-blue-400 before:opacity-40
              after:content-[''] after:w-6 after:h-px after:bg-blue-400 after:opacity-40
            ">
              {label}
            </div>
          )}
          {title && (
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.25] text-white mb-5 tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg leading-[1.65] text-slate-300 max-w-2xl mx-auto font-normal">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="relative w-full max-w-5xl h-[450px] md:h-[800px] flex items-center justify-center md:scale-100 origin-center transition-transform duration-500 mt-4 md:mt-8">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Central Orb */}
          <div className="absolute w-40 h-40 flex flex-col items-center justify-center z-10">
            <img
              src={centerOrbImage}
              alt="Hana Reasoning Engine"
              className="w-20 h-20 object-contain animate-spin-slow mb-2"
              style={{ animationDuration: "20s" }}
            />
            <div className="text-[10px] font-bold tracking-[0.2em] text-blue-400 text-center uppercase whitespace-nowrap">
              Hana Reasoning
              <br />
              Engine
            </div>
          </div>

          {/* Orbital Rings */}
          <div className={cn(
            "absolute rounded-full border-[3px] border-slate-700 opacity-70",
            isMobile ? "w-[300px] h-[300px]" : "w-[600px] h-[600px]"
          )} />
          <div className={cn(
            "absolute rounded-full border-[3px] border-slate-800 border-dashed opacity-70",
            isMobile ? "w-[200px] h-[200px]" : "w-[400px] h-[400px]"
          )} />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Energy Field */}
                <div
                  className="absolute rounded-full -inset-1"
                  style={{
                    background: `radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)`,
                    width: `${item.energy * 0.4 + 40}px`,
                    height: `${item.energy * 0.4 + 40}px`,
                    left: `-${(item.energy * 0.4 + 40 - 48) / 2}px`,
                    top: `-${(item.energy * 0.4 + 40 - 48) / 2}px`,
                    opacity: isPulsing ? 1 : 0
                  }}
                ></div>

                {/* Node Icon - Larger and wider */}
                <div
                  className={cn(
                    "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 transform shadow-sm",
                    isExpanded
                      ? "bg-[#00122F] text-white border-white shadow-md"
                      : isRelated
                      ? "bg-white text-slate-900 border-blue-500"
                      : "bg-white text-slate-600 border-slate-300"
                  )}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
                </div>

                {/* Title Label - Moved to top and serif */}
                <div
                  className={cn(
                    "absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs md:text-lg font-serif font-medium tracking-wide transition-all duration-300",
                    isExpanded
                      ? "text-white"
                      : "text-slate-400"
                  )}
                >
                  {item.title}
                </div>

                {/* Expanded Card */}
                {isExpanded && (
                  <Card className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 w-[220px] md:w-[350px] bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl overflow-visible z-50 text-left">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-slate-300"></div>
                    <CardHeader className="pb-2 md:pb-3 pt-3 md:pt-4 px-4 md:px-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-base md:text-2xl font-bold text-slate-900 font-[Courier_Prime]">
                          {item.date}
                        </span>
                      </div>
                      {/* Title removed as requested since it repeats the node label */}
                    </CardHeader>
                    <CardContent className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-slate-600">
                      <p className="mb-0 leading-relaxed">{item.content}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}