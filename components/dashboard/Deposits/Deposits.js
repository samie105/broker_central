import DepwCrypto from "./DepwCrypto";
import DepwBank from "./DepwBank";
import DepwMobilePayments from "./DepwMobilePayments";
export default function Deposit() {
  return (
    <>
      <DepwCrypto />
      <DepwMobilePayments />
      <DepwBank />
    </>
  );
}
