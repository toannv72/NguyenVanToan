"use client";

import { useEffect, useState } from "react";
import { fetchTokenPrices } from "../utils/fetchPrices";

const CurrencySwapForm = () => {
  const [fromCurrency, setFromCurrency] = useState<string>("SWTH");
  const [toCurrency, setToCurrency] = useState<string>("ETH");
  const [amount, setAmount] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await fetchTokenPrices();
        setTokenPrices(prices);
      } catch (err) {
        console.log(err);

        setError("Failed to fetch token prices.");
      }
    };
    loadPrices();
  }, []);

  const handleSwap = () => {
    if (!tokenPrices[fromCurrency] || !tokenPrices[toCurrency]) {
      setError("Invalid currency selection.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const fromPrice = tokenPrices[fromCurrency];
      const toPrice = tokenPrices[toCurrency];
      const convertedAmount = (amount * fromPrice) / toPrice;
      setResult(convertedAmount);
      setLoading(false);
    }, 1000); // Simulate loading delay
  };

  return (
    <div className=" m-auto p-16   rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mt-4">Currency Swap</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value);
              setResult(null);
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {Object.keys(tokenPrices).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To</label>
          <select
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value);
              setResult(null);
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {Object.keys(tokenPrices).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setResult(null);
              setAmount(parseFloat(e.target.value));
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleSwap}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Swapping..." : "Swap"}
        </button>
        {result !== null && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold">
              {amount} {fromCurrency} = {result.toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySwapForm;
