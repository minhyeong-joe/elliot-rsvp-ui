import { useState, useEffect } from "react";

interface LadderGameProps {
    participants: string[];
    onWinnerSelected: (winner: string) => void;
}

type LadderBranches = Array<Array<[number, number]>>;
type LadderPath = number[];

export default function LadderGame({
    participants,
    onWinnerSelected,
}: LadderGameProps) {
    const LADDER_ROWS = 8;
    const CELL_WIDTH = 100;
    const ROW_HEIGHT = 50;

    interface ResultNode {
        playerIndex: number;
        playerName: string;
        result: string;
        revealed: boolean;
    }

    const [ladderBranches, setLadderBranches] = useState<LadderBranches>([]);
    const [paths, setPaths] = useState<LadderPath[]>([]);
    const [endPositions, setEndPositions] = useState<number[]>([]);
    const [resultsByPosition, setResultsByPosition] = useState<
        (ResultNode | null)[]
    >([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number | null>(
        null,
    );
    const [revealedResults, setRevealedResults] = useState<boolean[]>([]);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [winnerName, setWinnerName] = useState<string | null>(null);
    const [showWinnerBanner, setShowWinnerBanner] = useState(false);

    // Generate ladder structure and paths
    const generateLadder = () => {
        const branches: LadderBranches = [];
        for (let row = 0; row < LADDER_ROWS; row++) {
            const rowBranches: Array<[number, number]> = [];
            for (let col = 0; col < participants.length - 1; col++) {
                if (Math.random() > 0.5) {
                    rowBranches.push([col, col + 1]);
                    col++;
                }
            }
            branches.push(rowBranches);
        }
        setLadderBranches(branches);

        const calculatedPaths: LadderPath[] = participants.map(
            (_, startCol) => {
                const path: number[] = [startCol];
                let currentCol = startCol;

                for (let row = 0; row < LADDER_ROWS; row++) {
                    let branchTarget: number | null = null;
                    for (const [col1, col2] of branches[row]) {
                        if (col1 === currentCol) {
                            branchTarget = col2;
                        } else if (col2 === currentCol) {
                            branchTarget = col1;
                        }
                    }

                    if (branchTarget !== null) {
                        currentCol = branchTarget;
                    }

                    path.push(currentCol);
                }
                return path;
            },
        );
        setPaths(calculatedPaths);

        const newEndPositions = calculatedPaths.map(
            (path) => path[LADDER_ROWS],
        );
        setEndPositions(newEndPositions);

        const winningCol = Math.floor(Math.random() * participants.length);

        // console.log("Winning column:", winningCol);

        const newResultsByPosition: (ResultNode | null)[] = new Array(
            participants.length,
        ).fill(null);

        for (let col = 0; col < participants.length; col++) {
            const result = col === winningCol ? "당첨" : "꽝";

            const playerAtCol = newEndPositions.findIndex(
                (endCol) => endCol === col,
            );

            newResultsByPosition[col] = {
                playerIndex: playerAtCol >= 0 ? playerAtCol : -1,
                playerName:
                    playerAtCol >= 0 ? participants[playerAtCol] : "Empty",
                result,
                revealed: false,
            };
        }

        setResultsByPosition(newResultsByPosition);
        setRevealedResults(new Array(participants.length).fill(false));
        setCurrentPlayerIndex(null);
        setWinnerName(null);
        setShowWinnerBanner(false);
        setAnimationProgress(0);
    };

    // Initialize ladder structure and paths
    useEffect(() => {
        generateLadder();
    }, [participants]);

    // Animation
    useEffect(() => {
        if (
            paths.length === 0 ||
            currentPlayerIndex === null ||
            currentPlayerIndex >= participants.length ||
            showWinnerBanner
        ) {
            return;
        }

        const stepDuration = 300;

        if (animationProgress < LADDER_ROWS) {
            const timer = setTimeout(() => {
                setAnimationProgress(animationProgress + 1);
            }, stepDuration);
            return () => clearTimeout(timer);
        }

        if (!revealedResults[currentPlayerIndex]) {
            const timer = setTimeout(() => {
                const newRevealed = [...revealedResults];
                newRevealed[currentPlayerIndex] = true;
                setRevealedResults(newRevealed);

                const endCol = endPositions[currentPlayerIndex];
                const nodeAtEndCol = resultsByPosition[endCol];
                if (nodeAtEndCol) {
                    const newResultsByPosition = [...resultsByPosition];
                    newResultsByPosition[endCol] = {
                        ...nodeAtEndCol,
                        revealed: true,
                    };
                    setResultsByPosition(newResultsByPosition);
                    setCurrentPlayerIndex(null);

                    if (nodeAtEndCol.result === "당첨") {
                        // Winner found! Show banner
                        setWinnerName(nodeAtEndCol.playerName);
                        setShowWinnerBanner(true);
                        return;
                    }
                }
            }, stepDuration);
            return () => clearTimeout(timer);
        }
    }, [
        animationProgress,
        currentPlayerIndex,
        paths,
        participants,
        showWinnerBanner,
        revealedResults,
        endPositions,
        resultsByPosition,
    ]);

    useEffect(() => {
        if (showWinnerBanner && winnerName) {
            // console.log("Winner selected:", winnerName);
            onWinnerSelected(winnerName);
        }
    }, [showWinnerBanner, winnerName, onWinnerSelected]);

    if (paths.length === 0 || ladderBranches.length === 0) {
        return (
            <div className="text-center py-8 text-lg">
                사다리 게임 준비 중...
            </div>
        );
    }

    const canvasWidth = participants.length * CELL_WIDTH;
    const canvasHeight = (LADDER_ROWS + 1) * ROW_HEIGHT;

    // Get current player's path
    const currentPath =
        currentPlayerIndex !== null && currentPlayerIndex < paths.length
            ? paths[currentPlayerIndex]
            : [];
    const currentCol =
        currentPath[Math.min(animationProgress, LADDER_ROWS)] ?? 0;

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div
                className="grid gap-1"
                style={{
                    gridTemplateColumns: `repeat(${participants.length}, 1fr)`,
                    width: `${canvasWidth}px`,
                }}
            >
                {participants.map((name, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (
                                currentPlayerIndex === null &&
                                !showWinnerBanner
                            ) {
                                setCurrentPlayerIndex(idx);
                                setAnimationProgress(0);
                            }
                        }}
                        disabled={
                            currentPlayerIndex !== null || showWinnerBanner
                        }
                        className={`text-center px-1 py-2 rounded text-xs font-semibold transition break-words cursor-pointer ${
                            idx === currentPlayerIndex
                                ? "bg-red-500 text-white animate-pulse"
                                : winnerName && winnerName === name
                                  ? "bg-green-500 text-white"
                                  : revealedResults[idx]
                                    ? "bg-gray-300 text-gray-700"
                                    : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                        } ${
                            currentPlayerIndex === null && !showWinnerBanner
                                ? "cursor-pointer"
                                : "cursor-not-allowed opacity-75"
                        }`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Ladder SVG Canvas */}
            <div
                className="flex justify-center rounded-xl"
                style={{ width: `${canvasWidth}px` }}
            >
                <svg width={canvasWidth} height={canvasHeight}>
                    {Array.from({ length: LADDER_ROWS + 1 }).map((_, row) => (
                        <g key={`row-${row}`}>
                            {Array.from({
                                length: participants.length,
                            }).map((_, col) => (
                                <line
                                    key={`vert-${row}-${col}`}
                                    x1={col * CELL_WIDTH + CELL_WIDTH / 2}
                                    y1={row * ROW_HEIGHT}
                                    x2={col * CELL_WIDTH + CELL_WIDTH / 2}
                                    y2={(row + 1) * ROW_HEIGHT}
                                    stroke="#333"
                                    strokeWidth="2"
                                />
                            ))}

                            {row < LADDER_ROWS &&
                                ladderBranches[row].map(([col1, col2], idx) => (
                                    <line
                                        key={`horiz-${row}-${idx}`}
                                        x1={col1 * CELL_WIDTH + CELL_WIDTH / 2}
                                        y1={(row + 0.5) * ROW_HEIGHT}
                                        x2={col2 * CELL_WIDTH + CELL_WIDTH / 2}
                                        y2={(row + 0.5) * ROW_HEIGHT}
                                        stroke="#666"
                                        strokeWidth="2"
                                    />
                                ))}
                        </g>
                    ))}

                    {currentPlayerIndex !== null &&
                        currentPlayerIndex < participants.length &&
                        animationProgress > 0 &&
                        Array.from({ length: animationProgress }).map(
                            (_, step) => {
                                const y1 = step * ROW_HEIGHT;
                                const y2 = (step + 0.5) * ROW_HEIGHT;
                                const y3 = (step + 1) * ROW_HEIGHT;

                                const col1 = currentPath[step] ?? 0;
                                const col2 = currentPath[step + 1] ?? col1;

                                return (
                                    <g key={`trace-${step}`}>
                                        <line
                                            x1={
                                                col1 * CELL_WIDTH +
                                                CELL_WIDTH / 2
                                            }
                                            y1={y1}
                                            x2={
                                                col1 * CELL_WIDTH +
                                                CELL_WIDTH / 2
                                            }
                                            y2={y2}
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                        />
                                        {col1 !== col2 && (
                                            <line
                                                x1={
                                                    col1 * CELL_WIDTH +
                                                    CELL_WIDTH / 2
                                                }
                                                y1={y2}
                                                x2={
                                                    col2 * CELL_WIDTH +
                                                    CELL_WIDTH / 2
                                                }
                                                y2={y2}
                                                stroke="#ef4444"
                                                strokeWidth="3"
                                            />
                                        )}
                                        <line
                                            x1={
                                                col2 * CELL_WIDTH +
                                                CELL_WIDTH / 2
                                            }
                                            y1={y2}
                                            x2={
                                                col2 * CELL_WIDTH +
                                                CELL_WIDTH / 2
                                            }
                                            y2={y3}
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                        />
                                    </g>
                                );
                            },
                        )}
                </svg>
            </div>

            <div
                className="grid gap-0"
                style={{
                    gridTemplateColumns: `repeat(${participants.length}, 1fr)`,
                    width: `${canvasWidth}px`,
                }}
            >
                {resultsByPosition.map((node, colIdx) => (
                    <div
                        key={colIdx}
                        className="flex-1 h-16 flex items-center justify-center rounded-lg text-lg font-bold bg-white transition-all"
                    >
                        {node && node.revealed ? (
                            <span
                                className={`text-center font-bold ${
                                    node.result === "당첨"
                                        ? "text-green-600 animate-bounce text-2xl"
                                        : "text-red-600 text-xl"
                                }`}
                            >
                                {node.result}
                            </span>
                        ) : (
                            <span className="text-3xl text-gray-300">?</span>
                        )}
                    </div>
                ))}
            </div>

            {showWinnerBanner && winnerName && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    onClick={() => {
                        setShowWinnerBanner(false);
                    }}
                >
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-bounce">
                        <h2 className="text-4xl font-bold text-green-600 mb-4">
                            {winnerName}
                        </h2>
                        <p className="text-3xl font-semibold text-formal">
                            님이 당첨되셨습니다!
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={generateLadder}
                className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition cursor-pointer"
            >
                <i className="fa-solid fa-shuffle"></i> 재생성
            </button>
        </div>
    );
}
