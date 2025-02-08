export interface TokenPrice {
  [key: string]: number;
}

export const fetchTokenPrices = async (): Promise<TokenPrice> => {
  const response = await fetch("https://interview.switcheo.com/prices.json");
  const data = await response.json();
  return data.reduce(
    (acc: TokenPrice, token: { currency: string; price: number }) => {
      acc[token.currency] = token.price;
      return acc;
    },
    {}
  );
};
