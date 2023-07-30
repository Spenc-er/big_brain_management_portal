import Head from "next/head";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, type DocumentSnapshot } from "firebase/firestore";
import { useState, useEffect, useRef, type MutableRefObject } from "react";
import * as XLSX from "xlsx"; // Import the xlsx library
import Nav from "../../components/navbar";
import Chart from "chart.js/auto";
import { ChartType } from 'chart.js';


interface GameData {
  sport_hour: number;
  screen_hour: number;
  game_level: string;
  mood: number;
  game_difficulty: string;
  game_time: string;
  name: string;
  sleep_quality: number;
}

interface UserData {
  age: string;
  education: string;
  email: string;
  gameData: GameData;
  bmi: string;
  gender: string;
}

interface ChartData {
  data: number;
  total: number;
}

export default function Home() {
  const firebaseConfig = {
    apiKey: "AIzaSyC9Pzo_um3NJBTR4PX81HG7R9XzGLgZfW8",
    authDomain: "bigbran-62b09.firebaseapp.com",
    projectId: "bigbran-62b09",
    storageBucket: "bigbran-62b09.appspot.com",
    messagingSenderId: "776782980237",
    appId: "1:776782980237:web:40d9cf3009e93326bdaec4"
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
  const db = getFirestore();

  const [usersDataNumberMemory, setUsersDataNumberMemory] = useState<UserData[]>([]);
  const [moodData, setMoodData] = useState<ChartData[]>([]);
  const [sleepData, setSleepData] = useState<ChartData[]>([]);
  const [sportData, setSportData] = useState<ChartData[]>([]);
  const [screenData, setScreenData] = useState<ChartData[]>([]);

  useEffect(() => {

    const loadasync = async () => {

      const querySnapshot = await getDocs(collection(db, "users"));
      const userDataArray: UserData[] = [];
      const charDataArray: ChartData[] = [];
      const sleepArray: ChartData[] = [];
      const sportArray: ChartData[] = [];
      const screenArray: ChartData[] = [];
      const moodTotal = 1;
      const sleepTotal = 1;
      const sportTotal = 1;
      const screenTotal = 1;
      querySnapshot?.forEach((doc: DocumentSnapshot) => {
        const userData = doc.data() as UserData;
        if (userData.gameData.name === "Audio Memory") {
          userDataArray.push(userData);
          const num: number = +userData.gameData.game_level - 1;
          if (!!charDataArray[num]) {
            charDataArray[num]!.data += userData.gameData.mood;
            charDataArray[num]!.total += 1;

          }
          else
            charDataArray[num] = { data: userData.gameData.mood, total: moodTotal }
          if (!!sleepArray[num]) {
            sleepArray[num]!.data += userData.gameData.sleep_quality;
            sleepArray[num]!.total += 1;

          }
          else
            sleepArray[num] = { data: userData.gameData.sleep_quality, total: sleepTotal }
          if (!!sportArray[num]) {
            sportArray[num]!.data += userData.gameData.sport_hour;
            sportArray[num]!.total += 1;

          }
          else
            sportArray[num] = { data: userData.gameData.sport_hour, total: sportTotal }
          if (!!screenArray[num]) {
            screenArray[num]!.data += userData.gameData.screen_hour;
            screenArray[num]!.total += 1;

          }
          else
            screenArray[num] = { data: userData.gameData.screen_hour, total: screenTotal }
        }

      });

      setUsersDataNumberMemory(userDataArray);
      setMoodData(charDataArray);
      setSleepData(sleepArray);
      setSportData(sportArray);
      setScreenData(screenArray);
    };
    loadasync().then(() => { return },
      () => { return },);
  }, [db]);

  // Function to export data as Excel
  const exportToExcel = () => {
    const flattenedData = usersDataNumberMemory.map((userData) => {
      const { gameData, ...rest } = userData;
      return { ...rest, ...gameData };
    });
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserData");
    XLSX.writeFile(workbook, "number_memory_data.xlsx");
  };
  const canvasEl = useRef() as MutableRefObject<HTMLCanvasElement>;
  const canvasEl2 = useRef() as MutableRefObject<HTMLCanvasElement>;
  const canvasEl3 = useRef() as MutableRefObject<HTMLCanvasElement>;
  const canvasEl4 = useRef() as MutableRefObject<HTMLCanvasElement>;
  const colors = {
    purple: {
      default: "rgba(149, 76, 233, 1)",
      half: "rgba(149, 76, 233, 0.5)",
      quarter: "rgba(149, 76, 233, 0.25)",
      zero: "rgba(149, 76, 233, 0)"
    },
    indigo: {
      default: "rgba(80, 102, 120, 1)",
      quarter: "rgba(80, 102, 120, 0.25)"
    }
  };
  Chart.defaults.font.size = 20;
  useEffect(() => {
    const ctx = canvasEl.current.getContext("2d");
    // const ctx = document.getElementById("myChart");

    const gradient = ctx?.createLinearGradient(0, 16, 0, 600);
    gradient?.addColorStop(0, colors.purple.half);
    gradient?.addColorStop(0.65, colors.purple.quarter);
    gradient?.addColorStop(1, colors.purple.zero);

    const weight = moodData.map((data) => data.data / data.total);

    const labels = [
      "level 1",
      "level 2",
      "level 3",
      "level 4",
      "level 5",
      "level 6",
      "level 7",
      "level 8",
      "level 9",
      "level 10",
      "level 11",
      "level 12",
      "level 13",
      "level 14",
      "level 15",
      "level 16",
      "level 17",
      "level 18",
      "level 19",
      "level 20"
    ];
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Average Mood agaisnt Game Level",
          data: weight,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3
        }
      ]
    };
    const lineChartType: ChartType = "bar";
    const config = {
      type: lineChartType,
      data: data,
    };
    let myLineChart: Chart;
    if (ctx) {
      myLineChart = new Chart(ctx, config);
    }


    return function cleanup() {
      myLineChart.destroy();
    };
  });


  useEffect(() => {
    const ctx = canvasEl2.current.getContext("2d");
    // const ctx = document.getElementById("myChart");

    const gradient = ctx?.createLinearGradient(0, 16, 0, 600);
    gradient?.addColorStop(0, colors.purple.half);
    gradient?.addColorStop(0.65, colors.purple.quarter);
    gradient?.addColorStop(1, colors.purple.zero);

    const weight = sleepData.map((data) => data.data / data.total);

    const labels = [
      "level 1",
      "level 2",
      "level 3",
      "level 4",
      "level 5",
      "level 6",
      "level 7",
      "level 8",
      "level 9",
      "level 10",
      "level 11",
      "level 12",
      "level 13",
      "level 14",
      "level 15",
      "level 16",
      "level 17",
      "level 18",
      "level 19",
      "level 20"
    ];
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Average Sleep Quality agaisnt Game Level",
          data: weight,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3
        }
      ]
    };
    const lineChartType: ChartType = "bar";
    const config = {
      type: lineChartType,
      data: data
    };
    let myLineChart: Chart;
    if (ctx) {
      myLineChart = new Chart(ctx, config);
    }


    return function cleanup() {
      myLineChart.destroy();
    };
  });
  useEffect(() => {
    const ctx = canvasEl3.current.getContext("2d");
    // const ctx = document.getElementById("myChart");

    const gradient = ctx?.createLinearGradient(0, 16, 0, 600);
    gradient?.addColorStop(0, colors.purple.half);
    gradient?.addColorStop(0.65, colors.purple.quarter);
    gradient?.addColorStop(1, colors.purple.zero);

    const weight = sportData.map((data) => data.data / data.total);

    const labels = [
      "level 1",
      "level 2",
      "level 3",
      "level 4",
      "level 5",
      "level 6",
      "level 7",
      "level 8",
      "level 9",
      "level 10",
      "level 11",
      "level 12",
      "level 13",
      "level 14",
      "level 15",
      "level 16",
      "level 17",
      "level 18",
      "level 19",
      "level 20"
    ];
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Average Sport Hour agaisnt Game Level",
          data: weight,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3
        }
      ]
    };
    const lineChartType: ChartType = "bar";
    const config = {
      type: lineChartType,
      data: data
    };
    let myLineChart: Chart;
    if (ctx) {
      myLineChart = new Chart(ctx, config);
    }


    return function cleanup() {
      myLineChart.destroy();
    };
  });
  useEffect(() => {
    const ctx = canvasEl4.current.getContext("2d");
    // const ctx = document.getElementById("myChart");

    const gradient = ctx?.createLinearGradient(0, 16, 0, 600);
    gradient?.addColorStop(0, colors.purple.half);
    gradient?.addColorStop(0.65, colors.purple.quarter);
    gradient?.addColorStop(1, colors.purple.zero);

    const weight = screenData.map((data) => data.data / data.total);

    const labels = [
      "level 1",
      "level 2",
      "level 3",
      "level 4",
      "level 5",
      "level 6",
      "level 7",
      "level 8",
      "level 9",
      "level 10",
      "level 11",
      "level 12",
      "level 13",
      "level 14",
      "level 15",
      "level 16",
      "level 17",
      "level 18",
      "level 19",
      "level 20"
    ];
    const data = {
      labels: labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Average Screen Hour agaisnt Game Level",
          data: weight,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3
        }
      ]
    };
    const lineChartType: ChartType = "bar";
    const config = {
      type: lineChartType,
      data: data
    };
    let myLineChart: Chart;
    if (ctx) {
      myLineChart = new Chart(ctx, config);
    }


    return function cleanup() {
      myLineChart.destroy();
    };
  });
  return (
    <>
      <Head>
        <title>BigBrain</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav />
        <div className="flex flex-col items-end gap-12 px-4 py-4">
          {/* Move the export button to the top right */}

          <button
            className="flex-row text-5xl font-extrabold tracking-tight sm:text-[3rem] bg-[hsl(280,100%,70%)] hover:bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold py-2 px-4 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80  text-center inline-flex items-center disabled:opacity-25 rounded"
            onClick={exportToExcel}
            disabled={usersDataNumberMemory.length < 1}
          >
            <svg className="w-12 h-12 text-white pr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
            </svg>
            EXPORT
          </button>
        </div>
        <canvas id="myChart" ref={canvasEl} height="100" className={moodData.length > 1 ? "pb-20" : "invisible"} />
        <canvas id="myChart" ref={canvasEl2} height="100" className={sleepData.length > 1 ? "pb-20" : "invisible"} />
        <canvas id="myChart" ref={canvasEl3} height="100" className={sportData.length > 1 ? "pb-20" : "invisible"} />
        <canvas id="myChart" ref={canvasEl4} height="100" className={screenData.length > 1 ? "pb-20" : "invisible"} />
      </main>

    </>

  );
}
