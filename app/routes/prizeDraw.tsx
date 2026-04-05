import { useState, useEffect } from "react";

import { api } from "~/lib/api";
import LadderGame from "~/components/LadderGame";

type PrizeDrawData = Record<string, string[]>;

export default function PrizeDraw() {
    const [prizeDrawData, setPrizeDrawData] = useState<PrizeDrawData | null>(
        null,
    );
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [stage, setStage] = useState<"select" | "customize" | "draw">(
        "select",
    );
    const [customNamesText, setCustomNamesText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [participants, setParticipants] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);

    const itemNames: { [key: string]: string } = {
        pen: "펜",
        microphone: "마이크",
        stethoscope: "청진기",
        mouse: "마우스",
        money: "돈",
        ball: "공",
    };

    useEffect(() => {
        const fetchPrizeDrawData = async () => {
            try {
                const response = await api.get("/prize-draw");
                // console.log("Response:", response.data);
                if (!response.data.success) {
                    console.error("API Error:", response.data.message);
                    return;
                }
                setPrizeDrawData(response.data.data);
            } catch (error) {
                console.error("Error fetching prize draw data:", error);
            }
        };

        fetchPrizeDrawData();
    }, []);

    const handleSelectItem = (item: string) => {
        if (!prizeDrawData) return;

        setSelectedItem(item);
        setCustomNamesText((prizeDrawData[item] ?? []).join("\n"));
        setErrorMessage("");
        setStage("customize");
    };

    const handleStartDraw = () => {
        if (!selectedItem || !prizeDrawData) return;

        const manualNames = customNamesText
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
        const participantList = manualNames.length
            ? manualNames
            : (prizeDrawData[selectedItem] ?? []);

        if (participantList.length === 0) {
            setErrorMessage("참가자 이름을 한 명 이상 입력해 주세요.");
            return;
        }

        setParticipants(participantList);
        setErrorMessage("");
        setWinner(null);
        setStage("draw");
    };

    const handleCustomizeBack = () => {
        setStage("select");
        setErrorMessage("");
    };

    const handleWinnerSelected = (winnerName: string) => {
        setWinner(winnerName);
    };

    const getStageTitle = () => {
        if (stage === "select") return "아이템을 선택하세요";
        if (stage === "customize") return "참가자 이름를 확인하세요";
        return "당첨자 추첨";
    };

    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-sky-100">
            <img src="img/balloons.png" alt="Balloons" className="w-full" />
            <div className="container mx-auto py-8 px-4 flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-6xl mb-8 text-center text-playful">
                    돌잡이 당첨자 추첨
                </h1>
                <div className="mb-8 text-center">
                    <p className="text-xl text-gray-700">{getStageTitle()}</p>
                </div>

                {stage === "select" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {prizeDrawData ? (
                            Object.keys(prizeDrawData).map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleSelectItem(item)}
                                    className="bg-white rounded-3xl shadow-xl p-6 text-center border border-cyan-200 hover:scale-105 hover:border-cyan-400 transition duration-300 cursor-pointer"
                                >
                                    <img
                                        src={`img/${item}.png`}
                                        alt={itemNames[item]}
                                        className="mx-auto mb-4 h-24"
                                    />
                                    <h2 className="text-2xl font-bold text-formal">
                                        {itemNames[item]}
                                    </h2>
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                당첨자 정보를 불러오는 중...
                            </p>
                        )}
                    </div>
                )}

                {stage === "customize" && selectedItem && (
                    <div className="mx-auto max-w-3xl space-y-6">
                        <div className="rounded-3xl bg-white p-6 shadow-xl border border-cyan-100">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-3 rounded-3xl bg-sky-100 px-4 py-3">
                                        <img
                                            src={`img/${selectedItem}.png`}
                                            alt={itemNames[selectedItem]}
                                            className="h-16"
                                        />
                                        <span className="text-2xl font-bold">
                                            {itemNames[selectedItem]}
                                        </span>
                                    </div>
                                </div>

                                <label className="block text-lg font-medium text-formal">
                                    참가자 목록
                                </label>
                                <textarea
                                    value={customNamesText}
                                    onChange={(event) =>
                                        setCustomNamesText(event.target.value)
                                    }
                                    rows={6}
                                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-formal outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                                />

                                {errorMessage && (
                                    <p className="rounded-3xl bg-red-100 px-4 py-3 text-red-700">
                                        {errorMessage}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row justify-center">
                            <button
                                type="button"
                                onClick={handleCustomizeBack}
                                className="rounded-3xl border border-slate-300 bg-white px-8 py-3 text-lg font-semibold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
                            >
                                뒤로가기
                            </button>
                            <button
                                type="button"
                                onClick={handleStartDraw}
                                className="rounded-3xl bg-cyan-500 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:bg-indigo-600 transition duration-300 cursor-pointer"
                            >
                                시작하기
                            </button>
                        </div>
                    </div>
                )}

                {stage === "draw" && selectedItem && (
                    <div className="mx-auto w-full space-y-6">
                        <div className="rounded-3xl bg-white p-4 shadow-xl border border-cyan-100">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p className="text-3xl font-bold text-formal">
                                        {itemNames[selectedItem]}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-6 shadow-xl border border-cyan-100">
                            <LadderGame
                                participants={participants}
                                onWinnerSelected={handleWinnerSelected}
                            />
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row justify-center">
                            <button
                                type="button"
                                onClick={handleCustomizeBack}
                                className="rounded-3xl border border-slate-300 bg-white px-8 py-3 text-lg font-semibold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
                            >
                                나가기
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <img
                src="img/balloons_footer.png"
                alt="Balloons"
                className="mt-auto w-full"
            />
        </main>
    );
}
