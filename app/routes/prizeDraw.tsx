import { NavLink } from "react-router";
import { useState, useEffect } from "react";

import { api } from "~/lib/api";

export default function PrizeDraw() {
    const [prizeDrawData, setPrizeDrawData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
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
                console.log("Response:", response.data);
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

    useEffect(() => {
        if (prizeDrawData && selectedItem) {
            console.log(
                `selected item: ${selectedItem}, attendees: ${prizeDrawData[selectedItem]}`,
            );
        }
    }, [selectedItem]);

    return (
        <main className="min-h-screen flex flex-col">
            <img src="img/balloons.png" alt="Balloons" />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl md:text-4xl lg:text-6xl mb-12 text-center text-playful">
                    돌잡이 당첨자 추첨
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {prizeDrawData ? (
                        Object.keys(prizeDrawData).map((item) => (
                            <div
                                key={item}
                                className="bg-white rounded-lg shadow p-6 text-center border-blue-500 cursor-pointer hover:scale-110 hover:border hover:border-blue-300 transition duration-300"
                                onClick={() => setSelectedItem(item)}
                            >
                                <img
                                    src={`img/${item}.png`}
                                    alt={itemNames[item]}
                                    className="mx-auto mb-4 h-24"
                                />
                                <h2 className="text-xl font-bold mb-4">
                                    {itemNames[item]}
                                </h2>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            당첨자 정보를 불러오는 중...
                        </p>
                    )}
                </div>
            </div>

            <img
                src="img/balloons_footer.png"
                alt="Balloons"
                className="mt-auto w-full"
            />
        </main>
    );
}
