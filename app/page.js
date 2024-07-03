import Script from "next/script";
import Home from "../components/main/Home";
export default function HomePage() {
  return (
    <>
      <Script
        src="//code.jivosite.com/widget/Sfx3BFRcZ1"
        strategy="afterInteractive"
        id="hs-script-loader"
        async
      ></Script>
      <Home />
    </>
  );
}
