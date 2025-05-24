export default async function useGetAllowanceSwap({
  address,
  tokenIn,
}: {
  address: string;
  tokenIn: string;
}) {
  const response = await fetch(
    `https://open-api.openocean.finance/v4/42161/allowance?account=${address}&inTokenAddress=${tokenIn}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  const data = await response.json();
  return data?.data[0]?.allowance;
}
