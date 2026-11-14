import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const Card = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  <div
    className={clsx(
      "relative bg-white rounded-3xl ring-1 ring-black/[0.04]",
      "shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)]",
      "overflow-hidden",
      "p-5 sm:p-7",
      className,
    )}
    {...rest}
  />;
};

export const GlassCard = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx(
      "relative rounded-3xl overflow-hidden",
      "bg-white/[0.97] backdrop-blur-xl ring-1 ring-white/20",
      "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]",
      "p-5 sm:p-7 md:p-8",
      className,
    )}
    {...rest}
  />
);
