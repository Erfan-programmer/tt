import Image from "next/image";

interface CryptoPropTypes {
  id: number;
  from: { img: string; cryptoName: string };
  to: { img: string; cryptoName: string };
  price: number;
  kind: string;
}
export default function CryptoBox(crypto: { crypto: CryptoPropTypes }) {
  return (
    <div className="crypto-container flex justify-center gap-[2rem] items-center">
      <div className="crypto-imgs w-[2rem] flex justify-center items-center">
        <Image width={300} height={300} src={`${process.env.VITE_STORAGE_URL}${crypto.crypto.from.img}`} alt="" className="rounded-[50%]" style={{transform:"translateX(6px)"}}/>
        <Image width={300} height={300} src={`${process.env.VITE_STORAGE_URL}${crypto.crypto.to.img}`} alt="" className="rounded-[50%] w-12 h-8"/>
      </div>
      <div className="flex justify-between gap-1 items-center">
        <div className="crypto-names flex justify-center text-[var(--main-background)] dark:text-white">
          {crypto.crypto.to.cryptoName} / {crypto.crypto.from.cryptoName}
        </div>
        <div className="crypto-price">
          <span className={crypto.crypto.kind === "sell" ? "text-[#FF4646]" : "text-[#00CB08]"}>{crypto.crypto.price}</span>
        </div>
      </div>
    </div>
  );
}
