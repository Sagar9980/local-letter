"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { HorizonGlow } from "@/components/Glow";
import TemplateWorkbench from "@/components/TemplateWorkbench";
import { site } from "@/lib/site";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.24, duration: 1.15 },
  },
};

const frameRise: Variants = {
  hidden: { opacity: 0, y: 46, scale: 0.975, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.14, duration: 1.5 },
  },
};

const proofPoints = ["No vendor lock-in", "Runs in your VPC", "MIT licensed"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <HorizonGlow />

      <motion.div
        className="ll-shell relative z-10"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={rise}>
            <span className="ll-pill">
              <span className="grid size-5 place-items-center rounded-full bg-ember-400/15">
                <Sparkles className="size-3 text-ember-300" />
              </span>
              Open source · Self-hosted · Multi-language
            </span>
          </motion.div>

          <motion.h1 variants={rise} className="ll-display mt-7 text-ink-50">
            Transactional email
            <br />
            that speaks{" "}
            <span className="ll-serif ll-gradient-text">every language</span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-300"
          >
            Design a template once in a visual editor, translate it per locale,
            and render it from any codebase with one typed SDK call. Your
            templates, your database, your infrastructure.
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/contact"
              className="ll-btn ll-btn-primary group w-full sm:w-auto"
            >
              Contact
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="ll-btn ll-btn-ghost w-full sm:w-auto"
            >
              <GithubIcon className="size-4" />
              View the source
            </a>
          </motion.div>

          <motion.ul
            variants={rise}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {proofPoints.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-500"
              >
                <Check className="size-3.5 text-ember-400/80" />
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={frameRise} className="relative mt-16 sm:mt-20">
          <TemplateWorkbench />
        </motion.div>
      </motion.div>
    </section>
  );
}

