"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  DollarSign,
  Download,
  FileText,
  HelpCircle,
  Loader2,
  Menu,
  Pause,
  Phone,
  PhoneOff,
  Play,
  SkipBack,
  SkipForward,
  Sparkles,
  Square,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface FormData {
  name: string;
  phone: string;
  email: string;
  nbfcName: string;
  originalAmount: string;
  outstandingAmount: string;
  emiDueDate: string;
  lastPaymentDate: string;
  lastPaymentAmount: string;
  loanType: string;
}

interface TranscriptItem {
  id: string;
  type: string;
  role: "assistant" | "user";
  content: string[];
  interrupted: boolean;
}

interface TranscriptData {
  items: TranscriptItem[];
}

interface OutcomeData {
  if_the_user_promised_to_pay_then_what_was_the_amount?: string;
  if_the_user_promised_to_pay_then_what_was_the_date_in_yyyymmdd_hhmm_format?: string;
  does_the_user_promised_to_pay?: string;
  what_was_the_summary_of_the_conversation?: string;
  [key: string]: any;
}

// Mock data for different DPD scenarios
const createDateForDPD = (dpd: number) => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() - dpd);
  return dueDate.toISOString().split("T")[0];
};

const createLastPaymentDate = (dpd: number) => {
  const today = new Date();
  const lastPayment = new Date(today);
  lastPayment.setDate(today.getDate() - Math.max(dpd + 15, 30));
  return lastPayment.toISOString().split("T")[0];
};

const mockLoanData: Record<string, FormData> = {
  // DPD 0-30 scenarios
  personal_dpd_15: {
    name: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh.kumar@email.com",
    nbfcName: "HDFC Credit",
    originalAmount: "150000",
    outstandingAmount: "125000",
    emiDueDate: createDateForDPD(15),
    lastPaymentDate: createLastPaymentDate(15),
    lastPaymentAmount: "5500",
    loanType: "Personal Loan",
  },
  smartphone_dpd_25: {
    name: "Priya Sharma",
    phone: "8765432109",
    email: "priya.sharma@email.com",
    nbfcName: "Bajaj Finserv",
    originalAmount: "45000",
    outstandingAmount: "28000",
    emiDueDate: createDateForDPD(25),
    lastPaymentDate: createLastPaymentDate(25),
    lastPaymentAmount: "2800",
    loanType: "Smartphone EMI",
  },

  // DPD 30-90 scenarios
  twowheeler_dpd_45: {
    name: "Amit Singh",
    phone: "7654321098",
    email: "amit.singh@email.com",
    nbfcName: "Tata Capital",
    originalAmount: "85000",
    outstandingAmount: "62000",
    emiDueDate: createDateForDPD(45),
    lastPaymentDate: createLastPaymentDate(45),
    lastPaymentAmount: "3200",
    loanType: "2-Wheeler Loan",
  },
  personal_dpd_60: {
    name: "Meera Patel",
    phone: "9123456789",
    email: "meera.patel@email.com",
    nbfcName: "ICICI Bank",
    originalAmount: "200000",
    outstandingAmount: "175000",
    emiDueDate: createDateForDPD(60),
    lastPaymentDate: createLastPaymentDate(60),
    lastPaymentAmount: "8500",
    loanType: "Personal Loan",
  },
  vitanium_dpd_75: {
    name: "Suresh Reddy",
    phone: "8234567890",
    email: "suresh.reddy@email.com",
    nbfcName: "Vitanium/Bharat Plays",
    originalAmount: "120000",
    outstandingAmount: "98000",
    emiDueDate: createDateForDPD(75),
    lastPaymentDate: createLastPaymentDate(75),
    lastPaymentAmount: "4200",
    loanType: "Business Loan",
  },

  // DPD 90-120 scenarios
  personal_dpd_105: {
    name: "Kavita Joshi",
    phone: "7345678901",
    email: "kavita.joshi@email.com",
    nbfcName: "Axis Bank",
    originalAmount: "300000",
    outstandingAmount: "285000",
    emiDueDate: createDateForDPD(105),
    lastPaymentDate: createLastPaymentDate(105),
    lastPaymentAmount: "12000",
    loanType: "Personal Loan",
  },
  smartphone_dpd_95: {
    name: "Ravi Gupta",
    phone: "6456789012",
    email: "ravi.gupta@email.com",
    nbfcName: "Bajaj Finserv",
    originalAmount: "65000",
    outstandingAmount: "58000",
    emiDueDate: createDateForDPD(95),
    lastPaymentDate: createLastPaymentDate(95),
    lastPaymentAmount: "3800",
    loanType: "Smartphone EMI",
  },

  // DPD 120+ scenarios
  personal_dpd_150: {
    name: "Deepak Shah",
    phone: "5567890123",
    email: "deepak.shah@email.com",
    nbfcName: "SBI",
    originalAmount: "500000",
    outstandingAmount: "495000",
    emiDueDate: createDateForDPD(150),
    lastPaymentDate: createLastPaymentDate(150),
    lastPaymentAmount: "18000",
    loanType: "Personal Loan",
  },
  twowheeler_dpd_180: {
    name: "Anjali Nair",
    phone: "4678901234",
    email: "anjali.nair@email.com",
    nbfcName: "Hero FinCorp",
    originalAmount: "95000",
    outstandingAmount: "92000",
    emiDueDate: createDateForDPD(180),
    lastPaymentDate: createLastPaymentDate(180),
    lastPaymentAmount: "4500",
    loanType: "2-Wheeler Loan",
  },
};

