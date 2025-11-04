import Header from "@/components/custom/Header"
import { Construction, AlertTriangle } from "lucide-react"

const CommunityPage = () => {
    return (
        <>
            <Header />
            <section className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
                <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Construction className="w-20 h-20 text-yellow-500 animate-pulse" />
                    <AlertTriangle className="absolute -top-3 -right-3 w-6 h-6 text-red-500 animate-bounce" />
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Halaman Sedang Dalam Pengembangan
                </h1>
                <p className="text-gray-600 max-w-md">
                    Maaf, fitur komunitas masih dalam proses pembangunan. Kami sedang
                    menyiapkan page ini agar siap dipakai.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                    Mohon maaf atas ketidaknyamanannya!
                </p>
                </div>
            </section>
        </>
    )
}

export default CommunityPage
