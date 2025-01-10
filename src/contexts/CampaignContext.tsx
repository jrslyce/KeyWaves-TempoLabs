import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Database } from "@/types/supabase";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
type Application = Database["public"]["Tables"]["applications"]["Row"];

type CampaignState = {
  campaign: Campaign | null;
  applications: Application[];
  loading: boolean;
  error: string | null;
};

type CampaignAction =
  | { type: "SET_CAMPAIGN"; payload: Campaign }
  | { type: "SET_APPLICATIONS"; payload: Application[] }
  | { type: "ADD_APPLICATION"; payload: Application }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: CampaignState = {
  campaign: null,
  applications: [],
  loading: false,
  error: null,
};

const CampaignContext = createContext<{
  state: CampaignState;
  dispatch: React.Dispatch<CampaignAction>;
}>({ state: initialState, dispatch: () => null });

function campaignReducer(
  state: CampaignState,
  action: CampaignAction,
): CampaignState {
  switch (action.type) {
    case "SET_CAMPAIGN":
      return { ...state, campaign: action.payload, error: null };
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload, error: null };
    case "ADD_APPLICATION":
      return {
        ...state,
        applications: [...state.applications, action.payload],
        error: null,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  return (
    <CampaignContext.Provider value={{ state, dispatch }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
}
