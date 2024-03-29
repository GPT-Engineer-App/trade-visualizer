import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Table, Thead, Tbody, Tr, Th, Td, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Trade {
  symbol: string;
  type: string;
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  openTime: string;
  closeTime: string;
}

const Index: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [profitLossData, setProfitLossData] = useState<{ date: string; profit: number }[]>([]);
  const toast = useToast();

  useEffect(() => {
    // Check if user is already connected
    const token = localStorage.getItem("mt5Token");
    if (token) {
      setIsConnected(true);
      fetchTradeHistory(token);
    }
  }, []);

  const connectToMT5 = async () => {
    try {
      // TODO: Implement MetaTrader 5 authentication flow
      // Retrieve access token and store it in local storage
      const token = "dummy_token";
      localStorage.setItem("mt5Token", token);
      setIsConnected(true);
      fetchTradeHistory(token);
      toast({
        title: "Connected to MetaTrader 5",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error connecting to MetaTrader 5:", error);
      toast({
        title: "Error connecting to MetaTrader 5",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const disconnectFromMT5 = () => {
    localStorage.removeItem("mt5Token");
    setIsConnected(false);
    setTrades([]);
    setProfitLossData([]);
    toast({
      title: "Disconnected from MetaTrader 5",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const fetchTradeHistory = async (token: string) => {
    try {
      // TODO: Make API call to fetch trade history using the access token
      // Dummy data for demonstration purposes
      const dummyTrades: Trade[] = [
        {
          symbol: "EURUSD",
          type: "Buy",
          volume: 1.0,
          openPrice: 1.1234,
          closePrice: 1.1245,
          profit: 110,
          openTime: "2023-06-01 10:00:00",
          closeTime: "2023-06-01 11:00:00",
        },
        {
          symbol: "GBPUSD",
          type: "Sell",
          volume: 0.5,
          openPrice: 1.2345,
          closePrice: 1.2335,
          profit: -50,
          openTime: "2023-06-02 14:30:00",
          closeTime: "2023-06-02 15:30:00",
        },
        // Add more dummy trade data
      ];

      setTrades(dummyTrades);
      calculateProfitLossData(dummyTrades);
    } catch (error) {
      console.error("Error fetching trade history:", error);
      toast({
        title: "Error fetching trade history",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const calculateProfitLossData = (trades: Trade[]) => {
    const data: { date: string; profit: number }[] = [];

    trades.forEach((trade) => {
      const date = trade.closeTime.split(" ")[0];
      const profit = trade.profit;

      const existingData = data.find((d) => d.date === date);
      if (existingData) {
        existingData.profit += profit;
      } else {
        data.push({ date, profit });
      }
    });

    setProfitLossData(data);
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        MetaTrader 5 Trade History
      </Heading>

      {isConnected ? (
        <>
          <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={disconnectFromMT5} mb={4}>
            Disconnect from MetaTrader 5
          </Button>

          <Heading as="h2" size="lg" mb={4}>
            Trade History
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Symbol</Th>
                <Th>Type</Th>
                <Th>Volume</Th>
                <Th>Open Price</Th>
                <Th>Close Price</Th>
                <Th>Profit</Th>
                <Th>Open Time</Th>
                <Th>Close Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trades.map((trade, index) => (
                <Tr key={index}>
                  <Td>{trade.symbol}</Td>
                  <Td>{trade.type}</Td>
                  <Td>{trade.volume}</Td>
                  <Td>{trade.openPrice}</Td>
                  <Td>{trade.closePrice}</Td>
                  <Td>{trade.profit}</Td>
                  <Td>{trade.openTime}</Td>
                  <Td>{trade.closeTime}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Heading as="h2" size="lg" mt={8} mb={4}>
            Profit/Loss Graph
          </Heading>
          <LineChart width={600} height={300} data={profitLossData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="profit" stroke="#8884d8" />
            <Tooltip />
            <Legend />
          </LineChart>
        </>
      ) : (
        <Box textAlign="center">
          <Text fontSize="xl" mb={4}>
            Please connect to your MetaTrader 5 account to view your trade history and profit/loss data.
          </Text>
          <Button leftIcon={<FaSignInAlt />} colorScheme="blue" onClick={connectToMT5}>
            Connect to MetaTrader 5
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Index;
