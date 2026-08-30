import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const TripDataContext = createContext(null);

export function TripDataProvider({ children }) {
  const [trip, setTrip] = useState(null);
  const [travellers, setTravellers] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const firstLoad = useRef(true);

  const refresh = useCallback(async () => {
    try {
      if (firstLoad.current) {
        setLoading(true);
      }

      setError("");

      const [
        tripResponse,
        travellersResponse,
        depositsResponse,
        expensesResponse,
      ] = await Promise.all([
        supabase.from("trip_settings").select("*").eq("id", 1).maybeSingle(),

        supabase
          .from("travellers")
          .select("*")
          .order("created_at", { ascending: true }),

        supabase
          .from("deposits")
          .select("*")
          .order("deposit_date", { ascending: false })
          .order("created_at", { ascending: false }),

        supabase
          .from("expenses")
          .select("*")
          .order("expense_date", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);

      const responses = [
        tripResponse,
        travellersResponse,
        depositsResponse,
        expensesResponse,
      ];

      const failedResponse = responses.find((response) => response.error);

      if (failedResponse?.error) {
        throw failedResponse.error;
      }

      setTrip(tripResponse.data || null);
      setTravellers(travellersResponse.data || []);
      setDeposits(depositsResponse.data || []);
      setExpenses(expensesResponse.data || []);

      return true;
    } catch (err) {
      console.error(err);

      setError("যাত্রার হিসাব লোড করা যায়নি।");

      return false;
    } finally {
      firstLoad.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const interval = window.setInterval(() => {
      refresh();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [refresh]);

  const summary = useMemo(() => {
    const totalDeposits = deposits.reduce(
      (sum, deposit) => sum + Number(deposit.amount || 0),
      0,
    );

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0,
    );

    const travellerCount = travellers.length;

    const perPersonExpense =
      travellerCount > 0 ? totalExpenses / travellerCount : 0;

    const depositsByTraveller = new Map();

    deposits.forEach((deposit) => {
      const current = depositsByTraveller.get(deposit.traveller_id) || 0;

      depositsByTraveller.set(
        deposit.traveller_id,
        current + Number(deposit.amount || 0),
      );
    });

    const settlements = travellers.map((traveller) => {
      const deposited = depositsByTraveller.get(traveller.id) || 0;

      const balance = deposited - perPersonExpense;

      return {
        ...traveller,
        deposited,
        expenseShare: perPersonExpense,
        balance,
      };
    });

    return {
      travellerCount,
      totalDeposits,
      totalExpenses,
      cashInHand: totalDeposits - totalExpenses,
      perPersonExpense,
      settlements,
    };
  }, [travellers, deposits, expenses]);

  return (
    <TripDataContext.Provider
      value={{
        trip,
        travellers,
        deposits,
        expenses,
        loading,
        error,
        summary,
        refresh,
      }}
    >
      {children}
    </TripDataContext.Provider>
  );
}

export function useTripData() {
  const context = useContext(TripDataContext);

  if (!context) {
    throw new Error("TripDataProvider-এর ভিতরে useTripData ব্যবহার করতে হবে।");
  }

  return context;
}
