import Script from "next/script";
import Home from "../components/main/Home";
export default function HomePage() {
  return (
    <>
      <Script
        src="//js-eu1.hs-scripts.com/144894320.js"
        strategy="afterInteractive"
        id="hs-script-loader"
        async
      ></Script>
      <Home />
    </>
  );
}