export default function DebtCollectionDashboard() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    nbfcName: "",
    originalAmount: "",
    outstandingAmount: "",
    emiDueDate: "",
    lastPaymentDate: "",
    lastPaymentAmount: "",
    loanType: "",
  });

  const [isCallActive, setIsCallActive] = useState(false);
  const [isOngoingCall, setIsOngoingCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSystemReady, setIsSystemReady] = useState(true);
  const [dpd, setDpd] = useState<number>(0);
  const [roomName, setRoomName] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const [recordingUrl, setRecordingUrl] = useState("");
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(
    null
  );
  const [outcomeData, setOutcomeData] = useState<OutcomeData | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Tour state
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedDebtWise");
    if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  // Tour steps configuration
  const tourSteps: Step[] = [
    {
      target: ".customer-info-section",
      content:
        "Start by entering customer information. Name and phone number are required fields.",
      disableBeacon: true,
      placement: "right",
    },
    {
      target: ".generate-button",
      content:
        "Need sample data? Click 'Generate' to auto-fill the form with realistic loan scenarios.",
      placement: "bottom",
    },
    {
      target: ".loan-details-section",
      content:
        "Review and adjust the loan details including amounts, dates, and loan type.",
      placement: "right",
    },
    {
      target: ".start-call-button",
      content:
        "Once all details are filled, click 'Start Call' to initiate the AI-powered collection call.",
      placement: "top",
    },
    {
      target: ".call-management-section",
      content:
        "Monitor the call in real-time. You'll see outcomes, recordings, and transcripts here after the call.",
      placement: "left",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem("hasCompletedTour", "true");
    }

    if (type === "step:after") {
      setTourStepIndex(index + 1);
    }
  };

  const startTour = () => {
    setShowWelcome(false);
    setRunTour(true);
    localStorage.setItem("hasVisitedDebtWise", "true");
  };

  const skipTour = () => {
    setShowWelcome(false);
    localStorage.setItem("hasVisitedDebtWise", "true");
    localStorage.setItem("hasCompletedTour", "skipped");
  };

  // Calculate DPD (Days Past Due)
  useEffect(() => {
    if (formData.emiDueDate) {
      const dueDate = new Date(formData.emiDueDate);
      const today = new Date();
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDpd(Math.max(0, diffDays));
    }
  }, [formData.emiDueDate]);

  // Track form completion for progress
  useEffect(() => {
    const newCompletedSteps = [];

    // Step 1: Basic Info
    if (formData.name && formData.phone) {
      newCompletedSteps.push(1);
    }

    // Step 2: Loan Details
    if (
      formData.originalAmount &&
      formData.outstandingAmount &&
      formData.emiDueDate
    ) {
      newCompletedSteps.push(2);
    }

    // Step 3: Ready to call
    if (newCompletedSteps.includes(1) && newCompletedSteps.includes(2)) {
      newCompletedSteps.push(3);
    }

    setCompletedSteps(newCompletedSteps);

    // Update current step
    if (newCompletedSteps.length === 0) {
      setCurrentStep(1);
    } else if (!newCompletedSteps.includes(2)) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }, [formData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fillMockData = (scenarioKey: string) => {
    const mockData = mockLoanData[scenarioKey];
    const {
      phone,
      name,
      email,
      nbfcName,
      originalAmount,
      outstandingAmount,
      lastPaymentAmount,
      ...otherData
    } = mockData;

    // Generate random values for numeric fields
    const randomOriginalAmount = (
      Math.floor(Math.random() * 400000) + 50000
    ).toString(); // 50k to 450k
    const randomOutstandingPercent = Math.random() * 0.4 + 0.5; // 50% to 90% outstanding
    const randomOutstandingAmount = Math.floor(
      parseInt(randomOriginalAmount) * randomOutstandingPercent
    ).toString();
    const randomLastPaymentAmount = (
      Math.floor(Math.random() * 15000) + 2000
    ).toString(); // 2k to 17k

    setFormData((prev) => ({
      ...prev,
      ...otherData,
      originalAmount: randomOriginalAmount,
      outstandingAmount: randomOutstandingAmount,
      lastPaymentAmount: randomLastPaymentAmount,
      // Preserve user-entered personal details
      name: prev.name || "",
      email: prev.email || "",
      nbfcName: prev.nbfcName || "",
      phone: prev.phone || "",
    }));
  };

  const generateRoomName = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const phoneLastTen = formData.phone.slice(-10);
    return `Test_Campaign_${phoneLastTen}_${timestamp}`;
  };

  const saveCallDataToSheet = async (
    roomName: string,
    callStatus: string,
    additionalData?: any
  ) => {
    try {
      // Convert to IST (UTC+5:30)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
      const istTime = new Date(now.getTime() + istOffset);
      const timestamp =
        istTime.toISOString().replace("T", " ").substring(0, 19) + " IST";

      const recordingUrl = `https://livekitblob.blob.core.windows.net/livekitblob/${roomName}.mp4`;
      const transcriptUrl = `https://livekitblob.blob.core.windows.net/livekitblob/transcripts/${roomName}.json`;
      const analysisUrl = `https://livekitblob.blob.core.windows.net/livekitblob/analysis/${roomName}.json`;

      const rowData = [
        timestamp, // Timestamp
        formData.name || "", // Name
        formData.phone || "", // Phone
        formData.email || "", // Email
        formData.nbfcName || "", // NBFC/Lender
        formData.originalAmount || "", // Original Amount
        formData.outstandingAmount || "", // Outstanding Amount
        formData.emiDueDate || "", // EMI Due Date
        dpd.toString(), // DPD
        formData.lastPaymentDate || "", // Last Payment Date
        formData.lastPaymentAmount || "", // Last Payment Amount
        formData.loanType || "", // Loan Type
        roomName, // Room Name
        callStatus, // Call Status
        recordingUrl, // Recording URL
        transcriptUrl, // Transcript URL
        analysisUrl, // Analysis URL
      ];

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: rowData }),
      });

      if (response.ok) {
        console.log("[v0] Data saved to Google Sheets successfully");
      } else {
        const errorData = await response.json();
        console.error("[v0] Failed to save data to Google Sheets:", errorData);
      }
    } catch (error) {
      console.error("[v0] Error saving data to Google Sheets:", error);
      // Don't throw error to avoid breaking the call flow
    }
  };

  const fetchMediaFiles = async (room: string) => {
    setIsLoadingMedia(true);

    try {
      // Set recording URL using proxy
      const recordingUrl = `/api/proxy?url=${encodeURIComponent(
        `https://livekitblob.blob.core.windows.net/livekitblob/${room}.mp4`
      )}`;
      setRecordingUrl(recordingUrl);

      // Fetch transcript using proxy
      try {
        const transcriptUrl = `/api/proxy?url=${encodeURIComponent(
          `https://livekitblob.blob.core.windows.net/livekitblob/transcripts/${room}.json`
        )}`;
        console.log("[v0] Fetching transcript from:", transcriptUrl);
        const transcriptResponse = await fetch(transcriptUrl);
        console.log(
          "[v0] Transcript response status:",
          transcriptResponse.status
        );

        if (transcriptResponse.ok) {
          const transcriptData: TranscriptData =
            await transcriptResponse.json();
          console.log("[v0] Transcript data received:", transcriptData);

          // Validate transcript data
          if (
            transcriptData &&
            transcriptData.items &&
            Array.isArray(transcriptData.items)
          ) {
            setTranscriptData(transcriptData);
            console.log(
              "[v0] Valid transcript data set:",
              transcriptData.items.length,
              "items"
            );
          } else {
            console.log("[v0] Invalid transcript data structure");
          }
        } else {
          console.log(
            "[v0] Transcript fetch failed with status:",
            transcriptResponse.status
          );
        }
      } catch (error) {
        console.error("[v0] Error fetching transcript:", error);
      }

      // Fetch analysis/outcome using proxy with retry logic
      const finalOutcomeData = await fetchAnalysisWithRetry(room, 5); // Retry up to 5 times
    } catch (error) {
      console.error("[v0] Error fetching media files:", error);
    } finally {
      setIsLoadingMedia(false);
      // System is ready for new call after processing is complete
      setIsSystemReady(true);
    }
  };

  const fetchAnalysisWithRetry = async (
    room: string,
    maxRetries: number
  ): Promise<OutcomeData | null> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const analysisUrl = `/api/proxy?url=${encodeURIComponent(
          `https://livekitblob.blob.core.windows.net/livekitblob/analysis/${room}.json`
        )}`;
        console.log(
          `[v0] Fetching analysis from: ${analysisUrl} (attempt ${attempt}/${maxRetries})`
        );
        const analysisResponse = await fetch(analysisUrl);
        console.log("[v0] Analysis response status:", analysisResponse.status);

        if (analysisResponse.ok) {
          let outcomeData = await analysisResponse.json();

          // If the response is a string containing JSON, parse it again
          if (typeof outcomeData === "string") {
            try {
              outcomeData = JSON.parse(outcomeData);
            } catch (parseError) {
              console.log(
                "[v0] Failed to parse outcome data string:",
                parseError
              );
              continue; // Skip this attempt and try again
            }
          }

          // Validate outcome data structure
          if (
            outcomeData &&
            typeof outcomeData === "object" &&
            Object.keys(outcomeData).length > 0
          ) {
            console.log("[v0] Valid outcome data received:", outcomeData);
            setOutcomeData(outcomeData);
            return outcomeData; // Return the outcome data
          } else {
            console.log("[v0] Invalid outcome data structure:", outcomeData);
            continue; // Try again
          }
        } else {
          console.log(
            "[v0] Analysis response not OK:",
            analysisResponse.status,
            analysisResponse.statusText
          );
          if (analysisResponse.status === 404) {
            console.log(
              `[v0] Analysis file not found on attempt ${attempt}/${maxRetries}`
            );
          }
        }
      } catch (error) {
        console.log(
          `[v0] Analysis fetch error on attempt ${attempt}/${maxRetries}:`,
          error
        );
      }

      // Wait before retrying (except on last attempt)
      if (attempt < maxRetries) {
        console.log(`[v0] Waiting 10 seconds before retry...`);
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
      }
    }

    console.log("[v0] Failed to fetch analysis after all retries");
    return null; // Return null if no data could be fetched
  };

  const makeCall = async () => {
    if (!formData.phone || !formData.name) {
      alert("Please fill in at least Name and Phone Number");
      return;
    }

    const room = generateRoomName();
    setRoomName(room);

    // Set connecting state
    setIsConnecting(true);
    setIsSystemReady(false);

    const payload = {
      number: formData.phone.startsWith("+")
        ? formData.phone
        : `+91${formData.phone}`,
      roomname: room,
      info: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        nbfcName: formData.nbfcName,
        originalAmount: formData.originalAmount,
        outstandingAmount: formData.outstandingAmount,
        emiDueDate: formData.emiDueDate,
        dpd: dpd.toString(),
        lastPaymentDate: formData.lastPaymentDate,
        lastPaymentAmount: formData.lastPaymentAmount,
        loanType: formData.loanType,
      },
    };

    console.log("[v0] Making call with payload:", payload);

    try {
      const response = await fetch("https://ai.rajatkhandelwal.com/makecall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });

      console.log("[v0] Call response status:", response.status);

      if (response.status === 200) {
        console.log("[v0] Call initiated successfully");
        setIsConnecting(false);
        setIsCallActive(true);
        setIsOngoingCall(true);
        setIsRecording(true);
        setIsPolling(true);
        setRecordingUrl("");
        setTranscriptData(null);
        setOutcomeData(null);

        startPolling(room);
      } else {
        console.log("[v0] Call failed with status:", response.status);
        setIsConnecting(false);
        setIsSystemReady(true);

        alert("Call could not be connected");
      }
    } catch (error) {
      console.error("[v0] Error making call:", error);
      setIsConnecting(false);
      setIsSystemReady(true);

      alert("Error connecting call. Please check your network connection.");
    }
  };

  const startPolling = (room: string) => {
    console.log("[v0] Starting polling for room:", room);
    let lastRoomPresent = false;
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch("https://ai.rajatkhandelwal.com/rooms", {
          method: "GET",
          mode: "cors",
        });
        if (!response.ok) {
          console.log("[v0] Polling response not ok:", response.status);
          return;
        }
        const data = await response.json();
        console.log("[v0] Polling response:", data);
        // Check if the current room exists in the rooms array
        const roomPresent =
          data.rooms &&
          Array.isArray(data.rooms) &&
          data.rooms.some((r: any) => r.name === room);
        console.log("[v0] Room present:", roomPresent, "Room name:", room);
        console.log(
          "[v0] Available rooms:",
          data.rooms?.map((r: any) => r.name)
        );
        setIsOngoingCall(roomPresent);
        if (!roomPresent && lastRoomPresent) {
          // Call has ended
          console.log("[v0] Call has ended - room no longer present");
          setIsCallActive(false);
          setIsOngoingCall(false);
          setIsRecording(false);
          setIsPolling(false);
          clearInterval(pollInterval);

          // Immediately save call data to Google Sheets when call ends
          await saveCallDataToSheet(room, "Call Completed");

          // Then fetch media files after call ends
          // Keep system not ready until media files are processed
          fetchMediaFiles(room);
        }
        lastRoomPresent = roomPresent;
      } catch (error) {
        console.error("[v0] Error polling rooms:", error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const endCall = async () => {
    setIsCallActive(false);
    setIsOngoingCall(false);
    setIsRecording(false);
    setIsPolling(false);
    setIsConnecting(false);
    setIsSystemReady(true);

    // Save data immediately when call is manually ended
    if (roomName) {
      await saveCallDataToSheet(roomName, "Call Ended Manually");
    }
  };

  const formatQuestion = (questionCode: string): string => {
    const questionMap: { [key: string]: string } = {
      if_the_user_promised_to_pay_then_what_was_the_amount:
        "Promised Payment Amount",
      if_the_user_promised_to_pay_then_what_was_the_date_in_yyyymmdd_hhmm_format:
        "Promised Payment Date",
      does_the_user_promised_to_pay: "Did the user promise to pay?",
      what_was_the_summary_of_the_conversation: "Conversation Summary",
      // Legacy support for old format
      q01_does_the_user_agreed_to_pay: "Does the user agree to pay?",
      q02_what_is_the_summary_of_the_conversation:
        "What is the summary of the conversation?",
      q03_what_is_the_age_of_the_user: "What is the age of the user?",
      q04_what_are_the_reasons_user_refused_to_pay:
        "What are the reasons user refused to pay?",
    };
    return (
      questionMap[questionCode] ||
      questionCode
        .replace(/_/g, " ")
        .replace(/^q\d+\s/, "")
        .replace(/^what\s/, "")
        .replace(/^if\s/, "")
        .replace(/^does\s/, "")
    );
  };

  const formatAnswer = (value: string): string => {
    if (value === "True") return "Yes";
    if (value === "False") return "No";
    if (value === "[]") return "None specified";
    if (value === "0.0") return "Not provided";

    // Handle date format (yyyymmdd_hhmm)
    if (/^\d{8}_\d{4}$/.test(value)) {
      const year = value.substring(0, 4);
      const month = value.substring(4, 6);
      const day = value.substring(6, 8);
      const hour = value.substring(9, 11);
      const minute = value.substring(11, 13);
      return `${day}/${month}/${year} ${hour}:${minute}`;
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 flex flex-col">
      {/* Joyride Tour */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        callback={handleJoyrideCallback}
        stepIndex={tourStepIndex}
        styles={{
          options: {
            primaryColor: "#2563eb",
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: 12,
            padding: 20,
          },
          buttonNext: {
            borderRadius: 8,
            padding: "8px 16px",
            backgroundColor: "#2563eb",
          },
          buttonBack: {
            borderRadius: 8,
            padding: "8px 16px",
            color: "#64748b",
          },
        }}
      />

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome to DebtWise AI
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Your intelligent AI-powered debt collection assistant. Let us
                  show you how it works!
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  What you'll learn:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Enter Customer Details
                      </p>
                      <p className="text-xs text-gray-600">
                        Fill in loan information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Generate Sample Data
                      </p>
                      <p className="text-xs text-gray-600">
                        Quick testing with mock data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Start AI Call
                      </p>
                      <p className="text-xs text-gray-600">
                        Initiate automated calls
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Review Results
                      </p>
                      <p className="text-xs text-gray-600">
                        View transcripts & analytics
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={skipTour}
                  variant="outline"
                  size="lg"
                  className="px-8 h-12 text-base border-gray-300 hover:bg-gray-50 rounded-lg"
                >
                  Skip Tour
                </Button>
                <Button
                  onClick={startTour}
                  size="lg"
                  className="px-8 h-12 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg rounded-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Tour
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                You can restart the tour anytime from the help menu
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                DebtWise AI
              </h1>
              <p className="text-gray-600 text-xs font-medium">
                AI-powered debt collection management
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setRunTour(true)}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-gray-200 hover:bg-gray-50 rounded-md"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                Help
              </Button>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs px-2 py-0.5 font-medium"
              >
                Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {[
                { num: 1, label: "Customer Info", icon: Users },
                { num: 2, label: "Loan Details", icon: DollarSign },
                { num: 3, label: "Start Call", icon: Phone },
              ].map(({ num, label, icon: Icon }) => (
                <div key={num} className="flex items-center">
                  <div className="flex items-center space-x-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                        completedSteps.includes(num)
                          ? "bg-green-500 text-white shadow-md shadow-green-200"
                          : currentStep === num
                          ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {completedSteps.includes(num) ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Icon className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        completedSteps.includes(num) || currentStep === num
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {num < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                        completedSteps.includes(num)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-600 hidden md:block">
              <span className="font-medium">
                {completedSteps.length}/3 Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 py-4 h-[calc(100vh-140px)]">
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Column 1: Customer Info */}
            <div className="flex flex-col customer-info-section">
              <Card className="flex flex-col h-full shadow-lg border border-gray-200 bg-white overflow-hidden">
                <CardHeader className="pb-2 flex-shrink-0 border-b border-gray-200 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 px-4 py-3">
                  <CardTitle className="flex items-center justify-between text-sm font-bold text-gray-900">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-2 shadow-md">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Customer Info
                        </div>
                        <p className="text-[10px] font-normal text-gray-600">
                          Step {currentStep} of 3
                        </p>
                      </div>
                    </div>
                    {completedSteps.includes(1) && (
                      <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0.5">
                        <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                        Done
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                  {/* Help Card */}
                  {currentStep === 1 && !completedSteps.includes(1) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-start space-x-2 animate-in fade-in slide-in-from-top duration-500">
                      <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 text-xs">
                          Get Started
                        </h4>
                        <p className="text-[10px] text-blue-700 mt-0.5">
                          Enter name and phone (required)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-xs font-semibold text-gray-700 flex items-center"
                      >
                        Name <span className="text-red-500 ml-0.5">*</span>
                        {!formData.name && currentStep === 1 && (
                          <span className="ml-1.5 text-[10px] font-normal text-blue-600 animate-pulse">
                            Required
                          </span>
                        )}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Customer name"
                        className={`h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md transition-all duration-200 ${
                          !formData.name && currentStep === 1
                            ? "border-blue-400 shadow-sm shadow-blue-100"
                            : ""
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-xs font-semibold text-gray-700 flex items-center"
                      >
                        Phone <span className="text-red-500 ml-0.5">*</span>
                        {!formData.phone && currentStep === 1 && (
                          <span className="ml-1.5 text-[10px] font-normal text-blue-600 animate-pulse">
                            Required
                          </span>
                        )}
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Phone number"
                        className={`h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md transition-all duration-200 ${
                          !formData.phone && currentStep === 1
                            ? "border-blue-400 shadow-sm shadow-blue-100"
                            : ""
                        }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold text-gray-700"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Email address"
                        className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="nbfcName"
                        className="text-xs font-semibold text-gray-700"
                      >
                        NBFC / Lender
                      </Label>
                      <Input
                        id="nbfcName"
                        value={formData.nbfcName}
                        onChange={(e) =>
                          handleInputChange("nbfcName", e.target.value)
                        }
                        placeholder="Lender name"
                        className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>
                <div className="p-3 flex-shrink-0 border-t border-gray-200 bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50">
                  {currentStep === 3 && !isCallActive && (
                    <div className="mb-2 bg-green-50 border border-green-200 rounded-lg p-2 flex items-start space-x-2 animate-in fade-in slide-in-from-bottom duration-500">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 text-xs">
                          Ready!
                        </h4>
                        <p className="text-[10px] text-green-700">
                          Click "Start Call" to begin
                        </p>
                      </div>
                    </div>
                  )}

                  {isOngoingCall ? (
                    <Button
                      disabled
                      className="w-full bg-green-600 text-white shadow-lg animate-pulse h-10 text-xs font-semibold rounded-lg start-call-button"
                      size="sm"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1.5" />
                      Call in Progress...
                    </Button>
                  ) : (
                    <Button
                      onClick={makeCall}
                      disabled={
                        isConnecting ||
                        isCallActive ||
                        !isSystemReady ||
                        !formData.name ||
                        !formData.phone
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-10 text-xs font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] start-call-button"
                      size="sm"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Connecting...
                        </>
                      ) : isCallActive ? (
                        <>
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          In Progress...
                        </>
                      ) : !isSystemReady ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          Start Call
                        </>
                      )}
                    </Button>
                  )}

                  {(!formData.name || !formData.phone) && (
                    <p className="text-[10px] text-center text-gray-500 mt-1.5">
                      Name & Phone required
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Column 2: Loan Details */}
            <div className="flex flex-col loan-details-section">
              <Card className="flex flex-col h-full shadow-lg border border-gray-200 bg-white overflow-hidden">
                <CardHeader className="pb-2 flex-shrink-0 border-b border-gray-200 bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 px-4 py-3">
                  <CardTitle className="flex items-center justify-between text-sm font-bold text-gray-900">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center mr-2 shadow-md">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Loan Details
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const scenarios = [
                          "personal_dpd_15",
                          "smartphone_dpd_25",
                          "twowheeler_dpd_45",
                          "personal_dpd_60",
                          "vitanium_dpd_75",
                          "smartphone_dpd_95",
                          "personal_dpd_105",
                          "personal_dpd_150",
                          "twowheeler_dpd_180",
                        ];
                        const randomScenario =
                          scenarios[
                            Math.floor(Math.random() * scenarios.length)
                          ];
                        fillMockData(randomScenario);
                      }}
                      size="sm"
                      className="h-7 px-3 text-[10px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md rounded-md font-medium generate-button"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                  {currentStep === 2 && !completedSteps.includes(2) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex items-start space-x-2 animate-in fade-in slide-in-from-top duration-500">
                      <HelpCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 text-xs">
                          Fill Loan Info
                        </h4>
                        <p className="text-[10px] text-green-700 mt-0.5">
                          Or click "Generate" for sample data
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="originalAmount"
                          className="text-xs font-semibold text-gray-700"
                        >
                          Original Amount
                        </Label>
                        <Input
                          id="originalAmount"
                          value={formData.originalAmount}
                          onChange={(e) =>
                            handleInputChange("originalAmount", e.target.value)
                          }
                          placeholder="₹0"
                          className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="outstandingAmount"
                          className="text-xs font-semibold text-gray-700"
                        >
                          Outstanding
                        </Label>
                        <Input
                          id="outstandingAmount"
                          value={formData.outstandingAmount}
                          onChange={(e) =>
                            handleInputChange(
                              "outstandingAmount",
                              e.target.value
                            )
                          }
                          placeholder="₹0"
                          className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="emiDueDate"
                          className="text-xs font-semibold text-gray-700"
                        >
                          EMI Due Date
                        </Label>
                        <Input
                          id="emiDueDate"
                          type="date"
                          value={formData.emiDueDate}
                          onChange={(e) =>
                            handleInputChange("emiDueDate", e.target.value)
                          }
                          className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-700">
                          Days Past Due
                        </Label>
                        <div className="p-2 bg-gray-50 rounded-md flex items-center justify-between border border-gray-200 h-9">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5 text-gray-500" />
                            <span className="text-xs text-gray-600">DPD:</span>
                          </div>
                          <Badge
                            variant={
                              dpd > 30
                                ? "destructive"
                                : dpd > 0
                                ? "secondary"
                                : "default"
                            }
                            className="text-[10px] px-1.5 py-0.5 font-medium"
                          >
                            {dpd} days
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="lastPaymentDate"
                          className="text-xs font-semibold text-gray-700"
                        >
                          Last Payment Date
                        </Label>
                        <Input
                          id="lastPaymentDate"
                          type="date"
                          value={formData.lastPaymentDate}
                          onChange={(e) =>
                            handleInputChange("lastPaymentDate", e.target.value)
                          }
                          className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="lastPaymentAmount"
                          className="text-xs font-semibold text-gray-700"
                        >
                          Last Payment
                        </Label>
                        <Input
                          id="lastPaymentAmount"
                          value={formData.lastPaymentAmount}
                          onChange={(e) =>
                            handleInputChange(
                              "lastPaymentAmount",
                              e.target.value
                            )
                          }
                          placeholder="₹0"
                          className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="loanType"
                        className="text-xs font-semibold text-gray-700"
                      >
                        Loan Type
                      </Label>
                      <Select
                        value={formData.loanType}
                        onValueChange={(value) =>
                          handleInputChange("loanType", value)
                        }
                      >
                        <SelectTrigger className="h-9 text-xs border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal Loan" className="text-xs">
                            Personal Loan
                          </SelectItem>
                          <SelectItem
                            value="Smartphone EMI"
                            className="text-xs"
                          >
                            Smartphone EMI
                          </SelectItem>
                          <SelectItem
                            value="2-Wheeler Loan"
                            className="text-xs"
                          >
                            2-Wheeler Loan
                          </SelectItem>
                          <SelectItem value="Business Loan" className="text-xs">
                            Business Loan
                          </SelectItem>
                          <SelectItem value="Home Loan" className="text-xs">
                            Home Loan
                          </SelectItem>
                          <SelectItem value="Car Loan" className="text-xs">
                            Car Loan
                          </SelectItem>
                          <SelectItem
                            value="Education Loan"
                            className="text-xs"
                          >
                            Education Loan
                          </SelectItem>
                          <SelectItem value="Gold Loan" className="text-xs">
                            Gold Loan
                          </SelectItem>
                          <SelectItem value="Credit Card" className="text-xs">
                            Credit Card
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column 3: Call Management & Outcomes */}
            <div className="flex flex-col call-management-section">
              <Card className="flex flex-col h-full shadow-lg border border-gray-200 bg-white overflow-hidden">
                <CardHeader className="pb-2 flex-shrink-0 border-b border-gray-200 bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 px-4 py-3">
                  <CardTitle className="flex items-center justify-between text-sm font-bold text-gray-900">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center mr-2 shadow-md">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-semibold">Call Outcomes</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCallActive && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 font-medium animate-pulse"
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Live
                        </Badge>
                      )}
                      {isLoadingMedia && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 font-medium"
                        >
                          <Loader2 className="w-2.5 h-2.5 mr-0.5 animate-spin" />
                          Loading
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                  {/* Outcomes Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900 flex items-center">
                        <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                        Analysis
                      </h3>
                      {!outcomeData && roomName && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchAnalysisWithRetry(roomName, 1)}
                          disabled={isLoadingMedia}
                          className="h-6 px-2 text-[10px] border-gray-200 hover:bg-gray-50 rounded-md"
                        >
                          {isLoadingMedia ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <BarChart3 className="w-3 h-3 mr-1" />
                          )}
                          Refresh
                        </Button>
                      )}
                      {outcomeData && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://livekitblob.blob.core.windows.net/livekitblob/analysis/${roomName}.json`,
                              "_blank"
                            )
                          }
                          className="h-6 px-2 text-[10px] border-gray-200 hover:bg-gray-50 rounded-md"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>

                    {outcomeData ? (
                      <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-lg p-2 bg-gray-50/50">
                        {Object.entries(outcomeData)
                          .filter(
                            ([key, value]) =>
                              value !== null &&
                              value !== undefined &&
                              value !== ""
                          )
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([questionCode, answer]) => (
                            <div
                              key={questionCode}
                              className="border-l-2 border-blue-400 pl-2 py-1.5 bg-white rounded-md shadow-sm"
                            >
                              <div className="text-[10px] font-semibold text-gray-700 mb-1">
                                {formatQuestion(questionCode)}
                              </div>
                              <div className="text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded-md border">
                                {formatAnswer(String(answer))}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50/50">
                        <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-[10px] font-medium">
                          {roomName
                            ? "Analysis in progress..."
                            : "Analysis will appear after call"}
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="my-3" />

                  {/* Recording Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900 flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                        Recording
                      </h3>
                      {recordingUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(recordingUrl, "_blank")}
                          className="h-6 px-2 text-[10px] border-gray-200 hover:bg-gray-50 rounded-md"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>

                    {recordingUrl ? (
                      <div className="space-y-2">
                        <audio
                          controls
                          className="w-full h-8 rounded-md border border-gray-200 text-xs"
                        >
                          <source src={recordingUrl} type="video/mp4" />
                          Your browser does not support audio.
                        </audio>
                      </div>
                    ) : isCallActive ? (
                      <div className="text-center py-3 text-gray-500 border rounded-lg bg-gray-50/50">
                        <div className="w-4 h-4 mx-auto mb-1.5 opacity-50 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-[10px] font-medium">Recording...</p>
                      </div>
                    ) : (
                      <div className="text-center py-3 text-gray-500 border rounded-lg bg-gray-50/50">
                        <Download className="w-4 h-4 mx-auto mb-1.5 opacity-50" />
                        <p className="text-[10px] font-medium">
                          Recording will appear after call
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator className="my-3" />

                  {/* Transcript Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-900 flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                        Transcript
                      </h3>
                      {transcriptData && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://livekitblob.blob.core.windows.net/livekitblob/transcripts/${roomName}.json`,
                              "_blank"
                            )
                          }
                          className="h-6 px-2 text-[10px] border-gray-200 hover:bg-gray-50 rounded-md"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>

                    {transcriptData &&
                    transcriptData.items &&
                    transcriptData.items.length > 0 ? (
                      <div className="space-y-2 max-h-[280px] overflow-y-auto border rounded-lg p-2 bg-gray-50/50">
                        {transcriptData.items.map((item, index) => (
                          <div
                            key={item.id || index}
                            className={`p-2 rounded-md border-l-2 shadow-sm ${
                              item.role === "assistant"
                                ? "bg-blue-50 border-blue-400"
                                : "bg-green-50 border-green-400"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-semibold">
                                {item.role === "assistant"
                                  ? "Agent"
                                  : "Customer"}
                              </span>
                              {item.interrupted && (
                                <Badge
                                  variant="destructive"
                                  className="text-[9px] px-1 py-0 font-medium"
                                >
                                  Interrupted
                                </Badge>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-700 leading-relaxed">
                              {item.content.join(" ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 text-gray-500 border rounded-lg bg-gray-50/50">
                        <FileText className="w-4 h-4 mx-auto mb-1.5 opacity-50" />
                        <p className="text-[10px] font-medium">
                          Transcript will appear after call
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
