export default async function useGetQuote({
  inTokenAddress,
  outTokenAddress,
  amount,
  gasPrice,
  slippage,
}: {
  inTokenAddress: string;
  outTokenAddress: string;
  amount: string;
  gasPrice: string;
  slippage: string;
}) {
  const response = await fetch(
    `https://open-api.openocean.finance/v4/42161/quote?inTokenAddress=${inTokenAddress}&outTokenAddress=${outTokenAddress}&amountDecimals=${amount}&gasPriceDecimals=${gasPrice}&slippage=${slippage}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await response.json();
  return data?.data;
}
