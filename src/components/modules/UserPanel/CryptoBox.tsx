// CryptoBox.tsx
import Image from "next/image";
import Flag from "react-world-flags";
import { CurrencyItem } from "./CryptoContent";

interface CryptoBoxProps {
  crypto: CurrencyItem;
  base: {
    base: string;
    flag_url: string;
  };
}

export default function CryptoBox({ crypto, base }: CryptoBoxProps) {
  return (
    <div className="crypto-container flex justify-center gap-[2rem] items-center">
      <div className="crypto-imgs flex justify-center items-center gap-0">
        {base.base ? (
          <Image
            width={100}
            height={100}
            src={`${base.flag_url}`}
            alt={base.base}
            className="rounded-full w-8 h-6 10-x-6 translate-x-2"
          />
        ) : (
          <Flag code={base.base} className="w-8 h-6 rounded-sm" />
        )}
        {crypto.flag_url ? (
          <Image
            width={100}
            height={100}
            src={`${crypto.flag_url}`}
            alt={crypto.code}
            className="rounded-full w-8 h-6"
          />
        ) : (
          <Flag code={crypto.country_code} className="w-8 h-6 rounded-sm" />
        )}
      </div>

      <div className="flex justify-between gap-1 items-center">
        <div className="crypto-names flex justify-center text-[var(--main-background)] dark:text-white">
          {base.base} / {crypto.code}
        </div>
        <div className="crypto-price">
          <span className="text-[#00CB08]">{crypto.rate}</span>
        </div>
      </div>
    </div>
  );
}
