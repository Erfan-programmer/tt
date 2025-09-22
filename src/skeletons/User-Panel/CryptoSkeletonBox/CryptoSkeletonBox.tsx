export default function CryptoSkeletonBox() {
    return (
        <div className="w-auto bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse flex  justify-center items-center p-2">
            <div className="flex items-center gap-0 mb-2">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600  rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            <div className="flex justify-center items-center">
                <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-12 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    );
}