"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchTokenPrices } from "../utils/fetchPrices";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("99.73");
  const [fromCurrency, setFromCurrency] = useState("ATOM");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState("103");
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch token prices on component mount
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await fetchTokenPrices();
        setTokenPrices(prices);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch token prices. Please try again later.");
      }
    };
    loadPrices();
  }, []);

  // Debounce effect for amount change
  useEffect(() => {
    // Calculate conversion result
    const calculateResult = (currentAmount: string) => {
      console.log(tokenPrices);
      console.log(fromCurrency);
      console.log(toCurrency);
      console.log(currentAmount);

      if (!tokenPrices[fromCurrency] || !tokenPrices[toCurrency]) {
        console.log("Invalid currency selection.");
        setError("Invalid currency selection.");
        return;
      }

      if (parseFloat(currentAmount) <= 0) {
        setError("Amount must be greater than zero.");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        const fromPrice = tokenPrices[fromCurrency];
        const toPrice = tokenPrices[toCurrency];
        const convertedAmount =
          (parseFloat(currentAmount) * fromPrice) / toPrice;
        setResult(convertedAmount.toFixed(2));
        setLoading(false);
        setError(null); // Clear any previous errors
      }, 1000); // Simulate loading delay
    };

    const timeout = setTimeout(() => {
      console.log(123, amount);
      calculateResult(amount);
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeout); // Clear timeout on component unmount or amount change
  }, [amount, fromCurrency, toCurrency, tokenPrices]);

  // Handle amount change
  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  // Handle currency change
  const handleCurrencyChange = (currency: string, type: "from" | "to") => {
    if (type === "from") {
      setFromCurrency(currency);
    } else {
      setToCurrency(currency);
    }
  };

  // Handle currency swap
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="min-h-screen bg-[#1B3B1B] flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-medium text-[#A5E887] mb-2">
        1 nghìn Euro sang Đô-la Mỹ
      </h1>
      <p className="text-[#A5E887] mb-8">
        Đổi tiền EUR sang USD theo tỷ giá chuyển đổi thực
      </p>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 space-y-8">
          <div className="grid gap-6">
            {/* From Currency */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Amount</label>
              <div className="flex gap-4 ">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="text-xl font-semibold h-14"
                  />
                </div>
                <Select
                  value={fromCurrency}
                  onValueChange={(value) => handleCurrencyChange(value, "from")}
                >
                  <SelectTrigger className="w-[100px] h-14">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {fromCurrency}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-52 overflow-y-auto">
                    {Object.keys(tokenPrices).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        <div className="flex items-center gap-2">
                          {currency}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwap}
                className="rounded-full"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Convert
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={result}
                    readOnly
                    className="text-xl font-semibold h-14 border-2 border-primary"
                  />
                </div>
                <Select
                  value={toCurrency}
                  onValueChange={(value) => handleCurrencyChange(value, "to")}
                >
                  <SelectTrigger className="w-[100px] h-14 border-2 border-primary">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {toCurrency}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-52 overflow-y-auto">
                    {Object.keys(tokenPrices).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        <div className="flex items-center gap-2">
                          {currency}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loading and Result */}
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {!loading && result !== null && (
            <div className="text-sm mb-4">
              <span className="font-medium">
                {amount} {fromCurrency} = {result} {toCurrency}
              </span>
            </div>
          )}
          {error}
        </div>
        <div className="h-2 bg-gradient-to-r from-red-400 via-red-500 to-red-400 opacity-75" />
      </div>
    </div>
  );
}
