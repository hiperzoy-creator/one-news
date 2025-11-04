import { axiosInstance } from "@/axios/axiosConfig";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search } from "lucide-react";
import { getVisiblePages } from "@/lib/visiblePage";

interface DocumentData {
    id: number;
    title: string;
    link: string;
    category: string;
    date: string;
    companyCode: string;
    company: {
        code: string;
        name: string;
    };
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const DocumentFeed = () => {
    const [documents, setDocuments] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [companyCode, setCompanyCode] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<{ code: string; name: string }[]>([]);
    const [yearFilter, setYearFilter] = useState("2021");

    const fetchCompanySuggestions = async (search: string) => {
        try {
        if (!search.trim()) {
            setSuggestions([]);
            return;
        }

        const res = await axiosInstance.get("/document/company", { params: { search } });
        setSuggestions(res.data.data || []);
        } catch (error) {
        console.error("Error fetching company suggestions:", error);
        }
    };

    const fetchDocuments = async () => {
        setLoading(true);
        try {
        const params: Record<string, any> = { page };
        if (companyCode) params.companyCode = companyCode;
        if (yearFilter) params.date = Number(yearFilter) + 1;

        const res = await axiosInstance.get("/document", { params });
        setDocuments(res.data.data || []);
        setPagination(res.data.pagination || null);
        } catch (error) {
        console.error("Error fetching documents:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [page, yearFilter]);

    const totalPages = pagination?.totalPages || 1;

    const handleSelectCompany = (code: string) => {
        setCompanyCode(code);
        setShowSuggestions(false);
    };

    const years = ["2021", "2022", "2023", "2024", "2025"];

    return (
        <section className="max-w-7xl mx-auto px-4 md:border-x py-3">
            <div className="flex flex-col md:flex-row gap-3 my-3">

                <div className="relative w-full md:w-1/3">
                <Input
                    type="text"
                    value={companyCode}
                    placeholder="Masukkan Company Code (contoh: AALI)"
                    className="pl-7 focus:ring-red-500 uppercase"
                    onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setCompanyCode(val);
                    setShowSuggestions(true);
                    fetchCompanySuggestions(val);
                    }}
                />
                <Building2 width={16} className="absolute left-2 top-1.5 text-gray-600" />

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute bg-white border border-gray-200 rounded-md shadow-md mt-1 w-full z-50 max-h-40 overflow-y-auto">
                    {suggestions.map((company) => (
                        <div
                        key={company.code}
                        className="px-3 py-2 hover:bg-red-50 cursor-pointer text-sm"
                        onClick={() => handleSelectCompany(company.code)}
                        >
                        <span className="font-semibold">{company.code}</span>
                        </div>
                    ))}
                    </div>
                )}
                </div>

                <Button
                variant="default"
                className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2 cursor-pointer"
                onClick={() => {
                    setPage(1);
                    fetchDocuments();
                }}
                >
                <Search className="w-4 h-4" /> Cari
                </Button>

                <div className="flex gap-4 items-center">
                {years.map((year) => (
                    <label key={year} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input
                        type="radio"
                        name="year"
                        value={year}
                        checked={yearFilter === year}
                        onChange={() => {
                        setYearFilter(year);
                        setPage(1);
                        }}
                    />
                    <span>{year}</span>
                    </label>
                ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                <Spinner className="w-10 h-10 text-red-600 animate-spin" />
                </div>
            ) : Array.isArray(documents) && documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {documents.map((doc) => (
                    <div
                    key={doc.id}
                    className="bg-white h-full rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 text-sm flex flex-col"
                    >
                    <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                        <h3 className="text-base font-semibold text-gray-800 hover:text-red-600 line-clamp-2 mb-1">
                            <a href={doc.link} target="_blank" rel="noreferrer">
                            {doc.title}
                            </a>
                        </h3>
                        <p className="text-gray-600 text-xs mb-1">{doc.company?.name || doc.companyCode}</p>
                        <p className="text-gray-500 text-xs">{doc.category}</p>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mt-2">
                        <span>
                            {new Date(doc.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            })}
                        </span>
                        <a
                            href={doc.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-red-500 hover:text-red-700 font-medium"
                        >
                            Baca →
                        </a>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-10">Tidak ada dokumen ditemukan</p>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-6">
                    <div className="flex justify-center gap-2 flex-wrap items-center">
                        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)} variant="outline">
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

                        <Button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} variant="outline">
                        Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default DocumentFeed;
