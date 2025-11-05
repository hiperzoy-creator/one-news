import { axiosInstance } from "@/axios/axiosConfig" 
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search, CalendarIcon } from "lucide-react"
import { getVisiblePages } from "@/lib/visiblePage"

interface getAllNews {
    title: string
    link: string
    snippet: string
    imageUrl?: string
    pubDate: Date
}

interface Meta {
    total: number;
    page: number;
    limit: number;
}

const NewsFeed = () => {
    const [news, setNews] = useState<getAllNews[]>([])
    const [loading, setLoading] = useState(false)
    const [sourceId, setSourceId] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<Meta | null>(null);

    const sourceBadges: Record<number, { name: string; color: string }> = {
        1: { name: "Sindonews", color: "bg-blue-500" },
        2: { name: "Viva", color: "bg-red-500" },
        3: { name: "Okezone", color: "bg-green-500" },
        4: { name: "Antaranews", color: "bg-orange-500" },
        5: { name: "Cnbc", color: "bg-purple-500" },
        7: { name: "Cnn", color: "bg-gray-600" },
        8: { name: "Idx", color: "bg-yellow-500" },
        9: { name: "Tempo", color: "bg-purple-500" },
    };

    const sources = [
        { id: 1, name: "Sindonews" },
        { id: 2, name: "Viva" },
        { id: 3, name: "Okezone" },
        { id: 4, name: "Antaranews" },
        { id: 5, name: "Cnbc" },
        { id: 7, name: "Cnn" },
        { id: 8, name: "Idx"},
        { id: 9, name: "Tempo" }
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
        setDebouncedSearch(search)
        setPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const fetchNews = async () => {
        setLoading(true)
        try {

            const params: Record<string, any> = {}

            if (debouncedSearch) params.search = debouncedSearch
            if (page) params.page = page
            if (sourceId !== null) params.sourceId = sourceId
            if (selectedDate) {
                const local = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
                params.date = local.toISOString().split("T")[0]
            }

            const result = await axiosInstance.get("/news", {
                params
            })
            setNews(result.data.data);
            setMeta(result.data.meta);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
        
    }
    useEffect(() => {
        fetchNews()
    },[sourceId, selectedDate, page, debouncedSearch])

    const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

    return (
        <section className="max-w-7xl mx-auto px-4 md:border-x py-3">

            <div className="w-full relative flex my-3">
                <Input
                    type="text"
                    value={search}
                    className="px-7 focus:ring-red-500"
                    placeholder="cari berita..." 
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search
                    width={16}
                    className="absolute left-2 top-1.5 text-gray-600"
                />
            </div>
                
            <div className="flex justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={sourceId === null ? "default" : "outline"}
                        onClick={() => { setSourceId(null); setPage(1)} }
                        className={
                            sourceId === null
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "border-gray-300 text-gray-700 hover:border-red-400"
                        }
                    >
                        Semua
                    </Button>

                    {sources.map((src) => (
                    <Button
                        key={src.id}
                        variant={sourceId === src.id ? "default" : "outline"}
                        onClick={() => {setSourceId(src.id); setPage(1)}}
                        className={
                        sourceId === src.id
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "border-gray-300 text-gray-700 hover:border-red-400"
                        }
                    >
                        {src.name}
                    </Button>
                    ))}
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        >
                        <CalendarIcon className="w-4 h-4" />
                        {selectedDate
                            ? selectedDate.toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            : "Filter Tanggal"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-3">
                        <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => {setSelectedDate(date || null); setPage(1)}}
                        />
                        <div className="flex justify-end mt-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedDate(null)}
                        >
                            Reset
                        </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            
            {loading ? (
            <div className="flex justify-center items-center h-64">
                <Spinner className="w-10 h-10 text-red-600 animate-spin" />
            </div>
            ) : Array.isArray(news) && news.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
               {news.map((item, index) => {
                const source = sourceBadges[(item as any).sourceId];
                return (
                    <div
                    key={index}
                    className="bg-white h-full rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 text-sm flex flex-col"
                    >
                    <div className="relative">
                        <img
                        src={item.imageUrl || "/imagenotfound.jpg"}
                        alt={item.title}
                        className="h-36 w-full object-cover"
                        />
                        {source && (
                        <span
                            className={`absolute top-2 left-2 ${source.color} text-white text-xs font-semibold px-2 py-1 rounded-full shadow`}
                        >
                            {source.name}
                        </span>
                        )}
                    </div>

                    <div className="p-3 flex flex-col flex-1 justify-between">
                        <div>
                        <h3 className="text-base font-semibold text-gray-800 hover:text-red-600 line-clamp-2 mb-1">
                            <a href={item.link} target="_blank" rel="noreferrer">
                            {item.title}
                            </a>
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-3 mb-2">
                            {item.snippet || "Tidak ada deskripsi"}
                        </p>
                        </div>

                        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mt-2">
                        <span>
                            {new Date(item.pubDate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            })}
                        </span>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-500 hover:text-red-700 font-medium"
                        >
                            Baca →
                        </a>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            ) : (
            <p className="text-center text-gray-500 mt-10">
                Tidak ada berita ditemukan
            </p>
            )}
            {meta && (
            <div className="flex flex-col items-center gap-4 mt-6">
                <div className="flex justify-center gap-2 flex-wrap items-center">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    variant="outline"
                >
                    Sebelumnya
                </Button>

                {getVisiblePages(totalPages, page).map((p, i) =>
                    p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-500">
                        ...
                    </span>
                    ) : (
                    <Button
                        key={p}
                        onClick={() => setPage(Number(p))}
                        variant="outline"
                        className={
                        page === p
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "border-gray-300 text-gray-700 hover:border-red-400"
                        }
                    >
                        {p}
                    </Button>
                    )
                )}

                <Button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    variant="outline"
                >
                    Selanjutnya
                </Button>
                </div>
            </div>
        )}
        </section>  
    );
}


export default NewsFeed

