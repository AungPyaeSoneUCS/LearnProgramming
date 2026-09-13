import type { ComponentPropsWithoutRef } from "react";

export default function ContentImage(props: ComponentPropsWithoutRef<"img">) {
  const { src, alt, width, height, ...rest } = props;
  return (
    <div className="my-6 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} width={width} height={height} {...rest} />
    </div>
  );
}
