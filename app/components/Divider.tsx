export default function FloralDivider() {
    return (
        <div className="flex items-center justify-center gap-3 mt-2 mb-6">
            <span className="h-px w-full bg-gradient-to-r from-transparent via-pink-300 to-pink-400"></span>
            <span className="text-pink-400 text-lg">✿</span>
            <span className="h-px w-full bg-gradient-to-l from-transparent via-blue-300 to-blue-400"></span>
        </div>
    )
}