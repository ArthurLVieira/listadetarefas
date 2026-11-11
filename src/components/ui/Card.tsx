import clsx from "clsx";
import type { HTMLAttributes } from "react";

export const Card = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  <div
    className={clsx(
      "bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary-950/10",
      "ring-1 ring-black/5 sm:p-8",
      className,
    )}
    {...rest}
  />;
};
