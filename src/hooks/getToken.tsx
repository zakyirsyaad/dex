interface TokenList {
  id: number;
  code: string;
  name: string;
  address: string;
  decimals: number;
  symbol: string;
  icon: string;
  chain: string;
  usd: string;
}

export default async function useGetToken() {
  const response = await fetch(
    "https://open-api.openocean.finance/v4/42161/tokenList",
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
