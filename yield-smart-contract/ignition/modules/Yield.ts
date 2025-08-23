import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";




export default buildModule("YieldModule", (m) => {
  const yield = m.contract("Yield",[],{

  });

  return { yield };
});
