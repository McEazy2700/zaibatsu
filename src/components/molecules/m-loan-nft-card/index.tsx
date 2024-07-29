"use client";

import html2canvas from "html2canvas";
import Image from "next/image";
import React from "react";

const NFTCard = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (ref.current) {
      const canvas = await html2canvas(ref.current, {
        allowTaint: true,
        removeContainer: true,
        backgroundColor: "transparent",
      });
      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = data;
      console.log(data);
      link.download = "downloaded-image.jpg";

      document.body.appendChild(link);
      // link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-transparent">
      <div
        ref={ref}
        className="font-serif relative z-0 w-[1011px] h-[637.5px] overflow-hidden rounded-[3rem] bg-gradient-to-b from-green-600 to-green-700"
      >
        <div className="bg-black/10 absolute right-[40%] top-[40%] aspect-square w-full rounded-full" />
        <div className="bg-black/10 absolute left-[40%] bottom-[40%] aspect-square w-full rounded-full" />
        <div className="absolute text-white inset-0 z-50 p-14 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <p className="text-7xl font-extrabold">Private Doc</p>
            <div className="flex items-center">
              {/* <span className="text-7xl font-semibold">Veecerts</span> */}
              <Image src="/logo.svg" alt="veecerts" width={120} height={120} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl">
              <div className="py-5 text-5xl space-y-4">
                <p>VEC-PRM</p>
                <p className="font-extrabold tracking-widest">#00192</p>
              </div>
              <p className="font-extralight">20-07-2024</p>
            </div>
            <div>
              <div className="border overflow-hidden z-0 rounded-3xl border-black/20 relative">
                <Image
                  src="/qr-code.svg"
                  alt="veecerts"
                  width={300}
                  height={300}
                />
                <div className="absolute translate-x-[50%] right-[50%] -translate-y-[50%] top-[50%] z-50">
                  <Image
                    className="bg-white p-2 rounded-lg"
                    src="/logo.svg"
                    alt="veecerts"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={handleDownloadImage}>Download Card</button>
    </div>
  );
};

export default NFTCard;
