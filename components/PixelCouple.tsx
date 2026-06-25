"use client";

export default function PixelCouple() {
  return (
    <div className="flex items-end justify-center gap-4">
      <style>{`
        @keyframes robotFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes girlJump {
          0%, 100% { transform: translateY(0px); }
          40% { transform: translateY(-12px); }
          60% { transform: translateY(-12px); }
        }
        @keyframes antennaBlink {
          0%, 80%, 100% { background-color: #a78bfa; }
          90% { background-color: #1a1a1a; }
        }
        @keyframes thinkPop {
          0%, 60%, 100% { opacity: 0; transform: scale(0); }
          75%, 90% { opacity: 1; transform: scale(1); }
        }
        .robot { animation: robotFloat 2.8s ease-in-out infinite; }
        .girl { animation: girlJump 1.1s ease-in-out infinite; }
        .dot1 { animation: thinkPop 2.8s ease-in-out infinite 0s; }
        .dot2 { animation: thinkPop 2.8s ease-in-out infinite 0.2s; }
        .dot3 { animation: thinkPop 2.8s ease-in-out infinite 0.4s; }
        .antenna { animation: antennaBlink 2.8s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col items-center relative">
        <div className="absolute -top-5 left-6 flex gap-[3px] items-end">
          <div className="dot1 w-[3px] h-[3px] bg-violet-300 rounded-full"></div>
          <div className="dot2 w-[4px] h-[4px] bg-violet-300 rounded-full"></div>
          <div className="dot3 w-[6px] h-[6px] bg-violet-300 rounded-full"></div>
        </div>
        <div className="robot flex flex-col items-center">
          <div className="flex flex-col items-center mb-[1px]">
            <div className="antenna w-[6px] h-[6px] rounded-sm"></div>
            <div className="w-[4px] h-[6px] bg-[#8c7b6b]"></div>
          </div>
          <div className="w-[32px] h-[28px] bg-[#8c7b6b] flex flex-col items-center justify-center gap-[4px]">
            <div className="flex gap-[6px]">
              <div className="w-[6px] h-[6px] bg-[#1a1a1a]"></div>
              <div className="w-[6px] h-[6px] bg-[#1a1a1a]"></div>
            </div>
            <div className="w-[12px] h-[3px] bg-[#1a1a1a]"></div>
          </div>
          <div className="w-[8px] h-[4px] bg-[#7a6a5a]"></div>
          <div className="w-[36px] h-[32px] bg-[#8c7b6b] flex items-center justify-center">
            <div className="w-[20px] h-[16px] bg-[#6a5a4a] flex items-center justify-center">
              <div className="w-[8px] h-[8px] bg-[#a78bfa] rounded-sm"></div>
            </div>
          </div>
          <div className="flex gap-[4px]">
            <div className="w-[12px] h-[16px] bg-[#7a6a5a]"></div>
            <div className="w-[12px] h-[16px] bg-[#7a6a5a]"></div>
          </div>
          <div className="flex gap-[2px]">
            <div className="w-[14px] h-[6px] bg-[#6a5a4a]"></div>
            <div className="w-[14px] h-[6px] bg-[#6a5a4a]"></div>
          </div>
        </div>
        <span className="text-[7px] text-gray-400 tracking-widest mt-2">CAEL</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="girl flex flex-col items-center">
          <div className="w-[28px] h-[6px] bg-[#1a1a1a]"></div>
          <div className="flex">
            <div className="w-[4px] h-[22px] bg-[#1a1a1a]"></div>
            <div className="w-[24px] h-[22px] bg-[#f5c9a0] flex flex-col items-center justify-center gap-[4px]">
              <div className="flex gap-[5px]">
                <div className="w-[5px] h-[5px] bg-[#1a1a1a]"></div>
                <div className="w-[5px] h-[5px] bg-[#1a1a1a]"></div>
              </div>
              <div className="w-[8px] h-[2px] bg-[#d4847a]"></div>
            </div>
            <div className="w-[4px] h-[22px] bg-[#1a1a1a]"></div>
          </div>
          <div className="flex">
            <div className="w-[4px] h-[8px] bg-[#1a1a1a]"></div>
            <div className="w-[24px]"></div>
            <div className="w-[4px] h-[8px] bg-[#1a1a1a]"></div>
          </div>
          <div className="w-[32px] h-[28px] bg-[#c4b5fd] flex items-end justify-center pb-[2px]">
            <div className="w-[28px] h-[10px] bg-[#a78bfa]"></div>
          </div>
          <div className="flex gap-[4px]">
            <div className="w-[10px] h-[14px] bg-[#f5c9a0]"></div>
            <div className="w-[10px] h-[14px] bg-[#f5c9a0]"></div>
          </div>
          <div className="flex gap-[2px]">
            <div className="w-[12px] h-[5px] bg-[#1a1a1a]"></div>
            <div className="w-[12px] h-[5px] bg-[#1a1a1a]"></div>
          </div>
        </div>
        <span className="text-[7px] text-gray-400 tracking-widest mt-2">JIA</span>
      </div>
    </div>
  );
}
