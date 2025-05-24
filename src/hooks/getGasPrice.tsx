export default async function useGetGasPrice() {
  const response = await fetch(
    "https://open-api.openocean.finance/v4/42161/gasPrice",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  const data = await response.json();
  return data?.without_decimals?.standard;
}
