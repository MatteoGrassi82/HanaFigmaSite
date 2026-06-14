"use client";

import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import React from "react";
import { cn } from "../../../lib/utils";

const css = `
.candy-bg {
    background-color: hsl(0 0% 96% / 2%);
    background-image: linear-gradient(
      135deg,
      hsl(0 0% 96%) 25%,
      transparent 25.5%,
      transparent 50%,
      hsl(0 0% 96%) 50.5%,
      hsl(0 0% 96%) 75%,
      transparent 75.5%,
      transparent
    );
    background-size: 10px 10px;
  }`;

const Stats = () => {
  return (
    <section className="py-20 md:py-32 w-full px-4 md:px-6 bg-[#F5F5F5]">
      <style>{css}</style>
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center mb-10 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-normal text-slate-900 dark:text-white mb-6 font-serif">
            Portals wait. Texts wait. <br className="hidden md:inline" />
            <span className="italic">Hana picks up the phone.</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Patients ignore the portal and miss the text — then the slot goes empty. Hana reaches them the way they actually respond, and protects the schedule.
          </p>
        </div>
        <div className="relative mx-auto mt-8 md:mt-20 flex h-[300px] md:h-[500px] max-w-4xl items-center justify-center gap-2 md:gap-8">
          {[
            { value: 15, label: "Patient portals", delay: 0.2 },
            { value: 20, label: "Health apps", delay: 0.4 },
            {
              value: 85,
              label: "Hana",
              className: "bg-[#A7BCF5]",
              showToolTip: true,
              delay: 0.6,
            },
            { value: 35, label: "SMS reminders", delay: 0.8 },
          ].map((props, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                type: "spring",
                damping: 10,
              }}
              className="h-full w-full"
            >
              <BarChart {...props} />
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">% of targeted patients reached per cycle. Voice vs. passive channels.</p>
        </div>
      </div>
    </section>
  );
};

export { Stats };

const BarChart = ({
  value,
  label,
  className = "",
  showToolTip = false,
  delay = 0,
}: {
  value: number;
  label: string;
  className?: string;
  showToolTip?: boolean;
  delay?: number;
}) => {
  return (
    <div className="group relative h-full w-full flex flex-col justify-end">
      <div className="candy-bg relative h-full w-full overflow-hidden rounded-[24px] md:rounded-[40px] bg-slate-100 dark:bg-slate-800/50">
        <motion.div
          initial={{ opacity: 0, y: 100, height: 0 }}
          animate={{ opacity: 1, y: 0, height: `${value}%` }}
          transition={{ duration: 0.5, type: "spring", damping: 20, delay }}
          className={cn(
            "absolute bottom-0 mt-auto w-full rounded-[24px] md:rounded-[40px] bg-zinc-800 dark:bg-zinc-700 p-2 md:p-3 text-white",
            className,
          )}
        >
          <div className="relative flex h-10 md:h-14 w-full items-center justify-center gap-2 rounded-full bg-white/20 tracking-tighter">
            <NumberFlow value={value} suffix="%" className="text-lg md:text-3xl font-bold" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100, height: 0 }}
        animate={{ opacity: 1, y: 0, height: `${value}%` }}
        transition={{ duration: 0.5, type: "spring", damping: 15, delay }}
        className="absolute bottom-0 w-full pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: showToolTip ? 1 : 0, y: showToolTip ? 0 : 100 }}
          transition={{ duration: 0.5, type: "spring", damping: 15, delay }}
          className={cn(
            "absolute -top-14 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] rounded-xl bg-zinc-800 px-3 py-2 text-white font-bold text-sm shadow-xl z-50 md:px-6 md:py-3 md:text-lg md:whitespace-nowrap",
            className.includes("bg-[#A7BCF5]") ? "bg-[#A7BCF5]" : "bg-zinc-800",
          )}
        >
          <div
            className={cn(
              "absolute -bottom-9 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-inherit transition-all duration-300 ease-in-out",
              className.includes("bg-[#A7BCF5]") ? "bg-[#A7BCF5]" : "bg-zinc-800",
            )}
          />
          <svg
            className={cn(
              "absolute -bottom-2 left-1/2 -translate-x-1/2",
              className.includes("bg-[#A7BCF5]")
                ? "text-[#A7BCF5]"
                : "text-zinc-800",
            )}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.83855 8.41381C4.43827 9.45255 5.93756 9.45255 6.53728 8.41381L9.65582 3.01233C10.2555 1.97359 9.50589 0.675159 8.30646 0.675159H2.06937C0.869935 0.675159 0.120287 1.97359 0.720006 3.01233L3.83855 8.41381Z"
              fill="currentColor"
            />
          </svg>
          Patients reached
        </motion.div>
      </motion.div>
      <p className="mx-auto mt-3 md:mt-4 w-fit tracking-tight text-xs md:text-base text-slate-500 dark:text-slate-400 font-medium">
        {label}
      </p>
    </div>
  );
};