"use client"

import { Wallet } from "lucide-react";
import Input from "@/app/src/components/FormInput";
import History from "@/app/src/components/History";
import { getUrls } from "../lib/storage";
import { useEffect, useState } from "react";
import { ApiResponse } from "../types/apiModels";

const Index = () => {

    const [urls, setUrls] = useState<ApiResponse[]>([]);

    useEffect(() => {
        setUrls(getUrls());
    }, []);

    const refreshUrls = () => {
        setUrls(getUrls());
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-12 pb-12">
            <div className="flex flex-col items-center justify-start w-full max-w-2xl px-4 pt-12 pb-12 md:pt-24">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                        <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Pocket</h1>
                </div>
                <p className="text-muted-foreground mb-8 text-center text-sm md:text-base max-w-lg">
                    Paste your link & get a short and traceable URL instantly in your pocket!
                </p>

                <div className="w-full">
                    <Input onSuccess={refreshUrls} />
                </div>

                <div className="w-full">
                    <History urls={urls} onDelete={refreshUrls} />
                </div>
            </div>
        </div>
    );
};

export default Index;